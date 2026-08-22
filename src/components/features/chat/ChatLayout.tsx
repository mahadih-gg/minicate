"use client"

import { MenuIcon, MessagesSquareIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"

import { ChatPanel } from "@/components/features/chat/ChatPanel"
import { ConnectionStatus } from "@/components/features/chat/ConnectionStatus"
import { ConversationSidebar } from "@/components/features/chat/ConversationSidebar"
import { CreateGroupDialog } from "@/components/features/chat/CreateGroupDialog"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { useCachedConversations } from "@/hooks/use-cached-conversations"
import { useConversationMessages } from "@/hooks/use-conversation-messages"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useChatSocket } from "@/hooks/useChatSocket"
import { getApiErrorMessage } from "@/lib/api/errors"
import { applyMessageToConversationList } from "@/lib/conversations/preview"
import { cn } from "@/lib/utils"
import { startDirectConversation } from "@/services/conversations.service"
import type { Message } from "@/types/message"
import type { PublicUser } from "@/types/user"

function subscribeToMobile(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(max-width: 767px)")
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches
}

function getServerMobileSnapshot() {
  return false
}

export function ChatLayout() {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getServerMobileSnapshot,
  )
  const {
    conversations,
    isLoading,
    isSyncing: conversationsSyncing,
    error,
    apiUnreachable: conversationsUnreachable,
    updateConversations,
    refresh: refreshConversations,
  } = useCachedConversations(user?._id)
  const conversationsRef = useRef(conversations)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    null,
  )
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const [groupOpen, setGroupOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    messages,
    error: messagesError,
    isLoading: messagesLoading,
    isSyncing: messagesSyncing,
    apiUnreachable: messagesUnreachable,
    send,
    retry,
    reload,
    upsertIncoming,
  } = useConversationMessages(selectedConversationId, user?._id)

  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  const handleIncomingMessage = useCallback(
    (message: Message) => {
      upsertIncoming(message)
      updateConversations((current) => applyMessageToConversationList(current, message))

      const isKnown = conversationsRef.current.some(
        (conversation) => conversation._id === message.conversation,
      )

      if (!isKnown) {
        void refreshConversations().catch(() => {
          return
        })
      }
    },
    [refreshConversations, updateConversations, upsertIncoming],
  )

  const socketStatus = useChatSocket(Boolean(user), handleIncomingMessage)
  const isOffline =
    !isOnline ||
    conversationsUnreachable ||
    (Boolean(selectedConversationId) && messagesUnreachable)
  const isSyncing = conversationsSyncing || messagesSyncing

  useEffect(() => {
    const viewport = window.visualViewport
    const root = document.documentElement

    function syncHeight() {
      const height = viewport?.height ?? window.innerHeight
      root.style.setProperty("--app-height", `${height}px`)
    }

    syncHeight()
    viewport?.addEventListener("resize", syncHeight)
    viewport?.addEventListener("scroll", syncHeight)

    return () => {
      viewport?.removeEventListener("resize", syncHeight)
      viewport?.removeEventListener("scroll", syncHeight)
      root.style.removeProperty("--app-height")
    }
  }, [])

  async function handleRetry() {
    try {
      await refreshConversations()
    } catch {
      return
    }
  }

  async function handleSelectUser(selectedUser: PublicUser) {
    setStartError(null)
    setPendingUserId(selectedUser._id)

    try {
      const started = await startDirectConversation({ userId: selectedUser._id })
      await refreshConversations()
      setSelectedConversationId(started._id)
      setPendingUserId(null)
      setMobileOpen(false)
    } catch (caught: unknown) {
      setStartError(
        getApiErrorMessage(
          caught,
          "Could not start that conversation. Please try again.",
        ),
      )
      setPendingUserId(null)
    }
  }

  async function handleGroupCreated(conversationId: string) {
    await refreshConversations()
    setSelectedConversationId(conversationId)
    setMobileOpen(false)
  }

  function handleSelectConversation(conversationId: string) {
    setSelectedConversationId(conversationId)
    setMobileOpen(false)
  }

  function handleMessageSent(message: Message) {
    updateConversations((current) => applyMessageToConversationList(current, message))
  }

  function handleSend(text: string) {
    const optimistic = send(text)
    if (optimistic) {
      handleMessageSent(optimistic)
    }
  }

  function handleBackToConversations() {
    setSelectedConversationId(null)
    setMobileOpen(false)
  }

  function handleMobileSheetChange(open: boolean) {
    if (!open && !selectedConversationId) {
      return
    }

    setMobileOpen(open)
  }

  const selectedConversation =
    conversations.find((conversation) => conversation._id === selectedConversationId) ??
    null
  const sheetOpen = isMobile && (!selectedConversationId || mobileOpen)

  const sidebar = (
    <ConversationSidebar
      conversations={conversations}
      selectedConversationId={selectedConversationId}
      isLoading={isLoading}
      error={error}
      currentUserId={user?._id}
      pendingUserId={pendingUserId}
      startError={startError}
      onRetry={() => {
        void handleRetry()
      }}
      onSelect={handleSelectConversation}
      onSelectUser={(selectedUser) => {
        void handleSelectUser(selectedUser)
      }}
      onCreateGroup={() => setGroupOpen(true)}
    />
  )

  return (
    <div
      className="flex overflow-hidden bg-background"
      style={{ height: "var(--app-height, 100dvh)" }}
    >
      {isMobile ? (
        <Sheet open={sheetOpen} onOpenChange={handleMobileSheetChange}>
          <SheetContent
            side="left"
            showCloseButton={Boolean(selectedConversationId)}
            className={cn(
              "w-full p-0 sm:max-w-sm",
              selectedConversationId ? "max-w-sm" : "max-w-none sm:max-w-none",
            )}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Conversations</SheetTitle>
              <SheetDescription>
                Search people and open a conversation.
              </SheetDescription>
            </SheetHeader>
            {sidebar}
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="flex h-full w-72 shrink-0 flex-col border-r lg:w-80">
          {sidebar}
        </aside>
      )}

      <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {selectedConversation && user ? (
          <ChatPanel
            conversation={selectedConversation}
            currentUserId={user._id}
            messages={messages}
            isLoading={messagesLoading}
            error={messagesError}
            socketStatus={socketStatus}
            showBack={isMobile}
            isOffline={isOffline}
            isSyncing={isSyncing}
            onBack={handleBackToConversations}
            onRetry={reload}
            onRetryMessage={retry}
            onSend={handleSend}
          />
        ) : (
          <>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
              {isMobile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Open conversations"
                  onClick={() => setMobileOpen(true)}
                >
                  <MenuIcon />
                </Button>
              ) : null}
              <h1 className="truncate text-sm font-medium">Minicate</h1>
              <div className="ml-auto">
                <ConnectionStatus
                  status={socketStatus}
                  isOffline={isOffline}
                  isSyncing={isSyncing}
                />
              </div>
            </header>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessagesSquareIcon />
                  </EmptyMedia>
                  <EmptyTitle>Select a conversation</EmptyTitle>
                  <EmptyDescription>
                    Choose someone from the list, or search by name or phone number.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          </>
        )}
      </section>

      <CreateGroupDialog
        open={groupOpen}
        excludeUserId={user?._id}
        onOpenChange={setGroupOpen}
        onCreated={(conversationId) => {
          void handleGroupCreated(conversationId)
        }}
      />
    </div>
  )
}

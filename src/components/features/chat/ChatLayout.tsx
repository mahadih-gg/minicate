"use client"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import { MenuIcon, MessagesSquareIcon } from "lucide-react"

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
import { ConversationSidebar } from "@/components/features/chat/ConversationSidebar"
import { CreateGroupDialog } from "@/components/features/chat/CreateGroupDialog"
import { useAuth } from "@/hooks/use-auth"
import { getApiErrorMessage, isAbortError } from "@/lib/api/errors"
import { getConversationTitle } from "@/lib/conversations/display"
import {
  listConversations,
  startDirectConversation,
} from "@/services/conversations.service"
import type { Conversation } from "@/types/conversation"
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
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getServerMobileSnapshot,
  )
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    null,
  )
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const [groupOpen, setGroupOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const refreshConversations = useCallback(async (signal?: AbortSignal) => {
    const nextConversations = await listConversations(signal)
    setConversations(nextConversations)
    return nextConversations
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    void (async () => {
      try {
        await refreshConversations(controller.signal)
        setError(null)
      } catch (caught: unknown) {
        if (isAbortError(caught) || controller.signal.aborted) {
          return
        }

        setError(
          getApiErrorMessage(
            caught,
            "Could not load conversations. Please try again.",
          ),
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    })()

    return () => controller.abort()
  }, [refreshConversations])

  async function handleRetry() {
    setIsLoading(true)
    setError(null)

    try {
      await refreshConversations()
    } catch (caught: unknown) {
      setError(
        getApiErrorMessage(caught, "Could not load conversations. Please try again."),
      )
    } finally {
      setIsLoading(false)
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

  const selectedConversation =
    conversations.find((conversation) => conversation._id === selectedConversationId) ??
    null

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
    <div className="flex min-h-dvh bg-background">
      {isMobile ? (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-80 p-0 sm:max-w-sm">
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
        <aside className="flex h-dvh w-80 shrink-0 flex-col border-r">{sidebar}</aside>
      )}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-2 border-b px-3">
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
          <h1 className="truncate text-sm font-medium">
            {selectedConversation
              ? getConversationTitle(selectedConversation)
              : "Minicate"}
          </h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-6">
          {selectedConversation ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessagesSquareIcon />
                </EmptyMedia>
                <EmptyTitle>{getConversationTitle(selectedConversation)}</EmptyTitle>
                <EmptyDescription>
                  Messages for this conversation will appear here in a later step.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
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
          )}
        </div>
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

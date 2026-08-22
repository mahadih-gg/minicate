"use client"

import { MenuIcon, MessagesSquareIcon } from "lucide-react"

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
import { useChatShell } from "@/hooks/use-chat-shell"
import { cn } from "@/lib/utils"

export function ChatLayout() {
  const {
    isMobile,
    sheetOpen,
    selectedConversationId,
    socketStatus,
    isOffline,
    isSyncing,
    openMobile,
    handleMobileSheetChange,
  } = useChatShell()

  const sidebar = <ConversationSidebar />

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
        {selectedConversationId ? (
          <ChatPanel />
        ) : (
          <>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
              {isMobile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Open conversations"
                  onClick={openMobile}
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

      <CreateGroupDialog />
    </div>
  )
}

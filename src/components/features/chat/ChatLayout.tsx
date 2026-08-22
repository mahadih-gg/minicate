"use client"

import { MenuIcon } from "lucide-react"

import { ChatPanel } from "@/components/features/chat/ChatPanel"
import { ConnectionStatus } from "@/components/features/chat/ConnectionStatus"
import { ConversationSidebar } from "@/components/features/chat/ConversationSidebar"
import { CreateGroupDialog } from "@/components/features/chat/CreateGroupDialog"
import {
  SketchArrow,
  SketchChatDoodle,
  SketchStar,
} from "@/components/common/sketch-marks"
import { Highlighter } from "@/components/ui/highlighter"
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
    openMobile,
    handleMobileSheetChange,
  } = useChatShell()

  const sidebar = <ConversationSidebar />

  return (
    <div
      className="chat-surface flex overflow-hidden pb-[env(safe-area-inset-bottom)]"
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
        <aside className="flex h-full w-72 shrink-0 flex-col border-r border-foreground lg:w-80">
          {sidebar}
        </aside>
      )}

      <section className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {selectedConversationId ? (
          <ChatPanel />
        ) : (
          <>
            <header className="chat-shell-header w-full gap-2">
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
              <h1 className="font-heading truncate text-xl tracking-tight">minicate</h1>
              <div className="ml-auto">
                <ConnectionStatus />
              </div>
            </header>
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
              <SketchStar className="absolute top-10 right-10 size-6 opacity-40 max-md:hidden" />
              <Empty className="max-w-md">
                <EmptyHeader>
                  <EmptyMedia variant="default">
                    <SketchChatDoodle className="h-24 w-40" />
                  </EmptyMedia>
                  <EmptyTitle>
                    A quiet page, waiting for a{" "}
                    <Highlighter action="underline" color="var(--brand-violet)">
                      conversation
                    </Highlighter>
                  </EmptyTitle>
                  <EmptyDescription>
                    Choose someone from the list, or search by name or phone number.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
              <SketchArrow className="absolute bottom-8 left-10 h-8 w-20 rotate-[-12deg] opacity-40 max-md:hidden" />
            </div>
          </>
        )}
      </section>

      <CreateGroupDialog />
    </div>
  )
}

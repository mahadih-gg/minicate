"use client"

import { MenuIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  getConversationSubtitle,
  getConversationTitle,
  getInitials,
} from "@/lib/conversations/display"
import type { Conversation } from "@/types/conversation"

type ChatHeaderProps = {
  conversation: Conversation
  showMenu?: boolean
  onOpenSidebar?: () => void
}

export function ChatHeader({
  conversation,
  showMenu = false,
  onOpenSidebar,
}: ChatHeaderProps) {
  const title = getConversationTitle(conversation)
  const subtitle = getConversationSubtitle(conversation)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3">
      {showMenu ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open conversations"
          onClick={onOpenSidebar}
        >
          <MenuIcon />
        </Button>
      ) : null}
      <Avatar size="sm">
        <AvatarFallback>{getInitials(title)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-medium">{title}</h2>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </header>
  )
}

"use client"

import { ArrowLeftIcon } from "lucide-react"

import { ConnectionStatus } from "@/components/features/chat/ConnectionStatus"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import { getConversationAvatarSeed } from "@/lib/avatars/config"
import {
  getConversationSubtitle,
  getConversationTitle,
} from "@/lib/conversations/display"
import type { Conversation } from "@/types/conversation"

type ChatHeaderProps = {
  conversation: Conversation
  showBack?: boolean
  onBack?: () => void
}

export function ChatHeader({
  conversation,
  showBack = false,
  onBack,
}: ChatHeaderProps) {
  const title = getConversationTitle(conversation)
  const subtitle = getConversationSubtitle(conversation)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3">
      {showBack ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back to conversations"
          onClick={onBack}
        >
          <ArrowLeftIcon />
        </Button>
      ) : null}
      <UserAvatar
        seed={getConversationAvatarSeed(conversation)}
        label={title}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-medium">{title}</h2>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ConnectionStatus />
    </header>
  )
}

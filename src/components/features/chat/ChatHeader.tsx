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
    <header className="chat-shell-header w-full gap-3">
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
        <h2 className="font-heading truncate text-base tracking-tight">{title}</h2>
        <p className="truncate font-hand text-sm leading-none text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <ConnectionStatus />
    </header>
  )
}

"use client"

import { memo } from "react"

import { UserAvatar } from "@/components/common/UserAvatar"
import { getConversationAvatarSeed } from "@/lib/avatars/config"
import {
  formatConversationUpdatedAt,
  getConversationPreview,
  getConversationTitle,
} from "@/lib/conversations/display"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/conversation"

type ConversationListItemProps = {
  conversation: Conversation
  isSelected: boolean
  onSelect: (conversationId: string) => void
}

export const ConversationListItem = memo(function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  const title = getConversationTitle(conversation)
  const preview = getConversationPreview(conversation)
  const timestamp = formatConversationUpdatedAt(conversation.updatedAt)

  return (
    <button
      type="button"
      aria-current={isSelected ? "true" : undefined}
      className={cn(
        "flex w-full min-w-0 items-center gap-3 rounded-lg border-l-2 border-transparent px-2 py-2 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "border-primary bg-secondary",
      )}
      onClick={() => onSelect(conversation._id)}
    >
      <UserAvatar
        seed={getConversationAvatarSeed(conversation)}
        label={title}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium">{title}</span>
          {timestamp ? (
            <time
              className="shrink-0 text-[0.7rem] text-muted-foreground"
              dateTime={conversation.updatedAt}
            >
              {timestamp}
            </time>
          ) : null}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {preview}
        </span>
      </span>
    </button>
  )
})

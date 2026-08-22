"use client"

import { formatDistanceToNow } from "date-fns"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  getConversationPreview,
  getConversationTitle,
  getInitials,
} from "@/lib/conversations/display"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/conversation"

type ConversationListItemProps = {
  conversation: Conversation
  isSelected: boolean
  onSelect: (conversationId: string) => void
}

export function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  const title = getConversationTitle(conversation)
  const preview = getConversationPreview(conversation)
  const timestamp = formatDistanceToNow(new Date(conversation.updatedAt), {
    addSuffix: true,
  })

  return (
    <button
      type="button"
      aria-current={isSelected ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border-l-2 border-transparent px-2 py-2 text-left outline-none hover:bg-muted focus-visible:bg-muted",
        isSelected && "border-primary bg-secondary",
      )}
      onClick={() => onSelect(conversation._id)}
    >
      <Avatar>
        <AvatarFallback>{getInitials(title)}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium">{title}</span>
          <time
            className="shrink-0 text-[0.7rem] text-muted-foreground"
            dateTime={conversation.updatedAt}
          >
            {timestamp}
          </time>
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {preview}
        </span>
      </span>
    </button>
  )
}

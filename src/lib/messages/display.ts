import { format, isToday } from "date-fns"

import type { Conversation } from "@/types/conversation"
import type { Message } from "@/types/message"

export function formatMessageTimestamp(createdAt: string): string {
  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  if (isToday(date)) {
    return format(date, "p")
  }

  return format(date, "MMM d, p")
}

export function getMessageSenderName(
  message: Message,
  conversation: Conversation,
  currentUserId: string,
): string | null {
  if (message.sender === currentUserId) {
    return null
  }

  if (conversation.type === "direct") {
    return conversation.participant._id === message.sender
      ? conversation.participant.name
      : null
  }

  return (
    conversation.participants.find((participant) => participant._id === message.sender)
      ?.name ?? null
  )
}

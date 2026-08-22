import { formatDistanceToNow } from "date-fns"

import type { Conversation } from "@/types/conversation"

export function getConversationTitle(conversation: Conversation): string {
  if (conversation.type === "group") {
    return conversation.name
  }

  return conversation.participant.name
}

export function getConversationSubtitle(conversation: Conversation): string {
  if (conversation.type === "direct") {
    return conversation.participant.phone
  }

  return `${conversation.participants.length} people`
}

export function getConversationPreview(conversation: Conversation): string {
  if (conversation.lastMessage) {
    return conversation.lastMessage.text
  }

  if (conversation.type === "direct") {
    return conversation.participant.phone
  }

  return `${conversation.participants.length} people`
}

export function formatConversationUpdatedAt(updatedAt: string): string {
  const date = new Date(updatedAt)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return formatDistanceToNow(date, { addSuffix: true })
}

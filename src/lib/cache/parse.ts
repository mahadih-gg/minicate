import { isRecord } from "@/lib/auth/parse"
import { parseConversation } from "@/lib/conversations/parse"
import { CHAT_CACHE_VERSION, type ChatCacheEnvelope } from "@/lib/cache/schema"
import type { Conversation } from "@/types/conversation"
import type { ChatMessage, MessageStatus } from "@/types/message"

const MESSAGE_STATUSES = new Set<MessageStatus>(["sending", "sent", "failed"])

export function parseCacheEnvelope<T>(
  value: unknown,
  parseData: (data: unknown) => T,
): ChatCacheEnvelope<T> {
  if (!isRecord(value) || value.version !== CHAT_CACHE_VERSION) {
    throw new Error("Unsupported chat cache version")
  }

  if (typeof value.updatedAt !== "string" || Number.isNaN(Date.parse(value.updatedAt))) {
    throw new Error("Invalid chat cache timestamp")
  }

  return {
    version: CHAT_CACHE_VERSION,
    updatedAt: value.updatedAt,
    data: parseData(value.data),
  }
}

export function parseCachedConversations(value: unknown): Conversation[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid cached conversations")
  }

  return value.map(parseConversation)
}

function parseMessageStatus(value: unknown): MessageStatus {
  if (typeof value !== "string" || !MESSAGE_STATUSES.has(value as MessageStatus)) {
    throw new Error("Invalid cached message status")
  }

  return value as MessageStatus
}

export function parseCachedChatMessage(value: unknown): ChatMessage {
  if (!isRecord(value)) {
    throw new Error("Invalid cached message")
  }

  const { _id, conversation, sender, text, createdAt, clientMessageId, status } = value

  if (
    typeof _id !== "string" ||
    typeof conversation !== "string" ||
    typeof sender !== "string" ||
    typeof text !== "string" ||
    typeof createdAt !== "string" ||
    typeof clientMessageId !== "string" ||
    clientMessageId.length === 0
  ) {
    throw new Error("Invalid cached message")
  }

  const parsedStatus = parseMessageStatus(status)

  if (parsedStatus === "sent" && _id.length === 0) {
    throw new Error("Invalid cached message")
  }

  return {
    _id,
    conversation,
    sender,
    text,
    createdAt,
    clientMessageId,
    status: parsedStatus,
  }
}

export function parseCachedChatMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid cached messages")
  }

  const messages: ChatMessage[] = []

  for (const item of value) {
    try {
      messages.push(parseCachedChatMessage(item))
    } catch {
      continue
    }
  }

  if (value.length > 0 && messages.length === 0) {
    throw new Error("Invalid cached messages")
  }

  return messages
}

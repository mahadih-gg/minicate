import {
  parseCachedChatMessages,
  parseCachedConversations,
  parseCacheEnvelope,
} from "@/lib/cache/parse"
import {
  CHAT_CACHE_VERSION,
  conversationsCacheKey,
  messagesCacheKey,
  messagesCacheKeyPrefix,
  type ChatCacheEnvelope,
} from "@/lib/cache/schema"
import {
  listStorageKeys,
  readStorageRaw,
  removeStorageRaw,
  writeStorageRaw,
} from "@/lib/cache/storage"
import type { Conversation } from "@/types/conversation"
import type { ChatMessage } from "@/types/message"

function readEnvelope<T>(
  key: string,
  parseData: (data: unknown) => T,
): ChatCacheEnvelope<T> | null {
  const raw = readStorageRaw(key)

  if (!raw) {
    return null
  }

  try {
    return parseCacheEnvelope(JSON.parse(raw) as unknown, parseData)
  } catch {
    removeStorageRaw(key)
    return null
  }
}

function writeEnvelope<T>(key: string, data: T): void {
  const current = readStorageRaw(key)

  if (current) {
    try {
      const parsed = JSON.parse(current) as { data?: unknown }
      if (JSON.stringify(parsed.data) === JSON.stringify(data)) {
        return
      }
    } catch {
      removeStorageRaw(key)
    }
  }

  const envelope: ChatCacheEnvelope<T> = {
    version: CHAT_CACHE_VERSION,
    updatedAt: new Date().toISOString(),
    data,
  }

  writeStorageRaw(key, JSON.stringify(envelope))
}

export function readCachedConversations(userId: string): Conversation[] | null {
  const envelope = readEnvelope(conversationsCacheKey(userId), parseCachedConversations)
  return envelope ? envelope.data : null
}

export function writeCachedConversations(
  userId: string,
  conversations: Conversation[],
): void {
  writeEnvelope(conversationsCacheKey(userId), conversations)
}

export function readCachedMessages(
  userId: string,
  conversationId: string,
): ChatMessage[] | null {
  const envelope = readEnvelope(
    messagesCacheKey(userId, conversationId),
    parseCachedChatMessages,
  )
  return envelope ? envelope.data : null
}

export function writeCachedMessages(
  userId: string,
  conversationId: string,
  messages: ChatMessage[],
): void {
  writeEnvelope(messagesCacheKey(userId, conversationId), messages)
}

export function readAllCachedMessages(userId: string): Record<string, ChatMessage[]> {
  const prefix = messagesCacheKeyPrefix(userId)
  const messagesByConversation: Record<string, ChatMessage[]> = {}

  for (const key of listStorageKeys(prefix)) {
    const conversationId = key.slice(prefix.length)

    if (!conversationId) {
      continue
    }

    const messages = readCachedMessages(userId, conversationId)

    if (messages) {
      messagesByConversation[conversationId] = messages
    }
  }

  return messagesByConversation
}

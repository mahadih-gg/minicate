export const CHAT_CACHE_VERSION = 1
export const CHAT_CACHE_PREFIX = "minicate.chat-cache.v1"

export type ChatCacheEnvelope<T> = {
  version: typeof CHAT_CACHE_VERSION
  updatedAt: string
  data: T
}

export function conversationsCacheKey(userId: string): string {
  return `${CHAT_CACHE_PREFIX}:${userId}:conversations`
}

export function messagesCacheKey(userId: string, conversationId: string): string {
  return `${CHAT_CACHE_PREFIX}:${userId}:messages:${conversationId}`
}

export function messagesCacheKeyPrefix(userId: string): string {
  return `${CHAT_CACHE_PREFIX}:${userId}:messages:`
}

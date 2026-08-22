import type { QueryClient } from "@tanstack/react-query"

import {
  writeCachedConversations,
  writeCachedMessages,
} from "@/lib/cache/chat-cache"
import { normalizeChatMessages } from "@/lib/messages/state"
import { queryKeys } from "@/lib/query/keys"
import type { Conversation } from "@/types/conversation"
import type { ChatMessage } from "@/types/message"

export function persistConversations(
  userId: string,
  conversations: Conversation[],
): void {
  writeCachedConversations(userId, conversations)
}

export function persistMessages(
  userId: string,
  conversationId: string,
  messages: ChatMessage[],
): void {
  writeCachedMessages(userId, conversationId, normalizeChatMessages(messages))
}

export function setConversationsCache(
  queryClient: QueryClient,
  userId: string,
  updater: (current: Conversation[]) => Conversation[],
): Conversation[] {
  const key = queryKeys.conversations(userId)
  const current = queryClient.getQueryData<Conversation[]>(key) ?? []
  const next = updater(current)
  queryClient.setQueryData(key, next)
  persistConversations(userId, next)
  return next
}

export function setMessagesCache(
  queryClient: QueryClient,
  userId: string,
  conversationId: string,
  updater: (current: ChatMessage[]) => ChatMessage[],
): ChatMessage[] {
  const key = queryKeys.messages(userId, conversationId)
  const current = queryClient.getQueryData<ChatMessage[]>(key) ?? []
  const next = normalizeChatMessages(updater(current))
  queryClient.setQueryData(key, next)
  persistMessages(userId, conversationId, next)
  return next
}

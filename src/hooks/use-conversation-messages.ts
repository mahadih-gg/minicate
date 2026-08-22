"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { getApiErrorMessage, isNetworkFailure } from "@/lib/api/errors"
import { readCachedMessages } from "@/lib/cache/chat-cache"
import { applyMessageToConversationList } from "@/lib/conversations/preview"
import {
  appendChatMessage,
  confirmOptimisticMessage,
  createOptimisticMessage,
  mergeChatHistory,
  normalizeChatMessages,
  setChatMessageStatus,
} from "@/lib/messages/state"
import { queryKeys } from "@/lib/query/keys"
import {
  persistMessages,
  setConversationsCache,
  setMessagesCache,
} from "@/lib/query/persist"
import {
  listConversationMessages,
  sendMessage as sendMessageRequest,
} from "@/services/messages.service"
import type { ChatMessage } from "@/types/message"

function logSendFailure(caught: unknown): void {
  if (process.env.NODE_ENV !== "development") {
    return
  }

  const detail = caught instanceof Error ? caught.message : "Unknown send failure"
  console.error("Message send failed:", detail)
}

export function useConversationMessages(
  conversationId: string | null,
  currentUserId?: string,
) {
  const queryClient = useQueryClient()
  const inFlightClientIdsRef = useRef(new Set<string>())
  const recoveredPendingRef = useRef(new Set<string>())

  const queryKey =
    currentUserId && conversationId
      ? queryKeys.messages(currentUserId, conversationId)
      : (["messages", "idle"] as const)

  const cached =
    currentUserId && conversationId
      ? readCachedMessages(currentUserId, conversationId)
      : null
  const hasCache = cached !== null

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      if (!conversationId || !currentUserId) {
        return []
      }

      const serverMessages = await listConversationMessages(conversationId, signal)
      const existing =
        queryClient.getQueryData<ChatMessage[]>(
          queryKeys.messages(currentUserId, conversationId),
        ) ??
        readCachedMessages(currentUserId, conversationId) ??
        []

      const merged = mergeChatHistory(existing, serverMessages)
      persistMessages(currentUserId, conversationId, merged)
      return merged
    },
    enabled: Boolean(conversationId && currentUserId),
    initialData: cached ? normalizeChatMessages(cached) : undefined,
    initialDataUpdatedAt: hasCache ? 0 : undefined,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  const messages = useMemo(
    () => (conversationId ? normalizeChatMessages(query.data ?? []) : []),
    [conversationId, query.data],
  )
  const errorMessage = query.error
    ? getApiErrorMessage(query.error, "Could not load messages. Please try again.")
    : null

  const { mutate: mutateSend } = useMutation({
    mutationFn: async (optimistic: ChatMessage) => {
      return sendMessageRequest({
        conversationId: optimistic.conversation,
        text: optimistic.text,
      })
    },
    onSuccess: (sent, optimistic) => {
      inFlightClientIdsRef.current.delete(optimistic.clientMessageId)

      if (!currentUserId) {
        return
      }

      setMessagesCache(queryClient, currentUserId, optimistic.conversation, (current) =>
        confirmOptimisticMessage(current, optimistic.clientMessageId, sent),
      )
      setConversationsCache(queryClient, currentUserId, (current) =>
        applyMessageToConversationList(current, sent),
      )
    },
    onError: (caught, optimistic) => {
      inFlightClientIdsRef.current.delete(optimistic.clientMessageId)
      logSendFailure(caught)

      if (!currentUserId) {
        return
      }

      setMessagesCache(queryClient, currentUserId, optimistic.conversation, (current) => {
        const currentMessage = current.find(
          (message) => message.clientMessageId === optimistic.clientMessageId,
        )

        if (currentMessage && currentMessage._id.length > 0) {
          return current
        }

        return setChatMessageStatus(current, optimistic.clientMessageId, "failed")
      })
    },
  })

  const persistOutgoing = useCallback(
    (optimistic: ChatMessage) => {
      if (inFlightClientIdsRef.current.has(optimistic.clientMessageId)) {
        return
      }

      inFlightClientIdsRef.current.add(optimistic.clientMessageId)
      mutateSend(optimistic)
    },
    [mutateSend],
  )

  useEffect(() => {
    if (!conversationId || !currentUserId || !query.isSuccess || !query.data) {
      return
    }

    for (const message of query.data) {
      if (message.status !== "sending" || message._id.length !== 0) {
        continue
      }

      persistOutgoing(message)
    }
  }, [conversationId, currentUserId, persistOutgoing, query.data, query.isSuccess])

  useEffect(() => {
    if (!conversationId || !currentUserId || !query.isError || !hasCache) {
      return
    }

    if (recoveredPendingRef.current.has(conversationId)) {
      return
    }

    recoveredPendingRef.current.add(conversationId)
    setMessagesCache(queryClient, currentUserId, conversationId, (current) =>
      current.map((message) =>
        message.status === "sending" && message._id.length === 0
          ? { ...message, status: "failed" }
          : message,
      ),
    )
  }, [conversationId, currentUserId, hasCache, query.isError, queryClient])

  const send = useCallback(
    (text: string): ChatMessage | null => {
      if (!conversationId || !currentUserId) {
        return null
      }

      const trimmed = text.trim()

      if (!trimmed) {
        return null
      }

      const optimistic = createOptimisticMessage({
        conversationId,
        senderId: currentUserId,
        text: trimmed,
      })

      setMessagesCache(queryClient, currentUserId, conversationId, (current) =>
        appendChatMessage(current, optimistic),
      )
      setConversationsCache(queryClient, currentUserId, (current) =>
        applyMessageToConversationList(current, optimistic),
      )
      persistOutgoing(optimistic)
      return optimistic
    },
    [conversationId, currentUserId, persistOutgoing, queryClient],
  )

  const retry = useCallback(
    (clientMessageId: string) => {
      if (!conversationId || !currentUserId) {
        return
      }

      const target = messages.find(
        (message) =>
          message.clientMessageId === clientMessageId && message.status === "failed",
      )

      if (!target) {
        return
      }

      inFlightClientIdsRef.current.delete(clientMessageId)
      const next: ChatMessage = { ...target, status: "sending" }
      setMessagesCache(queryClient, currentUserId, conversationId, (current) =>
        setChatMessageStatus(current, clientMessageId, "sending"),
      )
      persistOutgoing(next)
    },
    [conversationId, currentUserId, messages, persistOutgoing, queryClient],
  )

  const { refetch } = query

  const reload = useCallback(() => {
    void refetch()
  }, [refetch])

  return {
    messages,
    error: hasCache ? null : errorMessage,
    isLoading: Boolean(conversationId) && !hasCache && query.isPending,
    isSyncing: query.isFetching,
    apiUnreachable: query.isError && isNetworkFailure(query.error),
    send,
    retry,
    reload,
  }
}

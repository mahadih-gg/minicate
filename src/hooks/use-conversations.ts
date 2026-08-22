"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

import { getApiErrorMessage, isNetworkFailure } from "@/lib/api/errors"
import { readCachedConversations } from "@/lib/cache/chat-cache"
import { queryKeys } from "@/lib/query/keys"
import { persistConversations, setConversationsCache } from "@/lib/query/persist"
import { listConversations } from "@/services/conversations.service"
import type { Conversation } from "@/types/conversation"

export function useConversations(userId: string | undefined) {
  const queryClient = useQueryClient()
  const cached = userId ? readCachedConversations(userId) : null
  const hasLocalCache = cached !== null

  const query = useQuery({
    queryKey: userId ? queryKeys.conversations(userId) : ["conversations", "anonymous"],
    queryFn: async ({ signal }) => {
      if (!userId) {
        return []
      }

      const next = await listConversations(signal)
      persistConversations(userId, next)
      return next
    },
    enabled: Boolean(userId),
    initialData: cached ?? undefined,
    initialDataUpdatedAt: hasLocalCache ? 0 : undefined,
    staleTime: 15_000,
  })

  const conversations = query.data ?? []
  const errorMessage = query.error
    ? getApiErrorMessage(query.error, "Could not load conversations. Please try again.")
    : null

  const updateConversations = useCallback(
    (updater: (current: Conversation[]) => Conversation[]) => {
      if (!userId) {
        return
      }

      setConversationsCache(queryClient, userId, updater)
    },
    [queryClient, userId],
  )

  const { refetch } = query

  const refresh = useCallback(async () => {
    const result = await refetch()
    if (result.error) {
      throw result.error
    }
    return result.data ?? []
  }, [refetch])

  return {
    conversations,
    isLoading: Boolean(userId) && !hasLocalCache && query.isPending,
    isSyncing: query.isFetching,
    error: hasLocalCache ? null : errorMessage,
    apiUnreachable: query.isError && isNetworkFailure(query.error),
    updateConversations,
    refresh,
  }
}

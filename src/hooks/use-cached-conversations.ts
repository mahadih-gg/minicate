import { useCallback, useEffect, useState } from "react"

import { getApiErrorMessage, isAbortError, isNetworkFailure } from "@/lib/api/errors"
import {
  readCachedConversations,
  writeCachedConversations,
} from "@/lib/cache/chat-cache"
import { listConversations } from "@/services/conversations.service"
import type { Conversation } from "@/types/conversation"

type UseCachedConversationsResult = {
  conversations: Conversation[]
  isLoading: boolean
  isSyncing: boolean
  error: string | null
  apiUnreachable: boolean
  replaceConversations: (next: Conversation[]) => void
  updateConversations: (updater: (current: Conversation[]) => Conversation[]) => void
  refresh: (signal?: AbortSignal) => Promise<Conversation[]>
}

export function useCachedConversations(
  userId: string | undefined,
): UseCachedConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (!userId) {
      return []
    }

    return readCachedConversations(userId) ?? []
  })
  const [hasLocalCache, setHasLocalCache] = useState(() =>
    userId ? readCachedConversations(userId) !== null : false,
  )
  const [isSyncing, setIsSyncing] = useState(Boolean(userId))
  const [error, setError] = useState<string | null>(null)
  const [apiUnreachable, setApiUnreachable] = useState(false)
  const [observedUserId, setObservedUserId] = useState(userId)

  if (userId !== observedUserId) {
    setObservedUserId(userId)
    const cached = userId ? readCachedConversations(userId) : null
    setConversations(cached ?? [])
    setHasLocalCache(cached !== null)
    setError(null)
    setApiUnreachable(false)
    setIsSyncing(Boolean(userId))
  }

  const persist = useCallback(
    (next: Conversation[]) => {
      if (userId) {
        writeCachedConversations(userId, next)
      }
    },
    [userId],
  )

  const replaceConversations = useCallback(
    (next: Conversation[]) => {
      setConversations(next)
      persist(next)
      if (userId) {
        setHasLocalCache(true)
      }
    },
    [persist, userId],
  )

  const updateConversations = useCallback(
    (updater: (current: Conversation[]) => Conversation[]) => {
      setConversations((current) => {
        const next = updater(current)
        persist(next)
        return next
      })
      if (userId) {
        setHasLocalCache(true)
      }
    },
    [persist, userId],
  )

  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      const nextConversations = await listConversations(signal)
      replaceConversations(nextConversations)
      setError(null)
      setApiUnreachable(false)
      return nextConversations
    },
    [replaceConversations],
  )

  useEffect(() => {
    if (!userId) {
      return
    }

    const hasCachedConversations = readCachedConversations(userId) !== null
    const controller = new AbortController()

    void (async () => {
      await Promise.resolve()

      if (controller.signal.aborted) {
        return
      }

      setIsSyncing(true)
      try {
        await refresh(controller.signal)
      } catch (caught: unknown) {
        if (isAbortError(caught) || controller.signal.aborted) {
          return
        }

        setApiUnreachable(isNetworkFailure(caught))

        if (!hasCachedConversations) {
          setError(
            getApiErrorMessage(
              caught,
              "Could not load conversations. Please try again.",
            ),
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSyncing(false)
        }
      }
    })()

    function handleOnline() {
      setIsSyncing(true)
      void refresh()
        .catch((caught: unknown) => {
          setApiUnreachable(isNetworkFailure(caught))
        })
        .finally(() => {
          setIsSyncing(false)
        })
    }

    window.addEventListener("online", handleOnline)

    return () => {
      controller.abort()
      window.removeEventListener("online", handleOnline)
    }
  }, [refresh, userId])

  return {
    conversations,
    isLoading: Boolean(userId) && !hasLocalCache && isSyncing,
    isSyncing,
    error: hasLocalCache ? null : error,
    apiUnreachable,
    replaceConversations,
    updateConversations,
    refresh,
  }
}

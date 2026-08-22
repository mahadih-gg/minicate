import { useCallback, useEffect, useRef, useState } from "react"

import { getApiErrorMessage, isAbortError, isNetworkFailure } from "@/lib/api/errors"
import { readAllCachedMessages, readCachedMessages, writeCachedMessages } from "@/lib/cache/chat-cache"
import {
  appendChatMessage,
  confirmOptimisticMessage,
  createOptimisticMessage,
  mergeChatHistory,
  reconcileServerMessage,
  setChatMessageStatus,
} from "@/lib/messages/state"
import {
  listConversationMessages,
  sendMessage as sendMessageRequest,
} from "@/services/messages.service"
import type { ChatMessage, ServerMessage } from "@/types/message"

type MessagesStatus = "idle" | "loading" | "success" | "error"

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
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >(() => (currentUserId ? readAllCachedMessages(currentUserId) : {}))
  const [status, setStatus] = useState<MessagesStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [apiUnreachable, setApiUnreachable] = useState(false)
  const [observedConversationId, setObservedConversationId] = useState(conversationId)
  const retriedIdsRef = useRef(new Set<string>())
  const recoveredPendingRef = useRef(new Set<string>())
  const [observedUserId, setObservedUserId] = useState(currentUserId)

  if (currentUserId !== observedUserId) {
    setObservedUserId(currentUserId)
    setMessagesByConversation(
      currentUserId ? readAllCachedMessages(currentUserId) : {},
    )
  }

  if (conversationId !== observedConversationId) {
    setObservedConversationId(conversationId)

    if (conversationId && !(conversationId in messagesByConversation)) {
      setStatus("loading")
      setError(null)
    } else if (conversationId) {
      setStatus("success")
      setError(null)
    }
  }

  const messages = conversationId ? (messagesByConversation[conversationId] ?? []) : []
  const hasCache = conversationId ? conversationId in messagesByConversation : false
  const hasConversationCache = useCallback(
    (id: string) => id in messagesByConversation,
    [messagesByConversation],
  )
  const isLoading = Boolean(conversationId) && !hasCache && status !== "error"
  const visibleError = hasCache ? null : error

  const persistMessages = useCallback(
    (id: string, nextMessages: ChatMessage[]) => {
      if (currentUserId) {
        writeCachedMessages(currentUserId, id, nextMessages)
      }
    },
    [currentUserId],
  )

  const persistOutgoing = useCallback(
    async (optimistic: ChatMessage) => {
      try {
        const sent = await sendMessageRequest({
          conversationId: optimistic.conversation,
          text: optimistic.text,
        })

        setMessagesByConversation((current) => {
          const nextMessages = confirmOptimisticMessage(
            current[optimistic.conversation] ?? [],
            optimistic.clientMessageId,
            sent,
          )
          persistMessages(optimistic.conversation, nextMessages)
          return {
            ...current,
            [optimistic.conversation]: nextMessages,
          }
        })
        setApiUnreachable(false)

        return sent
      } catch (caught: unknown) {
        logSendFailure(caught)
        setApiUnreachable(isNetworkFailure(caught))
        setMessagesByConversation((current) => {
          const existing = current[optimistic.conversation] ?? []
          const currentMessage = existing.find(
            (message) => message.clientMessageId === optimistic.clientMessageId,
          )

          const nextMessages =
            currentMessage && currentMessage._id.length > 0
              ? existing
              : setChatMessageStatus(existing, optimistic.clientMessageId, "failed")

          persistMessages(optimistic.conversation, nextMessages)
          return {
            ...current,
            [optimistic.conversation]: nextMessages,
          }
        })
        return null
      }
    },
    [persistMessages],
  )

  const retryUnsent = useCallback(
    (pending: ChatMessage[]) => {
      for (const message of pending) {
        if (message.status !== "sending" || message._id.length !== 0) {
          continue
        }

        if (retriedIdsRef.current.has(message.clientMessageId)) {
          continue
        }

        retriedIdsRef.current.add(message.clientMessageId)
        void persistOutgoing(message)
      }
    },
    [persistOutgoing],
  )

  const writeCache = useCallback(
    (id: string, nextMessages: ServerMessage[]) => {
      setMessagesByConversation((current) => {
        const merged = mergeChatHistory(current[id] ?? [], nextMessages)
        persistMessages(id, merged)
        queueMicrotask(() => retryUnsent(merged))
        return {
          ...current,
          [id]: merged,
        }
      })
    },
    [persistMessages, retryUnsent],
  )

  const updateConversationMessages = useCallback(
    (id: string, updater: (current: ChatMessage[]) => ChatMessage[]) => {
      setMessagesByConversation((current) => {
        const nextMessages = updater(current[id] ?? [])
        persistMessages(id, nextMessages)
        return {
          ...current,
          [id]: nextMessages,
        }
      })
    },
    [persistMessages],
  )

  const reload = useCallback(async () => {
    if (!conversationId) {
      return
    }

    setIsSyncing(true)

    try {
      const nextMessages = await listConversationMessages(conversationId)
      writeCache(conversationId, nextMessages)
      setError(null)
      setStatus("success")
      setApiUnreachable(false)
    } catch (caught: unknown) {
      if (isAbortError(caught)) {
        return
      }

      setApiUnreachable(isNetworkFailure(caught))
      setError(
        getApiErrorMessage(caught, "Could not load messages. Please try again."),
      )
      setStatus("error")
    } finally {
      setIsSyncing(false)
    }
  }, [conversationId, writeCache])

  useEffect(() => {
    if (!conversationId) {
      return
    }

    const activeConversationId = conversationId
    const controller = new AbortController()
    const alreadyCached = currentUserId
      ? readCachedMessages(currentUserId, activeConversationId) !== null
      : false

    async function syncMessages() {
      await Promise.resolve()

      if (controller.signal.aborted) {
        return
      }

      setIsSyncing(true)

      if (!alreadyCached) {
        setStatus("loading")
        setError(null)
      }

      try {
        const nextMessages = await listConversationMessages(
          activeConversationId,
          controller.signal,
        )

        if (controller.signal.aborted) {
          return
        }

        writeCache(activeConversationId, nextMessages)
        setError(null)
        setStatus("success")
        setApiUnreachable(false)
        recoveredPendingRef.current.add(activeConversationId)
      } catch (caught: unknown) {
        if (isAbortError(caught) || controller.signal.aborted) {
          return
        }

        setApiUnreachable(isNetworkFailure(caught))
        setError(
          getApiErrorMessage(caught, "Could not load messages. Please try again."),
        )
        setStatus("error")

        if (alreadyCached && !recoveredPendingRef.current.has(activeConversationId)) {
          recoveredPendingRef.current.add(activeConversationId)
          updateConversationMessages(activeConversationId, (current) =>
            current.map((message) =>
              message.status === "sending" && message._id.length === 0
                ? { ...message, status: "failed" }
                : message,
            ),
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSyncing(false)
        }
      }
    }

    void syncMessages()

    function handleOnline() {
      void syncMessages()
    }

    window.addEventListener("online", handleOnline)

    return () => {
      controller.abort()
      window.removeEventListener("online", handleOnline)
    }
  }, [conversationId, currentUserId, updateConversationMessages, writeCache])

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

      updateConversationMessages(conversationId, (current) =>
        appendChatMessage(current, optimistic),
      )
      setStatus("success")
      void persistOutgoing(optimistic)
      return optimistic
    },
    [conversationId, currentUserId, persistOutgoing, updateConversationMessages],
  )

  const retry = useCallback(
    (clientMessageId: string) => {
      if (!conversationId) {
        return
      }

      const target = (messagesByConversation[conversationId] ?? []).find(
        (message) =>
          message.clientMessageId === clientMessageId && message.status === "failed",
      )

      if (!target) {
        return
      }

      updateConversationMessages(conversationId, (current) =>
        setChatMessageStatus(current, clientMessageId, "sending"),
      )
      void persistOutgoing({ ...target, status: "sending" })
    },
    [
      conversationId,
      messagesByConversation,
      persistOutgoing,
      updateConversationMessages,
    ],
  )

  const upsertIncoming = useCallback(
    (incoming: ServerMessage) => {
      setMessagesByConversation((current) => {
        const nextMessages = reconcileServerMessage(
          current[incoming.conversation] ?? [],
          incoming,
        )
        persistMessages(incoming.conversation, nextMessages)
        return {
          ...current,
          [incoming.conversation]: nextMessages,
        }
      })
    },
    [persistMessages],
  )

  return {
    messages,
    status,
    error: visibleError,
    isLoading,
    isSyncing,
    apiUnreachable,
    send,
    retry,
    reload: () => {
      void reload()
    },
    upsertIncoming,
    hasConversationCache,
  }
}

import { useCallback, useEffect, useRef, useState } from "react"

import { getApiErrorMessage, isAbortError } from "@/lib/api/errors"
import {
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
  >({})
  const [status, setStatus] = useState<MessagesStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [observedConversationId, setObservedConversationId] = useState(conversationId)
  const loadedIdsRef = useRef(new Set<string>())

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

  const writeCache = useCallback((id: string, nextMessages: ServerMessage[]) => {
    loadedIdsRef.current.add(id)
    setMessagesByConversation((current) => ({
      ...current,
      [id]: mergeChatHistory(current[id] ?? [], nextMessages),
    }))
  }, [])

  const updateConversationMessages = useCallback(
    (id: string, updater: (current: ChatMessage[]) => ChatMessage[]) => {
      setMessagesByConversation((current) => ({
        ...current,
        [id]: updater(current[id] ?? []),
      }))
    },
    [],
  )

  const reload = useCallback(async () => {
    if (!conversationId) {
      return
    }

    try {
      const nextMessages = await listConversationMessages(conversationId)
      writeCache(conversationId, nextMessages)
      setError(null)
      setStatus("success")
    } catch (caught: unknown) {
      if (isAbortError(caught)) {
        return
      }

      setError(
        getApiErrorMessage(caught, "Could not load messages. Please try again."),
      )
      setStatus("error")
    }
  }, [conversationId, writeCache])

  useEffect(() => {
    if (!conversationId) {
      return
    }

    const controller = new AbortController()
    const alreadyCached = loadedIdsRef.current.has(conversationId)

    void (async () => {
      await Promise.resolve()

      if (controller.signal.aborted) {
        return
      }

      if (!alreadyCached) {
        setStatus("loading")
        setError(null)
      }

      try {
        const nextMessages = await listConversationMessages(
          conversationId,
          controller.signal,
        )

        if (controller.signal.aborted) {
          return
        }

        writeCache(conversationId, nextMessages)
        setError(null)
        setStatus("success")
      } catch (caught: unknown) {
        if (isAbortError(caught) || controller.signal.aborted) {
          return
        }

        setError(
          getApiErrorMessage(caught, "Could not load messages. Please try again."),
        )
        setStatus("error")
      }
    })()

    return () => {
      controller.abort()
    }
  }, [conversationId, writeCache])

  const persistOutgoing = useCallback(
    async (optimistic: ChatMessage) => {
      try {
        const sent = await sendMessageRequest({
          conversationId: optimistic.conversation,
          text: optimistic.text,
        })

        updateConversationMessages(optimistic.conversation, (current) =>
          confirmOptimisticMessage(current, optimistic.clientMessageId, sent),
        )

        return sent
      } catch (caught: unknown) {
        logSendFailure(caught)
        updateConversationMessages(optimistic.conversation, (current) => {
          const currentMessage = current.find(
            (message) => message.clientMessageId === optimistic.clientMessageId,
          )

          if (currentMessage && currentMessage._id.length > 0) {
            return current
          }

          return setChatMessageStatus(current, optimistic.clientMessageId, "failed")
        })
        return null
      }
    },
    [updateConversationMessages],
  )

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

      updateConversationMessages(conversationId, (current) => [...current, optimistic])
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

      const retrying: ChatMessage = { ...target, status: "sending" }
      updateConversationMessages(conversationId, (current) =>
        setChatMessageStatus(current, clientMessageId, "sending"),
      )
      void persistOutgoing(retrying)
    },
    [
      conversationId,
      messagesByConversation,
      persistOutgoing,
      updateConversationMessages,
    ],
  )

  const upsertIncoming = useCallback((incoming: ServerMessage) => {
    setMessagesByConversation((current) => ({
      ...current,
      [incoming.conversation]: reconcileServerMessage(
        current[incoming.conversation] ?? [],
        incoming,
      ),
    }))
  }, [])

  return {
    messages,
    status,
    error: visibleError,
    isLoading,
    send,
    retry,
    reload: () => {
      void reload()
    },
    upsertIncoming,
    hasConversationCache,
  }
}

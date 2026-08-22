import { useCallback, useEffect, useRef, useState } from "react"

import { getApiErrorMessage, isAbortError } from "@/lib/api/errors"
import { upsertMessage } from "@/lib/messages/state"
import {
  listConversationMessages,
  sendMessage as sendMessageRequest,
} from "@/services/messages.service"
import type { Message } from "@/types/message"

type MessagesStatus = "idle" | "loading" | "success" | "error"

export function useConversationMessages(conversationId: string | null) {
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, Message[]>
  >({})
  const [status, setStatus] = useState<MessagesStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const loadedIdsRef = useRef(new Set<string>())

  const messages = conversationId ? (messagesByConversation[conversationId] ?? []) : []
  const hasCache = conversationId ? conversationId in messagesByConversation : false
  const isLoading = Boolean(conversationId) && !hasCache && status !== "error"

  const writeCache = useCallback((id: string, nextMessages: Message[]) => {
    loadedIdsRef.current.add(id)
    setMessagesByConversation((current) => ({
      ...current,
      [id]: nextMessages,
    }))
  }, [])

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

  const send = useCallback(
    async (text: string) => {
      if (!conversationId) {
        return
      }

      const trimmed = text.trim()

      if (!trimmed) {
        return
      }

      setIsSending(true)
      setSendError(null)

      try {
        const sent = await sendMessageRequest({
          conversationId,
          text: trimmed,
        })
        setMessagesByConversation((current) => ({
          ...current,
          [conversationId]: upsertMessage(current[conversationId] ?? [], sent),
        }))
        setStatus("success")
        return sent
      } catch (caught: unknown) {
        setSendError(
          getApiErrorMessage(caught, "Could not send that message. Please try again."),
        )
        throw caught
      } finally {
        setIsSending(false)
      }
    },
    [conversationId],
  )

  const upsertIncoming = useCallback((incoming: Message) => {
    setMessagesByConversation((current) => ({
      ...current,
      [incoming.conversation]: upsertMessage(
        current[incoming.conversation] ?? [],
        incoming,
      ),
    }))
  }, [])

  return {
    messages,
    status,
    error,
    isLoading,
    isSending,
    sendError,
    send,
    reload: () => {
      void reload()
    },
    upsertIncoming,
  }
}

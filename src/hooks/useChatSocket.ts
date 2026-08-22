"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

import { getAccessToken } from "@/lib/auth/session"
import {
  connectChatSocket,
  disconnectChatSocket,
  getChatSocketStatus,
  subscribeChatSocketStatus,
  subscribeToMessageNew,
} from "@/lib/websocket/client"
import { parseSocketMessage } from "@/lib/websocket/parse"
import type { ChatSocketStatus } from "@/lib/websocket/types"
import type { Message } from "@/types/message"

function getServerSocketSnapshot(): ChatSocketStatus {
  return "disconnected"
}

export function useChatSocket(
  enabled: boolean,
  onMessage: (message: Message) => void,
): ChatSocketStatus {
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  const status = useSyncExternalStore(
    subscribeChatSocketStatus,
    getChatSocketStatus,
    getServerSocketSnapshot,
  )

  useEffect(() => {
    if (!enabled) {
      disconnectChatSocket()
      return
    }

    const token = getAccessToken()

    if (!token) {
      disconnectChatSocket()
      return
    }

    connectChatSocket(token)

    const unsubscribe = subscribeToMessageNew((payload) => {
      try {
        onMessageRef.current(parseSocketMessage(payload))
      } catch {
        return
      }
    })

    return () => {
      unsubscribe()
      disconnectChatSocket()
    }
  }, [enabled])

  return status
}

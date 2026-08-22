import { io, type Socket } from "socket.io-client"

import { getSocketOrigin } from "@/lib/websocket/config"
import type { ChatSocketStatus } from "@/lib/websocket/types"

const MESSAGE_NEW_EVENT = "message:new"

let socket: Socket | null = null
let currentToken: string | null = null
let status: ChatSocketStatus = "disconnected"
/** Bumped on every teardown so stale socket events cannot update state. */
let activeGeneration = 0

const statusListeners = new Set<() => void>()
const messageListeners = new Set<(payload: unknown) => void>()

type BoundHandlers = {
  onMessage: (payload: unknown) => void
  onConnect: () => void
  onDisconnect: () => void
  onConnectError: (error: Error) => void
  onReconnectAttempt: () => void
  onReconnect: () => void
  onReconnectFailed: () => void
}

let boundHandlers: BoundHandlers | null = null

function setStatus(nextStatus: ChatSocketStatus, generation?: number): void {
  if (generation !== undefined && generation !== activeGeneration) {
    return
  }

  if (status === nextStatus) {
    return
  }

  status = nextStatus
  for (const listener of statusListeners) {
    listener()
  }
}

function isAuthFailure(error: Error): boolean {
  const message = error.message.toLowerCase()
  return message.includes("invalid token") || message.includes("unauthorized")
}

function unbindSocketListeners(target: Socket): void {
  if (!boundHandlers) {
    return
  }

  target.off(MESSAGE_NEW_EVENT, boundHandlers.onMessage)
  target.off("connect", boundHandlers.onConnect)
  target.off("disconnect", boundHandlers.onDisconnect)
  target.off("connect_error", boundHandlers.onConnectError)
  target.io.off("reconnect_attempt", boundHandlers.onReconnectAttempt)
  target.io.off("reconnect", boundHandlers.onReconnect)
  target.io.off("reconnect_failed", boundHandlers.onReconnectFailed)
  boundHandlers = null
}

function bindSocketListeners(target: Socket, generation: number): void {
  const handlers: BoundHandlers = {
    onMessage: (payload: unknown) => {
      if (generation !== activeGeneration) {
        return
      }

      for (const listener of messageListeners) {
        listener(payload)
      }
    },
    onConnect: () => {
      setStatus("connected", generation)
    },
    onDisconnect: () => {
      if (generation !== activeGeneration) {
        return
      }

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setStatus("disconnected", generation)
        return
      }

      if (socket?.io.opts.reconnection && socket.active) {
        setStatus("reconnecting", generation)
        return
      }

      setStatus("disconnected", generation)
    },
    onConnectError: (error: Error) => {
      if (generation !== activeGeneration) {
        return
      }

      if (isAuthFailure(error)) {
        socket?.io.reconnection(false)
        socket?.disconnect()
        setStatus("disconnected", generation)
        return
      }

      setStatus(socket?.active ? "reconnecting" : "disconnected", generation)
    },
    onReconnectAttempt: () => {
      setStatus("reconnecting", generation)
    },
    onReconnect: () => {
      setStatus("connected", generation)
    },
    onReconnectFailed: () => {
      setStatus("disconnected", generation)
    },
  }

  boundHandlers = handlers
  target.on(MESSAGE_NEW_EVENT, handlers.onMessage)
  target.on("connect", handlers.onConnect)
  target.on("disconnect", handlers.onDisconnect)
  target.on("connect_error", handlers.onConnectError)
  target.io.on("reconnect_attempt", handlers.onReconnectAttempt)
  target.io.on("reconnect", handlers.onReconnect)
  target.io.on("reconnect_failed", handlers.onReconnectFailed)
}

/**
 * Tear down the active socket. Keeps `currentToken` unless `clearToken` is set
 * so online reconnect can authenticate again.
 */
function tearDownSocket(options: { clearToken: boolean }): void {
  activeGeneration += 1

  if (socket) {
    const dying = socket
    socket = null
    unbindSocketListeners(dying)
    dying.io.reconnection(false)
    dying.removeAllListeners()
    dying.disconnect()
  }

  if (options.clearToken) {
    currentToken = null
  }
}

function createSocket(token: string): void {
  tearDownSocket({ clearToken: false })

  currentToken = token
  const generation = activeGeneration
  setStatus("connecting", generation)

  const nextSocket = io(getSocketOrigin(), {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
    timeout: 10000,
  })

  socket = nextSocket
  bindSocketListeners(nextSocket, generation)
}

export function getChatSocketStatus(): ChatSocketStatus {
  return status
}

export function subscribeChatSocketStatus(onStoreChange: () => void): () => void {
  statusListeners.add(onStoreChange)
  return () => {
    statusListeners.delete(onStoreChange)
  }
}

export function subscribeToMessageNew(onMessage: (payload: unknown) => void): () => void {
  messageListeners.add(onMessage)
  return () => {
    messageListeners.delete(onMessage)
  }
}

export function connectChatSocket(token: string): void {
  if (socket?.connected && currentToken === token) {
    return
  }

  createSocket(token)
}

/**
 * Force a brand-new socket after network recovery.
 * Does not reuse a closed/unusable Socket.IO instance.
 */
export function reconnectChatSocket(): void {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return
  }

  if (!currentToken) {
    return
  }

  createSocket(currentToken)
}

/** Stop Socket.IO reconnect loops while the browser is offline. */
export function pauseChatSocketForOffline(): void {
  if (!socket) {
    setStatus("disconnected")
    return
  }

  socket.io.reconnection(false)

  if (socket.connected) {
    socket.disconnect()
  }

  setStatus("disconnected")
}

export function disconnectChatSocket(): void {
  tearDownSocket({ clearToken: true })
  setStatus("disconnected")
}

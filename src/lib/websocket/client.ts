import { io, type Socket } from "socket.io-client"

import { getSocketOrigin } from "@/lib/websocket/config"
import type { ChatSocketStatus } from "@/lib/websocket/types"

const MESSAGE_NEW_EVENT = "message:new"

let socket: Socket | null = null
let currentToken: string | null = null
let status: ChatSocketStatus = "disconnected"

const statusListeners = new Set<() => void>()
const messageListeners = new Set<(payload: unknown) => void>()

function setStatus(nextStatus: ChatSocketStatus): void {
  if (status === nextStatus) {
    return
  }

  status = nextStatus
  for (const listener of statusListeners) {
    listener()
  }
}

function emitIncomingMessage(payload: unknown): void {
  for (const listener of messageListeners) {
    listener(payload)
  }
}

function isAuthFailure(error: Error): boolean {
  const message = error.message.toLowerCase()
  return message.includes("invalid token") || message.includes("unauthorized")
}

function handleConnect(): void {
  setStatus("connected")
}

function handleDisconnect(): void {
  if (socket?.io.opts.reconnection && socket.active) {
    setStatus("reconnecting")
    return
  }

  setStatus("disconnected")
}

function handleReconnectAttempt(): void {
  setStatus("reconnecting")
}

function handleReconnect(): void {
  setStatus("connected")
}

function handleReconnectFailed(): void {
  setStatus("disconnected")
}

function handleConnectError(error: Error): void {
  if (isAuthFailure(error)) {
    socket?.io.reconnection(false)
    socket?.disconnect()
    setStatus("disconnected")
    return
  }

  setStatus(socket?.active ? "reconnecting" : "disconnected")
}

function bindSocketListeners(nextSocket: Socket): void {
  nextSocket.on(MESSAGE_NEW_EVENT, emitIncomingMessage)
  nextSocket.on("connect", handleConnect)
  nextSocket.on("disconnect", handleDisconnect)
  nextSocket.on("connect_error", handleConnectError)
  nextSocket.io.on("reconnect_attempt", handleReconnectAttempt)
  nextSocket.io.on("reconnect", handleReconnect)
  nextSocket.io.on("reconnect_failed", handleReconnectFailed)
}

function unbindSocketListeners(nextSocket: Socket): void {
  nextSocket.off(MESSAGE_NEW_EVENT, emitIncomingMessage)
  nextSocket.off("connect", handleConnect)
  nextSocket.off("disconnect", handleDisconnect)
  nextSocket.off("connect_error", handleConnectError)
  nextSocket.io.off("reconnect_attempt", handleReconnectAttempt)
  nextSocket.io.off("reconnect", handleReconnect)
  nextSocket.io.off("reconnect_failed", handleReconnectFailed)
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
  if (socket && currentToken === token) {
    if (!socket.connected && (status === "disconnected" || status === "connecting")) {
      socket.io.reconnection(true)
      setStatus("connecting")
      socket.connect()
    }
    return
  }

  disconnectChatSocket()
  currentToken = token
  setStatus("connecting")

  socket = io(getSocketOrigin(), {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
    timeout: 10000,
  })

  bindSocketListeners(socket)
}

export function disconnectChatSocket(): void {
  if (!socket) {
    currentToken = null
    setStatus("disconnected")
    return
  }

  unbindSocketListeners(socket)
  socket.io.reconnection(false)
  socket.disconnect()
  socket = null
  currentToken = null
  setStatus("disconnected")
}

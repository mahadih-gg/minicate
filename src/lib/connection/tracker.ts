import { deriveConnectionStatus } from "@/lib/connection/derive"
import {
  getChatSocketStatus,
  pauseChatSocketForOffline,
  reconnectChatSocket,
  subscribeChatSocketStatus,
} from "@/lib/websocket/client"
import { useChatUiStore } from "@/stores/chat-ui"

let subscriberCount = 0
let removeBrowserListeners: (() => void) | null = null
let unsubscribeSocket: (() => void) | null = null

function publishFromSources(): void {
  const next = deriveConnectionStatus(navigator.onLine, getChatSocketStatus())
  useChatUiStore.getState().setConnectionStatus(next)
}

function handleBrowserOffline(): void {
  useChatUiStore.getState().setConnectionStatus("offline")
  pauseChatSocketForOffline()
  publishFromSources()
}

function handleBrowserOnline(): void {
  useChatUiStore.getState().setConnectionStatus("connecting")
  // Always create a new authenticated socket with fresh message:new listeners.
  reconnectChatSocket()
  publishFromSources()
}

function ensureListeners(): void {
  if (removeBrowserListeners) {
    return
  }

  window.addEventListener("offline", handleBrowserOffline)
  window.addEventListener("online", handleBrowserOnline)
  removeBrowserListeners = () => {
    window.removeEventListener("offline", handleBrowserOffline)
    window.removeEventListener("online", handleBrowserOnline)
  }

  unsubscribeSocket = subscribeChatSocketStatus(publishFromSources)
  publishFromSources()
}

function teardownListeners(): void {
  removeBrowserListeners?.()
  removeBrowserListeners = null
  unsubscribeSocket?.()
  unsubscribeSocket = null
}

/**
 * Start the single global connection tracker.
 * Safe to call from multiple mounts (ref-counted); listeners register once.
 */
export function startConnectionTracker(): () => void {
  subscriberCount += 1
  ensureListeners()

  return () => {
    subscriberCount = Math.max(0, subscriberCount - 1)
    if (subscriberCount === 0) {
      teardownListeners()
    }
  }
}

/** Manual retry from the connection-status UI. */
export function retryConnection(): void {
  if (!navigator.onLine) {
    useChatUiStore.getState().setConnectionStatus("offline")
    return
  }

  useChatUiStore.getState().setConnectionStatus("connecting")
  reconnectChatSocket()
  publishFromSources()
}

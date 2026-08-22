import type { ChatSocketStatus } from "@/lib/websocket/types"
import type { ConnectionStatus } from "@/types/connection"

/**
 * Combine browser network availability with Minicate's WebSocket lifecycle.
 * Network offline always wins. Socket open is the only path to `connected`.
 */
export function deriveConnectionStatus(
  isBrowserOnline: boolean,
  socketStatus: ChatSocketStatus,
): ConnectionStatus {
  if (!isBrowserOnline) {
    return "offline"
  }

  if (socketStatus === "connected") {
    return "connected"
  }

  if (socketStatus === "connecting" || socketStatus === "reconnecting") {
    return "connecting"
  }

  // Browser online but socket closed / failed without an active reconnect.
  return "offline"
}

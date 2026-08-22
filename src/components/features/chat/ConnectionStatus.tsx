"use client"

import { getAccessToken } from "@/lib/auth/session"
import { connectChatSocket } from "@/lib/websocket/client"
import { cn } from "@/lib/utils"
import type { ChatSocketStatus } from "@/lib/websocket/types"

const STATUS_LABEL: Record<ChatSocketStatus, string> = {
  connected: "Live",
  connecting: "Connecting",
  reconnecting: "Reconnecting",
  disconnected: "Offline",
}

type ConnectionStatusProps = {
  status: ChatSocketStatus
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const label = STATUS_LABEL[status]
  const canRetry = status === "disconnected"

  return (
    <button
      type="button"
      disabled={!canRetry}
      aria-label={
        canRetry ? "Realtime is offline. Retry connection." : `Realtime status: ${label}`
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-muted-foreground outline-none",
        canRetry && "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        !canRetry && "cursor-default",
      )}
      onClick={() => {
        if (!canRetry) {
          return
        }

        const token = getAccessToken()
        if (token) {
          connectChatSocket(token)
        }
      }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          status === "connected" && "bg-primary",
          status === "connecting" && "bg-muted-foreground",
          status === "reconnecting" && "bg-accent-foreground",
          status === "disconnected" && "bg-destructive",
        )}
      />
      <span aria-live="polite">{status === "connected" ? <span className="sr-only">{label}</span> : label}</span>
    </button>
  )
}

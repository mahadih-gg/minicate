"use client"

import { memo } from "react"

import { Spinner } from "@/components/ui/spinner"
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
  isOffline?: boolean
  isSyncing?: boolean
}

export const ConnectionStatus = memo(function ConnectionStatus({
  status,
  isOffline = false,
  isSyncing = false,
}: ConnectionStatusProps) {
  const label = isOffline ? "Offline" : isSyncing ? "Updating" : STATUS_LABEL[status]
  const canRetry = isOffline || status === "disconnected"

  return (
    <button
      type="button"
      disabled={!canRetry}
      aria-label={
        canRetry
          ? "Connection is offline. Retry connection."
          : isSyncing
            ? "Updating cached conversations"
            : `Realtime status: ${label}`
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
      {isSyncing && !isOffline ? (
        <Spinner className="size-3" aria-hidden="true" />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            !isOffline && status === "connected" && "bg-primary",
            !isOffline && status === "connecting" && "bg-muted-foreground",
            !isOffline && status === "reconnecting" && "bg-accent-foreground",
            (isOffline || status === "disconnected") && "bg-destructive",
          )}
        />
      )}
      <span aria-live="polite">
        {status === "connected" && !isOffline && !isSyncing ? (
          <span className="sr-only">{label}</span>
        ) : (
          label
        )}
      </span>
    </button>
  )
})

"use client"

import { memo, useEffect, useState } from "react"

import { retryConnection } from "@/lib/connection/tracker"
import { cn } from "@/lib/utils"
import { useChatUiStore } from "@/stores/chat-ui"
import type { ConnectionStatus as ConnectionStatusValue } from "@/types/connection"

const CONNECTED_VISIBLE_MS = 2500

const STATUS_COPY: Record<
  ConnectionStatusValue,
  { label: string; textClass: string }
> = {
  offline: {
    label: "Offline",
    textClass: "text-status-offline",
  },
  connecting: {
    label: "Connecting",
    textClass: "text-status-connecting",
  },
  connected: {
    label: "Connected",
    textClass: "text-status-connected",
  },
}

export const ConnectionStatus = memo(function ConnectionStatus() {
  const connectionStatus = useChatUiStore((state) => state.connectionStatus)
  const [hideConnected, setHideConnected] = useState(false)

  useEffect(() => {
    if (connectionStatus !== "connected") {
      setHideConnected(false)
      return
    }

    setHideConnected(false)
    const timer = window.setTimeout(() => {
      setHideConnected(true)
    }, CONNECTED_VISIBLE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [connectionStatus])

  if (connectionStatus === "connected" && hideConnected) {
    return null
  }

  const { label, textClass } = STATUS_COPY[connectionStatus]
  const canRetry = connectionStatus === "offline"

  return (
    <button
      type="button"
      disabled={!canRetry}
      aria-label={
        canRetry
          ? "Connection is offline. Retry connection."
          : `Realtime status: ${label}`
      }
      className={cn(
        "animate-status-in inline-flex items-center gap-1.5 rounded-[10px_16px_8px_14px] border border-foreground bg-card px-2 py-1 font-hand text-sm leading-none outline-none shadow-[var(--shadow-sketch-sm)]",
        textClass,
        canRetry && "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        !canRetry && "cursor-default",
      )}
      onClick={() => {
        if (!canRetry) {
          return
        }

        retryConnection()
      }}
    >
      <span aria-hidden="true">•</span>
      <span aria-live="polite">{label}</span>
    </button>
  )
})

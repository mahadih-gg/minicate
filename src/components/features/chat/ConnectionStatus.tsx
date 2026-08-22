"use client"

import { memo, useEffect, useState } from "react"

import { retryConnection } from "@/lib/connection/tracker"
import { cn } from "@/lib/utils"
import { useChatUiStore } from "@/stores/chat-ui"
import type { ConnectionStatus as ConnectionStatusValue } from "@/types/connection"

const CONNECTED_VISIBLE_MS = 2500

const STATUS_COPY: Record<
  ConnectionStatusValue,
  { label: string; dotClass: string }
> = {
  offline: {
    label: "Offline",
    dotClass: "bg-destructive",
  },
  connecting: {
    label: "Connecting",
    dotClass: "bg-amber-500",
  },
  connected: {
    label: "Connected",
    dotClass: "bg-emerald-500",
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

  const { label, dotClass } = STATUS_COPY[connectionStatus]
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
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-muted-foreground outline-none",
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
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dotClass)} />
      <span aria-live="polite">{label}</span>
    </button>
  )
})

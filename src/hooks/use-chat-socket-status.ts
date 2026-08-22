"use client"

import { useSyncExternalStore } from "react"

import {
  getChatSocketStatus,
  subscribeChatSocketStatus,
} from "@/lib/websocket/client"
import type { ChatSocketStatus } from "@/lib/websocket/types"

function getServerSocketSnapshot(): ChatSocketStatus {
  return "disconnected"
}

export function useChatSocketStatus(): ChatSocketStatus {
  return useSyncExternalStore(
    subscribeChatSocketStatus,
    getChatSocketStatus,
    getServerSocketSnapshot,
  )
}

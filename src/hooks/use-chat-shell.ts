"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"

import { useAuth } from "@/hooks/use-auth"
import { useChatRealtime } from "@/hooks/use-chat-realtime"
import { useConversations } from "@/hooks/use-conversations"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useChatUiStore } from "@/stores/chat-ui"

function subscribeToMobile(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(max-width: 767px)")
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches
}

function getServerMobileSnapshot() {
  return false
}

export function useChatShell() {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getServerMobileSnapshot,
  )
  const selectedConversationId = useChatUiStore((state) => state.selectedConversationId)
  const mobileOpen = useChatUiStore((state) => state.mobileOpen)
  const setMobileOpen = useChatUiStore((state) => state.setMobileOpen)
  const openMobile = useChatUiStore((state) => state.openMobile)

  const { apiUnreachable: conversationsUnreachable, isSyncing: conversationsSyncing } =
    useConversations(user?._id)

  const socketStatus = useChatRealtime()

  useEffect(() => {
    const viewport = window.visualViewport
    const root = document.documentElement

    function syncHeight() {
      const height = viewport?.height ?? window.innerHeight
      root.style.setProperty("--app-height", `${height}px`)
    }

    syncHeight()
    viewport?.addEventListener("resize", syncHeight)
    viewport?.addEventListener("scroll", syncHeight)

    return () => {
      viewport?.removeEventListener("resize", syncHeight)
      viewport?.removeEventListener("scroll", syncHeight)
      root.style.removeProperty("--app-height")
    }
  }, [])

  const handleMobileSheetChange = useCallback(
    (open: boolean) => {
      if (!open && !selectedConversationId) {
        return
      }

      setMobileOpen(open)
    },
    [selectedConversationId, setMobileOpen],
  )

  const sheetOpen = isMobile && (!selectedConversationId || mobileOpen)
  const isOffline = !isOnline || conversationsUnreachable
  const isSyncing = conversationsSyncing

  return {
    user,
    isMobile,
    sheetOpen,
    selectedConversationId,
    socketStatus,
    isOffline,
    isSyncing,
    openMobile,
    handleMobileSheetChange,
  }
}

"use client"

import { useCallback, useSyncExternalStore } from "react"

import { useAuth } from "@/hooks/use-auth"
import { useChatSocketStatus } from "@/hooks/use-chat-socket-status"
import { useConversationMessages } from "@/hooks/use-conversation-messages"
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

export function useChatPanel() {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getServerMobileSnapshot,
  )
  const selectedConversationId = useChatUiStore((state) => state.selectedConversationId)
  const clearSelection = useChatUiStore((state) => state.clearSelection)

  const {
    conversations,
    isSyncing: conversationsSyncing,
    apiUnreachable: conversationsUnreachable,
  } = useConversations(user?._id)

  const {
    messages,
    error: messagesError,
    isLoading: messagesLoading,
    isSyncing: messagesSyncing,
    apiUnreachable: messagesUnreachable,
    send,
    retry,
    reload,
  } = useConversationMessages(selectedConversationId, user?._id)

  const socketStatus = useChatSocketStatus()

  const conversation =
    conversations.find((item) => item._id === selectedConversationId) ?? null

  const handleBack = useCallback(() => {
    clearSelection()
  }, [clearSelection])

  const handleSend = useCallback(
    (text: string) => {
      send(text)
    },
    [send],
  )

  const isOffline =
    !isOnline ||
    conversationsUnreachable ||
    (Boolean(selectedConversationId) && messagesUnreachable)
  const isSyncing = conversationsSyncing || messagesSyncing

  if (!conversation || !user) {
    return null
  }

  return {
    conversation,
    currentUserId: user._id,
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    socketStatus,
    showBack: isMobile,
    isOffline,
    isSyncing,
    onBack: handleBack,
    onRetry: reload,
    onRetryMessage: retry,
    onSend: handleSend,
  }
}

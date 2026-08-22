"use client"

import { useCallback, useState, useSyncExternalStore } from "react"

import { useAuth } from "@/hooks/use-auth"
import { useConversationMessages } from "@/hooks/use-conversation-messages"
import { useConversations } from "@/hooks/use-conversations"
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
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getServerMobileSnapshot,
  )
  const selectedConversationId = useChatUiStore((state) => state.selectedConversationId)
  const clearSelection = useChatUiStore((state) => state.clearSelection)
  const [followLatestNonce, setFollowLatestNonce] = useState(0)

  const { conversations } = useConversations(user?._id)

  const {
    messages,
    error: messagesError,
    isLoading: messagesLoading,
    hasMore,
    isLoadingOlder,
    loadOlderError,
    loadOlder,
    send,
    retry,
    reload,
  } = useConversationMessages(selectedConversationId, user?._id)

  const conversation =
    conversations.find((item) => item._id === selectedConversationId) ?? null

  const handleBack = useCallback(() => {
    clearSelection()
  }, [clearSelection])

  const handleSend = useCallback(
    (text: string) => {
      if (send(text)) {
        setFollowLatestNonce((current) => current + 1)
      }
    },
    [send],
  )

  if (!conversation || !user) {
    return null
  }

  return {
    conversation,
    currentUserId: user._id,
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    hasMore,
    isLoadingOlder,
    loadOlderError,
    loadOlder,
    showBack: isMobile,
    onBack: handleBack,
    onRetry: reload,
    onRetryMessage: retry,
    onSend: handleSend,
    followLatestNonce,
  }
}

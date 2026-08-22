"use client"

import { useCallback } from "react"

import { useAuth } from "@/hooks/use-auth"
import {
  useCreateGroupConversation,
  useStartDirectConversation,
} from "@/hooks/use-conversation-mutations"
import { useConversations } from "@/hooks/use-conversations"
import { useChatUiStore } from "@/stores/chat-ui"
import type { PublicUser } from "@/types/user"

export function useConversationSidebar() {
  const { user } = useAuth()
  const selectedConversationId = useChatUiStore((state) => state.selectedConversationId)
  const pendingUserId = useChatUiStore((state) => state.pendingUserId)
  const startError = useChatUiStore((state) => state.startError)
  const selectConversation = useChatUiStore((state) => state.selectConversation)
  const setGroupOpen = useChatUiStore((state) => state.setGroupOpen)

  const {
    conversations,
    isLoading,
    error,
    refresh,
  } = useConversations(user?._id)

  const { startWithUser } = useStartDirectConversation()

  const handleRetry = useCallback(() => {
    void refresh().catch(() => {
      return
    })
  }, [refresh])

  const handleSelect = useCallback(
    (conversationId: string) => {
      selectConversation(conversationId)
    },
    [selectConversation],
  )

  const handleSelectUser = useCallback(
    (selectedUser: PublicUser) => {
      startWithUser(selectedUser)
    },
    [startWithUser],
  )

  const handleCreateGroup = useCallback(() => {
    setGroupOpen(true)
  }, [setGroupOpen])

  return {
    conversations,
    selectedConversationId,
    isLoading,
    error,
    currentUserId: user?._id,
    pendingUserId,
    startError,
    onRetry: handleRetry,
    onSelect: handleSelect,
    onSelectUser: handleSelectUser,
    onCreateGroup: handleCreateGroup,
  }
}

export function useCreateGroupDialog() {
  const { user } = useAuth()
  const open = useChatUiStore((state) => state.groupOpen)
  const setGroupOpen = useChatUiStore((state) => state.setGroupOpen)
  const { createGroup, isPending } = useCreateGroupConversation()

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setGroupOpen(nextOpen)
    },
    [setGroupOpen],
  )

  return {
    open,
    excludeUserId: user?._id,
    isPending,
    createGroup,
    onOpenChange: handleOpenChange,
  }
}

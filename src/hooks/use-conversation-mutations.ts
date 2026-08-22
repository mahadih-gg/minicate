"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

import { useAuth } from "@/hooks/use-auth"
import { getApiErrorMessage } from "@/lib/api/errors"
import { queryKeys } from "@/lib/query/keys"
import { persistConversations } from "@/lib/query/persist"
import {
  createGroupConversation,
  listConversations,
  startDirectConversation,
} from "@/services/conversations.service"
import { useChatUiStore } from "@/stores/chat-ui"
import type { CreateGroupRequest } from "@/types/conversation"
import type { PublicUser } from "@/types/user"

async function refreshConversationsForUser(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
) {
  const next = await listConversations()
  persistConversations(userId, next)
  queryClient.setQueryData(queryKeys.conversations(userId), next)
  return next
}

export function useStartDirectConversation() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const selectConversation = useChatUiStore((state) => state.selectConversation)
  const setPendingUserId = useChatUiStore((state) => state.setPendingUserId)
  const setStartError = useChatUiStore((state) => state.setStartError)

  const { mutate, isPending } = useMutation({
    mutationFn: (selectedUser: PublicUser) =>
      startDirectConversation({ userId: selectedUser._id }),
    onMutate: (selectedUser) => {
      setStartError(null)
      setPendingUserId(selectedUser._id)
    },
    onSuccess: async (started) => {
      if (user?._id) {
        await refreshConversationsForUser(queryClient, user._id)
      }
      selectConversation(started._id)
      setPendingUserId(null)
    },
    onError: (caught: unknown) => {
      setStartError(
        getApiErrorMessage(
          caught,
          "Could not start that conversation. Please try again.",
        ),
      )
      setPendingUserId(null)
    },
  })

  const startWithUser = useCallback(
    (selectedUser: PublicUser) => {
      mutate(selectedUser)
    },
    [mutate],
  )

  return {
    startWithUser,
    isPending,
  }
}

export function useCreateGroupConversation() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const selectConversation = useChatUiStore((state) => state.selectConversation)
  const setGroupOpen = useChatUiStore((state) => state.setGroupOpen)

  const mutation = useMutation({
    mutationFn: (payload: CreateGroupRequest) => createGroupConversation(payload),
    onSuccess: async (conversation) => {
      if (user?._id) {
        await refreshConversationsForUser(queryClient, user._id)
      }
      setGroupOpen(false)
      selectConversation(conversation._id)
    },
  })

  return {
    createGroup: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

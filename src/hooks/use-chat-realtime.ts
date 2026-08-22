"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

import { useAuth } from "@/hooks/use-auth"
import { useChatSocket } from "@/hooks/useChatSocket"
import { applyMessageToConversationList } from "@/lib/conversations/preview"
import { reconcileServerMessage } from "@/lib/messages/state"
import { queryKeys } from "@/lib/query/keys"
import { setConversationsCache, setMessagesCache } from "@/lib/query/persist"
import { useChatUiStore } from "@/stores/chat-ui"
import type { Conversation } from "@/types/conversation"
import type { Message } from "@/types/message"

export function useChatRealtime() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const selectedConversationId = useChatUiStore((state) => state.selectedConversationId)
  const bumpUnread = useChatUiStore((state) => state.bumpUnread)

  const handleIncomingMessage = useCallback(
    (message: Message) => {
      if (!user?._id) {
        return
      }

      const userId = user._id

      setMessagesCache(queryClient, userId, message.conversation, (current) =>
        reconcileServerMessage(current, message),
      )

      const conversations =
        queryClient.getQueryData<Conversation[]>(queryKeys.conversations(userId)) ?? []
      const isKnown = conversations.some(
        (conversation) => conversation._id === message.conversation,
      )

      setConversationsCache(queryClient, userId, (current) =>
        applyMessageToConversationList(current, message),
      )

      if (!isKnown) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.conversations(userId),
        })
      }

      const isActiveConversation = message.conversation === selectedConversationId
      const isOwnMessage = message.sender === userId

      if (!isActiveConversation && !isOwnMessage) {
        bumpUnread(message.conversation)
      }
    },
    [bumpUnread, queryClient, selectedConversationId, user],
  )

  return useChatSocket(Boolean(user), handleIncomingMessage)
}

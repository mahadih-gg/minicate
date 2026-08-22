import { create } from "zustand"

import type { ConnectionStatus } from "@/types/connection"

type ChatUiState = {
  selectedConversationId: string | null
  mobileOpen: boolean
  groupOpen: boolean
  pendingUserId: string | null
  startError: string | null
  connectionStatus: ConnectionStatus
  unreadByConversationId: Record<string, number>
  selectConversation: (conversationId: string) => void
  clearSelection: () => void
  openMobile: () => void
  closeMobile: () => void
  setMobileOpen: (open: boolean) => void
  setGroupOpen: (open: boolean) => void
  setPendingUserId: (userId: string | null) => void
  setStartError: (error: string | null) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  bumpUnread: (conversationId: string) => void
  clearUnread: (conversationId: string) => void
  clearAllUnread: () => void
}

function initialConnectionStatus(): ConnectionStatus {
  if (typeof navigator === "undefined") {
    return "connecting"
  }

  return navigator.onLine ? "connecting" : "offline"
}

export const useChatUiStore = create<ChatUiState>((set) => ({
  selectedConversationId: null,
  mobileOpen: false,
  groupOpen: false,
  pendingUserId: null,
  startError: null,
  connectionStatus: initialConnectionStatus(),
  unreadByConversationId: {},
  selectConversation: (conversationId) =>
    set((current) => {
      const nextUnread = { ...current.unreadByConversationId }
      delete nextUnread[conversationId]

      return {
        selectedConversationId: conversationId,
        mobileOpen: false,
        pendingUserId: null,
        startError: null,
        unreadByConversationId: nextUnread,
      }
    }),
  clearSelection: () =>
    set({
      selectedConversationId: null,
      mobileOpen: false,
    }),
  openMobile: () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),
  setMobileOpen: (open) => set({ mobileOpen: open }),
  setGroupOpen: (open) => set({ groupOpen: open }),
  setPendingUserId: (userId) => set({ pendingUserId: userId }),
  setStartError: (error) => set({ startError: error }),
  setConnectionStatus: (status) =>
    set((current) =>
      current.connectionStatus === status ? current : { connectionStatus: status },
    ),
  bumpUnread: (conversationId) =>
    set((current) => ({
      unreadByConversationId: {
        ...current.unreadByConversationId,
        [conversationId]: (current.unreadByConversationId[conversationId] ?? 0) + 1,
      },
    })),
  clearUnread: (conversationId) =>
    set((current) => {
      if (!(conversationId in current.unreadByConversationId)) {
        return current
      }

      const nextUnread = { ...current.unreadByConversationId }
      delete nextUnread[conversationId]
      return { unreadByConversationId: nextUnread }
    }),
  clearAllUnread: () => set({ unreadByConversationId: {} }),
}))

import { create } from "zustand"

import type { ConnectionStatus } from "@/types/connection"

type ChatUiState = {
  selectedConversationId: string | null
  mobileOpen: boolean
  groupOpen: boolean
  pendingUserId: string | null
  startError: string | null
  connectionStatus: ConnectionStatus
  selectConversation: (conversationId: string) => void
  clearSelection: () => void
  openMobile: () => void
  closeMobile: () => void
  setMobileOpen: (open: boolean) => void
  setGroupOpen: (open: boolean) => void
  setPendingUserId: (userId: string | null) => void
  setStartError: (error: string | null) => void
  setConnectionStatus: (status: ConnectionStatus) => void
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
  selectConversation: (conversationId) =>
    set({
      selectedConversationId: conversationId,
      mobileOpen: false,
      pendingUserId: null,
      startError: null,
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
}))

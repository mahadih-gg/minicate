"use client"

import { UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConversationList } from "@/components/features/chat/ConversationList"
import { ConversationSearch } from "@/components/features/chat/ConversationSearch"
import type { Conversation } from "@/types/conversation"
import type { PublicUser } from "@/types/user"

type ConversationSidebarProps = {
  conversations: Conversation[]
  selectedConversationId: string | null
  isLoading: boolean
  error: string | null
  currentUserId?: string
  pendingUserId?: string | null
  startError?: string | null
  onRetry: () => void
  onSelect: (conversationId: string) => void
  onSelectUser: (user: PublicUser) => void
  onCreateGroup: () => void
}

export function ConversationSidebar({
  conversations,
  selectedConversationId,
  isLoading,
  error,
  currentUserId,
  pendingUserId,
  startError,
  onRetry,
  onSelect,
  onSelectUser,
  onCreateGroup,
}: ConversationSidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-medium">Minicate</p>
          <p className="truncate text-xs text-muted-foreground">Conversations</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Create group"
          onClick={onCreateGroup}
        >
          <UsersIcon data-icon="inline-start" />
          Group
        </Button>
      </div>
      <div className="flex flex-col gap-2 border-b p-3">
        <ConversationSearch
          excludeUserId={currentUserId}
          pendingUserId={pendingUserId}
          onSelectUser={onSelectUser}
        />
        {startError ? (
          <p className="text-sm text-destructive" role="alert">
            {startError}
          </p>
        ) : null}
      </div>
      <div className="min-h-0 flex-1">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}

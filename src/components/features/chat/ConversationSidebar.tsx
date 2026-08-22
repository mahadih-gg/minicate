"use client"

import { PlusIcon } from "lucide-react"

import { ConversationList } from "@/components/features/chat/ConversationList"
import { ConversationSearch } from "@/components/features/chat/ConversationSearch"
import { SidebarProfileMenu } from "@/components/features/chat/SidebarProfileMenu"
import { Button } from "@/components/ui/button"
import { useConversationSidebar } from "@/hooks/use-conversation-sidebar"
import Image from "next/image"

export function ConversationSidebar() {
  const {
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
  } = useConversationSidebar()

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar">
      <div className="flex shrink-0 flex-col gap-3 border-b border-foreground p-3">
        <Image
          src="/assets/images/minicate-full.png"
          alt="Minicate"
          width={150}
          height={20}
          className="w-3/5 h-auto"
        />
        <Button
          type="button"
          size="lg"
          variant="secondary"
          aria-label="New chat"
          className="w-full"
          onClick={onCreateGroup}
        >
          <PlusIcon data-icon="inline-start" />
          New chat
        </Button>
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
      <div className="chat-shell-footer w-full">
        <SidebarProfileMenu />
      </div>
    </div>
  )
}

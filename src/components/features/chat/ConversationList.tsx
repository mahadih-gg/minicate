"use client"

import { MessagesSquareIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { ConversationListItem } from "@/components/features/chat/ConversationListItem"
import type { Conversation } from "@/types/conversation"

type ConversationListProps = {
  conversations: Conversation[]
  selectedConversationId: string | null
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onSelect: (conversationId: string) => void
}

export function ConversationList({
  conversations,
  selectedConversationId,
  isLoading,
  error,
  onRetry,
  onSelect,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2" aria-busy="true" aria-label="Loading conversations">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-3">
        <Alert variant="destructive">
          <AlertTitle>Could not load conversations</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-3 w-full" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessagesSquareIcon />
          </EmptyMedia>
          <EmptyTitle>No conversations yet</EmptyTitle>
          <EmptyDescription>
            Search for a person to start a chat, or create a group.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-2" role="list" aria-label="Conversations">
        {conversations.map((conversation) => (
          <div key={conversation._id} role="listitem">
            <ConversationListItem
              conversation={conversation}
              isSelected={conversation._id === selectedConversationId}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

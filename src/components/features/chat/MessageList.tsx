"use client"

import { ArrowDownIcon, MessageCircleIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageBubble } from "@/components/features/chat/MessageBubble"
import type { Conversation } from "@/types/conversation"
import type { ChatMessage } from "@/types/message"

type MessageListProps = {
  conversation: Conversation
  currentUserId: string
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onRetryMessage?: (clientMessageId: string) => void
}

export function MessageList({
  conversation,
  currentUserId,
  messages,
  isLoading,
  error,
  onRetry,
  onRetryMessage,
}: MessageListProps) {
  if (isLoading && messages.length === 0) {
    return (
      <div
        className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden p-4"
        aria-busy="true"
        aria-label="Loading messages"
      >
        <Skeleton className="h-16 w-3/4 max-w-xs self-start rounded-xl" />
        <Skeleton className="h-12 w-2/3 max-w-xs self-end rounded-xl" />
        <Skeleton className="h-20 w-4/5 max-w-sm self-start rounded-xl" />
        <Skeleton className="h-14 w-1/2 max-w-xs self-end rounded-xl" />
      </div>
    )
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Alert variant="destructive">
            <AlertTitle>Could not load messages</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageCircleIcon />
            </EmptyMedia>
            <EmptyTitle>No messages yet</EmptyTitle>
            <EmptyDescription>
              Send the first message to start this conversation.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <MessageScrollerProvider
      autoScroll
      defaultScrollPosition="end"
      scrollEdgeThreshold={80}
    >
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport aria-label="Messages">
          <MessageScrollerContent className="flex flex-col gap-3 overflow-x-hidden px-4 py-4">
            {messages.map((message) => (
              <MessageScrollerItem
                key={message.clientMessageId}
                messageId={message.clientMessageId}
              >
                <MessageBubble
                  message={message}
                  conversation={conversation}
                  currentUserId={currentUserId}
                  onRetry={onRetryMessage}
                />
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton
          direction="end"
          size="sm"
          aria-label="Jump to latest messages"
          className="gap-1.5 px-3"
        >
          <ArrowDownIcon data-icon="inline-start" />
          New messages
        </MessageScrollerButton>
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

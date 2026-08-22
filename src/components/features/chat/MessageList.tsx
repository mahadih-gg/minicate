"use client"

import { ArrowDownIcon } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SketchChatDoodle } from "@/components/common/sketch-marks"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { MessageBubble } from "@/components/features/chat/MessageBubble"
import type { Conversation } from "@/types/conversation"
import type { ChatMessage } from "@/types/message"

function FollowLatestOnSend({ nonce }: { nonce: number }) {
  const { scrollToEnd } = useMessageScroller()
  const handledNonceRef = useRef(nonce)

  useLayoutEffect(() => {
    if (nonce === handledNonceRef.current) {
      return
    }

    handledNonceRef.current = nonce

    if (nonce === 0) {
      return
    }

    scrollToEnd({ behavior: "smooth" })
  }, [nonce, scrollToEnd])

  return null
}

type MessageListProps = {
  conversation: Conversation
  currentUserId: string
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  hasMore?: boolean
  isLoadingOlder?: boolean
  loadOlderError?: string | null
  onLoadOlder?: () => void
  onRetry: () => void
  onRetryMessage?: (clientMessageId: string) => void
  followLatestNonce?: number
}

export function MessageList({
  conversation,
  currentUserId,
  messages,
  isLoading,
  error,
  hasMore = false,
  isLoadingOlder = false,
  loadOlderError = null,
  onLoadOlder,
  onRetry,
  onRetryMessage,
  followLatestNonce = 0,
}: MessageListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [scrollAnchorId, setScrollAnchorId] = useState<string | null>(null)

  const handleLoadOlder = useCallback(() => {
    if (!onLoadOlder || isLoadingOlder) {
      return
    }

    const firstId = messages[0]?.clientMessageId ?? null

    if (firstId) {
      setScrollAnchorId(firstId)
    }

    onLoadOlder()
  }, [isLoadingOlder, messages, onLoadOlder])

  useEffect(() => {
    const node = sentinelRef.current

    if (!node || !hasMore || !onLoadOlder) {
      return
    }

    const root =
      node.closest('[data-slot="message-scroller-viewport"]') ?? null

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (!entry?.isIntersecting || isLoadingOlder) {
          return
        }

        handleLoadOlder()
      },
      { root, rootMargin: "120px 0px 0px 0px", threshold: 0 },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [handleLoadOlder, hasMore, isLoadingOlder, onLoadOlder])

  if (isLoading && messages.length === 0) {
    return (
      <div
        className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden p-4"
        aria-busy="true"
        aria-label="Loading messages"
      >
        <Skeleton className="h-16 w-3/4 max-w-xs self-start" />
        <Skeleton className="h-12 w-2/3 max-w-xs self-end" />
        <Skeleton className="h-20 w-4/5 max-w-sm self-start" />
        <Skeleton className="h-14 w-1/2 max-w-xs self-end" />
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
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
        <Empty className="max-w-md">
          <EmptyHeader>
            <EmptyMedia variant="default">
              <SketchChatDoodle className="h-24 w-40" />
            </EmptyMedia>
            <EmptyTitle>No messages yet</EmptyTitle>
            <EmptyDescription className="font-hand text-base">
              Send the first message to start this conversation.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  let lastOwnClientMessageId: string | null = null
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const item = messages[index]
    if (item && item.sender === currentUserId) {
      lastOwnClientMessageId = item.clientMessageId
      break
    }
  }

  return (
    <MessageScrollerProvider
      autoScroll
      defaultScrollPosition="end"
      scrollEdgeThreshold={80}
    >
      <FollowLatestOnSend nonce={followLatestNonce} />
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport aria-label="Messages" className="[overflow-anchor:none]">
          <MessageScrollerContent className="flex flex-col gap-4 overflow-x-hidden px-2 py-4">
            <div
              ref={sentinelRef}
              className="flex min-h-8 flex-col items-center justify-center gap-2"
              aria-hidden={!hasMore && !isLoadingOlder && !loadOlderError}
            >
              {isLoadingOlder ? (
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Spinner className="size-3.5" />
                  Loading older messages
                </span>
              ) : null}
              {loadOlderError ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-destructive" role="alert">
                    {loadOlderError}
                  </p>
                  <Button type="button" variant="outline" size="xs" onClick={handleLoadOlder}>
                    Try again
                  </Button>
                </div>
              ) : null}
            </div>
            {messages.map((message) => (
              <MessageScrollerItem
                key={message.clientMessageId}
                messageId={message.clientMessageId}
                scrollAnchor={message.clientMessageId === scrollAnchorId}
              >
                <MessageBubble
                  message={message}
                  conversation={conversation}
                  currentUserId={currentUserId}
                  isLastOwnMessage={
                    message.clientMessageId === lastOwnClientMessageId
                  }
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
          className="gap-1.5 border-foreground bg-card px-3 shadow-[var(--shadow-sketch-sm)]"
        >
          <ArrowDownIcon data-icon="inline-start" />
          New messages
        </MessageScrollerButton>
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

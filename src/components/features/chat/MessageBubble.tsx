"use client"

import { memo } from "react"

import { SketchRays } from "@/components/common/sketch-marks"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import {
  formatMessageTimestamp,
  getMessageOwnershipLabel,
  getMessageSenderName,
} from "@/lib/messages/display"
import type { Conversation } from "@/types/conversation"
import type { ChatMessage } from "@/types/message"

type MessageBubbleProps = {
  message: ChatMessage
  conversation: Conversation
  currentUserId: string
  isLastOwnMessage?: boolean
  onRetry?: (clientMessageId: string) => void
}

function SendStatus({
  status,
  onRetry,
}: {
  status: ChatMessage["status"]
  onRetry?: () => void
}) {
  if (status === "sending") {
    return (
      <span className="font-hand text-xs text-muted-foreground" aria-label="Sending">
        Sending...
      </span>
    )
  }

  if (status === "sent") {
    return (
      <span className="font-hand text-xs text-muted-foreground" aria-label="Sent">
        ✓
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-hand text-xs text-destructive">Not sent</span>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="font-hand h-5 px-1.5 text-xs text-destructive hover:bg-transparent hover:text-destructive"
        aria-label="Not sent. Retry"
        onClick={onRetry}
      >
        Retry
      </Button>
    </span>
  )
}

export const MessageBubble = memo(function MessageBubble({
  message,
  conversation,
  currentUserId,
  isLastOwnMessage = false,
  onRetry,
}: MessageBubbleProps) {
  const isOwnMessage = message.sender === currentUserId
  const senderName = getMessageSenderName(message, conversation, currentUserId)
  const ownershipLabel = getMessageOwnershipLabel(isOwnMessage, senderName)
  const timestamp = formatMessageTimestamp(message.createdAt)
  const align = isOwnMessage ? "end" : "start"
  const showSendStatus =
    isOwnMessage &&
    (message.status === "sending" ||
      message.status === "failed" ||
      (message.status === "sent" && isLastOwnMessage))

  return (
    <Message
      align={align}
      className="animate-ink-in"
      aria-label={`${ownershipLabel}, ${timestamp || "sent"}`}
    >
      <MessageContent>
        {!isOwnMessage ? (
          <MessageHeader className="font-hand">{senderName ?? "Member"}</MessageHeader>
        ) : null}
        <span className="relative w-fit max-w-full">
          {isOwnMessage ? (
            <SketchRays className="pointer-events-none absolute -top-2 -right-1 size-4" />
          ) : null}
          <Bubble
            variant={isOwnMessage ? "default" : "outline"}
            align={align}
            className="max-w-full"
          >
            <BubbleContent className="whitespace-pre-wrap wrap-anywhere">
              {message.text}
            </BubbleContent>
          </Bubble>
        </span>
        <MessageFooter>
          {timestamp ? (
            <time className="font-hand" dateTime={message.createdAt}>
              {timestamp}
            </time>
          ) : null}
          {showSendStatus ? (
            <SendStatus
              status={message.status}
              onRetry={() => onRetry?.(message.clientMessageId)}
            />
          ) : null}
        </MessageFooter>
      </MessageContent>
    </Message>
  )
})

"use client"

import { CheckIcon, ClockIcon, RotateCcwIcon } from "lucide-react"
import { memo } from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
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
      <Tooltip>
        <TooltipTrigger
          render={
            <span className="inline-flex text-primary-foreground/80" />
          }
        >
          <ClockIcon className="size-2.5" aria-label="Sending" />
        </TooltipTrigger>
        <TooltipContent>Sending</TooltipContent>
      </Tooltip>
    )
  }

  if (status === "sent") {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <span className="inline-flex text-primary-foreground/80" />
          }
        >
          <CheckIcon className="size-2.5" aria-label="Sent" />
        </TooltipTrigger>
        <TooltipContent>Sent</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-4 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
            aria-label="Not sent. Retry"
            onClick={onRetry}
          />
        }
      >
        <RotateCcwIcon className="size-2.5" />
      </TooltipTrigger>
      <TooltipContent>Not sent. Retry</TooltipContent>
    </Tooltip>
  )
}

export const MessageBubble = memo(function MessageBubble({
  message,
  conversation,
  currentUserId,
  onRetry,
}: MessageBubbleProps) {
  const isOwnMessage = message.sender === currentUserId
  const senderName = getMessageSenderName(message, conversation, currentUserId)
  const ownershipLabel = getMessageOwnershipLabel(isOwnMessage, senderName)
  const timestamp = formatMessageTimestamp(message.createdAt)
  const align = isOwnMessage ? "end" : "start"
  const showLocalStatus = isOwnMessage && message.clientMessageId !== message._id

  return (
    <Message align={align} aria-label={`${ownershipLabel}, ${timestamp || "sent"}`}>
      <MessageContent>
        {!isOwnMessage ? (
          <MessageHeader>{senderName ?? "Member"}</MessageHeader>
        ) : null}
        <Bubble variant={isOwnMessage ? "default" : "outline"} align={align}>
          <BubbleContent
            className={cn(
              "whitespace-pre-wrap wrap-anywhere",
              showLocalStatus && "pr-5",
            )}
          >
            {message.text}
          </BubbleContent>
          {showLocalStatus ? (
            <span className="absolute right-1.5 bottom-1 z-10 inline-flex">
              <SendStatus
                status={message.status}
                onRetry={() => onRetry?.(message.clientMessageId)}
              />
            </span>
          ) : null}
        </Bubble>
        {timestamp ? (
          <MessageFooter>
            <time dateTime={message.createdAt}>{timestamp}</time>
          </MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
  )
})

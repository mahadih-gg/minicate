"use client"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import { formatMessageTimestamp, getMessageSenderName } from "@/lib/messages/display"
import type { Conversation } from "@/types/conversation"
import type { Message as ChatMessage } from "@/types/message"

type MessageBubbleProps = {
  message: ChatMessage
  conversation: Conversation
  currentUserId: string
}

export function MessageBubble({
  message,
  conversation,
  currentUserId,
}: MessageBubbleProps) {
  const isOwnMessage = message.sender === currentUserId
  const senderName = getMessageSenderName(message, conversation, currentUserId)
  const timestamp = formatMessageTimestamp(message.createdAt)
  const align = isOwnMessage ? "end" : "start"

  return (
    <Message align={align}>
      <MessageContent>
        {senderName ? <MessageHeader>{senderName}</MessageHeader> : null}
        <Bubble variant={isOwnMessage ? "default" : "muted"} align={align}>
          <BubbleContent>{message.text}</BubbleContent>
        </Bubble>
        {timestamp ? <MessageFooter>{timestamp}</MessageFooter> : null}
      </MessageContent>
    </Message>
  )
}

"use client"

import { ChatHeader } from "@/components/features/chat/ChatHeader"
import { MessageComposer } from "@/components/features/chat/MessageComposer"
import { MessageList } from "@/components/features/chat/MessageList"
import type { ChatSocketStatus } from "@/lib/websocket/types"
import type { Conversation } from "@/types/conversation"
import type { ChatMessage } from "@/types/message"

type ChatPanelProps = {
  conversation: Conversation
  currentUserId: string
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  socketStatus: ChatSocketStatus
  showBack?: boolean
  onBack?: () => void
  onRetry: () => void
  onRetryMessage: (clientMessageId: string) => void
  onSend: (text: string) => void
}

export function ChatPanel({
  conversation,
  currentUserId,
  messages,
  isLoading,
  error,
  socketStatus,
  showBack,
  onBack,
  onRetry,
  onRetryMessage,
  onSend,
}: ChatPanelProps) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <ChatHeader
        conversation={conversation}
        showBack={showBack}
        socketStatus={socketStatus}
        onBack={onBack}
      />
      <MessageList
        key={conversation._id}
        conversation={conversation}
        currentUserId={currentUserId}
        messages={messages}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        onRetryMessage={onRetryMessage}
      />
      <MessageComposer key={`${conversation._id}-composer`} onSend={onSend} />
    </div>
  )
}

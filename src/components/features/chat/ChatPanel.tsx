"use client"

import { ChatHeader } from "@/components/features/chat/ChatHeader"
import { MessageComposer } from "@/components/features/chat/MessageComposer"
import { MessageList } from "@/components/features/chat/MessageList"
import { useConversationMessages } from "@/hooks/use-conversation-messages"
import type { Conversation } from "@/types/conversation"
import type { Message } from "@/types/message"

type ChatPanelProps = {
  conversation: Conversation
  currentUserId: string
  showMenu?: boolean
  onOpenSidebar?: () => void
  onMessageSent?: (message: Message) => void
}

export function ChatPanel({
  conversation,
  currentUserId,
  showMenu,
  onOpenSidebar,
  onMessageSent,
}: ChatPanelProps) {
  const { messages, error, isLoading, isSending, sendError, send, reload } =
    useConversationMessages(conversation._id)

  async function handleSend(text: string) {
    const sent = await send(text)
    if (sent) {
      onMessageSent?.(sent)
    }
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ChatHeader
        conversation={conversation}
        showMenu={showMenu}
        onOpenSidebar={onOpenSidebar}
      />
      <MessageList
        key={conversation._id}
        conversation={conversation}
        currentUserId={currentUserId}
        messages={messages}
        isLoading={isLoading}
        error={error}
        onRetry={reload}
      />
      <MessageComposer
        isSending={isSending}
        sendError={sendError}
        onSend={handleSend}
      />
    </div>
  )
}

"use client"

import { ChatHeader } from "@/components/features/chat/ChatHeader"
import { MessageComposer } from "@/components/features/chat/MessageComposer"
import { MessageList } from "@/components/features/chat/MessageList"
import { useChatPanel } from "@/hooks/use-chat-panel"

export function ChatPanel() {
  const panel = useChatPanel()

  if (!panel) {
    return null
  }

  const {
    conversation,
    currentUserId,
    messages,
    isLoading,
    error,
    socketStatus,
    showBack,
    isOffline,
    isSyncing,
    onBack,
    onRetry,
    onRetryMessage,
    onSend,
  } = panel

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <ChatHeader
        conversation={conversation}
        showBack={showBack}
        socketStatus={socketStatus}
        isOffline={isOffline}
        isSyncing={isSyncing}
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

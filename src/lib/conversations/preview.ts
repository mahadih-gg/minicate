import type { Conversation } from "@/types/conversation"
import type { Message } from "@/types/message"

export function applyMessageToConversationList(
  conversations: Conversation[],
  message: Message,
): Conversation[] {
  const match = conversations.find(
    (conversation) => conversation._id === message.conversation,
  )

  if (!match) {
    return conversations
  }

  const updatedConversation: Conversation = {
    ...match,
    lastMessage: {
      text: message.text,
      sender: message.sender,
      createdAt: message.createdAt,
    },
    updatedAt: message.createdAt,
  }

  return [
    updatedConversation,
    ...conversations.filter((conversation) => conversation._id !== message.conversation),
  ]
}

import type { ChatMessage, Message, MessageStatus, ServerMessage } from "@/types/message"

function byServerOrder(left: Message, right: Message): number {
  const timeDiff =
    new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()

  if (timeDiff !== 0) {
    return timeDiff
  }

  return left._id.localeCompare(right._id)
}

function byChatOrder(left: ChatMessage, right: ChatMessage): number {
  const timeDiff =
    new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()

  if (timeDiff !== 0) {
    return timeDiff
  }

  return left.clientMessageId.localeCompare(right.clientMessageId)
}

export function sortMessagesChronologically(messages: Message[]): Message[] {
  return [...messages].sort(byServerOrder)
}

export function sortChatMessagesChronologically(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort(byChatOrder)
}

export function toChatMessage(
  server: ServerMessage,
  extras?: Partial<Pick<ChatMessage, "clientMessageId" | "status">>,
): ChatMessage {
  return {
    ...server,
    clientMessageId: extras?.clientMessageId ?? server._id,
    status: extras?.status ?? "sent",
  }
}

export function createOptimisticMessage(input: {
  conversationId: string
  senderId: string
  text: string
}): ChatMessage {
  const clientMessageId = crypto.randomUUID()

  return {
    _id: "",
    clientMessageId,
    conversation: input.conversationId,
    sender: input.senderId,
    text: input.text,
    createdAt: new Date().toISOString(),
    status: "sending",
  }
}

export function isUnconfirmedOptimistic(message: ChatMessage): boolean {
  return message._id.length === 0 && message.status !== "sent"
}

function replaceAt(
  messages: ChatMessage[],
  index: number,
  server: ServerMessage,
  status: MessageStatus,
): ChatMessage[] {
  const current = messages[index]

  if (!current) {
    return messages
  }

  const next = [...messages]
  next[index] = {
    ...current,
    ...server,
    clientMessageId: current.clientMessageId,
    status,
  }

  return next
}

export function confirmOptimisticMessage(
  messages: ChatMessage[],
  clientMessageId: string,
  server: ServerMessage,
): ChatMessage[] {
  const byClientId = messages.findIndex(
    (message) => message.clientMessageId === clientMessageId,
  )
  const byServerId = messages.findIndex(
    (message) => message._id.length > 0 && message._id === server._id,
  )

  if (byClientId >= 0 && byServerId >= 0 && byClientId !== byServerId) {
    const withoutSocketDuplicate = messages.filter((_, index) => index !== byServerId)
    const clientIndex = withoutSocketDuplicate.findIndex(
      (message) => message.clientMessageId === clientMessageId,
    )

    if (clientIndex < 0) {
      return withoutSocketDuplicate
    }

    return replaceAt(withoutSocketDuplicate, clientIndex, server, "sent")
  }

  if (byClientId >= 0) {
    return replaceAt(messages, byClientId, server, "sent")
  }

  if (byServerId >= 0) {
    return replaceAt(messages, byServerId, server, "sent")
  }

  return reconcileServerMessage(messages, server)
}

export function upsertMessage(messages: Message[], incoming: Message): Message[] {
  if (messages.some((message) => message._id === incoming._id)) {
    return messages
  }

  return sortMessagesChronologically([...messages, incoming])
}

export function reconcileServerMessage(
  messages: ChatMessage[],
  server: ServerMessage,
): ChatMessage[] {
  const existingByServerId = messages.findIndex(
    (message) => message._id.length > 0 && message._id === server._id,
  )

  if (existingByServerId >= 0) {
    return replaceAt(messages, existingByServerId, server, "sent")
  }

  const pendingIndex = messages.findIndex(
    (message) =>
      isUnconfirmedOptimistic(message) &&
      message.status === "sending" &&
      message.conversation === server.conversation &&
      message.sender === server.sender &&
      message.text === server.text,
  )

  if (pendingIndex >= 0) {
    return replaceAt(messages, pendingIndex, server, "sent")
  }

  return sortChatMessagesChronologically([...messages, toChatMessage(server)])
}

export function mergeChatHistory(
  existing: ChatMessage[],
  incoming: ServerMessage[],
): ChatMessage[] {
  let next = existing

  for (const server of incoming) {
    next = reconcileServerMessage(next, server)
  }

  return sortChatMessagesChronologically(next)
}

export function setChatMessageStatus(
  messages: ChatMessage[],
  clientMessageId: string,
  status: MessageStatus,
): ChatMessage[] {
  return messages.map((message) =>
    message.clientMessageId === clientMessageId ? { ...message, status } : message,
  )
}

export function mergeMessagePages(
  existing: Message[],
  incoming: Message[],
): Message[] {
  const byId = new Map(existing.map((message) => [message._id, message]))

  for (const message of incoming) {
    byId.set(message._id, message)
  }

  return sortMessagesChronologically([...byId.values()])
}

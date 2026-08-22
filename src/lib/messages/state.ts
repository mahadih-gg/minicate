import type { ChatMessage, Message, MessageStatus, ServerMessage } from "@/types/message"

/** Optimistic messages covered by a server copy within this window are dropped. */
const OPTIMISTIC_MATCH_WINDOW_MS = 120_000

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

function withinOptimisticWindow(left: string, right: string): boolean {
  const delta = Math.abs(new Date(left).getTime() - new Date(right).getTime())
  return delta <= OPTIMISTIC_MATCH_WINDOW_MS
}

/**
 * Match an optimistic row to a server message without using text alone:
 * conversation + sender + text + createdAt proximity.
 */
export function isOptimisticMatchForServer(
  optimistic: ChatMessage,
  server: ServerMessage,
): boolean {
  if (!isUnconfirmedOptimistic(optimistic)) {
    return false
  }

  return (
    optimistic.conversation === server.conversation &&
    optimistic.sender === server.sender &&
    optimistic.text === server.text &&
    withinOptimisticWindow(optimistic.createdAt, server.createdAt)
  )
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

function mergeServerRows(left: ChatMessage, right: ChatMessage): ChatMessage {
  const preferLeftClientId = left.clientMessageId.length > 0 && left.clientMessageId !== left._id
  const preferRightClientId =
    right.clientMessageId.length > 0 && right.clientMessageId !== right._id

  return {
    ...left,
    ...right,
    clientMessageId: preferLeftClientId
      ? left.clientMessageId
      : preferRightClientId
        ? right.clientMessageId
        : right._id,
    status: "sent",
  }
}

/**
 * Single-list uniqueness:
 * - at most one row per server `_id`
 * - drop optimistics already covered by a server row
 * - at most one optimistic per `clientMessageId`
 */
export function normalizeChatMessages(messages: ChatMessage[]): ChatMessage[] {
  const byServerId = new Map<string, ChatMessage>()
  const optimistics: ChatMessage[] = []

  for (const message of messages) {
    if (message._id.length > 0) {
      const existing = byServerId.get(message._id)
      byServerId.set(
        message._id,
        existing ? mergeServerRows(existing, message) : { ...message, status: "sent" },
      )
      continue
    }

    optimistics.push(message)
  }

  const serverMessages = [...byServerId.values()]
  const byClientId = new Map<string, ChatMessage>()

  for (const optimistic of optimistics) {
    const covered = serverMessages.some((server) =>
      isOptimisticMatchForServer(optimistic, server),
    )

    if (covered) {
      continue
    }

    const previous = byClientId.get(optimistic.clientMessageId)
    if (!previous || optimistic.status === "sending") {
      byClientId.set(optimistic.clientMessageId, optimistic)
    }
  }

  return sortChatMessagesChronologically([...serverMessages, ...byClientId.values()])
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

  let next = messages

  if (byClientId >= 0 && byServerId >= 0 && byClientId !== byServerId) {
    const withoutSocketDuplicate = messages.filter((_, index) => index !== byServerId)
    const clientIndex = withoutSocketDuplicate.findIndex(
      (message) => message.clientMessageId === clientMessageId,
    )

    if (clientIndex < 0) {
      next = withoutSocketDuplicate
    } else {
      next = replaceAt(withoutSocketDuplicate, clientIndex, server, "sent")
    }
  } else if (byClientId >= 0) {
    next = replaceAt(messages, byClientId, server, "sent")
  } else if (byServerId >= 0) {
    next = replaceAt(messages, byServerId, server, "sent")
  } else {
    next = reconcileServerMessage(messages, server)
  }

  return normalizeChatMessages(next)
}

export function appendChatMessage(
  messages: ChatMessage[],
  incoming: ChatMessage,
): ChatMessage[] {
  return normalizeChatMessages([...messages, incoming])
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
    return normalizeChatMessages(replaceAt(messages, existingByServerId, server, "sent"))
  }

  // Prefer still-sending rows, then any unconfirmed optimistic (e.g. failed) that matches.
  const sendingIndex = messages.findIndex(
    (message) =>
      isOptimisticMatchForServer(message, server) && message.status === "sending",
  )

  if (sendingIndex >= 0) {
    return normalizeChatMessages(replaceAt(messages, sendingIndex, server, "sent"))
  }

  const pendingIndex = messages.findIndex((message) =>
    isOptimisticMatchForServer(message, server),
  )

  if (pendingIndex >= 0) {
    return normalizeChatMessages(replaceAt(messages, pendingIndex, server, "sent"))
  }

  return normalizeChatMessages([...messages, toChatMessage(server)])
}

export function mergeChatHistory(
  existing: ChatMessage[],
  incoming: ServerMessage[],
): ChatMessage[] {
  let next = existing

  for (const server of incoming) {
    next = reconcileServerMessage(next, server)
  }

  return normalizeChatMessages(next)
}

export function setChatMessageStatus(
  messages: ChatMessage[],
  clientMessageId: string,
  status: MessageStatus,
): ChatMessage[] {
  return normalizeChatMessages(
    messages.map((message) =>
      message.clientMessageId === clientMessageId ? { ...message, status } : message,
    ),
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

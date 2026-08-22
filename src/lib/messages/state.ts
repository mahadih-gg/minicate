import type { Message } from "@/types/message"

function byChronologicalOrder(left: Message, right: Message): number {
  const timeDiff =
    new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()

  if (timeDiff !== 0) {
    return timeDiff
  }

  return left._id.localeCompare(right._id)
}

export function sortMessagesChronologically(messages: Message[]): Message[] {
  return [...messages].sort(byChronologicalOrder)
}

export function upsertMessage(messages: Message[], incoming: Message): Message[] {
  if (messages.some((message) => message._id === incoming._id)) {
    return messages
  }

  return sortMessagesChronologically([...messages, incoming])
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

import { isRecord } from "@/lib/auth/parse"
import type { Message, MessagePage } from "@/types/message"

export function parseMessage(value: unknown): Message {
  if (!isRecord(value)) {
    throw new Error("Invalid message payload")
  }

  const { _id, conversation, sender, text, createdAt } = value

  if (
    typeof _id !== "string" ||
    typeof conversation !== "string" ||
    typeof sender !== "string" ||
    typeof text !== "string" ||
    typeof createdAt !== "string"
  ) {
    throw new Error("Invalid message payload")
  }

  return { _id, conversation, sender, text, createdAt }
}

export function parseMessagePage(value: unknown): MessagePage {
  if (!isRecord(value) || typeof value.hasMore !== "boolean") {
    throw new Error("Invalid message list payload")
  }

  if (!Array.isArray(value.messages)) {
    throw new Error("Invalid message list payload")
  }

  return {
    messages: value.messages.map(parseMessage),
    hasMore: value.hasMore,
  }
}

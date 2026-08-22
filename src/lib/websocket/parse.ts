import { isRecord } from "@/lib/auth/parse"
import type { Message } from "@/types/message"

function toIsoTimestamp(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0) {
    return value
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString()
  }

  return null
}

/**
 * Socket.io `message:new` payload observed from the live API:
 * `{ id, conversation, sender, text, createdAt }` where `createdAt` is a unix ms number.
 * REST messages use `_id` and an ISO `createdAt` string. This adapter keeps the rest of
 * the app on the REST `Message` shape.
 */
export function parseSocketMessage(value: unknown): Message {
  if (!isRecord(value)) {
    throw new Error("Invalid socket message")
  }

  const id =
    typeof value.id === "string"
      ? value.id
      : typeof value._id === "string"
        ? value._id
        : null
  const conversation =
    typeof value.conversation === "string"
      ? value.conversation
      : typeof value.conversationId === "string"
        ? value.conversationId
        : null
  const sender = typeof value.sender === "string" ? value.sender : null
  const text = typeof value.text === "string" ? value.text : null
  const createdAt = toIsoTimestamp(value.createdAt)

  if (!id || !conversation || !sender || text === null || !createdAt) {
    throw new Error("Invalid socket message")
  }

  return {
    _id: id,
    conversation,
    sender,
    text,
    createdAt,
  }
}

import { isRecord } from "@/lib/auth/parse"
import { parsePublicUser } from "@/lib/users/parse"
import type {
  Conversation,
  ConversationLastMessage,
  CreateGroupResponse,
  DirectConversation,
  GroupConversation,
  StartConversationResponse,
} from "@/types/conversation"

function parseLastMessage(value: unknown): ConversationLastMessage | null {
  if (!isRecord(value)) {
    return null
  }

  const { text, sender, createdAt } = value

  if (
    typeof text !== "string" ||
    typeof sender !== "string" ||
    typeof createdAt !== "string"
  ) {
    return null
  }

  return { text, sender, createdAt }
}

function parseStringIdList(value: unknown): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error("Invalid conversation payload")
  }

  return value
}

function parseDirectConversation(value: Record<string, unknown>): DirectConversation {
  const { _id, updatedAt, participant } = value

  if (typeof _id !== "string" || typeof updatedAt !== "string") {
    throw new Error("Invalid conversation payload")
  }

  return {
    _id,
    type: "direct",
    lastMessage: parseLastMessage(value.lastMessage),
    updatedAt,
    participant: parsePublicUser(participant),
  }
}

function parseGroupConversation(value: Record<string, unknown>): GroupConversation {
  const { _id, updatedAt, name, createdBy, admins, participants } = value

  if (
    typeof _id !== "string" ||
    typeof updatedAt !== "string" ||
    typeof name !== "string" ||
    typeof createdBy !== "string"
  ) {
    throw new Error("Invalid conversation payload")
  }

  if (!Array.isArray(participants)) {
    throw new Error("Invalid conversation payload")
  }

  return {
    _id,
    type: "group",
    lastMessage: parseLastMessage(value.lastMessage),
    updatedAt,
    name,
    createdBy,
    admins: parseStringIdList(admins),
    participants: participants.map(parsePublicUser),
  }
}

export function parseConversation(value: unknown): Conversation {
  if (!isRecord(value) || (value.type !== "direct" && value.type !== "group")) {
    throw new Error("Invalid conversation payload")
  }

  if (value.type === "direct") {
    return parseDirectConversation(value)
  }

  return parseGroupConversation(value)
}

export function parseConversationList(value: unknown): Conversation[] {
  if (!isRecord(value) || !Array.isArray(value.data)) {
    throw new Error("Invalid conversation list payload")
  }

  return value.data.map(parseConversation)
}

export function parseStartConversationResponse(
  value: unknown,
): StartConversationResponse {
  if (!isRecord(value)) {
    throw new Error("Invalid conversation payload")
  }

  const { _id, createdAt, participants } = value

  if (typeof _id !== "string" || typeof createdAt !== "string") {
    throw new Error("Invalid conversation payload")
  }

  return {
    _id,
    createdAt,
    participants: parseStringIdList(participants),
  }
}

export function parseCreateGroupResponse(value: unknown): CreateGroupResponse {
  if (!isRecord(value)) {
    throw new Error("Invalid conversation payload")
  }

  const group = parseGroupConversation({ ...value, type: "group" })

  if (typeof value.createdAt !== "string") {
    throw new Error("Invalid conversation payload")
  }

  return {
    ...group,
    createdAt: value.createdAt,
  }
}

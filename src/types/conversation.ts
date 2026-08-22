import type { PublicUser } from "@/types/user"

/** Confirmed by Swagger `StartConversationRequest`. */
export interface StartConversationRequest {
  userId: string
}

/** Confirmed by Swagger `CreateGroupRequest`. */
export interface CreateGroupRequest {
  name: string
  participantIds: string[]
}

/** Confirmed by Swagger `AddParticipantsRequest`. */
export interface AddParticipantsRequest {
  userIds: string[]
}

/** Confirmed by Swagger `PromoteRequest`. */
export interface PromoteRequest {
  userId: string
}

/** Confirmed by Swagger `RenameGroupRequest`. */
export interface RenameGroupRequest {
  name: string
}

/** Confirmed by Swagger `GET /conversations/{id}/messages` parameters. */
export interface GetConversationMessagesParams {
  id: string
  limit?: number
  before?: string
}

/**
 * `lastMessage` on list items. Observed from `GET /conversations`.
 * An empty object means there is no last message yet.
 */
export interface ConversationLastMessage {
  text: string
  sender: string
  createdAt: string
}

/** Observed from `GET /conversations` for `type: "direct"`. */
export interface DirectConversation {
  _id: string
  type: "direct"
  lastMessage: ConversationLastMessage | null
  updatedAt: string
  participant: PublicUser
}

/** Observed from `GET /conversations` for `type: "group"`. */
export interface GroupConversation {
  _id: string
  type: "group"
  lastMessage: ConversationLastMessage | null
  updatedAt: string
  name: string
  createdBy: string
  admins: string[]
  participants: PublicUser[]
}

export type Conversation = DirectConversation | GroupConversation

/** Observed from `POST /conversations`. */
export interface StartConversationResponse {
  _id: string
  participants: string[]
  createdAt: string
}

/** Observed from `POST /conversations/group`. */
export interface CreateGroupResponse {
  _id: string
  type: "group"
  name: string
  createdBy: string
  admins: string[]
  participants: PublicUser[]
  createdAt: string
  updatedAt: string
}

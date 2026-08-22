/** Confirmed by Swagger `SendMessageRequest`. */
export interface SendMessageRequest {
  conversationId: string
  text: string
}

export type MessageStatus = "sending" | "sent" | "failed"

/**
 * Message object from `GET /conversations/{id}/messages` and `POST /messages`.
 * Swagger does not document response bodies; this shape was observed from the live API.
 */
export interface ServerMessage {
  _id: string
  conversation: string
  sender: string
  text: string
  createdAt: string
}

/** Server/API message shape. Prefer `ServerMessage` at new call sites. */
export type Message = ServerMessage

/** Client list item: server fields plus local send state. */
export interface ChatMessage extends ServerMessage {
  clientMessageId: string
  status: MessageStatus
}

/** Observed from `GET /conversations/{id}/messages`. */
export interface MessagePage {
  messages: ServerMessage[]
  hasMore: boolean
}

/** Confirmed by Swagger `SendMessageRequest`. */
export interface SendMessageRequest {
  conversationId: string
  text: string
}

/**
 * Message object from `GET /conversations/{id}/messages` and `POST /messages`.
 * Swagger does not document response bodies; this shape was observed from the live API.
 */
export interface Message {
  _id: string
  conversation: string
  sender: string
  text: string
  createdAt: string
}

/** Observed from `GET /conversations/{id}/messages`. */
export interface MessagePage {
  messages: Message[]
  hasMore: boolean
}

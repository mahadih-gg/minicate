import { authenticatedRequest } from "@/lib/api/authenticated"
import { parseMessage, parseMessagePage } from "@/lib/messages/parse"
import type { GetConversationMessagesParams } from "@/types/conversation"
import type { Message, MessagePage, SendMessageRequest } from "@/types/message"

export const MESSAGE_PAGE_SIZE = 100

export async function getConversationMessages(
  params: GetConversationMessagesParams,
  signal?: AbortSignal,
): Promise<MessagePage> {
  const searchParams = new URLSearchParams()

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit))
  }

  if (params.before) {
    searchParams.set("before", params.before)
  }

  const query = searchParams.toString()
  const path = query
    ? `/conversations/${params.id}/messages?${query}`
    : `/conversations/${params.id}/messages`

  const response = await authenticatedRequest<unknown>(path, { signal })
  return parseMessagePage(response)
}

export async function sendMessage(payload: SendMessageRequest): Promise<Message> {
  const response = await authenticatedRequest<unknown>("/messages", {
    method: "POST",
    body: payload,
  })

  return parseMessage(response)
}

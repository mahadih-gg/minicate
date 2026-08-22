import { authenticatedRequest } from "@/lib/api/authenticated"
import { parseMessage, parseMessagePage } from "@/lib/messages/parse"
import { mergeMessagePages } from "@/lib/messages/state"
import type { GetConversationMessagesParams } from "@/types/conversation"
import type { Message, MessagePage, SendMessageRequest } from "@/types/message"

const PAGE_SIZE = 100
const MAX_PAGES = 10

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

export async function listConversationMessages(
  conversationId: string,
  signal?: AbortSignal,
): Promise<Message[]> {
  let before: string | undefined
  let hasMore = true
  let collected: Message[] = []

  for (let page = 0; page < MAX_PAGES && hasMore; page += 1) {
    const result = await getConversationMessages(
      { id: conversationId, limit: PAGE_SIZE, before },
      signal,
    )

    collected = mergeMessagePages(collected, result.messages)
    hasMore = result.hasMore

    const oldest = result.messages[result.messages.length - 1]
    if (!oldest || oldest._id === before) {
      break
    }

    before = oldest._id
  }

  return collected
}

export async function sendMessage(payload: SendMessageRequest): Promise<Message> {
  const response = await authenticatedRequest<unknown>("/messages", {
    method: "POST",
    body: payload,
  })

  return parseMessage(response)
}

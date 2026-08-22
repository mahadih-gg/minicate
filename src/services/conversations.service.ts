import { authenticatedRequest } from "@/lib/api/authenticated"
import {
  parseConversationList,
  parseCreateGroupResponse,
  parseStartConversationResponse,
} from "@/lib/conversations/parse"
import type {
  Conversation,
  CreateGroupRequest,
  CreateGroupResponse,
  StartConversationRequest,
  StartConversationResponse,
} from "@/types/conversation"

export async function listConversations(
  signal?: AbortSignal,
): Promise<Conversation[]> {
  const response = await authenticatedRequest<unknown>("/conversations", {
    signal,
  })

  return parseConversationList(response)
}

export async function startDirectConversation(
  payload: StartConversationRequest,
): Promise<StartConversationResponse> {
  const response = await authenticatedRequest<unknown>("/conversations", {
    method: "POST",
    body: payload,
  })

  return parseStartConversationResponse(response)
}

export async function createGroupConversation(
  payload: CreateGroupRequest,
): Promise<CreateGroupResponse> {
  const response = await authenticatedRequest<unknown>("/conversations/group", {
    method: "POST",
    body: payload,
  })

  return parseCreateGroupResponse(response)
}

import { apiRequest } from "@/lib/api/client"
import type { SendMessageRequest } from "@/types/message"

export async function sendMessage(
  payload: SendMessageRequest,
  token?: string,
): Promise<unknown> {
  return apiRequest<unknown>("/messages", {
    method: "POST",
    body: payload,
    token,
  })
}

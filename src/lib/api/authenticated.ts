import { apiRequest, type ApiRequestOptions } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"

export async function authenticatedRequest<T>(
  path: string,
  options: Omit<ApiRequestOptions, "token"> = {},
): Promise<T> {
  const token = getAccessToken()

  if (!token) {
    throw new Error("Not authenticated")
  }

  return apiRequest<T>(path, { ...options, token })
}

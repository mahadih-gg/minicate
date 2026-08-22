import { authenticatedRequest } from "@/lib/api/authenticated"
import { parseUserSearchResults } from "@/lib/users/parse"
import type { PublicUser } from "@/types/user"

export async function searchUsers(
  query: string,
  signal?: AbortSignal,
): Promise<PublicUser[]> {
  const params = new URLSearchParams({ q: query })

  const response = await authenticatedRequest<unknown>(
    `/users/search?${params.toString()}`,
    { signal },
  )

  return parseUserSearchResults(response)
}

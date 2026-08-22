import { isRecord } from "@/lib/auth/parse"
import type { PublicUser } from "@/types/user"

export function parsePublicUser(value: unknown): PublicUser {
  if (!isRecord(value)) {
    throw new Error("Invalid user payload")
  }

  const { _id, name, phone } = value

  if (
    typeof _id !== "string" ||
    typeof name !== "string" ||
    typeof phone !== "string"
  ) {
    throw new Error("Invalid user payload")
  }

  return { _id, name, phone }
}

export function parseUserSearchResults(value: unknown): PublicUser[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid user search payload")
  }

  return value.map(parsePublicUser)
}

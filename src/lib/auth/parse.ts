import type { LoginResponse } from "@/types/auth"
import type { User } from "@/types/user"

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function parseUser(value: unknown): User {
  if (!isRecord(value)) {
    throw new Error("Invalid user payload")
  }

  const { _id, name, phone, createdAt } = value

  if (
    typeof _id !== "string" ||
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof createdAt !== "string"
  ) {
    throw new Error("Invalid user payload")
  }

  return { _id, name, phone, createdAt }
}

export function parseLoginResponse(value: unknown): LoginResponse {
  if (!isRecord(value)) {
    throw new Error("Invalid login payload")
  }

  const { token, user } = value

  if (typeof token !== "string" || token.length === 0) {
    throw new Error("Invalid login payload")
  }

  return {
    token,
    user: parseUser(user),
  }
}

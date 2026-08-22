import { ApiError, apiRequest } from "@/lib/api/client"
import { parseLoginResponse, parseUser } from "@/lib/auth/parse"
import { getAccessToken } from "@/lib/auth/session"
import type { LoginRequest, LoginResponse } from "@/types/auth"
import type { User } from "@/types/user"

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<unknown>("/auth/login", {
    method: "POST",
    body: payload,
  })

  return parseLoginResponse(response)
}

export async function getCurrentUser(): Promise<User> {
  const token = getAccessToken()

  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await apiRequest<unknown>("/auth/me", { token })
  return parseUser(response)
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return "Something went wrong on our side. Please try again in a moment."
    }

    if (error.status === 401) {
      return "We could not sign you in with those details. Please try again."
    }

    if (error.message === "Validation failed") {
      return "Please check your phone number and name, then try again."
    }

    if (error.message) {
      return error.message
    }

    return "We could not sign you in. Please try again."
  }

  if (error instanceof Error && error.message === "Invalid login payload") {
    return "The server returned an unexpected response. Please try again."
  }

  return "Unable to sign in. Check your connection and try again."
}

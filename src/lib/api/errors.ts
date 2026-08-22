import { ApiError } from "@/lib/api/client"

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError"
}

export function isNetworkFailure(error: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return true
  }

  if (error instanceof ApiError) {
    return false
  }

  if (error instanceof TypeError) {
    return true
  }

  return (
    error instanceof Error && /failed to fetch|networkerror|load failed/i.test(error.message)
  )
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return "Something went wrong on our side. Please try again in a moment."
    }

    if (error.status === 401) {
      return "Your session has expired. Please sign in again."
    }

    if (error.message) {
      return error.message
    }
  }

  if (error instanceof Error && error.message === "Not authenticated") {
    return "Your session has expired. Please sign in again."
  }

  return fallback
}

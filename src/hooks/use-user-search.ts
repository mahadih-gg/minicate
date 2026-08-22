import { useEffect, useState } from "react"

import { getApiErrorMessage, isAbortError } from "@/lib/api/errors"
import { searchUsers } from "@/services/users.service"
import type { PublicUser } from "@/types/user"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

type SearchStatus = "idle" | "loading" | "success" | "error"

export function useUserSearch(excludeUserId?: string) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PublicUser[]>([])
  const [status, setStatus] = useState<SearchStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebouncedValue(query, 300)
  const trimmedQuery = debouncedQuery.trim()

  useEffect(() => {
    if (!trimmedQuery) {
      return
    }

    const controller = new AbortController()

    void (async () => {
      await Promise.resolve()

      if (controller.signal.aborted) {
        return
      }

      setStatus("loading")
      setError(null)

      try {
        const users = await searchUsers(trimmedQuery, controller.signal)
        const visibleUsers = excludeUserId
          ? users.filter((user) => user._id !== excludeUserId)
          : users
        setResults(visibleUsers)
        setStatus("success")
      } catch (caught: unknown) {
        if (isAbortError(caught) || controller.signal.aborted) {
          return
        }

        setResults([])
        setStatus("error")
        setError(
          getApiErrorMessage(caught, "Could not search users. Please try again."),
        )
      }
    })()

    return () => {
      controller.abort()
    }
  }, [excludeUserId, trimmedQuery])

  function clear() {
    setQuery("")
    setResults([])
    setStatus("idle")
    setError(null)
  }

  const isIdle = !query.trim()

  return {
    query,
    setQuery,
    results: isIdle ? [] : results,
    status: isIdle ? "idle" : status,
    error: isIdle ? null : error,
    isLoading: !isIdle && status === "loading",
    clear,
  }
}

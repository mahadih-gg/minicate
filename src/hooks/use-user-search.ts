"use client"

import { useQuery } from "@tanstack/react-query"
import { useCallback, useState } from "react"

import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getApiErrorMessage } from "@/lib/api/errors"
import { queryKeys } from "@/lib/query/keys"
import { searchUsers } from "@/services/users.service"

export function useUserSearch(excludeUserId?: string) {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const trimmedQuery = debouncedQuery.trim()
  const isIdle = !query.trim()

  const searchQuery = useQuery({
    queryKey: [...queryKeys.userSearch(trimmedQuery), excludeUserId ?? null],
    queryFn: async ({ signal }) => {
      const users = await searchUsers(trimmedQuery, signal)
      return excludeUserId
        ? users.filter((user) => user._id !== excludeUserId)
        : users
    },
    enabled: Boolean(trimmedQuery),
    staleTime: 30_000,
  })

  const clear = useCallback(() => {
    setQuery("")
  }, [])

  const { refetch } = searchQuery

  const retry = useCallback(() => {
    if (!query.trim()) {
      return
    }

    void refetch()
  }, [query, refetch])

  const error = searchQuery.error
    ? getApiErrorMessage(searchQuery.error, "Could not search users. Please try again.")
    : null

  return {
    query,
    setQuery,
    results: isIdle ? [] : (searchQuery.data ?? []),
    status: isIdle
      ? ("idle" as const)
      : searchQuery.isPending
        ? ("loading" as const)
        : searchQuery.isError
          ? ("error" as const)
          : ("success" as const),
    error: isIdle ? null : error,
    isLoading: !isIdle && searchQuery.isFetching,
    clear,
    retry,
  }
}

"use client"

import { QueryClient } from "@tanstack/react-query"

const DAY_MS = 1000 * 60 * 60 * 24

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15_000,
        gcTime: DAY_MS,
        retry: 1,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"

import { AuthProvider } from "@/components/features/auth/auth-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { makeQueryClient } from "@/lib/query/client"

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

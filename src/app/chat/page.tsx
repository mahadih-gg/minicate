"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { ChatLayout } from "@/components/features/chat/ChatLayout"
import { useAuth } from "@/hooks/use-auth"

export default function ChatPage() {
  const router = useRouter()
  const { isReady, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isReady, router])

  if (!isReady) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <p className="font-hand text-lg text-muted-foreground">Loading your session.</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <p className="font-hand text-lg text-muted-foreground">Redirecting to sign in.</p>
      </main>
    )
  }

  return <ChatLayout />
}

import Image from "next/image"
import type { Metadata } from "next"

import { LoginForm } from "@/components/features/auth/LoginForm"

export const metadata: Metadata = {
  title: "Sign in · Minicate",
  description: "Sign in or register for Minicate with your phone number and name.",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Image
          src="/assets/images/minicate-full.png"
          alt="Minicate"
          width={180}
          height={48}
          priority
        />
        <p className="max-w-sm text-sm text-muted-foreground">
          A calm place for one-to-one and group conversations.
        </p>
      </div>
      <LoginForm />
    </main>
  )
}

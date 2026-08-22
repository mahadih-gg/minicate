import Image from "next/image"
import type { Metadata } from "next"

import { SketchStar } from "@/components/common/sketch-marks"
import { LoginForm } from "@/components/features/auth/LoginForm"
import { Highlighter } from "@/components/ui/highlighter"

export const metadata: Metadata = {
  title: "Sign in · Minicate",
  description: "Sign in or register for Minicate with your phone number and name.",
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <SketchStar className="absolute top-10 right-12 size-7 opacity-40 max-sm:hidden" />
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Image
          src="/assets/images/minicate-full.png"
          alt="Minicate"
          width={180}
          height={48}
          priority
        />
        <p className="max-w-sm text-sm text-muted-foreground">
          A calm place for{" "}
          <Highlighter action="highlight" color="var(--brand-marker)">
            one-to-one
          </Highlighter>{" "}
          and group conversations.
        </p>
      </div>
      <LoginForm />
    </main>
  )
}

import type { Metadata } from "next"

import { LandingHero } from "@/components/features/landing/LandingHero"
import { LandingNavbar } from "@/components/features/landing/LandingNavbar"

export const metadata: Metadata = {
  title: "Minicate - Chat freely. Stay closely.",
  description:
    "Minicate is a real-time messenger built for meaningful conversations, beautifully designed for everyday use.",
}

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
      </main>
    </div>
  )
}

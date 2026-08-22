import type { Metadata } from "next"

import { LandingBuilder } from "@/components/features/landing/LandingBuilder"
import { LandingFeatures } from "@/components/features/landing/LandingFeatures"
import { LandingFooter } from "@/components/features/landing/LandingFooter"
import { LandingHero } from "@/components/features/landing/LandingHero"
import { LandingMessenger } from "@/components/features/landing/LandingMessenger"
import { LandingNavbar } from "@/components/features/landing/LandingNavbar"
import { Reveal } from "@/components/features/landing/Reveal"
import { SmoothScroll } from "@/components/features/landing/SmoothScroll"
import Grainient from "@/components/Grainient"

export const metadata: Metadata = {
  title: "Minicate - Chat freely. Stay closely.",
  description:
    "Minicate is a real-time messenger built for meaningful conversations, beautifully designed for everyday use.",
}

export default function Home() {
  return (
    <SmoothScroll>
      <div className="relative flex min-h-dvh flex-col overflow-x-clip">
        <div aria-hidden className="pointer-events-none absolute inset-0 notebook-wash" />
        <LandingNavbar />
        <main className="flex-1">
          <LandingHero />
          <LandingFeatures />

          <div className="relative overflow-hidden">

            <LandingMessenger />
            <LandingBuilder />
            <LandingFooter />

            <Reveal
              variant="blur"
              duration={1.2}
              amount={0.1}
              className="pointer-events-none absolute bottom-0 left-0 -z-10 aspect-square w-[70%] -translate-x-[20%] translate-y-[50%] overflow-hidden rounded-full opacity-70 mask-[radial-gradient(circle_at_center,black_0%,transparent_55%)]"
            >
              <div aria-hidden className="size-full">
                <Grainient
                  blendAngle={148}
                  centerX={0.2}
                  centerY={-0.1}
                  timeSpeed={0.14}
                  grainAmount={0.04}
                />
              </div>
            </Reveal>
          </div>
        </main>
      </div>
    </SmoothScroll>
  )
}

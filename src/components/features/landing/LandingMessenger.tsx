import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import {
  SketchArrow,
  SketchHeart,
  SketchStar,
} from "@/components/common/sketch-marks"
import { landingSecondaryCtaClassName } from "@/components/features/landing/cta-styles"
import {
  LANDING_COPY,
  LANDING_MESSENGER,
} from "@/components/features/landing/hero"
import { MessengerVisualSlot } from "@/components/features/landing/MessengerVisualSlot"
import {
  Reveal,
  RevealFloat,
  RevealGroup,
  RevealItem,
} from "@/components/features/landing/Reveal"
import { ReviewSlider } from "@/components/features/landing/ReviewSlider"
import { Highlighter } from "@/components/ui/highlighter"

export function LandingMessenger() {
  return (
    <section
      id="about"
      aria-labelledby="messenger-heading"
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
    >
      <SketchStar className="absolute top-10 left-6 size-5 opacity-40 max-md:hidden" />
      <SketchStar className="absolute top-16 right-10 size-4 opacity-30 max-md:hidden" />
      <SketchHeart className="absolute right-8 bottom-8 size-10 opacity-50 max-md:hidden" />

      <div className="container-fluid grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8">
        <RevealGroup
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          stagger={0.12}
        >
          <RevealItem variant="left">
          <h2
            id="messenger-heading"
            className="font-heading text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl"
          >
            <span className="block">{LANDING_MESSENGER.headline}</span>
            <span className="mt-1 block font-hand text-[1.15em] font-bold text-brand-violet">
              <Highlighter
                action="underline"
                color="var(--brand-violet)"
                strokeWidth={3}
                iterations={2}
                animationDuration={800}
                padding={4}
                isView
              >
                {LANDING_MESSENGER.headlineAccent}
              </Highlighter>
            </span>
          </h2>
          </RevealItem>

          <RevealItem variant="left">
          <p className="mt-5 max-w-md font-hand text-lg leading-snug text-foreground/80 sm:text-xl">
            {LANDING_MESSENGER.supporting}
          </p>
          </RevealItem>

          <RevealItem variant="left">
          <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
            <Link
              href={LANDING_COPY.secondaryCtaHref}
              className={landingSecondaryCtaClassName()}
            >
              {LANDING_MESSENGER.cta}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <p className="flex items-center gap-2 font-hand text-base text-muted-foreground">
              <SketchArrow className="h-5 w-12 -rotate-90" />
              {LANDING_MESSENGER.ctaHint}
            </p>
          </div>
          </RevealItem>
        </RevealGroup>

        <Reveal variant="scale" delay={0.12}>
          <RevealFloat>
            <MessengerVisualSlot />
          </RevealFloat>
        </Reveal>

        <Reveal variant="right" delay={0.18} className="flex min-w-0 flex-col gap-6">
          <p className="text-center font-hand text-2xl text-foreground lg:text-left">
            {LANDING_MESSENGER.reviewsTitlePrefix}
            <Highlighter
              action="circle"
              color="var(--brand-violet)"
              strokeWidth={2}
              iterations={2}
              animationDuration={700}
              padding={6}
              isView
            >
              {LANDING_MESSENGER.reviewsTitleAccent}
            </Highlighter>
            {LANDING_MESSENGER.reviewsTitleSuffix}
          </p>
          <ReviewSlider />
        </Reveal>
      </div>
    </section>
  )
}

import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import {
  landingPrimaryCtaClassName,
  landingSecondaryCtaClassName,
} from "@/components/features/landing/cta-styles"
import { LANDING_COPY, LANDING_CTA_HREF } from "@/components/features/landing/hero"
import { HeroVisualSlot } from "@/components/features/landing/HeroVisualSlot"
import {
  Reveal,
  RevealFloat,
  RevealGroup,
  RevealItem,
} from "@/components/features/landing/Reveal"
import { Highlighter } from "@/components/ui/highlighter"

export function LandingHero() {
  return (
    <section className="container-fluid mt-20 relative grid w-full items-center gap-10 py-10 sm:gap-12 sm:py-12 md:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] md:gap-8 md:py-14 lg:gap-12 lg:py-16">
      <RevealGroup
        className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left"
        stagger={0.12}
        delay={0.08}
      >
        <RevealItem>
        <p className="font-hand text-xl text-foreground/80 lg:text-2xl">
          <Highlighter
            action="underline"
            color="var(--brand-violet)"
            strokeWidth={2}
            iterations={2}
            animationDuration={700}
            isView
          >
            {LANDING_COPY.eyebrow}
          </Highlighter>
        </p>
        </RevealItem>

        <RevealItem>
        <h1 className="font-heading mt-4 leading-[1.05] tracking-tight text-foreground sm:mt-5 text-5xl sm:text-6xl 2xl:text-8xl lg:leading-[1.02]">
          <span className="block">{LANDING_COPY.headlineLines[0]}</span>
          <span className="block">{LANDING_COPY.headlineLines[1]}</span>
          <span className="mt-1 block font-heading">
            {LANDING_COPY.headlineAccentPrefix}
            <span className="font-hand text-[1.15em] font-bold text-[var(--brand-violet)]">
              <Highlighter
                action="underline"
                color="var(--brand-violet)"
                strokeWidth={3}
                iterations={2}
                animationDuration={800}
                padding={4}
                isView
              >
                {LANDING_COPY.headlineAccent}
              </Highlighter>
            </span>
          </span>
        </h1>
        </RevealItem>

        <RevealItem>
        <p className="mt-5 max-w-2xl leading-relaxed text-foreground/80 sm:mt-6 text-base sm:text-lg lg:text-2xl">
          {LANDING_COPY.supporting}
        </p>
        </RevealItem>

        <RevealItem>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8 md:justify-start">
          <Link href={LANDING_CTA_HREF} className={landingPrimaryCtaClassName()}>
            {LANDING_COPY.primaryCta}
            <ArrowRightIcon data-icon="inline-end" className="size-4" />
          </Link>
          <Link
            href={LANDING_COPY.secondaryCtaHref}
            className={landingSecondaryCtaClassName()}
          >
            {LANDING_COPY.secondaryCta}
          </Link>
        </div>
        </RevealItem>

        <RevealItem>
        <p className="mt-4 font-hand text-base text-muted-foreground sm:text-lg">
          {LANDING_COPY.supportLine}
        </p>
        </RevealItem>
      </RevealGroup>

      <Reveal variant="right" delay={0.2} className="relative flex min-w-0 justify-center overflow-visible md:justify-end">
        <RevealFloat className="w-full">
          <HeroVisualSlot className="w-full" />
        </RevealFloat>
      </Reveal>
    </section>
  )
}

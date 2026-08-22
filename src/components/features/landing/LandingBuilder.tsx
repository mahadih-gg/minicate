import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { FaGithub, FaLinkedin } from "react-icons/fa6"
import { HiArrowTopRightOnSquare, HiMiniSquares2X2 } from "react-icons/hi2"
import {
  SiNextdotjs,
  SiReact,
  SiReactquery,
  SiSocketdotio,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si"
import { TbBrandFramerMotion } from "react-icons/tb"

import {
  SketchArrow,
  SketchHeart,
  SketchRule,
  SketchScribble,
  SketchStar,
} from "@/components/common/sketch-marks"
import { LANDING_BUILDER } from "@/components/features/landing/hero"
import {
  Reveal,
  RevealFloat,
  RevealGroup,
  RevealItem,
} from "@/components/features/landing/Reveal"
import { Highlighter } from "@/components/ui/highlighter"

function StackIcon({ kind }: { kind: (typeof LANDING_BUILDER.stack)[number]["kind"] }) {
  const className = "size-4 shrink-0"

  switch (kind) {
    case "next":
      return <SiNextdotjs className={className} aria-hidden />
    case "react":
      return <SiReact className={className} aria-hidden />
    case "typescript":
      return <SiTypescript className={className} aria-hidden />
    case "tailwind":
      return <SiTailwindcss className={className} aria-hidden />
    case "shadcn":
      return <HiMiniSquares2X2 className={className} aria-hidden />
    case "socket":
      return <SiSocketdotio className={className} aria-hidden />
    case "query":
      return <SiReactquery className={className} aria-hidden />
    case "motion":
      return <TbBrandFramerMotion className={className} aria-hidden />
  }
}

function LinkIcon({ kind }: { kind: (typeof LANDING_BUILDER.links)[number]["kind"] }) {
  const className = "size-4 shrink-0"

  if (kind === "github") {
    return <FaGithub className={className} aria-hidden />
  }

  if (kind === "linkedin") {
    return <FaLinkedin className={className} aria-hidden />
  }

  return <HiArrowTopRightOnSquare className={className} aria-hidden />
}

function StackChip({
  children,
  icon,
}: {
  children: ReactNode
  icon: ReactNode
}) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-[10px_16px_8px_14px] border-[1.5px] border-foreground bg-card px-2.5 py-1 font-hand text-sm text-foreground shadow-[2px_2px_0_var(--foreground)]">
      {icon}
      {children}
    </li>
  )
}

export function LandingBuilder() {
  return (
    <section
      id="builder"
      aria-labelledby="builder-heading"
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
    >
      <SketchStar className="absolute top-8 left-6 size-5 opacity-40 max-md:hidden" />
      <SketchHeart className="absolute right-10 bottom-10 size-9 opacity-40 max-md:hidden" />

      <div className="container-fluid flex flex-col gap-10 lg:gap-14">
        <Reveal variant="left">
          <div className="flex items-center gap-3">
            <SketchArrow className="hidden h-5 w-12 shrink-0 sm:block" />
            <h2
              id="builder-heading"
              className="font-hand shrink-0 text-xl tracking-[0.18em] text-foreground uppercase sm:text-2xl"
            >
              {LANDING_BUILDER.heading}
            </h2>
            <SketchRule className="min-w-0 flex-1 opacity-70" />
          </div>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-6 xl:gap-10">
          <Reveal
            variant="scale"
            delay={0.08}
            className="relative z-10 order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none"
          >
            <RevealFloat>
              <figure className="relative mx-auto w-full">
                <SketchArrow className="absolute top-1/2 -left-10 hidden h-7 w-16 -translate-y-1/2 rotate-180 text-brand-violet opacity-70 lg:block" />
                <SketchArrow className="absolute top-1/2 -right-10 hidden h-7 w-16 -translate-y-1/2 text-brand-cyan opacity-70 lg:block" />
                <div
                  aria-hidden
                  className="absolute -inset-5 -z-10 rotate-[-4deg] rounded-[40%_60%_55%_45%/45%_40%_60%_55%] bg-brand-violet/25"
                />
                <div
                  aria-hidden
                  className="absolute -right-3 -bottom-4 -z-10 h-24 w-24 rotate-6 rounded-full bg-brand-cyan/30"
                />
                <div className="rotate-[1.5deg] rounded-[28px_18px_32px_20px] border-[1.5px] border-foreground bg-card p-2 shadow-[6px_6px_0_var(--foreground)] sm:p-3">
                  <Image
                    src={LANDING_BUILDER.portrait.src}
                    alt={LANDING_BUILDER.portrait.alt}
                    width={720}
                    height={900}
                    sizes="(min-width: 1024px) 32vw, 80vw"
                    className="h-auto w-full rounded-[22px_14px_26px_16px] object-contain"
                  />
                </div>
              </figure>
            </RevealFloat>
          </Reveal>

          <RevealGroup
            className="relative order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left"
            stagger={0.1}
          >
            <SketchStar className="absolute -top-2 right-4 size-4 opacity-40 lg:right-auto lg:-left-2" />
            <RevealItem variant="left">
              <p className="font-heading text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
                {LANDING_BUILDER.name}
              </p>
            </RevealItem>
            <RevealItem variant="left">
              <p className="mt-2 font-hand text-lg text-foreground/80 sm:text-xl">
                <Highlighter
                  action="underline"
                  color="var(--brand-violet)"
                  strokeWidth={2}
                  iterations={2}
                  animationDuration={700}
                  isView
                >
                  {LANDING_BUILDER.role}
                </Highlighter>
              </p>
            </RevealItem>
            <RevealItem variant="left">
              <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/80 sm:text-lg">
                {LANDING_BUILDER.intro}
              </p>
            </RevealItem>
            <RevealItem variant="left">
              <ul className="mt-6 flex max-w-md flex-col gap-3 text-left">
                {LANDING_BUILDER.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 font-hand text-base leading-snug text-foreground/85 sm:text-lg"
                  >
                    <SketchStar className="mt-1 size-3.5 shrink-0 opacity-70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          </RevealGroup>

          <Reveal
            variant="right"
            delay={0.14}
            className="relative order-3 flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left"
          >
            <SketchScribble className="absolute -top-3 right-8 h-4 w-14 opacity-50 max-lg:hidden" />
            <p className="font-hand text-lg text-foreground sm:text-xl">
              Built with{" "}
              <Highlighter
                action="circle"
                color="var(--brand-cyan)"
                strokeWidth={2}
                iterations={2}
                animationDuration={700}
                padding={4}
                isView
              >
                care
              </Highlighter>
              .
            </p>
            <p className="mt-3 max-w-sm font-hand text-base leading-snug text-foreground/80 sm:text-lg">
              {LANDING_BUILDER.builtWith}
            </p>
            <ul className="mt-6 flex max-w-sm flex-wrap justify-center gap-2 lg:justify-start">
              {LANDING_BUILDER.stack.map((item) => (
                <StackChip key={item.label} icon={<StackIcon kind={item.kind} />}>
                  {item.label}
                </StackChip>
              ))}
            </ul>
            <ul className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {LANDING_BUILDER.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-[10px_16px_8px_14px] border-[1.5px] border-foreground bg-foreground px-3 py-2 font-hand text-sm font-medium text-background shadow-[3px_3px_0_color-mix(in_oklab,var(--brand-violet)_70%,black)] transition-[translate,box-shadow] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_color-mix(in_oklab,var(--brand-violet)_70%,black)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <LinkIcon kind={link.kind} />
                    {link.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

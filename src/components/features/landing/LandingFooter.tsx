import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { LANDING_FOOTER } from "@/components/features/landing/hero"
import { NavbarProgressiveBlur } from "@/components/features/landing/NavbarProgressiveBlur"
import { RevealGroup, RevealItem } from "@/components/features/landing/Reveal"
import { Highlighter } from "@/components/ui/highlighter"

export function LandingFooter() {
  return (
    <footer className="relative mt-auto overflow-x-clip overflow-b-clip pt-12 pb-8 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12">

      <NavbarProgressiveBlur className="z-[1]" direction="bottom" />

      <div className="container-fluid relative z-10 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <RevealGroup
          className="flex max-w-md flex-col items-center gap-6 text-center lg:items-start lg:text-left"
          stagger={0.12}
        >
          <RevealItem>
            <Link
              href="/"
              className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Image
                src="/assets/images/minicate-full.png"
                alt="Minicate"
                width={148}
                height={40}
                className="h-10 w-auto sm:h-14"
              />
            </Link>
          </RevealItem>

          <RevealItem>
            <p className="flex items-center gap-2 font-hand text-2xl leading-tight text-foreground sm:text-3xl">
              <span>
                {LANDING_FOOTER.taglineBefore}
                <span className="text-brand-cyan">
                  <Highlighter
                    action="underline"
                    color="var(--brand-cyan)"
                    strokeWidth={2}
                    iterations={2}
                    animationDuration={700}
                    padding={2}
                    isView
                  >
                    {LANDING_FOOTER.taglineAccent}
                  </Highlighter>
                </span>
                {LANDING_FOOTER.taglineAfter}
              </span>
              <Heart
                aria-hidden="true"
                className="size-5 shrink-0 fill-brand-violet text-brand-violet sm:size-6"
              />
            </p>
          </RevealItem>
        </RevealGroup>

        <RevealGroup
          className="flex flex-wrap justify-center gap-10 sm:gap-14 lg:justify-start"
          stagger={0.1}
          delay={0.1}
        >
          {LANDING_FOOTER.columns.map((column) => (
            <RevealItem key={column.title}>
              <nav
                aria-label={column.title}
                className="flex min-w-32 flex-col gap-3"
              >
                <p className="font-sans text-sm font-semibold tracking-tight text-foreground">
                  {column.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </footer>
  )
}

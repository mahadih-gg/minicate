"use client"

import { ArrowRightIcon, MenuIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { landingNavbarCtaClassName } from "@/components/features/landing/cta-styles"
import {
  LANDING_COPY,
  LANDING_CTA_HREF,
  LANDING_NAV_LINKS,
} from "@/components/features/landing/hero"
import { NavbarProgressiveBlur } from "@/components/features/landing/NavbarProgressiveBlur"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function LandingNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full">
      <div className="relative">
        <NavbarProgressiveBlur />
        <div className="container-fluid relative z-10 flex items-center gap-3 py-3">
          <Link
            href="/"
            className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Image
              src="/assets/images/minicate-full.png"
              alt="Minicate"
              width={148}
              height={40}
              priority
              className="h-10 w-auto sm:h-16"
            />
          </Link>

          <div className="ml-auto flex items-center gap-2 md:gap-7">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-7 md:flex"
            >
              {LANDING_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-hand text-lg text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href={LANDING_CTA_HREF}
              className={landingNavbarCtaClassName(
                "h-9 gap-1.5 px-3 text-xs sm:h-10 sm:gap-2 sm:px-4 sm:text-sm",
              )}
            >
              <span className="sm:hidden">Get Minicate</span>
              <span className="hidden sm:inline">{LANDING_COPY.primaryCta}</span>
              <ArrowRightIcon data-icon="inline-end" className="size-3.5 sm:size-4" />
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-foreground md:hidden"
                    aria-label="Open menu"
                  />
                }
              >
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-0">
                <SheetHeader className="border-b border-foreground/15 p-5">
                  <SheetTitle className="font-hand text-xl tracking-normal">
                    Menu
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Landing page navigation links.
                  </SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                  {LANDING_NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-[var(--radius-sketch)] px-3 py-3 font-hand text-xl text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={LANDING_CTA_HREF}
                    onClick={() => setOpen(false)}
                    className={landingNavbarCtaClassName("mt-3 w-full")}
                  >
                    {LANDING_COPY.primaryCta}
                    <ArrowRightIcon data-icon="inline-end" className="size-4" />
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

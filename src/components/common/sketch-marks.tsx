import { cn } from "@/lib/utils"

type SketchMarkProps = {
  className?: string
}

export function SketchArrow({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 72 28"
      className={cn("pointer-events-none text-foreground", className)}
      fill="none"
    >
      <path
        d="M4 8c18 2 34 3 52 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M48 3c6 3 10 6 12 10-5-1-10-1-16 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SketchStar({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("pointer-events-none text-foreground", className)}
      fill="none"
    >
      <path
        d="M12 2.5 13.6 9l6.4.4-5 4.2 1.6 6.4L12 16.4 7.4 20l1.6-6.4-5-4.2L10.4 9 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SketchScribble({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 16"
      className={cn("pointer-events-none text-foreground", className)}
      fill="none"
    >
      <path
        d="M2 10c4-7 8 6 12-2s8 8 12 0 8 8 12-1 6 6 8 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SketchRays({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 18 18"
      className={cn("pointer-events-none text-[var(--brand-cyan)]", className)}
      fill="none"
    >
      <path d="M3 15 8 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 15 12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 15 16 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function SketchChatDoodle({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 92"
      className={cn("pointer-events-none text-foreground", className)}
      fill="none"
    >
      <path
        d="M18 22c0-8 8-14 22-14h42c14 0 22 6 22 14v18c0 8-8 14-22 14H52l-16 12 4-12c-12-1-22-6-22-16V22Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="color-mix(in oklab, var(--card) 86%, white)"
      />
      <path
        d="M78 42c0-8 8-14 24-14h28c14 0 22 6 22 14v16c0 8-8 14-22 14h-8l10 10-16-10c-14 0-38-4-38-16V42Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="color-mix(in oklab, var(--brand-cyan) 78%, white)"
      />
      <path d="M38 30h28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38 38h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M108 52h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="146" cy="18" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 72c8-2 14 4 22-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function SketchRule({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 8"
      preserveAspectRatio="none"
      className={cn("pointer-events-none h-2 w-full text-foreground", className)}
      fill="none"
    >
      <path
        d="M0 4c40-2.5 80 2.5 120 0s80 3.5 120-1 80 2.8 160 1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SketchColumnRule({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 8 220"
      preserveAspectRatio="none"
      className={cn("pointer-events-none h-full w-2 text-foreground", className)}
      fill="none"
    >
      <path
        d="M4 2c2 28-2 48 1 72-3 28 2 46 0 74-2 24 3 38 0 70"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SketchPaintBlob({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      className={cn("pointer-events-none text-current", className)}
      fill="currentColor"
    >
      <path d="M22 14c16-12 42-6 48 14 6 18-8 36-26 38-20 3-36-12-34-28 1-12 6-18 12-24Z" />
    </svg>
  )
}

export function SketchHeart({ className }: SketchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 36 36"
      className={cn("pointer-events-none text-foreground", className)}
      fill="none"
    >
      <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M18 25c-6-4.2-9-7.4-9-11 0-2.6 2-4.4 4.5-4.4 1.7 0 3.2.9 4.5 2.4 1.3-1.5 2.8-2.4 4.5-2.4 2.5 0 4.5 1.8 4.5 4.4 0 3.6-3 6.8-9 11Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

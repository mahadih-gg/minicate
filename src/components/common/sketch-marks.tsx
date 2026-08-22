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

"use client"

import { cn } from "@/lib/utils"

/**
 * Progressive backdrop blur for the navbar — layered blur + masks
 * (CSS adaptation of the Codrops / webgl-progressive-blur idea).
 * Strongest in the nav band, dissolving toward the bottom edge.
 */
const BLUR_LAYERS = [
  {
    blur: 48,
    mask: "linear-gradient(to bottom, black 0%, black 12.5%, transparent 25%)",
  },
  {
    blur: 32,
    mask: "linear-gradient(to bottom, transparent 0%, black 12.5%, black 25%, transparent 37.5%)",
  },
  {
    blur: 16,
    mask: "linear-gradient(to bottom, transparent 12.5%, black 25%, black 37.5%, transparent 50%)",
  },
  {
    blur: 8,
    mask: "linear-gradient(to bottom, transparent 25%, black 37.5%, black 50%, transparent 62.5%)",
  },
  {
    blur: 4,
    mask: "linear-gradient(to bottom, transparent 37.5%, black 50%, black 62.5%, transparent 75%)",
  },
  {
    blur: 2,
    mask: "linear-gradient(to bottom, transparent 50%, black 62.5%, black 75%, transparent 87.5%)",
  },
  {
    blur: 1,
    mask: "linear-gradient(to bottom, transparent 62.5%, black 75%, black 87.5%, transparent 100%)",
  },
  {
    blur: 0.5,
    mask: "linear-gradient(to bottom, transparent 75%, black 87.5%, black 100%)",
  },
] as const

type NavbarProgressiveBlurProps = {
  className?: string
}

export function NavbarProgressiveBlur({
  className,
}: NavbarProgressiveBlurProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 h-[140%]",
        className,
      )}
    >
      {BLUR_LAYERS.map(({ blur, mask }) => (
        <div
          key={blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--background) 78%, transparent) 0%, color-mix(in oklab, var(--background) 42%, transparent) 55%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 72%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 72%, transparent 100%)",
        }}
      />
    </div>
  )
}

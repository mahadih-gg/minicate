"use client"

import { cn } from "@/lib/utils"

/**
 * Progressive backdrop blur — layered blur + masks
 * (CSS adaptation of the Codrops / webgl-progressive-blur idea).
 * `top`: strongest in the nav band, dissolving downward.
 * `bottom`: strongest in the footer band, dissolving upward.
 */
const BLUR_LAYERS = [
  {
    blur: 48,
    stops: "black 0%, black 12.5%, transparent 25%",
  },
  {
    blur: 32,
    stops: "transparent 0%, black 12.5%, black 25%, transparent 37.5%",
  },
  {
    blur: 16,
    stops: "transparent 12.5%, black 25%, black 37.5%, transparent 50%",
  },
  {
    blur: 8,
    stops: "transparent 25%, black 37.5%, black 50%, transparent 62.5%",
  },
  {
    blur: 4,
    stops: "transparent 37.5%, black 50%, black 62.5%, transparent 75%",
  },
  {
    blur: 2,
    stops: "transparent 50%, black 62.5%, black 75%, transparent 87.5%",
  },
  {
    blur: 1,
    stops: "transparent 62.5%, black 75%, black 87.5%, transparent 100%",
  },
  {
    blur: 0.5,
    stops: "transparent 75%, black 87.5%, black 100%",
  },
] as const

type ProgressiveBlurDirection = "top" | "bottom"

type NavbarProgressiveBlurProps = {
  className?: string
  direction?: ProgressiveBlurDirection
}

function gradientTo(direction: ProgressiveBlurDirection) {
  return direction === "bottom" ? "to top" : "to bottom"
}

export function NavbarProgressiveBlur({
  className,
  direction = "top",
}: NavbarProgressiveBlurProps) {
  const to = gradientTo(direction)

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-0 h-[140%]",
        direction === "bottom" ? "top-auto bottom-0" : "top-0",
        className,
      )}
    >
      {BLUR_LAYERS.map(({ blur, stops }) => {
        const mask = `linear-gradient(${to}, ${stops})`

        return (
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
        )
      })}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${to}, color-mix(in oklab, var(--background) 78%, transparent) 0%, color-mix(in oklab, var(--background) 42%, transparent) 55%, transparent 100%)`,
          maskImage: `linear-gradient(${to}, black 0%, black 72%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(${to}, black 0%, black 72%, transparent 100%)`,
        }}
      />
    </div>
  )
}

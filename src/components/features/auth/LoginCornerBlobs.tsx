"use client"

import Grainient from "@/components/Grainient"
import { cn } from "@/lib/utils"

const blobs = [
  {
    className:
      "-bottom-[24rem] -left-[22rem] size-[38rem] sm:-bottom-[32rem] sm:-left-[30rem] sm:size-[54rem] lg:-bottom-[42rem] lg:-left-[30rem] lg:size-[85rem]",
    blendAngle: 148,
    centerX: 0.2,
    centerY: -0.1,
  },
  {
    className:
      "-bottom-[20rem] -right-[20rem] size-[34rem] sm:-bottom-[28rem] sm:-right-[28rem] sm:size-[50rem] lg:-bottom-[38rem] lg:-right-[36rem] lg:size-[85rem]",
    blendAngle: 228,
    centerX: -0.16,
    centerY: -0.14,
  },
] as const

export function LoginCornerBlobs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {blobs.map((blob) => (
        <div
          key={blob.className}
          className={cn(
            "absolute overflow-hidden rounded-full opacity-70",
            "mask-[radial-gradient(circle_at_center,black_0%,transparent_55%)]",
            blob.className,
          )}
        >
          <Grainient
            blendAngle={blob.blendAngle}
            centerX={blob.centerX}
            centerY={blob.centerY}
            timeSpeed={0.14}
            grainAmount={0.04}
          />
        </div>
      ))}
    </div>
  )
}

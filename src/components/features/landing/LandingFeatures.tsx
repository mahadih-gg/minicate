import Image from "next/image"

import {
  SketchArrow,
  SketchColumnRule,
  SketchRule,
  SketchScribble,
  SketchStar,
} from "@/components/common/sketch-marks"
import { LANDING_FEATURES } from "@/components/features/landing/hero"

export function LandingFeatures() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
    >
      <SketchStar className="absolute top-8 left-4 size-5 opacity-40 sm:left-8" />
      <SketchStar className="absolute right-6 bottom-10 size-6 opacity-30 max-sm:hidden" />

      <div className="container-fluid flex flex-col gap-10 lg:gap-14">
        <div className="flex items-center gap-3">
          <SketchArrow className="hidden h-5 w-12 shrink-0 sm:block" />
          <h2
            id="features-heading"
            className="font-hand shrink-0 text-xl tracking-[0.18em] text-foreground uppercase sm:text-2xl"
          >
            Why Minicate?
          </h2>
          <SketchRule className="min-w-0 flex-1 opacity-70" />
        </div>

        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {LANDING_FEATURES.map((feature, index) => {
            const isLast = index === LANDING_FEATURES.length - 1

            return (
              <li
                key={feature.title}
                className="relative flex flex-col items-center px-2 text-center sm:px-6 lg:px-8"
              >
                {!isLast ? (
                  <SketchColumnRule className="absolute top-6 right-0 hidden h-[calc(100%-2rem)] lg:block" />
                ) : null}

                <div className="relative mb-5 size-28 sm:size-32">
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-[16rem] font-hand text-lg leading-snug text-foreground/80">
                  {feature.description}
                </p>
                <SketchScribble className="mt-5 h-4 w-16 opacity-70" />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

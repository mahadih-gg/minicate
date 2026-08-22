import { cn } from "@/lib/utils"
import Image from "next/image"

type HeroVisualSlotProps = {
  className?: string
}

/**
 * Dedicated slot for the hero visual PNG.
 * Drop the asset at HERO_VISUAL_SRC and set `src` on the Image below.
 * Until then the tilted container reserves space without inventing artwork.
 */
export function HeroVisualSlot({ className }: HeroVisualSlotProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-visible",
        className,
      )}
    >

      <Image
        src="/assets/images/minicate_hero_right_section.webp"
        alt="Minicate Hero Right Section"
        width={1536}
        height={1024}
        priority
        className="object-contain object-center w-full h-auto"
        sizes="(max-width: 768px) 100vw, 55vw"
      />
    </div>
  )
}
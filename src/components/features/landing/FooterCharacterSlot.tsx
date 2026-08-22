import { cn } from "@/lib/utils"

type FooterCharacterSlotProps = {
  className?: string
}

/**
 * Dedicated slot for the footer waving character.
 * Drop the asset here later and render it with next/image.
 * Until then this container only reserves the right-column space.
 */
export function FooterCharacterSlot({ className }: FooterCharacterSlotProps) {
  return (
    <div
      className={cn(
        "mx-auto flex h-44 w-40 shrink-0 items-center justify-center sm:h-52 sm:w-48 lg:mx-0",
        className,
      )}
      aria-label="Footer character coming soon"
    >
      <div className="flex h-full w-full items-center justify-center rounded-(--radius-sketch) border-[1.5px] border-dashed border-foreground/40 bg-card/40 px-3 text-center">
        <p className="font-hand text-sm text-muted-foreground sm:text-base">
          Footer character coming soon
        </p>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
import Image from "next/image"

type MessengerVisualSlotProps = {
  className?: string
}

/**
 * Dedicated slot for the messenger phone mockup.
 */
export function MessengerVisualSlot({ className }: MessengerVisualSlotProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-md overflow-visible",
        className,
      )}
    >
      <Image
        src="/assets/images/mobile-mock-up.webp"
        alt="Minicate chat on a phone"
        width={1024}
        height={1536}
        className="h-auto w-full object-contain object-center"
        sizes="(max-width: 1024px) 80vw, 32vw"
      />
    </div>
  )
}

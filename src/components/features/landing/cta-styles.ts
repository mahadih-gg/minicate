import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Black neo-brutalist primary CTA matching the landing reference. */
export function landingPrimaryCtaClassName(className?: string) {
  return cn(
    buttonVariants({ variant: "default", size: "lg" }),
    "h-16 gap-3 border-[1.5px] border-foreground bg-foreground px-8 text-lg font-semibold text-background shadow-[4px_4px_0_var(--foreground)] hover:bg-foreground/90 hover:shadow-[5px_5px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px",
    className,
  )
}

export function landingNavbarCtaClassName(className?: string) {
  return cn(
    buttonVariants({ variant: "default", size: "lg" }),
    "h-11 gap-2 border-[1.5px] border-foreground bg-foreground px-5 text-sm font-semibold text-background shadow-[4px_4px_0_var(--foreground)] hover:bg-foreground/90 hover:shadow-[5px_5px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px",
    className,
  )
}

export function landingSecondaryCtaClassName(className?: string) {
  return cn(
    buttonVariants({ variant: "outline", size: "lg" }),
    "h-16 gap-3 border-[1.5px] bg-card/60 px-8 text-lg font-semibold hover:bg-card",
    className,
  )
}



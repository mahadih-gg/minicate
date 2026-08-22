"use client"

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type TargetAndTransition,
} from "motion/react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "blur"

const EASE = [0.22, 1, 0.36, 1] as const

const hiddenByVariant: Record<RevealVariant, TargetAndTransition> = {
  up: { opacity: 0, y: 36, filter: "blur(10px)" },
  down: { opacity: 0, y: -28, filter: "blur(8px)" },
  left: { opacity: 0, x: -40, filter: "blur(8px)" },
  right: { opacity: 0, x: 48, rotate: 2.5, filter: "blur(10px)" },
  scale: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
  blur: { opacity: 0, filter: "blur(18px)" },
}

const visible: TargetAndTransition = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  filter: "blur(0px)",
}

type RevealProps = {
  children: ReactNode
  className?: string
  variant?: RevealVariant
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
} & Omit<
  HTMLMotionProps<"div">,
  "children" | "initial" | "animate" | "whileInView" | "variants"
>

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  duration = 0.75,
  once = true,
  amount = 0.25,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={hiddenByVariant[variant]}
      whileInView={visible}
      viewport={{ once, amount, margin: "0px 0px -6% 0px" }}
      transition={{ duration, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type RevealGroupProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  amount?: number
}

export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  amount = 0.2,
}: RevealGroupProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -6% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

type RevealItemProps = {
  children: ReactNode
  className?: string
  variant?: RevealVariant
}

export function RevealItem({
  children,
  className,
  variant = "up",
}: RevealItemProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: hiddenByVariant[variant],
        visible: {
          ...visible,
          transition: { duration: 0.7, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

type RevealFloatProps = {
  children: ReactNode
  className?: string
}

export function RevealFloat({ children, className }: RevealFloatProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

"use client"

import type { ReactNode } from "react"

import { useLenis } from "@/hooks/use-lenis"

import "lenis/dist/lenis.css"

export function SmoothScroll({ children }: { children: ReactNode }) {
  useLenis()
  return children
}

"use client"

import Lenis from "lenis"
import { useEffect } from "react"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

export function useLenis() {
  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    let lenis: Lenis | null = null
    let rafId = 0

    const tick = (time: number) => {
      lenis?.raf(time)
      rafId = window.requestAnimationFrame(tick)
    }

    const stop = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }

      if (lenis) {
        lenis.destroy()
        lenis = null
      }
    }

    const start = () => {
      if (lenis || mediaQuery.matches) {
        return
      }

      lenis = new Lenis({
        anchors: true,
        autoRaf: false,
        respectReducedMotion: true,
      })
      rafId = window.requestAnimationFrame(tick)
    }

    const syncWithMotionPreference = () => {
      if (mediaQuery.matches) {
        stop()
        return
      }

      start()
    }

    syncWithMotionPreference()
    mediaQuery.addEventListener("change", syncWithMotionPreference)

    return () => {
      mediaQuery.removeEventListener("change", syncWithMotionPreference)
      stop()
    }
  }, [])
}

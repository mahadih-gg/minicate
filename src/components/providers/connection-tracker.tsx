"use client"

import { useEffect } from "react"

import { startConnectionTracker } from "@/lib/connection/tracker"

/** Mounts the single global network + WebSocket connection tracker. */
export function ConnectionTracker() {
  useEffect(() => startConnectionTracker(), [])
  return null
}

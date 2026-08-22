import { parseLoginResponse } from "@/lib/auth/parse"
import type { LoginResponse } from "@/types/auth"

const STORAGE_KEY = "minicate.session"
const SESSION_CHANGE_EVENT = "minicate-session-change"

let memorySession: LoginResponse | null = null

function canUseStorage(): boolean {
  return typeof window !== "undefined"
}

function notifySessionChange(): void {
  if (!canUseStorage()) {
    return
  }

  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export function persistSession(session: LoginResponse): void {
  memorySession = session

  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  notifySessionChange()
}

export function readSession(): LoginResponse | null {
  if (memorySession) {
    return memorySession
  }

  if (!canUseStorage()) {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    memorySession = parseLoginResponse(JSON.parse(raw) as unknown)
    return memorySession
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    memorySession = null
    return null
  }
}

export function clearSession(): void {
  memorySession = null

  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
  notifySessionChange()
}

export function subscribeToSession(onStoreChange: () => void): () => void {
  if (!canUseStorage()) {
    return () => {}
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      memorySession = null
      onStoreChange()
    }
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(SESSION_CHANGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(SESSION_CHANGE_EVENT, onStoreChange)
  }
}

export function getAccessToken(): string | null {
  return readSession()?.token ?? null
}

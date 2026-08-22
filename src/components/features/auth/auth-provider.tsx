"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import {
  clearSession,
  persistSession,
  readSession,
  subscribeToSession,
} from "@/lib/auth/session"
import { login } from "@/services/auth.service"
import type { LoginRequest } from "@/types/auth"
import type { User } from "@/types/user"

type AuthContextValue = {
  user: User | null
  isReady: boolean
  isAuthenticated: boolean
  signIn: (credentials: LoginRequest) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const subscribeHydration = () => () => {}

function getClientHydrationSnapshot(): boolean {
  return true
}

function getServerHydrationSnapshot(): boolean {
  return false
}

function getServerSessionSnapshot(): null {
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const isReady = useSyncExternalStore(
    subscribeHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  )
  const session = useSyncExternalStore(
    subscribeToSession,
    readSession,
    getServerSessionSnapshot,
  )

  const signIn = useCallback(async (credentials: LoginRequest) => {
    const nextSession = await login(credentials)
    persistSession(nextSession)
  }, [])

  const signOut = useCallback(() => {
    clearSession()
  }, [])

  const user = session?.user ?? null

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      isAuthenticated: user !== null,
      signIn,
      signOut,
    }),
    [user, isReady, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}

import type { Conversation } from "@/types/conversation"

/** Stable palette for `boring-avatars`. Module-level so it is not recreated per render. */
export const AVATAR_COLORS: string[] = [
  "#0098d4",
  "#1d6fff",
  "#8a60ff",
  "#f0c49a",
  "#2f9e5f",
]

export const AVATAR_VARIANT = "beam" as const

export const AVATAR_SIZE_PX = {
  sm: 24,
  default: 32,
  lg: 40,
} as const

export type AvatarSize = keyof typeof AVATAR_SIZE_PX

export function getAvatarSeed(id: string): string {
  return id
}

export function getConversationAvatarSeed(conversation: Conversation): string {
  if (conversation.type === "direct") {
    return conversation.participant._id
  }

  return conversation._id
}

import type { Conversation } from "@/types/conversation"

/** Stable palette for `boring-avatars`. Module-level so it is not recreated per render. */
export const AVATAR_COLORS: string[] = [
  "#00ace5",
  "#0074f7",
  "#8a60ff",
  "#00c3b2",
  "#be64d2",
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

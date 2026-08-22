"use client"

import { memo } from "react"

import { UserAvatar } from "@/components/common/UserAvatar"
import { Spinner } from "@/components/ui/spinner"
import { getAvatarSeed } from "@/lib/avatars/config"
import { cn } from "@/lib/utils"
import type { PublicUser } from "@/types/user"

type UserSearchResultProps = {
  user: PublicUser
  isActive?: boolean
  isSelected?: boolean
  isPending?: boolean
  id?: string
  onSelect: (user: PublicUser) => void
}

export const UserSearchResult = memo(function UserSearchResult({
  user,
  isActive = false,
  isSelected = false,
  isPending = false,
  id,
  onSelect,
}: UserSearchResultProps) {
  return (
    <button
      type="button"
      id={id}
      role="option"
      aria-selected={isActive || isSelected}
      disabled={isPending}
      className={cn(
        "flex w-full min-w-0 items-center gap-3 rounded-[var(--radius-sketch)] border border-transparent px-2 py-2 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        (isActive || isSelected) && "marker-wash border-foreground/40 bg-accent",
      )}
      onClick={() => onSelect(user)}
    >
      <UserAvatar seed={getAvatarSeed(user._id)} label={user.name} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{user.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {user.phone}
        </span>
      </span>
      {isPending ? <Spinner /> : null}
    </button>
  )
})

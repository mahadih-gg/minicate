"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { getInitials } from "@/lib/conversations/display"
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

export function UserSearchResult({
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
        "flex w-full min-w-0 items-center gap-3 rounded-lg px-2 py-2 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        (isActive || isSelected) && "bg-muted",
      )}
      onClick={() => onSelect(user)}
    >
      <Avatar size="sm">
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{user.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {user.phone}
        </span>
      </span>
      {isPending ? <Spinner /> : null}
    </button>
  )
}

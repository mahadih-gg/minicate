"use client"

import { memo } from "react"
import BoringAvatar from "boring-avatars"

import { Avatar } from "@/components/ui/avatar"
import {
  AVATAR_COLORS,
  AVATAR_SIZE_PX,
  AVATAR_VARIANT,
  type AvatarSize,
} from "@/lib/avatars/config"

type UserAvatarProps = {
  seed: string
  label: string
  size?: AvatarSize
}

function UserAvatarComponent({ seed, label, size = "default" }: UserAvatarProps) {
  const pixelSize = AVATAR_SIZE_PX[size]

  return (
    <Avatar
      size={size}
      className="overflow-hidden"
      title={label}
      aria-hidden="true"
    >
      <BoringAvatar
        name={seed}
        variant={AVATAR_VARIANT}
        colors={AVATAR_COLORS}
        size={pixelSize}
        title={false}
      />
    </Avatar>
  )
}

export const UserAvatar = memo(UserAvatarComponent, (previous, next) => {
  return (
    previous.seed === next.seed &&
    previous.size === next.size &&
    previous.label === next.label
  )
})

UserAvatar.displayName = "UserAvatar"

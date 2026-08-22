"use client"

import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { UserAvatar } from "@/components/common/UserAvatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { getAvatarSeed } from "@/lib/avatars/config"
import { disconnectChatSocket } from "@/lib/websocket/client"
import { useChatUiStore } from "@/stores/chat-ui"

export function SidebarProfileMenu() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const clearSelection = useChatUiStore((state) => state.clearSelection)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!user) {
    return null
  }

  function handleLogout() {
    disconnectChatSocket()
    clearSelection()
    signOut()
    setConfirmOpen(false)
    router.replace("/login")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex w-full min-w-0 items-center gap-3 rounded-lg px-2 py-2 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open profile menu"
        >
          <UserAvatar seed={getAvatarSeed(user._id)} label={user.name} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{user.name}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {user.phone}
            </span>
          </span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-(--anchor-width) min-w-56"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5 px-0.5 py-0.5">
                <span className="truncate text-sm font-medium text-foreground">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.phone}
                </span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again with your phone number to keep chatting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleLogout}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

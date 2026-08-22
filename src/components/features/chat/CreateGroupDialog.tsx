"use client"

import { useState, type FormEvent } from "react"
import { Loader2Icon, UsersIcon, XIcon } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { UserSearchResult } from "@/components/features/chat/UserSearchResult"
import { useCreateGroupDialog } from "@/hooks/use-conversation-sidebar"
import { useUserSearch } from "@/hooks/use-user-search"
import { getApiErrorMessage } from "@/lib/api/errors"
import type { PublicUser } from "@/types/user"

const MIN_OTHER_PARTICIPANTS = 2

export function CreateGroupDialog() {
  const { open, excludeUserId, createGroup, onOpenChange } = useCreateGroupDialog()
  const { query, setQuery, results, error, isLoading, clear, retry } =
    useUserSearch(excludeUserId)
  const [name, setName] = useState("")
  const [participants, setParticipants] = useState<PublicUser[]>([])
  const [nameError, setNameError] = useState<string | null>(null)
  const [participantsError, setParticipantsError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedIds = new Set(participants.map((user) => user._id))
  const visibleResults = results.filter((user) => !selectedIds.has(user._id))

  function resetForm() {
    setName("")
    setParticipants([])
    setNameError(null)
    setParticipantsError(null)
    setSubmitError(null)
    setIsSubmitting(false)
    clear()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm()
    }
    onOpenChange(nextOpen)
  }

  function toggleParticipant(user: PublicUser) {
    setParticipants((current) =>
      current.some((item) => item._id === user._id)
        ? current.filter((item) => item._id !== user._id)
        : [...current, user],
    )
    setParticipantsError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    const nextNameError = trimmedName ? null : "Enter a group name."
    const nextParticipantsError =
      participants.length >= MIN_OTHER_PARTICIPANTS
        ? null
        : "Add at least two other people."

    setName(trimmedName)
    setNameError(nextNameError)
    setParticipantsError(nextParticipantsError)
    setSubmitError(null)

    if (nextNameError || nextParticipantsError) {
      return
    }

    setIsSubmitting(true)

    try {
      await createGroup({
        name: trimmedName,
        participantIds: participants.map((user) => user._id),
      })
      resetForm()
    } catch (caught: unknown) {
      setSubmitError(
        getApiErrorMessage(caught, "Could not create the group. Please try again."),
      )
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[min(90dvh,40rem)] overflow-y-auto sm:max-w-md" showCloseButton={!isSubmitting}>
        <DialogHeader>
          <DialogTitle>New group</DialogTitle>
          <DialogDescription>
            Name the group and add at least two other people.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {submitError ? (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              name="name"
              value={name}
              disabled={isSubmitting}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "group-name-error" : undefined}
              onChange={(event) => {
                setName(event.target.value)
                setNameError(null)
              }}
            />
            {nameError ? (
              <p id="group-name-error" className="text-sm text-destructive" role="alert">
                {nameError}
              </p>
            ) : null}
          </div>

          {participants.length > 0 ? (
            <div className="flex flex-wrap gap-2" aria-label="Selected people">
              {participants.map((user) => (
                <Badge key={user._id} variant="secondary" className="max-w-full">
                  <span className="truncate">{user.name}</span>
                  <button
                    type="button"
                    className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Remove ${user.name}`}
                    disabled={isSubmitting}
                    onClick={() => toggleParticipant(user)}
                  >
                    <XIcon data-icon="inline-end" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : null}

          {participantsError ? (
            <p className="text-sm text-destructive" role="alert">
              {participantsError}
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="group-search">Add people</Label>
            <Input
              id="group-search"
              type="search"
              placeholder="Search by name or phone"
              value={query}
              disabled={isSubmitting}
              onChange={(event) => setQuery(event.target.value)}
            />
            {error ? (
              <div className="flex flex-col gap-2">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button type="button" variant="outline" size="sm" onClick={retry}>
                  Try again
                </Button>
              </div>
            ) : null}
            {isLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : null}
            {!isLoading && !error && query.trim() && visibleResults.length === 0 ? (
              <Empty className="border p-3">
                <EmptyHeader>
                  <EmptyTitle>No people found</EmptyTitle>
                  <EmptyDescription>Try another search.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}
            {!isLoading && visibleResults.length > 0 ? (
              <ScrollArea className="h-40">
                {visibleResults.map((user) => (
                  <UserSearchResult
                    key={user._id}
                    user={user}
                    onSelect={toggleParticipant}
                  />
                ))}
              </ScrollArea>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2Icon data-icon="inline-start" className="animate-spin" />
              ) : (
                <UsersIcon data-icon="inline-start" />
              )}
              {isSubmitting ? "Creating..." : "Create group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

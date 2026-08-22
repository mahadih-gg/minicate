"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { useCallback, useId, useState, type KeyboardEvent } from "react"

import { UserSearchResult } from "@/components/features/chat/UserSearchResult"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserSearch } from "@/hooks/use-user-search"
import type { PublicUser } from "@/types/user"

type ConversationSearchProps = {
  excludeUserId?: string
  pendingUserId?: string | null
  onSelectUser: (user: PublicUser) => void
}

export function ConversationSearch({
  excludeUserId,
  pendingUserId,
  onSelectUser,
}: ConversationSearchProps) {
  const listId = useId()
  const { query, setQuery, results, status, error, isLoading, clear, retry } =
    useUserSearch(excludeUserId)
  const [activeIndex, setActiveIndex] = useState(0)
  const [indexedQuery, setIndexedQuery] = useState(query)

  if (query !== indexedQuery) {
    setIndexedQuery(query)
    setActiveIndex(0)
  }
  const safeActiveIndex =
    results.length === 0 ? 0 : Math.min(activeIndex, results.length - 1)

  const handleSelectUser = useCallback(
    (selectedUser: PublicUser) => {
      onSelectUser(selectedUser)
      clear()
    },
    [clear, onSelectUser],
  )

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      clear()
      return
    }

    if (results.length === 0) {
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % results.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + results.length) % results.length)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      const user = results[safeActiveIndex]
      if (user) {
        handleSelectUser(user)
      }
    }
  }

  const showResults = query.trim().length > 0
  const activeUser = results[safeActiveIndex]
  const activeOptionId = activeUser ? `${listId}-${activeUser._id}` : undefined

  return (
    <div className="flex flex-col gap-2">
      <InputGroup className="h-10">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          className="h-10"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-activedescendant={activeOptionId}
          aria-label="Search people"
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        {query ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Clear search"
              onClick={clear}
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>

      {showResults ? (
        <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2" aria-busy="true" aria-label="Searching">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {!isLoading && status === "success" && results.length === 0 ? (
            <Empty className="border border-foreground p-4 shadow-[var(--shadow-sketch-sm)]">
              <EmptyHeader>
                <EmptyTitle>No people found</EmptyTitle>
                <EmptyDescription>
                  Try a different name or phone number.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {!isLoading && results.length > 0 ? (
            <ScrollArea className="h-56">
              <div id={listId} role="listbox" aria-label="Search results">
                {results.map((user, index) => (
                  <UserSearchResult
                    key={user._id}
                    id={`${listId}-${user._id}`}
                    user={user}
                    isActive={index === safeActiveIndex}
                    isPending={pendingUserId === user._id}
                    onSelect={handleSelectUser}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

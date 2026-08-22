"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

type MessageComposerProps = {
  disabled?: boolean
  isSending: boolean
  sendError: string | null
  onSend: (text: string) => Promise<unknown>
}

export function MessageComposer({
  disabled = false,
  isSending,
  sendError,
  onSend,
}: MessageComposerProps) {
  const [text, setText] = useState("")
  const canSend = text.trim().length > 0 && !isSending && !disabled

  async function submit() {
    if (!canSend) {
      return
    }

    const trimmed = text.trim()
    setText("")

    try {
      await onSend(trimmed)
    } catch {
      setText(trimmed)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await submit()
  }

  async function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return
    }

    event.preventDefault()
    await submit()
  }

  return (
    <form className="flex flex-col gap-2 border-t bg-background p-3" onSubmit={handleSubmit}>
      {sendError ? (
        <p className="text-sm text-destructive" role="alert">
          {sendError}
        </p>
      ) : null}
      <InputGroup className="h-auto items-end">
        <InputGroupTextarea
          id="message-composer"
          name="message"
          rows={1}
          aria-label="Message"
          placeholder="Write a message"
          value={text}
          disabled={disabled || isSending}
          className="min-h-10 max-h-32 py-2.5"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align="inline-end">
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={!canSend}
            className="bg-linear-to-r from-(--brand-cyan) via-(--brand-blue) to-(--brand-violet) text-primary-foreground hover:opacity-90"
          >
            {isSending ? <Spinner /> : <SendIcon />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group"

type MessageComposerProps = {
  disabled?: boolean
  onSend: (text: string) => void
}

export function MessageComposer({
  disabled = false,
  onSend,
}: MessageComposerProps) {
  const [text, setText] = useState("")
  const trimmed = text.trim()
  const canSend = trimmed.length > 0 && !disabled

  function submit() {
    if (!canSend) {
      return
    }

    const outgoing = trimmed
    setText("")
    onSend(outgoing)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submit()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) {
      return
    }

    if (event.key !== "Enter" || event.shiftKey) {
      return
    }

    event.preventDefault()
    submit()
  }

  return (
    <form
      className="flex flex-col gap-2 border-t bg-background px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      onSubmit={handleSubmit}
    >
      <InputGroup className="h-auto items-end">
        <InputGroupTextarea
          id="message-composer"
          name="message"
          rows={1}
          aria-label="Message"
          aria-describedby="message-composer-hint"
          placeholder="Write a message"
          value={text}
          disabled={disabled}
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
            <SendIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <p id="message-composer-hint" className="text-xs text-muted-foreground">
        Enter to send. Shift+Enter for a new line.
      </p>
    </form>
  )
}

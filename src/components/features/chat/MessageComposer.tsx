"use client"

import { SendIcon } from "lucide-react"
import { useState, type FormEvent, type KeyboardEvent } from "react"

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
      className="chat-shell-footer w-full items-end [overflow-anchor:none]"
      onSubmit={handleSubmit}
    >
      <InputGroup className="h-auto min-h-12 items-end border-[1.5px] border-foreground bg-white shadow-[var(--shadow-sketch)] has-[>textarea]:h-auto dark:bg-card">
        <InputGroupTextarea
          id="message-composer"
          name="message"
          rows={1}
          aria-label="Message"
          aria-describedby="message-composer-hint"
          placeholder="Write a message"
          value={text}
          disabled={disabled}
          className="field-sizing-content max-h-32 min-h-10 overflow-y-auto py-2 text-foreground placeholder:text-muted-foreground"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align="inline-end" className="pr-1.5 pb-1.5">
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={!canSend}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <SendIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <p id="message-composer-hint" className="sr-only">
        Enter to send. Shift+Enter for a new line.
      </p>
    </form>
  )
}

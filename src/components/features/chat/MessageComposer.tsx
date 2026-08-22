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
    <form className="chat-shell-footer w-full" onSubmit={handleSubmit}>
      <InputGroup className="h-12 items-center border-[1.5px] border-foreground bg-white shadow-[var(--shadow-sketch)] has-[>textarea]:h-12 dark:bg-card">
        <InputGroupTextarea
          id="message-composer"
          name="message"
          rows={1}
          aria-label="Message"
          aria-describedby="message-composer-hint"
          placeholder="Write a message"
          value={text}
          disabled={disabled}
          className="h-10 min-h-10 max-h-10 field-sizing-fixed overflow-y-auto py-2 text-foreground placeholder:text-muted-foreground"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align="inline-end" className="pr-1.5">
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={!canSend}
            className="bg-linear-to-br from-brand-cyan via-brand-blue to-brand-violet text-primary-foreground hover:opacity-90"
          >
            <SendIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

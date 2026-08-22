"use client"

import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { getLoginErrorMessage } from "@/services/auth.service"

type FieldErrors = {
  phone?: string
  name?: string
}

function validateCredentials(phone: string, name: string): FieldErrors {
  const errors: FieldErrors = {}

  if (!phone) {
    errors.phone = "Enter your phone number."
  }

  if (!name) {
    errors.name = "Enter your name."
  }

  return errors
}

export function LoginForm() {
  const router = useRouter()
  const { isReady, isAuthenticated, signIn } = useAuth()
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/chat")
    }
  }, [isAuthenticated, isReady, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedPhone = phone.trim()
    const trimmedName = name.trim()
    const nextFieldErrors = validateCredentials(trimmedPhone, trimmedName)

    setPhone(trimmedPhone)
    setName(trimmedName)
    setFieldErrors(nextFieldErrors)
    setApiError(null)

    if (nextFieldErrors.phone || nextFieldErrors.name) {
      return
    }

    setIsSubmitting(true)

    try {
      await signIn({ phone: trimmedPhone, name: trimmedName })
      setIsSuccess(true)
      router.replace("/chat")
    } catch (error) {
      setApiError(getLoginErrorMessage(error))
      setIsSubmitting(false)
    }
  }

  if (!isReady) {
    return (
      <Card className="w-full text-base [--card-spacing:--spacing(4)]">
        <CardHeader>
          <CardTitle className="text-2xl">Loading</CardTitle>
          <CardDescription className="text-base">Checking your session.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isAuthenticated || isSuccess) {
    return (
      <Card className="w-full text-base [--card-spacing:--spacing(4)]">
        <CardHeader>
          <CardTitle className="text-2xl">You are signed in</CardTitle>
          <CardDescription className="text-base">
            Taking you to your conversations.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full text-base [--card-spacing:--spacing(4)]">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Minicate</CardTitle>
        <CardDescription className="text-base">
          Enter your phone number and name to continue. New numbers are registered
          automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
          {apiError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not sign in</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone" className="text-base">
              Phone number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+15551234567"
              value={phone}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
              className="h-12 px-4 text-base md:text-base"
              onChange={(event) => {
                setPhone(event.target.value)
                setFieldErrors((current) => ({ ...current, phone: undefined }))
              }}
            />
            {fieldErrors.phone ? (
              <p id="phone-error" className="text-sm text-destructive" role="alert">
                {fieldErrors.phone}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-base">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              className="h-12 px-4 text-base md:text-base"
              onChange={(event) => {
                setName(event.target.value)
                setFieldErrors((current) => ({ ...current, name: undefined }))
              }}
            />
            {fieldErrors.name ? (
              <p id="name-error" className="text-sm text-destructive" role="alert">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full bg-linear-to-br from-brand-cyan via-brand-blue to-brand-violet px-4 text-base text-primary-foreground hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
            ) : null}
            {isSubmitting ? "Signing in..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

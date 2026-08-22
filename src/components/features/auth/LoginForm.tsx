"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"

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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading</CardTitle>
          <CardDescription>Checking your session.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isAuthenticated || isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>You are signed in</CardTitle>
          <CardDescription>Taking you to your conversations.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Welcome to Minicate</CardTitle>
        <CardDescription>
          Enter your phone number and name to continue. New numbers are registered
          automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {apiError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not sign in</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone number</Label>
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
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
            className="mt-1 w-full bg-linear-to-br from-brand-cyan via-brand-blue to-brand-violet text-primary-foreground hover:opacity-90"
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

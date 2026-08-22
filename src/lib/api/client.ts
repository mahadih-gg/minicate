import { getApiBaseUrl } from "@/lib/api/config"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

export type ApiRequestOptions = {
  method?: HttpMethod
  body?: unknown
  token?: string
  headers?: Record<string, string>
  signal?: AbortSignal
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (
    isRecord(body) &&
    isRecord(body.error) &&
    typeof body.error.message === "string" &&
    body.error.message.length > 0
  ) {
    return body.error.message
  }

  return fallback
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, headers, signal } = options

  const requestHeaders = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  })

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(joinUrl(getApiBaseUrl(), path), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  const parsedBody = await parseBody(response)

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(
        parsedBody,
        response.statusText || `Request failed with status ${response.status}`,
      ),
      response.status,
      parsedBody,
    )
  }

  return parsedBody as T
}

export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set")
  }

  return baseUrl.replace(/\/$/, "")
}

import { getApiBaseUrl } from "@/lib/api/config"

export function getSocketOrigin(): string {
  const apiBaseUrl = getApiBaseUrl()
  const url = new URL(apiBaseUrl)

  if (url.pathname === "/api" || url.pathname.endsWith("/api")) {
    return url.origin
  }

  return url.origin
}

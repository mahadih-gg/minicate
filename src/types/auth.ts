import type { User } from "@/types/user"

/** Confirmed by Swagger `LoginRequest`. */
export interface LoginRequest {
  phone: string
  name: string
}

/**
 * Response from `POST /auth/login`.
 * Swagger only states that the response includes a JWT; field names were observed from the live API.
 */
export interface LoginResponse {
  token: string
  user: User
}

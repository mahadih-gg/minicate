/** Confirmed by Swagger `GET /users/search` query parameter `q`. */
export interface SearchUsersQuery {
  q: string
}

/**
 * User object in search results and conversation participants.
 * Observed from `GET /users/search` and conversation payloads (no `createdAt`).
 */
export interface PublicUser {
  _id: string
  name: string
  phone: string
}

/**
 * User object returned by `POST /auth/login` and `GET /auth/me`.
 * Swagger does not document response bodies; this shape was observed from the live API.
 */
export interface User extends PublicUser {
  createdAt: string
}

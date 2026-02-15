import { NextRequest } from "next/server"
import {
  SESSION_COOKIE_NAME,
  SessionPayload,
  verifyToken as verifyTokenFromString,
} from "@/lib/session"

export type { SessionPayload as JWTPayload }

/**
 * Verify JWT token from request cookies (used in middleware / edge)
 */
export function verifyToken(request: NextRequest): SessionPayload | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  return verifyTokenFromString(token)
}

/**
 * Get current user from JWT token
 */
export function getCurrentUser(request: NextRequest): SessionPayload | null {
  return verifyToken(request)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(request: NextRequest): boolean {
  return verifyToken(request) !== null
}

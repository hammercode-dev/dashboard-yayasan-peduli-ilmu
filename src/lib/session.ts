import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { cache } from "react"
import { redirect } from "next/navigation"

export const JWT_SECRET = process.env.JWT_SECRET || "secretkeybro"

export const SESSION_COOKIE_NAME = "auth-token"

export const SESSION_MAX_AGE = 60 * 60 * 24

const cookieOptions = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

export interface SessionPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export function signToken(
  payload: Omit<SessionPayload, "iat" | "exp">
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" })
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string, email: string) {
  const token = signToken({ userId, email })
  const cookieStore = await cookies()

  cookieStore.set({ ...cookieOptions, value: token, maxAge: SESSION_MAX_AGE })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  return verifyToken(token)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export const verifySession = cache(async () => {
  const session = await getSession()

  if (!session?.userId) {
    redirect("/login")
  }

  return { isAuth: true, userId: session.userId, email: session.email }
})

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "./auth.services"
import { useAppDispatch } from "@/store/hooks"
import { authStart, authSuccess, authFailure, logout as clearAuth } from "./authSlice"

interface LoginCredentials {
  email: string
  password: string
}

export function useLogin() {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    dispatch(authStart())

    try {
      const response = await authService.login(credentials)
      dispatch(authSuccess(response.user))

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      dispatch(authFailure(errorMessage))
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
    error,
    setError,
  }
}

export function useLogout() {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const logout = async () => {
    setIsLoading(true)

    try {
      await authService.logout()
      dispatch(clearAuth())
      router.push("/login")
      router.refresh()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    logout,
    isLoading,
  }
}

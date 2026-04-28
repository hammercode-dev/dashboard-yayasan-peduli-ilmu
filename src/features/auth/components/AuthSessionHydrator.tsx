"use client"

import { useEffect } from "react"

import { useAppDispatch } from "@/store/hooks"
import { setSessionUser } from "@/features/auth/authSlice"

type AuthSessionHydratorProps = {
  user: {
    id: string
    email: string
    roleCode: string | null
    fullName: string | null
    roleName: string | null
  } | null
}

export function AuthSessionHydrator({ user }: AuthSessionHydratorProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setSessionUser(user))
  }, [dispatch, user])

  return null
}

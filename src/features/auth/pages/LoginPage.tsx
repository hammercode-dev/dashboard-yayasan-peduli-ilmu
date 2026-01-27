"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAppSelector } from "@/store/hooks"

import { useLogin } from "../auth.hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const auth = useAppSelector(state => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useLogin()

  console.log("error:", auth)

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>
            Masukkan email dan password untuk melanjutkan
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <form
            action={async formData => {
              const email = formData.get("email") as string
              const password = formData.get("password") as string

              try {
                await login({ email, password })
              } catch (err) {
                console.error(err)
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="email@example.com"
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="kata sandi"
                  disabled={isLoading}
                  className="h-10 pr-10"
                />
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none"
                  style={{
                    pointerEvents: isLoading ? "none" : undefined,
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </span>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-10">
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Memuat...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

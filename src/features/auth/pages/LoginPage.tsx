"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { loginSchema, LoginSchema } from "../auth.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLoginMutation } from "../auth.api"
import {
  Field,
  FieldError,
  FieldContent,
  FieldLabel,
} from "@/components/ui/field"
import { ApiResponse } from "@/lib/response"
import Image from "next/image"

export default function LoginPage() {
  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading, error }] = useLoginMutation()
  const router = useRouter()
  const onSubmit = async (data: LoginSchema) => {
    await login({ email: data.email, password: data.password })
      .unwrap()
      .then(res => {
        if (res.success) {
          router.push("/dashboard")
        }
      })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {/* <Image src="/logo.png" alt="Logo" width={60} height={60} className="mb-2"/> */}
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>
            Masukkan email dan password untuk melanjutkan
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {(error as ApiResponse<{ message: string }>)?.data?.message ||
                "Terjadi kesalahan saat login"}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <Field>
              <FieldLabel>
                Email <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  autoComplete="email"
                  placeholder="email@example.com"
                  disabled={isLoading}
                  className="h-10"
                />
              </FieldContent>
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <FieldLabel>
                Kata Sandi <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Input
                    id="password"
                    {...register("password")}
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
              </FieldContent>
              <FieldError errors={[errors.password]} />
            </Field>
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

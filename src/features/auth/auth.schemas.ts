import * as z from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine(v => v.includes("@") && v.includes("."), "Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginSchema = z.infer<typeof loginSchema>

import { z } from "zod"

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.date(),
  updated_at: z.date(),
})

export const profileSchema = z.object({
  username: z.string().min(3).max(50).nullable().optional(),
  full_name: z.string().max(100).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  address: z.string().max(255).nullable().optional(),
  phone_number: z.string().max(20).nullable().optional(),
  role_id: z.string().uuid().nullable().optional(),
})

export const roleSchema = z.object({
  name: z.string(),
  created_at: z.date(),
})

export const userWithProfileAndRoleSchema = userSchema.extend({
  profiles: profileSchema.nullable().optional(),
  roles: roleSchema.array().nullable().optional(),
})

export const createUserSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
    username: z.string().min(3, "Username minimal 3 karakter"),
    full_name: z.string().min(1, "Nama lengkap wajib diisi"),
    phone_number: z.string().min(1, "Nomor telepon wajib diisi"),
    address: z.string().min(1, "Alamat wajib diisi"),
    role_id: z.string().min(1, "Role wajib dipilih"),
  })
  .refine(data => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Konfirmasi password tidak sama",
  })

export const updateUserSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .or(z.literal("")),
    confirm_password: z.string().optional(),
    username: z.string().min(3, "Username minimal 3 karakter"),
    full_name: z.string().min(1, "Nama lengkap wajib diisi"),
    phone_number: z.string().min(1, "Nomor telepon wajib diisi"),
    address: z.string().min(1, "Alamat wajib diisi"),
    role_id: z.string().min(1, "Role wajib dipilih"),
  })
  .refine(
    data =>
      data.password.length === 0 ||
      data.password === (data.confirm_password ?? ""),
    {
      path: ["confirm_password"],
      message: "Konfirmasi password tidak sama",
    }
  )

export type User = z.infer<typeof userSchema>
export type UserWithProfile = z.infer<typeof userWithProfileAndRoleSchema>
export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>

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

export type User = z.infer<typeof userSchema>
export type UserWithProfile = z.infer<typeof userWithProfileAndRoleSchema>

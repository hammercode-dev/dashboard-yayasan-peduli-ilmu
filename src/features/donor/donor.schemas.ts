import { z } from "zod"

const phoneField = z
  .string()
  .min(1, "Nomor HP wajib diisi")
  .regex(/^[0-9+]+$/, "Nomor HP tidak valid")

export const createDonorSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone_number: phoneField,
  email: z
    .string()
    .optional()
    .refine(
      v =>
        v == null ||
        v.trim() === "" ||
        z.string().email().safeParse(v.trim()).success,
      { message: "Email tidak valid" }
    ),
})

export const updateDonorSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone_number: phoneField,
  email: z
    .string()
    .optional()
    .refine(
      v =>
        v == null ||
        v.trim() === "" ||
        z.string().email().safeParse(v.trim()).success,
      { message: "Email tidak valid" }
    ),
})

export type CreateDonorFormData = z.infer<typeof createDonorSchema>
export type UpdateDonorFormData = z.infer<typeof updateDonorSchema>

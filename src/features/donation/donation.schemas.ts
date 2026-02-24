import * as z from "zod"

export const donationEvidenceSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),

  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+]+$/, "Invalid phone number"),

  payment_method: z.string().min(1, "Payment method is required"),

  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(val => !isNaN(Number(val)), {
      message: "Amount must be a valid number",
    }),

  evidence_url: z.string().url("Invalid URL").optional().or(z.literal("")),

  description: z.string().optional(),

  program_id: z
    .string()
    .min(1, "Program is required")
    .refine(val => !isNaN(Number(val)), {
      message: "Invalid program ID",
    }),
})

export type DonationEvidenceFormData = z.infer<typeof donationEvidenceSchema>

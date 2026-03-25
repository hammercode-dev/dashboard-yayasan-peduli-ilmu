import * as z from "zod"

export const donationEvidenceSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+]+$/, "Invalid phone number"),
  email: z.string().optional(),
  payment_method: z.string().min(1, "Payment method is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      v => !isNaN(Number(v)) && Number(v) > 0,
      "Amount must be greater than 0"
    ),
  evidence_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  donation_upload_at: z.string().min(1, "Donation date is required"),
  program_id: z
    .string()
    .min(1, "Silakan pilih program tujuan")
    .refine(
      v => !isNaN(Number(v)) && Number(v) >= 1,
      "Choose a program"
    ),
})

export type DonationEvidenceFormData = z.infer<typeof donationEvidenceSchema>

export const updateDonationSchema = donationEvidenceSchema.partial()

export type DonationFormData = z.infer<typeof donationEvidenceSchema>

export type UpdateDonationFormData = z.infer<typeof updateDonationSchema>

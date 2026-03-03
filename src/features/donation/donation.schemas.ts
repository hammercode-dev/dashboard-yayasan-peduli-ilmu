import * as z from "zod"

export const donationEvidenceSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+]+$/, "Invalid phone number"),
  payment_method: z.string().min(1, "Payment method is required"),

  amount: z.coerce.number().min(1, "Amount must be greater than 0"),

  evidence_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),

  donation_upload_at: z.string().min(1, "Donation date is required"),

  program_id: z.coerce.number().min(1, "Silakan pilih program tujuan"),
})

export type DonationEvidenceFormData = z.infer<typeof donationEvidenceSchema>

export const updateDonationSchema = donationEvidenceSchema.partial()

export type DonationFormData = z.infer<typeof donationEvidenceSchema>

export type UpdateDonationFormData = z.infer<typeof updateDonationSchema>

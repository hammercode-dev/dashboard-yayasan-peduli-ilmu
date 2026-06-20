import * as z from "zod"

export const donorContactFieldsSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+]+$/, "Invalid phone number"),
  email: z.string().optional(),
})

export const donationEvidenceCoreSchema = z.object({
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

export const createDonationEvidenceSchema = donationEvidenceCoreSchema.extend({
  donor_id: z
    .string()
    .min(1, "Pilih donatur terlebih dahulu")
    .refine(v => !isNaN(Number(v)) && Number(v) >= 1, "Donatur tidak valid"),
})

export const editDonationEvidenceSchema = z.object({
  ...donationEvidenceCoreSchema.shape,
  ...donorContactFieldsSchema.shape,
})

export const donationEvidenceBulkRowSchema = z.object({
  ...donationEvidenceCoreSchema.shape,
  ...donorContactFieldsSchema.shape,
})

export type CreateDonationEvidenceFormData = z.infer<
  typeof createDonationEvidenceSchema
>

export type EditDonationEvidenceFormData = z.infer<
  typeof editDonationEvidenceSchema
>

export type DonationEvidenceBulkRowData = z.infer<
  typeof donationEvidenceBulkRowSchema
>

export const updateDonationSchema = editDonationEvidenceSchema.partial()

export type UpdateDonationFormData = z.infer<typeof updateDonationSchema>

export type DonationFormData = CreateDonationEvidenceFormData

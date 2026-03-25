import * as z from "zod"

export const programTimelineRowSchema = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  activity: z.string().min(1, "Activity is required"),
  activity_en: z.string().min(1, "Activity (English) is required"),
  activity_ar: z.string().min(1, "Activity (Arabic) is required"),
  cost: z.string().min(1, "Cost is required"),
  description: z.string().min(1, "Description is required"),
})

export type ProgramTimelineRow = z.infer<typeof programTimelineRowSchema>

export const programDonationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.string().min(1, "Status is required"),
  location: z.string().min(1, "Location is required"),
  image_url: z.string().min(1, "Image URL is required"),
  target_amount: z.string().min(1, "Target amount is required"),
  collected_amount: z.string().min(1, "Collected amount is required"),
  starts_at: z.string().min(1, "Start date is required"),
  ends_at: z.string().min(1, "End date is required"),
  short_description: z.string().min(1, "Short description is required"),
  short_description_en: z
    .string()
    .min(1, "Short description (English) is required"),
  short_description_ar: z
    .string()
    .min(1, "Short description (Arabic) is required"),
  description: z.string().min(1, "Description is required"),
  description_en: z.string().min(1, "Description (English) is required"),
  description_ar: z.string().min(1, "Description (Arabic) is required"),
  title_en: z.string().min(1, "Title (English) is required"),
  title_ar: z.string().min(1, "Title (Arabic) is required"),
  // program_timeline: z.array(programTimelineRowSchema),
})

export const updateProgramDonationSchema = programDonationSchema.partial()

export type ProgramDonationFormData = z.infer<typeof programDonationSchema>

export type UpdateProgramDonationFormData = z.infer<
  typeof updateProgramDonationSchema
>

import * as z from "zod"

export const timelineFormRowSchema = z.object({
  id: z.string(),
  date: z.string().min(1, "Tanggal wajib diisi"),
  activity: z.string().min(1, "Judul ID wajib diisi"),
  activity_en: z.string().min(1, "Judul EN wajib diisi"),
  activity_ar: z.string().min(1, "Judul AR wajib diisi"),
  cost: z.string().min(1, "Biaya wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
})

export const timelineFormSchema = z.object({
  timeline: z.array(timelineFormRowSchema),
})

export type TimelineFormRow = z.infer<typeof timelineFormRowSchema>
export type TimelineFormData = z.infer<typeof timelineFormSchema>

export const createTimelineItemSchema = z.object({
  program_id: z.number().min(1, "Program ID is required"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  activity: z.string().min(1, "Judul ID wajib diisi"),
  activity_en: z.string().min(1, "Judul EN wajib diisi"),
  activity_ar: z.string().min(1, "Judul AR wajib diisi"),
  cost: z.string().min(1, "Biaya wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
})

export const updateTimelineItemSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  activity: z.string().min(1, "Judul ID wajib diisi"),
  activity_en: z.string().min(1, "Judul EN wajib diisi"),
  activity_ar: z.string().min(1, "Judul AR wajib diisi"),
  cost: z.string().min(1, "Biaya wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
})

export type CreateTimelineItemInput = z.infer<typeof createTimelineItemSchema>
export type UpdateTimelineItemInput = z.infer<typeof updateTimelineItemSchema>

import z from "zod";

export const schema = z
  .object({
    title: z.string().min(1, "Title is required"),
    title_en: z.string().min(1, "English title is required"),
    title_ar: z.string().min(1, "Arabic title is required"),

    short_description: z.string().min(1, "Short description required"),
    short_description_en: z.string().min(1, "English Short desc is required"),
    short_description_ar: z.string().min(1, "Arabic Short desc is required"),

    description: z.string().min(1, "Description is required"),
    description_en: z.string().min(1, "English Description is required"),
    description_ar: z.string().min(1, "Arabic Description is required"),

    target_amount: z.coerce.number().min(1, { message: "Target amount must be greater than 0" }),
    collected_amount: z.coerce.number().min(0),

    starts_at: z.date().nullable().refine(Boolean, { message: "Start date is required" }),
    ends_at: z.date().nullable().refine(Boolean, { message: "End date is required" }),

    location: z.string().min(1, "Location is required"),
    image_url: z.string().optional(),
    image_file: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.starts_at && data.ends_at && data.ends_at <= data.starts_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ends_at"],
        message: "End date must be after start date",
      });
    }
  });

export type FormInput = z.infer<typeof schema>;

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import RichTextEditor from "@/components/common/rich-text-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

const programDonationSchema = z.object({
  // Required fields
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.string().min(1, "Status is required"),
  location: z.string().min(1, "Location is required"),
  image_url: z.string().min(1, "Image URL is required"),

  // Amount fields
  target_amount: z.string().min(1, "Target amount is required"),
  collected_amount: z.string().min(1, "Collected amount is required"),

  // Date fields
  starts_at: z.string().min(1, "Start date is required"),
  ends_at: z.string().min(1, "End date is required"),

  // Short descriptions
  short_description: z.string().min(1, "Short description is required"),
  short_description_en: z.string().min(1, "Short description (English) is required"),
  short_description_ar: z.string().min(1, "Short description (Arabic) is required"),

  // Full descriptions (markdown)
  description: z.string().min(1, "Description is required"),
  description_en: z.string().min(1, "Description (English) is required"),
  description_ar: z.string().min(1, "Description (Arabic) is required"),

  // Translated titles
  title_en: z.string().min(1, "Title (English) is required"),
  title_ar: z.string().min(1, "Title (Arabic) is required"),
})

type ProgramDonationFormData = z.infer<typeof programDonationSchema>

export default function CreateProgramDonationForm() {
  const [description, setDescription] = useState("")
  const [descriptionEn, setDescriptionEn] = useState("")
  const [descriptionAr, setDescriptionAr] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProgramDonationFormData>({
    resolver: zodResolver(programDonationSchema),
  })

  const onSubmit = (data: ProgramDonationFormData) => {
    console.log("Form Data:", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field className="md:col-span-2">
              <FieldLabel>
                Title (Indonesia) <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...register("title")}
                  placeholder="Enter program title"
                />
                <FieldError errors={[errors.title]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Slug <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input {...register("slug")} placeholder="program-slug" />
                <FieldDescription>
                  URL-friendly version of the title
                </FieldDescription>
                <FieldError errors={[errors.slug]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Status <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...register("status")}
                  placeholder="active, completed, etc."
                />
                <FieldError errors={[errors.status]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Location <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input {...register("location")} placeholder="Enter location" />
                <FieldError errors={[errors.location]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Image URL <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input {...register("image_url")} placeholder="https://..." />
                <FieldError errors={[errors.image_url]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>
                Target Amount <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  {...register("target_amount")}
                  placeholder="0.00"
                />
                <FieldError errors={[errors.target_amount]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Collected Amount <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  {...register("collected_amount")}
                  placeholder="0.00"
                />
                <FieldError errors={[errors.collected_amount]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>
                Start Date <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input type="datetime-local" {...register("starts_at")} />
                <FieldError errors={[errors.starts_at]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                End Date <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input type="datetime-local" {...register("ends_at")} />
                <FieldError errors={[errors.ends_at]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content (Indonesia)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <FieldLabel>
              Short Description <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                {...register("short_description")}
                placeholder="Brief summary"
              />
              <FieldError errors={[errors.short_description]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              Full Description <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <RichTextEditor
                value={description}
                onChange={markdown => {
                  setDescription(markdown)
                  setValue("description", markdown)
                }}
                placeholder="Enter detailed description..."
              />
              <FieldError errors={[errors.description]} />
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content (English)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>
                Title (English) <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input {...register("title_en")} placeholder="English title" />
                <FieldError errors={[errors.title_en]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Short Description (English) <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...register("short_description_en")}
                  placeholder="Brief summary in English"
                />
                <FieldError errors={[errors.short_description_en]} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>
              Full Description (English) <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <RichTextEditor
                value={descriptionEn}
                onChange={markdown => {
                  setDescriptionEn(markdown)
                  setValue("description_en", markdown)
                }}
                placeholder="Enter detailed description in English..."
              />
              <FieldError errors={[errors.description_en]} />
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content (Arabic)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>
                Title (Arabic) <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...register("title_ar")}
                  placeholder="العنوان بالعربية"
                  dir="rtl"
                />
                <FieldError errors={[errors.title_ar]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Short Description (Arabic) <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...register("short_description_ar")}
                  placeholder="ملخص موجز بالعربية"
                  dir="rtl"
                />
                <FieldError errors={[errors.short_description_ar]} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>
              Full Description (Arabic) <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <RichTextEditor
                value={descriptionAr}
                onChange={markdown => {
                  setDescriptionAr(markdown)
                  setValue("description_ar", markdown)
                }}
                placeholder="أدخل وصفاً تفصيلياً بالعربية..."
              />
              <FieldError errors={[errors.description_ar]} />
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Create Program</Button>
      </div>
    </form>
  )
}

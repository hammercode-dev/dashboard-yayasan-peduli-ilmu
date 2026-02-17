"use client"

import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import RichTextEditor from "@/components/common/rich-text-editor"
import { CalendarPopover } from "@/components/common/calendar-popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Languages,
  Info,
  DollarSign,
  CalendarDays,
  FileText,
} from "lucide-react"
import {
  ProgramDonationFormData,
  programDonationSchema,
} from "../program.schemas"
import { Separator } from "@/components/ui/separator"
import {
  useCreateProgramDonationMutation,
  useGetProgramDonationByIdQuery,
  useUpdateProgramDonationMutation,
} from "../program.api"
import { toast } from "sonner"
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_OPTIONS } from "../program.constants"
import SkeletonDetail from "./SkeletonDetail"

interface ProgramDonationFormProps {
  id?: string
  type: "create" | "edit"
}

export default function ProgramDonationForm({
  id,
  type,
}: ProgramDonationFormProps) {
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [descriptionEn, setDescriptionEn] = useState("")
  const [descriptionAr, setDescriptionAr] = useState("")
  const [createProgramDonation, { isLoading: isLoadingCreate }] =
    useCreateProgramDonationMutation()
  const [updateProgramDonation, { isLoading: isLoadingUpdate }] =
    useUpdateProgramDonationMutation()
  const {
    data: detailProgramDonation,
    isFetching: isLoadingDetailProgramDonation,
  } = useGetProgramDonationByIdQuery(id ?? "", {
    skip: type !== "edit",
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    reset,
    formState: { errors },
  } = useForm<ProgramDonationFormData>({
    resolver: zodResolver(programDonationSchema),
  })

  const onSubmit = async (data: ProgramDonationFormData) => {
    try {
      if (type === "create") {
        await createProgramDonation(data).unwrap()
        toast.success("Program donation created successfully")
      }
      if (type === "edit") {
        await updateProgramDonation({ id: id as string, ...data }).unwrap()
        toast.success("Program donation updated successfully")
      }
      router.push("/dashboard/program")
    } catch (err) {
      console.log("err", err)
      const apiError = err as {
        status?: number
        data?: { message?: string; errors?: unknown }
      }
      const message = apiError?.data?.message
      toast.error(message)
    }
  }

  const generateSlug = useCallback((title: string) => {
    return title.toLowerCase().replace(/ /g, "-")
  }, [])

  useEffect(() => {
    if (detailProgramDonation) {
      reset({
        title: detailProgramDonation.title ?? "",
        title_en: detailProgramDonation.title_en ?? "",
        title_ar: detailProgramDonation.title_ar ?? "",
        slug: detailProgramDonation.slug ?? "",
        status: detailProgramDonation.status ?? "",
        location: detailProgramDonation.location ?? "",
        image_url: detailProgramDonation.image_url ?? "",
        target_amount: detailProgramDonation.target_amount?.toString() ?? "",
        collected_amount:
          detailProgramDonation.collected_amount?.toString() ?? "",
        starts_at: detailProgramDonation.starts_at
          ? format(new Date(detailProgramDonation.starts_at), "yyyy-MM-dd")
          : "",
        ends_at: detailProgramDonation.ends_at
          ? format(new Date(detailProgramDonation.ends_at), "yyyy-MM-dd")
          : "",
        short_description: detailProgramDonation.short_description ?? "",
        short_description_en: detailProgramDonation.short_description_en ?? "",
        short_description_ar: detailProgramDonation.short_description_ar ?? "",
        description: detailProgramDonation.description ?? "",
        description_en: detailProgramDonation.description_en ?? "",
        description_ar: detailProgramDonation.description_ar ?? "",
      })
      setDescription(detailProgramDonation.description ?? "")
      setDescriptionEn(detailProgramDonation.description_en ?? "")
      setDescriptionAr(detailProgramDonation.description_ar ?? "")
    }
  }, [detailProgramDonation])

  if (isLoadingDetailProgramDonation) {
    return <SkeletonDetail />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue="general" orientation={"horizontal"} className="gap-2">
        <TabsList
          variant="default"
          className={"h-full shrink-0 items-stretch justify-start gap-1"}
        >
          <TabsTrigger
            value="general"
            className={
              "w-full justify-start gap-2 px-3 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            }
          >
            <Settings className="size-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="translation"
            className={
              "w-full justify-start gap-2 px-3 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            }
          >
            <Languages className="size-4" />
            Translation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0 flex-1 space-y-6 py-4">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Info className="size-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field className="md:col-span-2">
                <FieldLabel>
                  Title (Indonesia) <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...register("title")}
                    aria-invalid={!!errors.title}
                    placeholder="Enter program title"
                    onChange={e => {
                      setValue("slug", generateSlug(e.target.value))
                    }}
                  />
                  <FieldError errors={[errors.title]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  Slug <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...register("slug")}
                    aria-invalid={!!errors.slug}
                    placeholder="program-slug"
                  />
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
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        key={field.value}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={!!errors.status}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.status]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  Location <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...register("location")}
                    placeholder="Enter location"
                    aria-invalid={!!errors.location}
                  />
                  <FieldError errors={[errors.location]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  Image URL <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...register("image_url")}
                    aria-invalid={!!errors.image_url}
                    placeholder="https://..."
                  />
                  <FieldError errors={[errors.image_url]} />
                </FieldContent>
              </Field>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <DollarSign className="size-4" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                    aria-invalid={!!errors.target_amount}
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
                    aria-invalid={!!errors.collected_amount}
                  />
                  <FieldError errors={[errors.collected_amount]} />
                </FieldContent>
              </Field>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <CalendarDays className="size-4" />
              Schedule
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel>
                  Start Date <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <CalendarPopover
                    value={watch("starts_at")}
                    onChange={async date => {
                      setValue(
                        "starts_at",
                        date ? format(date, "yyyy-MM-dd") : ""
                      )
                      await trigger("starts_at")
                    }}
                    placeholder="Pilih tanggal mulai"
                    error={errors.starts_at}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  End Date <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <CalendarPopover
                    value={watch("ends_at")}
                    onChange={async date => {
                      console.log("dateee", date)
                      setValue(
                        "ends_at",
                        date ? format(date, "yyyy-MM-dd") : ""
                      )
                      await trigger("ends_at")
                    }}
                    placeholder="Pilih tanggal selesai"
                    error={errors.ends_at}
                  />
                </FieldContent>
              </Field>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Content Indonesia */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <FileText className="size-4" />
              Content (Indonesia)
            </h3>
            <div className="space-y-5">
              <Field>
                <FieldLabel>
                  Short Description <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...register("short_description")}
                    placeholder="Brief summary"
                    aria-invalid={!!errors.short_description}
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
                    onChange={async markdown => {
                      setDescription(markdown)
                      setValue("description", markdown)
                      await trigger("description")
                    }}
                    placeholder="Enter detailed description..."
                    aria-invalid={!!errors.description}
                  />
                  <FieldError errors={[errors.description]} />
                </FieldContent>
              </Field>
            </div>
          </div>
        </TabsContent>

        {/* Translation Tab */}
        <TabsContent value="translation" className="mt-0 flex-1 space-y-6 py-4">
          {/* English */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span>🇬🇧</span>
              English
            </h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel>
                    Title (English) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      {...register("title_en")}
                      placeholder="English title"
                      aria-invalid={!!errors.title_en}
                    />
                    <FieldError errors={[errors.title_en]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>
                    Short Description <span className="text-red-500">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      {...register("short_description_en")}
                      placeholder="Brief summary in English"
                      aria-invalid={!!errors.short_description_en}
                    />
                    <FieldError errors={[errors.short_description_en]} />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>
                  Full Description <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <RichTextEditor
                    value={descriptionEn}
                    onChange={async markdown => {
                      setDescriptionEn(markdown)
                      setValue("description_en", markdown)
                      await trigger("description_en")
                    }}
                    placeholder="Enter detailed description in English..."
                    aria-invalid={!!errors.description_en}
                  />
                  <FieldError errors={[errors.description_en]} />
                </FieldContent>
              </Field>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Arabic */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span>🇸🇦</span>
              Arabic
            </h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel>
                    Title (Arabic) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      {...register("title_ar")}
                      placeholder="العنوان بالعربية"
                      dir="rtl"
                      aria-invalid={!!errors.title_ar}
                    />
                    <FieldError errors={[errors.title_ar]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>
                    Short Description <span className="text-red-500">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      {...register("short_description_ar")}
                      placeholder="ملخص موجز بالعربية"
                      dir="rtl"
                      aria-invalid={!!errors.short_description_ar}
                    />
                    <FieldError errors={[errors.short_description_ar]} />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>
                  Full Description <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <RichTextEditor
                    value={descriptionAr}
                    onChange={async markdown => {
                      setDescriptionAr(markdown)
                      setValue("description_ar", markdown)
                      await trigger("description_ar")
                    }}
                    placeholder="أدخل وصفاً تفصيلياً بالعربية..."
                    textAlign="right"
                  />
                  <FieldError errors={[errors.description_ar]} />
                </FieldContent>
              </Field>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 py-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" loading={isLoadingCreate || isLoadingUpdate}>
          {type === "create" ? "Create Program" : "Update Program"}
        </Button>
      </div>
    </form>
  )
}

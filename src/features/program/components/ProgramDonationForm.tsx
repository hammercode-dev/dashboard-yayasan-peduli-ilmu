"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import RichTextEditor, {
  RichTextEditorRef,
} from "@/components/common/rich-text-editor"
import { CalendarPopover } from "@/components/common/calendar-popover"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import {
  ProgramDonationFormData,
  ProgramDonationFormInput,
  programDonationSchema,
} from "../program.schemas"

import {
  useCreateProgramDonationMutation,
  useGetParentProgramsQuery,
  useGetProgramDonationByIdQuery,
  useUpdateProgramDonationMutation,
} from "../program.api"

import { PROGRAM_TYPE_OPTIONS, STATUS_OPTIONS } from "../program.constants"
import { SkeletonForm } from "./SkeletonForm"

import { formatRupiah } from "@/lib/format"
import { getDirtyValues } from "@/lib/utils"
// import ProgramTimelineEditor from "./ProgramTimelineEditor"

interface ProgramDonationFormProps {
  id?: string
  type: "create" | "edit"
}

export default function ProgramDonationForm({
  id,
  type,
}: ProgramDonationFormProps) {
  const router = useRouter()
  const [isUploadPendingFile, setIsUploadPendingFile] = useState(false)
  const [description, setDescription] = useState("")
  const [descriptionEn, setDescriptionEn] = useState("")
  const [descriptionAr, setDescriptionAr] = useState("")
  const descriptionRef = useRef<RichTextEditorRef>(null)
  const descriptionEnRef = useRef<RichTextEditorRef>(null)
  const descriptionArRef = useRef<RichTextEditorRef>(null)
  const [createProgramDonation, { isLoading: isLoadingCreate }] =
    useCreateProgramDonationMutation()
  const [updateProgramDonation, { isLoading: isLoadingUpdate }] =
    useUpdateProgramDonationMutation()
  const {
    data: detailProgramDonation,
    isFetching: isLoadingDetailProgramDonation,
  } = useGetProgramDonationByIdQuery(id ?? "", {
    skip: type !== "edit",
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const { data: parentProgramsData } = useGetParentProgramsQuery(undefined, {
    skip: type === "edit" && isLoadingDetailProgramDonation,
  })

  const methods = useForm<ProgramDonationFormInput>({
    resolver: zodResolver(programDonationSchema),
    defaultValues: {
      program_type: "parent",
      parent_id: null,
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = methods

  const target_amount = watch("target_amount")
  const collected_amount = watch("collected_amount")
  const starts_at = watch("starts_at") ? new Date(watch("starts_at")) : null
  const ends_at = watch("ends_at") ? new Date(watch("ends_at")) : null
  const programType = watch("program_type") ?? "parent"

  const parentOptions =
    parentProgramsData?.data?.parents
      ?.map((p: { id: string | number; title: string }) => ({
        id: String(p.id),
        title: p.title,
      }))
      .filter((p: { id: string; title: string }) => p.id !== id) ?? []

  const isChildProgram =
    type === "edit" && detailProgramDonation?.parent_id != null
  const hasChildren =
    type === "edit" &&
    (detailProgramDonation?.children?.length ?? 0) > 0
  const isTypeLocked = type === "edit"

  const noParentsAvailable =
    programType === "child" && parentOptions.length === 0

  const generateSlug = useCallback((title: string) => {
    return title.toLowerCase().replace(/ /g, "-")
  }, [])

  const quickAmounts = [
    "1000000",
    "5000000",
    "10000000",
    "25000000",
    "50000000",
    "100000000",
  ]

  const quickDurations = [
    { label: "3 Bulan", type: "month", value: 3 },
    { label: "6 Bulan", type: "month", value: 6 },
    { label: "9 Bulan", type: "month", value: 9 },
    { label: "1 Tahun", type: "year", value: 1 },
  ]

  const handleQuickAmount = (amount: string) => {
    setValue("target_amount", amount, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleQuickDuration = (type: "month" | "year", value: number) => {
    const startDate = new Date()
    const endDate = new Date()

    if (type === "month") {
      endDate.setMonth(endDate.getMonth() + value)
    } else {
      endDate.setFullYear(endDate.getFullYear() + value)
    }

    setValue("starts_at", startDate.toISOString(), { shouldDirty: true })
    setValue("ends_at", endDate.toISOString(), { shouldDirty: true })

    trigger(["starts_at", "ends_at"])
  }

  useEffect(() => {
    if (detailProgramDonation) {
      const isChild = detailProgramDonation.parent_id != null
      reset({
        program_type: isChild ? "child" : "parent",
        parent_id: detailProgramDonation.parent_id
          ? String(detailProgramDonation.parent_id)
          : null,
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
  }, [detailProgramDonation, reset])

  const onSubmit = async (raw: ProgramDonationFormInput) => {
    const data = programDonationSchema.parse(raw)
    setIsUploadPendingFile(true)
    try {
      const [descResult, descEnResult, descArResult] = await Promise.all([
        descriptionRef.current?.uploadPendingFiles() ?? {
          markdown: description,
          success: true,
        },
        descriptionEnRef.current?.uploadPendingFiles() ?? {
          markdown: descriptionEn,
          success: true,
        },
        descriptionArRef.current?.uploadPendingFiles() ?? {
          markdown: descriptionAr,
          success: true,
        },
      ])

      if (
        !descResult.success ||
        !descEnResult.success ||
        !descArResult.success
      ) {
        toast.error("Gagal mengupload gambar, silakan coba lagi")
        return
      }

      data.description = descResult.markdown
      data.description_en = descEnResult.markdown
      data.description_ar = descArResult.markdown

      const payload: ProgramDonationFormData = {
        ...data,
        program_type: data.program_type ?? "parent",
        parent_id:
          data.program_type === "child" ? (data.parent_id ?? null) : null,
      }

      if (type === "create") {
        await createProgramDonation(payload).unwrap()
        toast.success("Program donation created successfully")
      }
      if (type === "edit" && id) {
        const changedData = getDirtyValues(dirtyFields, {
          ...data,
          parent_id:
            data.program_type === "child" ? (data.parent_id ?? null) : null,
        })

        await updateProgramDonation({
          id: id as string,
          ...changedData,
          program_type: data.program_type ?? "parent",
        }).unwrap()

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
    } finally {
      setIsUploadPendingFile(false)
    }
  }

  const isSaving = isUploadPendingFile || isLoadingCreate || isLoadingUpdate

  if (isLoadingDetailProgramDonation) {
    return <SkeletonForm />
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, () =>
          toast.error("Periksa field yang wajib diisi")
        )}
      >
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-12">
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Tipe Program</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Field>
                    <FieldContent>
                      <div className="flex flex-wrap gap-2">
                        {PROGRAM_TYPE_OPTIONS.map(option => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={
                              programType === option.value
                                ? "default"
                                : "outline"
                            }
                            disabled={isTypeLocked}
                            onClick={() => {
                              setValue("program_type", option.value, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                              if (option.value === "parent") {
                                setValue("parent_id", null, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                })
                              }
                            }}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                      {isChildProgram && (
                        <FieldDescription>
                          Sub-program tidak dapat diubah menjadi program utama.
                        </FieldDescription>
                      )}
                      {hasChildren && !isChildProgram && (
                        <FieldDescription>
                          Program utama yang memiliki sub-program tidak dapat
                          diubah menjadi sub-program.
                        </FieldDescription>
                      )}
                      {!isTypeLocked && programType === "child" && (
                        <FieldDescription>
                          Sub-program akan tampil di bawah program utama pada
                          daftar program.
                        </FieldDescription>
                      )}
                    </FieldContent>
                  </Field>

                  {programType === "child" && (
                    <Field>
                      <FieldLabel>
                        Program Utama{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Controller
                          name="parent_id"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value ?? ""}
                              onValueChange={val =>
                                field.onChange(val || null)
                              }
                              disabled={noParentsAvailable}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih program utama" />
                              </SelectTrigger>
                              <SelectContent>
                                {parentOptions.map((parent: { id: string; title: string }) => (
                                  <SelectItem
                                    key={parent.id}
                                    value={parent.id}
                                  >
                                    {parent.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError errors={[errors.parent_id]} />
                        {noParentsAvailable && (
                          <p className="text-sm text-destructive mt-1">
                            Buat program utama terlebih dahulu.
                          </p>
                        )}
                      </FieldContent>
                    </Field>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Judul Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field className="md:col-span-2">
                      <FieldLabel>
                        Judul (Bahasa Indonesia){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          {...register("title")}
                          aria-invalid={!!errors.title}
                          placeholder="Masukkan judul program"
                          onChange={e => {
                            register("title").onChange(e)

                            const newTitle = e.target.value
                            setValue("slug", generateSlug(newTitle), {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }}
                        />
                        <FieldError errors={[errors.title]} />
                      </FieldContent>
                    </Field>

                    <Field className="md:col-span-2">
                      <FieldLabel>
                        Judul (Bahasa Inggris){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          {...register("title_en")}
                          placeholder="Judul dalam Bahasa Inggris"
                          aria-invalid={!!errors.title_en}
                        />
                        <FieldError errors={[errors.title_en]} />
                      </FieldContent>
                    </Field>

                    <Field className="md:col-span-2">
                      <FieldLabel>
                        Judul (Bahasa Arab){" "}
                        <span className="text-red-500">*</span>
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
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Deskripsi Singkat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-5">
                    <Field>
                      <FieldLabel>
                        Deskripsi Singkat (Bahasa Indonesia){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          {...register("short_description")}
                          placeholder="Ringkasan singkat dalam Bahasa Indonesia"
                          aria-invalid={!!errors.short_description}
                        />
                        <FieldError errors={[errors.short_description]} />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Deskripsi Singkat (Bahasa Inggris){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          {...register("short_description_en")}
                          placeholder="Ringkasan singkat dalam Bahasa Inggris"
                          aria-invalid={!!errors.short_description_en}
                        />
                        <FieldError errors={[errors.short_description_en]} />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Deskripsi Singkat (Bahasa Arab){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          {...register("short_description_ar")}
                          dir="rtl"
                          placeholder="ملخص مختصر بالعربية"
                          aria-invalid={!!errors.short_description_ar}
                        />
                        <FieldError errors={[errors.short_description_ar]} />
                      </FieldContent>
                    </Field>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Deskripsi Lengkap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-5">
                    <Field>
                      <FieldLabel>
                        Deskripsi Lengkap (Bahasa Indonesia){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <RichTextEditor
                          ref={descriptionRef}
                          value={description}
                          onChange={async markdown => {
                            setDescription(markdown)
                            setValue("description", markdown, {
                              shouldDirty: true,
                            })
                            await trigger("description")
                          }}
                          placeholder="Masukkan deskripsi lengkap..."
                          aria-invalid={!!errors.description}
                        />
                        <FieldError errors={[errors.description]} />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Deskripsi Lengkap (Bahasa Inggris){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <RichTextEditor
                          ref={descriptionEnRef}
                          value={descriptionEn}
                          onChange={async markdown => {
                            setDescriptionEn(markdown)
                            setValue("description_en", markdown, {
                              shouldDirty: true,
                            })
                            await trigger("description_en")
                          }}
                          placeholder="Masukkan deskripsi lengkap dalam Bahasa Inggris..."
                          aria-invalid={!!errors.description_en}
                        />
                        <FieldError errors={[errors.description_en]} />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Deskripsi Lengkap (Bahasa Arab){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <RichTextEditor
                          ref={descriptionArRef}
                          value={descriptionAr}
                          onChange={async markdown => {
                            setDescriptionAr(markdown)
                            setValue("description_ar", markdown, {
                              shouldDirty: true,
                            })
                            await trigger("description_ar")
                          }}
                          placeholder="Masukkan deskripsi lengkap dalam Bahasa Arab..."
                          aria-invalid={!!errors.description_ar}
                        />
                        <FieldError errors={[errors.description_ar]} />
                      </FieldContent>
                    </Field>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Informasi Keuangan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-7">
                    <FieldLabel>Pilihan Cepat Nominal</FieldLabel>

                    <div className="flex flex-wrap gap-2 mb-7">
                      {quickAmounts.map(amount => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          value={amount}
                          size="sm"
                          onClick={() => handleQuickAmount(String(amount))}
                          className="text-xs"
                        >
                          {formatRupiah(Number(amount))}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-7">
                    <Field>
                      <FieldLabel>
                        Target Dana <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          type="number"
                          {...register("target_amount")}
                          placeholder="Rp."
                          aria-invalid={!!errors.target_amount}
                        />
                        {target_amount && (
                          <div className="text-xs text-gray-600 mt-1">
                            {formatRupiah(Number(target_amount))}
                          </div>
                        )}
                        <FieldError errors={[errors.target_amount]} />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Dana Terkumpul <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          type="number"
                          {...register("collected_amount")}
                          placeholder="Rp. "
                          aria-invalid={!!errors.collected_amount}
                        />
                        {collected_amount && (
                          <div className="text-xs text-gray-600">
                            {formatRupiah(Number(collected_amount))}
                          </div>
                        )}
                        <FieldError errors={[errors.collected_amount]} />
                      </FieldContent>
                    </Field>
                  </div>
                  {/* Progress Display */}
                  {target_amount &&
                    collected_amount &&
                    Number(target_amount) > 0 && (
                      <FundingProgress
                        collected_amount={collected_amount}
                        target_amount={target_amount}
                      />
                    )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Jadwal Pelaksanaan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-7">
                    <FieldLabel>Pilihan Cepat Durasi</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {quickDurations.map(option => (
                        <Button
                          key={option.label}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuickDuration(
                              option.type as "month" | "year",
                              option.value
                            )
                          }
                          className="text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-7">
                    <Field>
                      <FieldLabel>
                        Tanggal Mulai <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <CalendarPopover
                          value={watch("starts_at")}
                          onChange={async date => {
                            setValue(
                              "starts_at",
                              date ? format(date, "yyyy-MM-dd") : "",
                              { shouldDirty: true }
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
                        Tanggal Selesai <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <CalendarPopover
                          value={watch("ends_at")}
                          onChange={async date => {
                            setValue(
                              "ends_at",
                              date ? format(date, "yyyy-MM-dd") : "",
                              { shouldDirty: true }
                            )
                            await trigger("ends_at")
                          }}
                          placeholder="Pilih tanggal selesai"
                          error={errors.ends_at}
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  {starts_at && ends_at && (
                    <CampaignDuration starts_at={starts_at} ends_at={ends_at} />
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Informasi Lainnya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field>
                      <FieldLabel>
                        Slug <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          {...register("slug")}
                          aria-invalid={!!errors.slug}
                          placeholder="slug-program"
                        />
                        <FieldDescription>
                          Versi judul yang ramah untuk URL
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
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map(option => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
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
                        Lokasi <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          {...register("location")}
                          placeholder="Masukkan lokasi"
                          aria-invalid={!!errors.location}
                        />
                        <FieldError errors={[errors.location]} />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        URL Gambar Sampul{" "}
                        <span className="text-red-500">*</span>
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
                </CardContent>
              </Card>
            </div>
          </div>
          {/* <div className="col-span-4 sticky top-12 self-start">
            <ProgramTimelineEditor />
          </div> */}
        </div>

        <div className="flex justify-end gap-3 py-4">
          <Button
            type="button"
            variant="outline"
            className="hover:cursor-pointer"
            disabled={isSaving}
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={isSaving}
            disabled={isSaving || noParentsAvailable}
            className="hover:cursor-pointer font-bold"
          >
            {type === "create" ? "Buat Program" : "Perbarui Program"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

const FundingProgress = ({
  collected_amount,
  target_amount,
}: {
  collected_amount: number | string
  target_amount: number | string
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-green-900">Progres Pendanaan</h4>
        <span className="text-sm font-medium text-green-700">
          {Math.round((Number(collected_amount) / Number(target_amount)) * 100)}
          %
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-green-200 rounded-full h-2 mb-3">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${Math.min((Number(collected_amount) / Number(target_amount)) * 100, 100)}%`,
          }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-green-700 font-medium">Terkumpul</div>
          <div className="text-green-900 font-semibold">
            {formatRupiah(Number(collected_amount))}
          </div>
        </div>
        <div>
          <div className="text-green-700 font-medium">Kekurangan</div>
          <div className="text-green-900 font-semibold">
            {formatRupiah(
              Math.max(Number(target_amount) - Number(collected_amount), 0)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CampaignDuration = ({
  starts_at,
  ends_at,
}: {
  starts_at: Date | null
  ends_at: Date | null
}) => {
  if (!starts_at || !ends_at) {
    return null
  }

  const diffTime = Math.abs(ends_at.getTime() - starts_at.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  const getReadableDuration = () => {
    if (diffDays < 7) {
      return `${diffDays} hari`
    }

    if (diffDays < 30) {
      return `${diffWeeks} minggu (${diffDays} hari)`
    }

    return `${diffMonths} bulan (${diffDays} hari)`
  }

  const isInvalidRange = ends_at <= starts_at

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-blue-900">Durasi Kampanye</h4>
          <p className="text-sm text-blue-700 mt-1">{getReadableDuration()}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{diffDays}</div>
          <div className="text-xs text-blue-600 font-medium uppercase">
            Hari
          </div>
        </div>
      </div>

      {isInvalidRange && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          ⚠️ Tanggal selesai harus setelah tanggal mulai
        </div>
      )}
    </div>
  )
}

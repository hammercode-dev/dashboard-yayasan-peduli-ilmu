"use client"

import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useDebouncedCallback } from "use-debounce"
import { Controller, useForm } from "react-hook-form"
import type { FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CalendarPopover } from "@/components/common/calendar-popover"

import {
  createDonationEvidenceSchema,
  editDonationEvidenceSchema,
  type CreateDonationEvidenceFormData,
  type EditDonationEvidenceFormData,
} from "../donation.schemas"
import {
  useCreateDonationMutation,
  useGetDonationByIdQuery,
  useUpdateDonationMutation,
} from "../donation.api"
import { PAYMENT_METHODS } from "../donation.constants"

import { useGetAllProgramDonationsQuery } from "@/features/program/program.api"
import { SkeletonEdit } from "@/features/donation/components/SkeletonEdit"

import { SearchProgram } from "./SearchProgram"
import { DonorSelectCombobox } from "./DonorSelectCombobox"

import { useGetDonorsQuery } from "@/features/donor/donor.api"
import { DonorForm } from "@/features/donor/components/DonorForm"
import { useAppSelector } from "@/store/hooks"
import { isSuperAdminRole } from "@/features/auth/roles"

import { formatRupiah } from "@/lib/format"
import { getDirtyValues } from "@/lib/utils"

interface DonationFormProps {
  id?: string
  type: "create" | "edit"
}

interface ProgramDonationListItem {
  id: string | number
  title?: string | null
  collected_amount?: unknown
  parent_id?: string | number | null
  parent?: { id: string | number; title: string } | null
}

export default function DonationForm({ id, type }: DonationFormProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [donorSearch, setDonorSearch] = useState("")
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null)
  const [donorDialogOpen, setDonorDialogOpen] = useState(false)
  const [displayDonorCreate, setDisplayDonorCreate] = useState<{
    name: string
    phone_number: string
    email: string
  } | null>(null)

  const currentUserRoleCode = useAppSelector(state => state.auth.user?.roleCode)
  const canManageDonors = isSuperAdminRole(currentUserRoleCode)

  const [createDonationEvidence, { isLoading: isLoadingCreate }] =
    useCreateDonationMutation()

  const { data: detailDonation, isFetching: isLoadingDetailDonation } =
    useGetDonationByIdQuery(id ?? "", {
      skip: type !== "edit",
    })

  const [updateDonationEvidence, { isLoading: isLoadingUpdate }] =
    useUpdateDonationMutation()

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value)
  }, 300)

  const debouncedDonorSearch = useDebouncedCallback((value: string) => {
    setDonorSearch(value)
  }, 300)

  const { data, isFetching } = useGetAllProgramDonationsQuery({
    query: search,
  })

  const { data: donorListResponse, isFetching: isFetchingDonors } =
    useGetDonorsQuery({ query: donorSearch, page: 1, limit: 50 })

  const programOptions =
    data?.data.donations?.map((p: ProgramDonationListItem) => {
      const title =
        typeof p.title === "string" ? p.title : String(p.title ?? "")
      const parentTitle = p.parent?.title
      return {
        id: p.id,
        nama: title,
        displayName:
          p.parent_id && parentTitle ? `${parentTitle} › ${title}` : title,
        parent_id: p.parent_id != null ? String(p.parent_id) : null,
        collectedAmount: p.collected_amount,
      }
    }) ?? []

  const donorOptions =
    donorListResponse?.data?.donors?.map(
      (d: {
        id: string
        name: string
        phone_number: string
        email: string | null
      }) => ({
        id: String(d.id),
        name: d.name,
        phone_number: d.phone_number,
        email: d.email ?? null,
      })
    ) ?? []

  const formSchema = useMemo(
    () =>
      type === "create"
        ? createDonationEvidenceSchema
        : editDonationEvidenceSchema,
    [type]
  )

  const defaultFormValues = useMemo(
    (): CreateDonationEvidenceFormData | EditDonationEvidenceFormData =>
      type === "create"
        ? {
            donor_id: "",
            amount: "",
            program_id: "",
            payment_method: "",
            donation_upload_at: "",
            evidence_url: "",
            description: "",
          }
        : {
            full_name: "",
            phone_number: "",
            email: "",
            amount: "",
            program_id: "",
            payment_method: "",
            donation_upload_at: "",
            evidence_url: "",
            description: "",
          },
    [type]
  )

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<CreateDonationEvidenceFormData | EditDonationEvidenceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch
  const amount = watch("amount")

  useEffect(() => {
    if (type === "edit") {
      setDisplayDonorCreate(null)
    }
  }, [type])

  useEffect(() => {
    if (detailDonation && type === "edit") {
      setSelectedDonorId(String(detailDonation.donor_id))
    }
  }, [detailDonation, type])

  useEffect(() => {
    if (detailDonation) {
      reset({
        full_name: detailDonation.donors?.name ?? "",
        amount:
          detailDonation.amount != null ? String(detailDonation.amount) : "",
        phone_number: detailDonation.donors?.phone_number ?? "",
        email: detailDonation.donors?.email ?? "",
        payment_method: detailDonation.payment_method ?? "",
        program_id:
          detailDonation.program_id != null
            ? String(detailDonation.program_id)
            : "",
        donation_upload_at: detailDonation.donation_upload_at
          ? format(new Date(detailDonation.donation_upload_at), "yyyy-MM-dd")
          : "",
        evidence_url: detailDonation.evidence_url ?? "",
        description: detailDonation.description ?? "",
      })
    }
  }, [detailDonation, reset])

  const onSubmit = async (
    formData: CreateDonationEvidenceFormData | EditDonationEvidenceFormData
  ) => {
    try {
      if (type === "create") {
        await createDonationEvidence(
          formData as CreateDonationEvidenceFormData
        ).unwrap()

        toast.success("Donation created successfully")
      }

      if (type === "edit" && id) {
        const changedData = getDirtyValues(dirtyFields, formData)

        await updateDonationEvidence({
          id: id as string,
          ...changedData,
        }).unwrap()

        toast.success("Donation evidence updated successfully")
      }

      router.push("/dashboard/donation")
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

  if (isLoadingDetailDonation) {
    return <SkeletonEdit />
  }

  const createFieldErrors =
    errors as FieldErrors<CreateDonationEvidenceFormData>
  const editFieldErrors = errors as FieldErrors<EditDonationEvidenceFormData>

  return (
    <form
      key={`donation-${type}-${id ?? "new"}`}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Donatur</CardTitle>
          <CardDescription>
            Data dasar donatur yang melakukan pembayaran
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(type === "create" || type === "edit") && (
              <Field className="md:col-span-2">
                <FieldLabel>Cari atau pilih donatur</FieldLabel>
                <FieldContent>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start">
                    <DonorSelectCombobox
                      className="min-w-[220px] flex-1"
                      donors={donorOptions}
                      value={selectedDonorId}
                      onSelect={d => {
                        setSelectedDonorId(d.id)
                        setDisplayDonorCreate(
                          type === "create"
                            ? {
                                name: d.name,
                                phone_number: d.phone_number,
                                email: d.email ?? "",
                              }
                            : null
                        )
                        if (type === "create") {
                          setValue("donor_id", d.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        } else {
                          setValue("full_name", d.name)
                          setValue("phone_number", d.phone_number)
                          setValue("email", d.email ?? "")
                        }
                      }}
                      onSearch={debouncedDonorSearch}
                      isFetching={isFetchingDonors}
                    />
                    {selectedDonorId ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="shrink-0"
                        onClick={() => {
                          setSelectedDonorId(null)
                          setDisplayDonorCreate(null)
                          if (type === "create") {
                            setValue("donor_id", "", {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          } else {
                            setValue("full_name", "")
                            setValue("phone_number", "")
                            setValue("email", "")
                          }
                        }}
                      >
                        Hapus pilihan
                      </Button>
                    ) : null}
                    {canManageDonors ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 font-semibold"
                        onClick={() => setDonorDialogOpen(true)}
                      >
                        Tambah donatur
                      </Button>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    Setelah dipilih, data donatur ditampilkan di bawah (hanya
                    baca).
                  </p>
                  {type === "create" ? (
                    <FieldError errors={[createFieldErrors.donor_id]} />
                  ) : null}
                  {type === "create" ? (
                    <input type="hidden" {...register("donor_id")} />
                  ) : null}
                </FieldContent>
              </Field>
            )}

            {type === "create" && displayDonorCreate ? (
              <>
                <Field className="md:col-span-2">
                  <FieldLabel>
                    Nama Donatur <span className="text-red-500">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      readOnly
                      className="bg-muted cursor-not-allowed"
                      value={displayDonorCreate.name}
                      aria-invalid={false}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>
                    No HP <span className="text-red-500">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      readOnly
                      className="bg-muted cursor-not-allowed"
                      type="tel"
                      value={displayDonorCreate.phone_number}
                      aria-invalid={false}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <FieldContent>
                    <Input
                      readOnly
                      className="bg-muted cursor-not-allowed"
                      type="email"
                      value={displayDonorCreate.email}
                      aria-invalid={false}
                    />
                  </FieldContent>
                </Field>
              </>
            ) : null}

            {type === "edit" ? (
              <>
                <Field className="md:col-span-2">
                  <FieldLabel>
                    Nama Donatur <span className="text-red-500">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Nama donatur"
                      {...register("full_name")}
                    />
                    <FieldError errors={[editFieldErrors.full_name]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>
                    No HP <span className="text-red-500">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      placeholder="08xxxxxxxxxx"
                      {...register("phone_number")}
                    />
                    <FieldError errors={[editFieldErrors.phone_number]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      inputMode="email"
                      placeholder="email@example.com"
                      {...register("email")}
                    />
                    <FieldError errors={[editFieldErrors.email]} />
                  </FieldContent>
                </Field>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Detail Donasi</CardTitle>
          <CardDescription>
            Pilih program dan metode pembayaran donasi
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field className="">
              <FieldLabel>
                Program Tujuan <span className="text-red-500">*</span>
              </FieldLabel>

              <FieldContent>
                <Controller
                  name="program_id"
                  control={control}
                  render={({ field }) => (
                    <SearchProgram
                      programs={programOptions}
                      value={field.value}
                      onChange={id => field.onChange(String(id))}
                      onSearch={debouncedSearch}
                      isFetching={isFetching}
                    />
                  )}
                />

                <FieldError errors={[errors.program_id]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Tanggal Donasi <span className="text-red-500">*</span>
              </FieldLabel>

              <FieldContent>
                <Controller
                  name="donation_upload_at"
                  control={control}
                  render={({ field }) => (
                    <CalendarPopover
                      value={field.value}
                      onChange={date =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      placeholder="Pilih tanggal donasi"
                      error={errors.donation_upload_at}
                    />
                  )}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Jumlah Donasi <span className="text-red-500">*</span>
              </FieldLabel>

              <FieldContent>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                    Rp
                  </span>

                  <Input
                    type="number"
                    className="pl-10 disabled:cursor-not-allowed disabled:pointer-events-auto"
                    {...register("amount")}
                    disabled={type === "edit"}
                  />
                </div>

                {Number(amount) > 0 && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    {formatRupiah(Number(amount))}
                  </p>
                )}

                <FieldError errors={[errors.amount]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Metode Pembayaran <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Controller
                  name="payment_method"
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger aria-invalid={!!errors.payment_method}>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.payment_method]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Bukti Donasi</CardTitle>
          <CardDescription>Lampirkan bukti transfer donasi</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-5">
            <Field>
              <FieldLabel>Bukti Donasi URL </FieldLabel>

              <FieldContent>
                <Input
                  placeholder="https://drive.google.com/..."
                  {...register("evidence_url")}
                  aria-invalid={!!errors.evidence_url}
                />

                <p className="text-xs text-muted-foreground mt-1">
                  Link Supabase Storage yang berisi bukti transfer donasi.
                </p>

                <FieldError errors={[errors.evidence_url]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Catatan</FieldLabel>

              <FieldContent>
                <textarea
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                  placeholder="Tambahkan catatan jika ada"
                  {...register("description")}
                />

                <FieldError errors={[errors.description]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-background pt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>

        <Button
          type="submit"
          loading={isLoadingCreate || isLoadingUpdate}
          disabled={isLoadingCreate || isLoadingUpdate}
        >
          {type === "create" ? "Simpan Donasi" : "Update Donasi"}
        </Button>
      </div>

      {(type === "create" || type === "edit") && canManageDonors ? (
        <Dialog open={donorDialogOpen} onOpenChange={setDonorDialogOpen}>
          <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah donatur baru</DialogTitle>
              <DialogDescription>
                Data akan mengisi form donasi setelah donatur tersimpan.
              </DialogDescription>
            </DialogHeader>
            <DonorForm
              type="create"
              onDismiss={() => setDonorDialogOpen(false)}
              onCreateSuccess={created => {
                setSelectedDonorId(created.id)
                setDonorDialogOpen(false)
                if (type === "create") {
                  setDisplayDonorCreate({
                    name: created.name,
                    phone_number: created.phone_number,
                    email: created.email ?? "",
                  })
                  setValue("donor_id", created.id, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                } else {
                  setValue("full_name", created.name)
                  setValue("phone_number", created.phone_number)
                  setValue("email", created.email ?? "")
                }
              }}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </form>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DonationEvidenceFormData,
  donationEvidenceSchema,
} from "../donation.schemas"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import { useUpdateProgramDonationMutation } from "@/features/program/program.api"

import {
  useCreateDonationMutation,
  useGetDonationByIdQuery,
} from "../donation.api"
import { CalendarPopover } from "@/components/common/calendar-popover"

import { useGetProgramDonationsQuery } from "@/features/program/program.api"

import { PAYMENT_METHODS } from "../donation.constants"
import { formatRupiah } from "@/lib/format"
import { SearchProgram } from "./SearchProgram"
import { useDebouncedCallback } from "use-debounce"

import { SkeletonDetail } from "@/features/donation/components/SkeletonDetail"

interface DonationFormProps {
  id?: string
  type: "create" | "edit"
}

export default function DonationForm({ id, type }: DonationFormProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [createDonationEvidence, { isLoading: isLoadingCreate }] =
    useCreateDonationMutation()
  const [updateProgramDonation] = useUpdateProgramDonationMutation()
  const { data: detailDonation, isFetching: isLoadingDetailDonation } =
    useGetDonationByIdQuery(id ?? "", {
      skip: type !== "edit",
    })

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value)
  }, 300)

  const { data, isFetching } = useGetProgramDonationsQuery({
    page: 1,
    status: "all",
    query: search,
  })

  const programOptions = data?.data.donations.map((p: any) => ({
    id: p.id,
    nama: p.title,
    collectedAmount: p.collected_amount,
  }))

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<DonationEvidenceFormData>({
    resolver: zodResolver(donationEvidenceSchema),
    defaultValues: {
      full_name: "",
      amount: "",
      phone_number: "",
      payment_method: "",
      program_id: "",
      donation_upload_at: "",
      evidence_url: "",
    },
  })

  const amount = watch("amount")

  useEffect(() => {
    if (detailDonation) {
      reset({
        full_name: detailDonation.full_name ?? "",
        amount: detailDonation.amount?.toString() ?? "",
        phone_number: detailDonation.phone_number ?? "",
        payment_method: detailDonation.payment_method ?? "",
        program_id: detailDonation.program_id ?? "",
        donation_upload_at: detailDonation.donation_upload_at
          ? format(new Date(detailDonation.donation_upload_at), "yyyy-MM-dd")
          : "",
        evidence_url: detailDonation.evidence_url ?? "",
        description: detailDonation.description ?? "",
      })
    }
  }, [detailDonation])

  const onSubmit = async (formData: DonationEvidenceFormData) => {
    try {
      if (type === "create") {
        await createDonationEvidence(formData).unwrap()

        const selectedProgram = programOptions?.find(
          p => p.id === formData.program_id
        )

        const newCollectedAmount =
          Number(selectedProgram?.collectedAmount || 0) +
          Number(formData.amount)

        await updateProgramDonation({
          id: formData.program_id,
          collected_amount: String(newCollectedAmount),
        }).unwrap()

        toast.success("Donation created successfully")
      }
      console.log("formData", formData)
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
    return <SkeletonDetail />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Donatur</CardTitle>
          <CardDescription>
            Data dasar donatur yang melakukan pembayaran
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field className="md:col-span-2">
              <FieldLabel>Nama Donatur *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Nama lengkap donatur"
                  {...register("full_name")}
                />
                <FieldError errors={[errors.full_name]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>No HP *</FieldLabel>
              <FieldContent>
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="08xxxxxxxxxx"
                  {...register("phone_number")}
                />
                <FieldError errors={[errors.phone_number]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>💳 Detail Donasi</CardTitle>
          <CardDescription>
            Pilih program dan metode pembayaran donasi
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field className="md:col-span-2">
              <FieldLabel>Program Tujuan *</FieldLabel>

              <FieldContent>
                <Controller
                  name="program_id"
                  control={control}
                  render={({ field }) => (
                    <SearchProgram
                      programs={programOptions}
                      value={field.value}
                      onChange={field.onChange}
                      onSearch={debouncedSearch}
                      isFetching={isFetching}
                    />
                  )}
                />

                <FieldError errors={[errors.program_id]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Jumlah Donasi *</FieldLabel>

              <FieldContent>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                    Rp
                  </span>

                  <Input
                    type="number"
                    className="pl-10"
                    {...register("amount")}
                  />
                </div>

                {amount && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    {formatRupiah(Number(amount))}
                  </p>
                )}

                <FieldError errors={[errors.amount]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Metode Pembayaran *</FieldLabel>

              <FieldContent>
                <Controller
                  name="payment_method"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih metode pembayaran" />
                      </SelectTrigger>

                      <SelectContent>
                        {PAYMENT_METHODS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <FieldError errors={[errors.payment_method]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Tanggal Donasi *</FieldLabel>

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
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>📎 Bukti Donasi</CardTitle>
          <CardDescription>Lampirkan bukti transfer donasi</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-5">
            <Field>
              <FieldLabel>Bukti Donasi URL *</FieldLabel>

              <FieldContent>
                <Input
                  placeholder="https://drive.google.com/..."
                  {...register("evidence_url")}
                  aria-invalid={!!errors.evidence_url}
                />

                <p className="text-xs text-muted-foreground mt-1">
                  Link Google Drive / WhatsApp / Storage bukti transfer
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
          loading={isLoadingCreate}
          disabled={isLoadingCreate}
        >
          {type === "create" ? "Simpan Donasi" : "Update Donasi"}
        </Button>
      </div>
    </form>
  )
}

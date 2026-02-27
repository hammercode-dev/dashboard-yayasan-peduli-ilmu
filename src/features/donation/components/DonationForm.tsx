"use client"
import { useState } from "react"
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

import { useUpdateProgramDonationMutation } from "@/features/program/program.api"

import { useCreateDonationMutation } from "../donation.api"
import { CalendarPopover } from "@/components/common/calendar-popover"

import { useGetProgramDonationsQuery } from "@/features/program/program.api"

import { PAYMENT_METHODS } from "../donation.constants"
import { formatRupiah } from "@/lib/format"
import { SearchProgram } from "./SearchProgram"
import { useDebouncedCallback } from "use-debounce"

interface DonationFormProps {
  id?: string
  type: "create" | "edit"
}

export default function DonationForm({ type }: DonationFormProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [createDonationEvidence, { isLoading: isLoadingCreate }] =
    useCreateDonationMutation()
  const [updateProgramDonation] = useUpdateProgramDonationMutation()

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Nama */}
        <Field className="md:col-span-2">
          <FieldLabel>Nama Donatur *</FieldLabel>
          <FieldContent>
            <Input {...register("full_name")} />
            <FieldError errors={[errors.full_name]} />
          </FieldContent>
        </Field>

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
            <Input type="number" {...register("amount")} />

            {amount && (
              <p className="text-xs mt-1 text-gray-600">
                {formatRupiah(Number(amount))}
              </p>
            )}

            <FieldError errors={[errors.amount]} />
          </FieldContent>
        </Field>

        {/* Payment */}
        <Field>
          <FieldLabel>Metode Pembayaran *</FieldLabel>
          <FieldContent>
            <Controller
              name="payment_method"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode" />
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
          <FieldLabel>No Hp *</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              {...register("phone_number")}
              placeholder="087844073870"
            />

            <FieldError errors={[errors.phone_number]} />
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
                  placeholder="Pilih tanggal mulai"
                  error={errors.donation_upload_at}
                />
              )}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            Bukti Donasi URL <span className="text-red-500">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              {...register("evidence_url")}
              aria-invalid={!!errors.evidence_url}
              placeholder="https://..."
            />
            <FieldError errors={[errors.evidence_url]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            Catatan <span className="text-red-500">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              {...register("evidence_url")}
              aria-invalid={!!errors.evidence_url}
              placeholder=""
            />
            <FieldError errors={[errors.evidence_url]} />
          </FieldContent>
        </Field>
      </div>

      <div className="flex justify-end gap-3 mt-7">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>

        <Button type="submit" loading={isLoadingCreate}>
          {type === "create" ? "Create Program" : "Update Program"}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"

import {
  useCreateDonorMutation,
  useGetDonorByIdQuery,
  useUpdateDonorMutation,
} from "../donor.api"
import { createDonorSchema, type CreateDonorFormData } from "../donor.schemas"

export interface CreatedDonorPayload {
  id: string
  name: string
  phone_number: string
  email: string | null
}

interface DonorFormProps {
  id?: string
  type: "create" | "edit"
  onCreateSuccess?: (created: CreatedDonorPayload) => void
  onDismiss?: () => void
}

function DonorFormSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

export function DonorForm({
  id,
  type,
  onCreateSuccess,
  onDismiss,
}: DonorFormProps) {
  const router = useRouter()
  const [createDonor, { isLoading: isLoadingCreate }] = useCreateDonorMutation()
  const [updateDonor, { isLoading: isLoadingUpdate }] = useUpdateDonorMutation()

  const { data: detailDonor, isFetching: isLoadingDetail } = useGetDonorByIdQuery(
    id ?? "",
    { skip: type !== "edit" }
  )

  const form = useForm<CreateDonorFormData>({
    resolver: zodResolver(createDonorSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (!detailDonor) return
    reset({
      name: detailDonor.name ?? "",
      phone_number: detailDonor.phone_number ?? "",
      email: detailDonor.email ?? "",
    })
  }, [detailDonor, reset])

  const onSubmit = async (data: CreateDonorFormData) => {
    try {
      if (type === "create") {
        const res = await createDonor(data).unwrap()
        toast.success("Donatur berhasil dibuat")
        const created = res?.data as
          | {
              id: bigint | string | number
              name: string
              phone_number: string
              email: string | null
            }
          | undefined
        if (onCreateSuccess && created) {
          onCreateSuccess({
            id: String(created.id),
            name: created.name,
            phone_number: created.phone_number,
            email: created.email ?? null,
          })
          return
        }
      }
      if (type === "edit" && id) {
        await updateDonor({ id, ...data }).unwrap()
        toast.success("Donatur berhasil diperbarui")
      }
      router.push("/dashboard/donor")
    } catch (err) {
      const apiError = err as { data?: { message?: string } }
      toast.error(
        apiError?.data?.message ??
          (type === "create"
            ? "Gagal membuat donatur"
            : "Gagal memperbarui donatur")
      )
    }
  }

  if (type === "edit" && isLoadingDetail) {
    return <DonorFormSkeleton />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Data Donatur</CardTitle>
          <CardDescription>Nama, nomor HP (unik), dan email opsional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field className="md:col-span-2">
              <FieldLabel>
                Nama <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Nama donatur"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>
                Nomor HP <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="08xxxxxxxxxx atau +62..."
                  aria-invalid={!!errors.phone_number}
                  {...register("phone_number")}
                />
                <FieldError errors={[errors.phone_number]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="Opsional"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex justify-end gap-3 bg-background pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => (onDismiss ? onDismiss() : router.back())}
        >
          Batal
        </Button>
        <Button
          type="submit"
          loading={isLoadingCreate || isLoadingUpdate}
          disabled={isLoadingCreate || isLoadingUpdate}
        >
          {type === "create" ? "Simpan Donatur" : "Perbarui Donatur"}
        </Button>
      </div>
    </form>
  )
}

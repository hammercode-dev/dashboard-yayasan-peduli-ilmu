"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

import {
  useCreateUserMutation,
  useGetRolesQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../user.api"
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "../user.schemas"
import { SkeletonForm } from "./SkeletonForm"

interface UserFormProps {
  id?: string
  type: "create" | "edit"
}

export function UserForm({ id, type }: UserFormProps) {
  const router = useRouter()
  const [createUser, { isLoading: isLoadingCreate }] = useCreateUserMutation()
  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation()
  const { data: rolesResponse, isFetching: isLoadingRoles } = useGetRolesQuery(undefined)

  const { data: detailUser, isFetching: isLoadingDetailUser } = useGetUserByIdQuery(
    id ?? "",
    {
      skip: type !== "edit",
    }
  )

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(type === "create" ? createUserSchema : updateUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      username: "",
      full_name: "",
      phone_number: "",
      address: "",
      role_id: "",
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = form

  const roleOptions = (rolesResponse?.data?.roles ?? []) as Array<{
    id: string
    name: string | null
  }>

  useEffect(() => {
    if (!detailUser) return

    reset({
      email: detailUser.email ?? "",
      password: "",
      confirm_password: "",
      username: detailUser.profiles?.username ?? "",
      full_name: detailUser.profiles?.full_name ?? "",
      phone_number: detailUser.profiles?.phone_number ?? "",
      address: detailUser.profiles?.address ?? "",
      role_id:
        detailUser.profiles?.role_id != null
          ? String(detailUser.profiles.role_id)
          : "",
    })
  }, [detailUser, reset])

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      if (type === "create") {
        await createUser(data as CreateUserFormData).unwrap()
        toast.success("User berhasil dibuat")
      }

      if (type === "edit" && id) {
        await updateUser({ id, ...(data as UpdateUserFormData) }).unwrap()
        toast.success("User berhasil diperbarui")
      }

      router.push("/dashboard/user")
    } catch (err) {
      const apiError = err as { data?: { message?: string } }
      toast.error(
        apiError?.data?.message ??
          (type === "create" ? "Gagal membuat user" : "Gagal memperbarui user")
      )
    }
  }

  if (type === "edit" && isLoadingDetailUser) {
    return <SkeletonForm />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () =>
        toast.error("Periksa field yang wajib diisi")
      )}
      className="space-y-6"
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>Email dan kredensial login user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field className="md:col-span-2">
              <FieldLabel>
                Email <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="Masukkan email user"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Password{" "}
                {type === "create" && <span className="text-red-500">*</span>}
              </FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder={
                    type === "create"
                      ? "Minimal 6 karakter"
                      : "Kosongkan jika tidak diubah"
                  }
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Konfirmasi Password</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder={
                    type === "create"
                      ? "Ulangi password"
                      : "Ulangi password baru"
                  }
                  aria-invalid={!!errors.confirm_password}
                  {...register("confirm_password")}
                />
                <FieldError errors={[errors.confirm_password]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profil User</CardTitle>
          <CardDescription>Informasi identitas dasar user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field>
              <FieldLabel>
                Username <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Masukkan username"
                  aria-invalid={!!errors.username}
                  {...register("username")}
                />
                <FieldError errors={[errors.username]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Nama Lengkap <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Masukkan nama lengkap"
                  aria-invalid={!!errors.full_name}
                  {...register("full_name")}
                />
                <FieldError errors={[errors.full_name]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Role <span className="text-red-500">*</span>
              </FieldLabel>

              <FieldContent>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                    key={field.value}
                      name={field.name}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={isLoadingRoles}
                    >
                      <SelectTrigger aria-invalid={!!errors.role_id}>
                        <SelectValue placeholder="Pilih role user" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(role => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.name ?? "-"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.role_id]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Nomor Telepon <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="08xxxxxxxxxx"
                  aria-invalid={!!errors.phone_number}
                  {...register("phone_number")}
                />
                <FieldError errors={[errors.phone_number]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Alamat <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Masukkan alamat user"
                  aria-invalid={!!errors.address}
                  {...register("address")}
                />
                <FieldError errors={[errors.address]} />
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-background pt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button
          type="submit"
          loading={isLoadingCreate || isLoadingUpdate}
          disabled={isLoadingCreate || isLoadingUpdate}
        >
          {type === "create" ? "Buat User" : "Update User"}
        </Button>
      </div>
    </form>
  )
}

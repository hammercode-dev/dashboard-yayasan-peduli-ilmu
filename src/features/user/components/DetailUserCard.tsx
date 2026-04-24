"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/format"

import { useGetUserByIdQuery } from "../user.api"

function UserInfoItem({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value && value.length > 0 ? value : "-"}</p>
    </div>
  )
}

export function DetailUserCard({ id }: { id: string }) {
  const { data: user, isFetching, isError } = useGetUserByIdQuery(id)

  if (isFetching) {
    return <p className="text-sm text-muted-foreground">Memuat detail user...</p>
  }

  if (isError || !user) {
    return (
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Gagal memuat detail user.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Informasi User</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/user/${id}/edit`}>
            <Pencil className="size-4" />
            Ubah User
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UserInfoItem label="ID User" value={user.id} />
          <UserInfoItem label="Email" value={user.email} />
          <UserInfoItem label="Username" value={user.profiles?.username} />
          <UserInfoItem label="Nama Lengkap" value={user.profiles?.full_name} />
          <UserInfoItem label="Role" value={user.profiles?.roles?.name} />
          <UserInfoItem label="Nomor Telepon" value={user.profiles?.phone_number} />
          <UserInfoItem label="Alamat" value={user.profiles?.address} />
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UserInfoItem
            label="Tanggal Dibuat"
            value={user.created_at ? formatDate(user.created_at) : "-"}
          />
          <UserInfoItem
            label="Terakhir Diperbarui"
            value={user.updated_at ? formatDate(user.updated_at) : "-"}
          />
        </div>
      </CardContent>
    </Card>
  )
}

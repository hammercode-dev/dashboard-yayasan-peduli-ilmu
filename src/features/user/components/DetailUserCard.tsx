"use client"

import Link from "next/link"
import { Pencil, User, Mail, ShieldCheck, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/format"
import { useGetUserByIdQuery } from "../user.api"
import { SkeletonDetail } from "./SkeletonDetail"

function UserInfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | null | undefined
  icon?: any
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50/50 border border-transparent hover:border-slate-200 transition-colors">
      <div className="flex items-center gap-2 text-slate-500">
        {Icon && <Icon className="size-3.5" />}
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>

      <p className=" font-semibold text-slate-900 break-words">
        {value && value.length > 0 ? value : "-"}
      </p>
    </div>
  )
}

export function DetailUserCard({ id }: { id: string }) {
  const { data: user, isFetching, isError } = useGetUserByIdQuery(id)

  if (isFetching) {
    return <SkeletonDetail />
  }

  if (isError || !user) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-base font-medium text-destructive text-center">
            Oops! Detail user tidak dapat ditemukan.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md border-slate-200 overflow-hidden">
      <CardHeader className="bg-slate-50/80 border-b flex flex-row items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full hidden sm:block">
            <User className="size-5 text-primary" />
          </div>
          <CardTitle className="text-lg md:text-xl font-bold">Informasi Detail User</CardTitle>
        </div>
        <Button asChild variant="default" size="default" className="shadow-sm shrink-0">
          <Link href={`/dashboard/user/${id}/edit`} className="gap-2">
            <Pencil className="size-4" />
            <span className="hidden sm:inline">Ubah User</span>
            <span className="sm:hidden">Ubah</span>
          </Link>
        </Button>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 space-y-8">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <UserInfoItem label="Nama Lengkap" value={user.profiles?.full_name} />
          <UserInfoItem label="Username" value={user.profiles?.username} />
          <UserInfoItem label="Email" value={user.email} />
          <UserInfoItem label="Role" value={user.profiles?.roles?.name} />
          <UserInfoItem label="Nomor Telepon" value={user.profiles?.phone_number} />
          <UserInfoItem label="ID User" value={user.id} />
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                <ShieldCheck className="size-4" /> Alamat & Lokasi
            </h4>
            <UserInfoItem label="Alamat Lengkap" value={user.profiles?.address} />
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-lg">
             <Calendar className="size-5" />
             <div>
                <p className="text-xs uppercase font-bold">Dibuat Pada</p>
                <p className="text-sm">{user.created_at ? formatDate(user.created_at) : "-"}</p>
             </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-lg">
             <Calendar className="size-5" />
             <div>
                <p className="text-xs uppercase font-bold">Pembaruan Terakhir</p>
                <p className="text-sm">{user.updated_at ? formatDate(user.updated_at) : "-"}</p>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

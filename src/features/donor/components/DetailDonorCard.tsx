"use client"

import Link from "next/link"
import { Pencil, Heart, Calendar, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { useGetDonorByIdQuery } from "../donor.api"
import { useAppSelector } from "@/store/hooks"
import { isSuperAdminRole } from "@/features/auth/roles"

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | null | undefined
  icon?: LucideIcon
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-transparent p-3 transition-colors hover:border-slate-200 bg-slate-50/50">
      <div className="flex items-center gap-2 text-slate-500">
        {Icon && <Icon className="size-3.5" />}
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="break-words font-semibold text-slate-900">
        {value && value.length > 0 ? value : "—"}
      </p>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b bg-slate-50/80 py-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-28" />
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DetailDonorCard({ id }: { id: string }) {
  const currentUserRoleCode = useAppSelector(state => state.auth.user?.roleCode)
  const canManageDonors = isSuperAdminRole(currentUserRoleCode)
  const { data: donor, isFetching, isError } = useGetDonorByIdQuery(id)

  if (isFetching) {
    return <DetailSkeleton />
  }

  if (isError || !donor) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-center text-base font-medium text-destructive">
            Detail donatur tidak dapat ditemukan.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-slate-200 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b bg-slate-50/80 py-4">
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-primary/10 p-2 sm:block">
            <Heart className="size-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-bold md:text-xl">
            Detail Donatur
          </CardTitle>
        </div>
        {canManageDonors && (
          <Button asChild variant="default" size="default" className="shrink-0 shadow-sm">
            <Link href={`/dashboard/donor/${id}/edit`} className="gap-2">
              <Pencil className="size-4" />
              <span className="hidden sm:inline">Ubah</span>
            </Link>
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-8 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem label="Nama" value={donor.name} />
          <InfoItem label="Nomor HP" value={donor.phone_number} />
          <InfoItem label="Email" value={donor.email} />
          <InfoItem label="ID Donatur" value={String(donor.id)} />
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-slate-500">
            <Calendar className="size-5" />
            <div>
              <p className="text-xs font-bold uppercase">Dibuat</p>
              <p className="text-sm">
                {donor.created_at ? formatDate(donor.created_at) : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-slate-500">
            <Calendar className="size-5" />
            <div>
              <p className="text-xs font-bold uppercase">Diperbarui</p>
              <p className="text-sm">
                {donor.updated_at ? formatDate(donor.updated_at) : "—"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

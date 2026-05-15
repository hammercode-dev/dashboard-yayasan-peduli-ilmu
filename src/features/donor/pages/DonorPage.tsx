"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks"
import { isSuperAdminRole } from "@/features/auth/roles"

import { SearchDonor } from "../components/SearchDonor"
import { DonorTable } from "../components/DonorTable"

export default function DonorPage() {
  const currentUserRoleCode = useAppSelector(state => state.auth.user?.roleCode)
  const canManageDonors = isSuperAdminRole(currentUserRoleCode)

  return (
    <section className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Daftar Donatur</h1>
        <p>Kelola data donatur: cari, tambah, ubah, dan hapus.</p>
      </div>

      <Card>
        <CardContent className="">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <SearchDonor className="md:max-w-md" />
              {canManageDonors && (
                <Button variant="default" className="ml-auto font-bold">
                  <Link href="/dashboard/donor/create">Tambah Donatur</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DonorTable />
    </section>
  )
}

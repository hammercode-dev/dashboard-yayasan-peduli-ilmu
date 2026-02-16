"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { SearchInput } from "../components/SearchInput"

import { Button } from "@/components/ui/button"
import { ProgramDonationTable } from "../components/ProgramDonationTable"
import { StatusFilter } from "../components/StatusFilter"

export default function ProgramPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Program Donasi</h1>
        <p>Berikut adalah daftar program donasi yang tersedia</p>
      </div>

      {/* <StatsCards /> */}

      <Card>
        <CardContent className="">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchInput placeholder="Cari nama program donasi..." />
              <StatusFilter />
              <Button variant="default" className="font-bold ml-auto">
                <Link href="/dashboard/program/create">
                  Tambah Program Donasi
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProgramDonationTable />
    </section>
  )
}

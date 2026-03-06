"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchInput } from "@/components/common/search-input"

import { DonationTable } from "../components/DonationTable"
import StatsCards from "../components/StatsCards"
import { BulkImportModal } from "../components/BulkImportModal"

export default function DonationPage() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  return (
    <section className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Daftar Donasi</h1>
        <p>Berikut adalah daftar donasi yang tersedia</p>
      </div>
      <StatsCards />
      <Card>
        <CardContent className="">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 ">
              <SearchInput placeholder="Cari nama donatur..." />

              <Button
                variant="outline"
                className="font-bold hover:cursor-pointer"
                onClick={() => setIsImportModalOpen(true)}
              >
                Impor CSV
              </Button>

              <Button variant="default" className="font-bold ml-auto">
                <Link href="/dashboard/donation/create">Tambah Donasi</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DonationTable />

      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </section>
  )
}

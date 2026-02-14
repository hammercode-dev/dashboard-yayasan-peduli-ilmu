import { Card, CardContent } from "@/components/ui/card"
import { SearchInput } from "../components/SearchInput"

import { DonationTable } from "../components/DonationTable"
import { Suspense } from "react"
import { DonationTableSkeleton } from "../components/TableSkeleton"
import { Button } from "@/components/ui/button"
import { Pagination } from "../components/Pagination"
import StatsCards from "../components/StatsCards"
import { StatusFilter } from "../components/StatusFilter"

export default async function ProgramPage({
  query,
  currentPage,
  totalData,
  status,
}: {
  query?: string
  currentPage?: number
  totalData?: number
  status?: string
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Program Donasi
            </h1>
          </div>
        </div>

        <StatsCards />

        {/* Filters Section */}
        <Card className="mb-6">
          <CardContent className="">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <SearchInput placeholder="Cari nama program donasi..." />
                <StatusFilter query={query} />
                <Button variant="default" className="ml-auto font-bold">
                  Tambah Program Donasi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Suspense fallback={<DonationTableSkeleton />}>
            <DonationTable
              query={query || ""}
              currentPage={currentPage || 1}
              status={status}
            />
          </Suspense>

          <Pagination totalData={totalData || 1} />
        </div>
      </div>
    </div>
  )
}

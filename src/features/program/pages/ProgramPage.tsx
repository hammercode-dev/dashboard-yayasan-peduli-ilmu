"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { SearchInput } from "../components/SearchInput"

import { DonationTable } from "../components/DonationTable"
import { Suspense } from "react"
import { DonationTableSkeleton } from "../components/TableSkeleton"
import { Button } from "@/components/ui/button"
import { Pagination } from "../components/Pagination"
import StatsCards from "../components/StatsCards"
import { StatusFilter } from "../components/StatusFilter"
import { useQueryParams } from "@/hooks/use-query-params"
import { useGetProgramDonationsQuery } from "../program.api"

export default function ProgramPage() {
  const { getParam, getNumberParam } = useQueryParams()
  const queryParam = getParam("query")
  const pageParam = getNumberParam("page", 1)
  const statusParam = getParam("status", "all")

  const { data, isLoading } = useGetProgramDonationsQuery({
    query: queryParam,
    page: pageParam,
    status: statusParam,
  })

  console.log("data", data)
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Program Donasi</h1>
        <p>Berikut adalah daftar program donasi yang tersedia</p>
      </div>

      {/* <StatsCards /> */}

      {/* Filters Section */}
      <Card>
        <CardContent className="">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchInput placeholder="Cari nama program donasi..." />
              {/* <StatusFilter query={query} /> */}
              <Button variant="default" className="font-bold ml-auto">
                <Link href="/dashboard/program/create">
                  Tambah Program Donasi
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {/* <Suspense fallback={<DonationTableSkeleton />}> */}
        <DonationTable
          query={queryParam || ""}
          currentPage={pageParam || 1}
          status={statusParam}
        />
        {/* </Suspense> */}

        {/* <Pagination totalData={totalData || 1} /> */}
      </div>
    </section>
  )
}

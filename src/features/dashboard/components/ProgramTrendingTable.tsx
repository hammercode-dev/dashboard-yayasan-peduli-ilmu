"use client"

import { DataTable } from "@/components/common/data-table"

import { useGetProgramTrendingsQuery } from "../dashboard.api"

import { getProgramTrendingColumns } from "../columns/trending-columns"

export function ProgramTrendingTable() {
  const { data, isFetching } = useGetProgramTrendingsQuery({})

  const columns = getProgramTrendingColumns()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">5 Program Terpopuler</h2>
      <DataTable
        columns={columns}
        data={data?.trendings || []}
        isLoading={isFetching}
      />
    </div>
  )
}

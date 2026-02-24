"use client"

import { useState, useMemo } from "react"

import { useQueryParams } from "@/hooks/use-query-params"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DataTable } from "@/components/common/data-table"

import { useGetDonationEvidencesQuery } from "../donation.api"
import { getDonationColumns } from "../columns/donation-columns"

export function DonationTable() {
  const { getParam, getNumberParam } = useQueryParams()
  const query = getParam("query")
  const page = getNumberParam("page", 1)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)

  const { data, isFetching } = useGetDonationEvidencesQuery({
    query,
    page,
  })

  const columns = useMemo(
    () =>
      getDonationColumns({
        onDelete: (id, title) => setDeleteTarget({ id, title }),
      }),
    []
  )

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data?.data.donations || []}
          isLoading={isFetching}
        />
      </div>
    </TooltipProvider>
  )
}

"use client"

import { useMemo } from "react"

import { useQueryParams } from "@/hooks/use-query-params"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DataTable } from "@/components/common/data-table"
import { Pagination } from "@/components/common/pagination"

import { useGetUsersQuery } from "../user.api"

import { getUserColumns } from "../columns/user-columns"

export function UserTable() {
  const { getParam, getNumberParam } = useQueryParams()
  const query = getParam("query")
  const page = getNumberParam("page", 1)

  const { data, isFetching } = useGetUsersQuery({
    query,
    page,
  })
  const totalPages = data?.meta?.totalPages ?? 0

  const columns = useMemo(() => getUserColumns({}), [])

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data?.data.users || []}
          isLoading={isFetching}
        />
        <Pagination totalPages={totalPages} />
      </div>
    </TooltipProvider>
  )
}

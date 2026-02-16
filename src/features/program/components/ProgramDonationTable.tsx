"use client"

import { useMemo, useState } from "react"
import { useQueryParams } from "@/hooks/use-query-params"
import { useGetProgramDonationsQuery } from "../program.api"
import { DataTable } from "@/components/common/data-table"
import { Pagination } from "@/components/common/pagination"
import { getProgramDonationColumns } from "../columns/program-donation-columns"
import type { ProgramDonationRow } from "../columns/program-donation-columns"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { DeleteSuccessDialog } from "./DeleteSuccessDialog"
import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"
import { FolderX } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DonationTableSkeleton } from "./TableSkeleton"

export function ProgramDonationTable() {
  const { getParam, getNumberParam } = useQueryParams()
  const query = getParam("query")
  const page = getNumberParam("page", 1)
  const status = getParam("status", "all")

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastDeletedTitle, setLastDeletedTitle] = useState("")

  const { data, isFetching } = useGetProgramDonationsQuery({
    query,
    page,
    status: status || "all",
  })

  const donations: ProgramDonationRow[] = useMemo(() => {
    const raw = data?.data?.donations ?? []
    return raw.map((d: Record<string, unknown>) => ({
      id: String(d.id),
      title: String(d.title),
      collected_amount: Number(d.collected_amount) ?? 0,
      target_amount: Number(d.target_amount) ?? 0,
      starts_at: d.starts_at != null ? String(d.starts_at) : "",
      ends_at: d.ends_at != null ? String(d.ends_at) : "",
      status: (d.status as ProgramDonationRow["status"]) ?? "draft",
      created_at: d.created_at != null ? String(d.created_at) : "",
    }))
  }, [data?.data?.donations])

  const totalPages = data?.meta?.totalPages ?? 0
  const columns = useMemo(
    () =>
      getProgramDonationColumns({
        onDelete: (id, title) => setDeleteTarget({ id, title }),
      }),
    []
  )

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(
        `/api/program/program-donation/${deleteTarget.id}`,
        { method: "DELETE" }
      )
      if (res.ok) {
        setLastDeletedTitle(deleteTarget.title)
        setShowSuccess(true)
      }
      setDeleteTarget(null)
    } catch {
      setDeleteTarget(null)
    }
  }

  console.log("ini data", data)

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable columns={columns} data={donations} isLoading={isFetching} />
        <Pagination totalPages={totalPages} />
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        title={deleteTarget?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <DeleteSuccessDialog
        open={showSuccess}
        title={lastDeletedTitle}
        onClose={() => setShowSuccess(false)}
      />
    </TooltipProvider>
  )
}

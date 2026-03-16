"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useQueryParams } from "@/hooks/use-query-params"

import {
  useDeleteProgramDonationMutation,
  useGetProgramDonationsQuery,
} from "../program.api"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DataTable } from "@/components/common/data-table"
import { Pagination } from "@/components/common/pagination"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { CustomAlertDialog } from "@/components/common/custom-alert-dialog"

import { getProgramDonationColumns } from "../columns/program-donation-columns"
import type { ProgramDonationRow } from "../columns/program-donation-columns"

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
  const [deleteProgramDonation, { isLoading: isDeleting }] =
    useDeleteProgramDonationMutation()

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
      await deleteProgramDonation(deleteTarget.id).unwrap()
      setLastDeletedTitle(deleteTarget.title)
      setShowSuccess(true)
    } catch (err) {
      const apiError = err as {
        status?: number
        data?: { message?: string; errors?: unknown }
      }
      const message = apiError?.data?.message
      toast.error(message)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable columns={columns} data={donations} isLoading={isFetching} />
        <Pagination totalPages={totalPages} />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
        title="Konfirmasi Hapus"
        confirmText="Hapus"
        description={
          <>
            Apakah Anda yakin ingin menghapus program{" "}
            <span className="font-semibold">{deleteTarget?.title}</span> ?
            Tindakan ini tidak dapat dibatalkan.
          </>
        }
      />

      <CustomAlertDialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Data Terhapus"
        description={
          <>
            Program <span className="font-semibold">{lastDeletedTitle}</span>{" "}
            telah berhasil dihapus.
          </>
        }
      />
    </TooltipProvider>
  )
}

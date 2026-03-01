"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"

import { useQueryParams } from "@/hooks/use-query-params"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DataTable } from "@/components/common/data-table"
import { Pagination } from "@/components/common/pagination"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { CustomAlertDialog } from "@/components/common/custom-alert-dialog"

import {
  useDeleteDonationEvidenceMutation,
  useGetDonationEvidencesQuery,
} from "../donation.api"

import { getDonationColumns } from "../columns/donation-columns"

export function DonationTable() {
  const { getParam, getNumberParam } = useQueryParams()
  const query = getParam("query")
  const page = getNumberParam("page", 1)

  const [showSuccess, setShowSuccess] = useState(false)
  const [lastDeletedDonation, setLastDeletedDonation] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)

  const [deleteProgramDonation, { isLoading: isDeleting }] =
    useDeleteDonationEvidenceMutation()

  const { data, isFetching } = useGetDonationEvidencesQuery({
    query,
    page,
  })
  const totalPages = data?.meta?.totalPages ?? 0

  const columns = useMemo(
    () =>
      getDonationColumns({
        onDelete: (id, title) => setDeleteTarget({ id, title }),
      }),
    []
  )

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteProgramDonation(deleteTarget.id).unwrap()
      setLastDeletedDonation(deleteTarget.title)
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
        <DataTable
          columns={columns}
          data={data?.data.donations || []}
          isLoading={isFetching}
        />
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
            Apakah Anda yakin ingin menghapus donasi dari{" "}
            <span className="font-semibold">{deleteTarget?.title}</span>?
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
            Data donasi dari{" "}
            <span className="font-semibold">{lastDeletedDonation}</span> telah
            berhasil dihapus.
          </>
        }
      />
    </TooltipProvider>
  )
}

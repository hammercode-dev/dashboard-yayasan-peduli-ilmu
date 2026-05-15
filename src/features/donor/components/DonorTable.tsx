"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"

import { useQueryParams } from "@/hooks/use-query-params"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { CustomAlertDialog } from "@/components/common/custom-alert-dialog"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DataTable } from "@/components/common/data-table"
import { Pagination } from "@/components/common/pagination"

import { useDeleteDonorMutation, useGetDonorsQuery } from "../donor.api"
import { useAppSelector } from "@/store/hooks"
import { isSuperAdminRole } from "@/features/auth/roles"

import { getDonorColumns } from "../columns/donor-columns"
import { TOTAL_DONORS_PER_PAGE } from "@/constants/data"

export function DonorTable() {
  const currentUserRoleCode = useAppSelector(state => state.auth.user?.roleCode)
  const canManageDonors = isSuperAdminRole(currentUserRoleCode)
  const { getParam, getNumberParam } = useQueryParams()
  const query = getParam("query")
  const page = getNumberParam("page", 1)
  const limit = getNumberParam("limit", TOTAL_DONORS_PER_PAGE)

  const [showSuccess, setShowSuccess] = useState(false)
  const [lastDeletedName, setLastDeletedName] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  const { data, isFetching } = useGetDonorsQuery({
    query,
    page,
    limit,
  })
  const totalPages = data?.meta?.totalPages ?? 0

  const [deleteDonor, { isLoading: isDeleting }] = useDeleteDonorMutation()

  const columns = useMemo(
    () =>
      getDonorColumns({
        canManageDonors,
        onDelete: (id, name) => setDeleteTarget({ id, name }),
      }),
    [canManageDonors]
  )

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteDonor(deleteTarget.id).unwrap()
      setLastDeletedName(deleteTarget.name)
      setShowSuccess(true)
    } catch (err) {
      const apiError = err as {
        status?: number
        data?: { message?: string }
      }
      const message = apiError?.data?.message
      toast.error(message ?? "Gagal menghapus donatur")
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data?.data.donors || []}
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
            Apakah Anda yakin ingin menghapus donatur{" "}
            <span className="font-semibold">{deleteTarget?.name}</span>? Tindakan
            ini tidak dapat dibatalkan.
          </>
        }
      />

      <CustomAlertDialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Data Terhapus"
        description={
          <>
            Donatur <span className="font-semibold">{lastDeletedName}</span> telah
            berhasil dihapus.
          </>
        }
      />
    </TooltipProvider>
  )
}

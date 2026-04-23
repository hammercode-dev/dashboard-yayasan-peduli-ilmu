"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"

import { useQueryParams } from "@/hooks/use-query-params"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { CustomAlertDialog } from "@/components/common/custom-alert-dialog"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DataTable } from "@/components/common/data-table"
import { Pagination } from "@/components/common/pagination"

import { useDeleteUserMutation, useGetUsersQuery } from "../user.api"

import { getUserColumns } from "../columns/user-columns"

export function UserTable() {
  const { getParam, getNumberParam } = useQueryParams()
  const query = getParam("query")
  const page = getNumberParam("page", 1)

  const [showSuccess, setShowSuccess] = useState(false)
  const [lastDeletedUser, setLastDeletedUser] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  const { data, isFetching } = useGetUsersQuery({
    query,
    page,
  })
  const totalPages = data?.meta?.totalPages ?? 0

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const columns = useMemo(
    () =>
      getUserColumns({
        onDelete: (id, name) => setDeleteTarget({ id, name }),
      }),
    []
  )

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteUser(deleteTarget.id).unwrap()
      setLastDeletedUser(deleteTarget.name)
      setShowSuccess(true)
    } catch (err) {
      const apiError = err as {
        status?: number
        data?: { message?: string; errors?: unknown }
      }
      const message = apiError?.data?.message
      toast.error(message ?? "Gagal menghapus user")
    } finally {
      setDeleteTarget(null)
    }
  }

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
            Apakah Anda yakin ingin menghapus user{" "}
            <span className="font-semibold">{deleteTarget?.name}</span>?
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
            User <span className="font-semibold">{lastDeletedUser}</span> telah
            berhasil dihapus.
          </>
        }
      />
    </TooltipProvider>
  )
}

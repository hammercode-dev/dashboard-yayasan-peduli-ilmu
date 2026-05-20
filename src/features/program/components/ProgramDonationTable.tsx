"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useQueryParams } from "@/hooks/use-query-params"

import {
  useDeleteProgramDonationMutation,
  useGetProgramDonationsQuery,
} from "../program.api"

import { Pagination } from "@/components/common/pagination"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { CustomAlertDialog } from "@/components/common/custom-alert-dialog"
import { ProgramDonationAccordionTable } from "./ProgramDonationAccordionTable"
import type { ProgramDonationListItem } from "../types/programDonation"
import type { DonationStatus } from "../types/programDonation"

function mapChildRow(
  child: Record<string, unknown>
): ProgramDonationListItem {
  return {
    id: String(child.id),
    title: String(child.title),
    collected_amount: Number(child.collected_amount) ?? 0,
    target_amount: Number(child.target_amount) ?? 0,
    starts_at: child.starts_at != null ? String(child.starts_at) : "",
    ends_at: child.ends_at != null ? String(child.ends_at) : "",
    status: (child.status as DonationStatus) ?? "draft",
    created_at: child.created_at != null ? String(child.created_at) : "",
    parent_id:
      child.parent_id != null ? String(child.parent_id) : null,
  }
}

function mapParentRow(d: Record<string, unknown>): ProgramDonationListItem {
  const childrenRaw = (d.children as Record<string, unknown>[]) ?? []
  const countObj = d._count as { children?: number } | undefined

  return {
    id: String(d.id),
    title: String(d.title),
    collected_amount: Number(d.collected_amount) ?? 0,
    target_amount: Number(d.target_amount) ?? 0,
    starts_at: d.starts_at != null ? String(d.starts_at) : "",
    ends_at: d.ends_at != null ? String(d.ends_at) : "",
    status: (d.status as DonationStatus) ?? "draft",
    created_at: d.created_at != null ? String(d.created_at) : "",
    parent_id: null,
    children: childrenRaw.map(mapChildRow),
    childrenCount: countObj?.children ?? childrenRaw.length,
  }
}

export function ProgramDonationTable() {
  const { getParam, getNumberParam } = useQueryParams()
  const query = getParam("query")
  const page = getNumberParam("page", 1)
  const limit = getNumberParam("limit", 10)
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
    limit,
    status,
  })
  const [deleteProgramDonation, { isLoading: isDeleting }] =
    useDeleteProgramDonationMutation()

  const parents: ProgramDonationListItem[] = useMemo(() => {
    const raw = data?.data?.donations ?? []
    return raw.map((d: Record<string, unknown>) => mapParentRow(d))
  }, [data?.data?.donations])

  const totalPages = data?.meta?.totalPages ?? 0

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
      toast.error(message ?? "Gagal menghapus program")
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-4">
      <ProgramDonationAccordionTable
        parents={parents}
        isLoading={isFetching}
        onDelete={(id, title) => setDeleteTarget({ id, title })}
      />
      <Pagination totalPages={totalPages} />

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
    </div>
  )
}

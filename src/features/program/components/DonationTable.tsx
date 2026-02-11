"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getDaysRemaining,
  formatDateRange,
  formatDate,
  formatRupiahCompact,
} from "@/lib/format"
import { StatusBadge } from "./StatusBadge"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { DeleteSuccessDialog } from "./DeleteSuccessDialog"
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  FolderX,
  FolderMinus,
} from "lucide-react"
import { Donation, DonationStatus } from "../types/programDonation"

interface DonationTableProps {
  query?: string
  currentPage?: number
  status?: string
}

export function DonationTable({
  query = "",
  currentPage = 1,
  status = "all",
}: DonationTableProps) {
  const [data, setData] = useState<Donation[]>([])

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastDeletedTitle, setLastDeletedTitle] = useState("")

  useEffect(() => {
    fetch(
      `/api/donations?query=${encodeURIComponent(query)}&page=${currentPage}&status=${status}`
    )
      .then(res => {
        if (!res.ok) throw new Error("Failed fetch")
        return res.json()
      })
      .then(result => {
        setData(result.data ?? [])
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setData([])
      })
  }, [query, currentPage, status])

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    try {
      const response = await fetch(`/api/donations?id=${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLastDeletedTitle(deleteTarget.title)
        setData(prev =>
          prev.filter(item => item.id.toString() !== deleteTarget.id)
        )
        setShowSuccess(true)
        console.log("Post deleted!")
      } else {
        console.error("Failed to delete post")
      }

      setDeleteTarget(null)
    } catch (error) {
      console.error(error)
      alert("Gagal menghapus data")
    } finally {
      setDeleteTarget(null)
    }
  }

  const columns: { key: string; label: string }[] = [
    { key: "title", label: "Nama Program" },
    { key: "progress", label: "Progress" },
    { key: "schedule", label: "Pelaksanaan" },
    { key: "status", label: "Status" },
    { key: "created", label: "Tanggal Dibuat" },
    { key: "actions", label: "Aksi" },
  ]

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.key}>
                  <div>{column.label}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-40 text-center text-muted-foreground"
                >
                  <FolderX className="m-auto mb-2 h-8 w-8" />
                  <p className="text-lg">Data tidak ditemukan.</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map(donation => {
                const collected = Number(donation.collected_amount) || 0
                const target = Number(donation.target_amount) || 0
                const pct =
                  target > 0 ? Math.min((collected / target) * 100, 100) : 0

                const daysLeft = getDaysRemaining(
                  donation.ends_at,
                  donation.starts_at
                )
                const scheduleLabel = formatDateRange(
                  donation.starts_at?.toString() ?? null,
                  donation.ends_at?.toString() ?? null
                )

                return (
                  <TableRow
                    key={donation.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {donation.title}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="space-y-1 min-w-30">
                        <div className="flex justify-between text-sm">
                          <span>{formatRupiahCompact(collected)}</span>
                          <span className="text-xs text-red-500">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          dari {formatRupiahCompact(target)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{scheduleLabel}</div>

                        <div className="text-xs text-muted-foreground mt-1">
                          {daysLeft !== null && daysLeft !== undefined && (
                            <span>({daysLeft})</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={donation.status as DonationStatus} />
                    </TableCell>
                    <TableCell>
                      {formatDate(donation.created_at.toString())}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Buka menu aksi</span>
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Aksi</p>
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                          // onClick={() => handleView(donation)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          // onClick={() => handleEdit(donation)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteTarget({
                                id: donation.id.toString(),
                                title: donation.title,
                              })
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
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

"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import {
  getDaysRemaining,
  formatDateRange,
  formatDate,
  formatRupiahCompact,
} from "@/lib/format"
import { StatusBadge } from "../components/StatusBadge"
import type { DonationStatus } from "../types/programDonation"
import Link from "next/link"

export type ProgramDonationRow = {
  id: string
  title: string
  collected_amount: number
  target_amount: number
  starts_at: string
  ends_at: string
  status: DonationStatus
  created_at: string
}

export function getProgramDonationColumns(options: {
  onDelete?: (id: string, title: string) => void
}): ColumnDef<ProgramDonationRow>[] {
  return [
    {
      accessorKey: "title",
      header: "Nama Program",
      cell: ({ row }) => (
        <span className="font-bold">{row.original.title}</span>
      ),
    },
    {
      id: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const collected = Number(row.original.collected_amount) || 0
        const target = Number(row.original.target_amount) || 0
        const pct = target > 0 ? Math.min((collected / target) * 100, 100) : 0
        return (
          <div className="space-y-1 min-w-[120px]">
            <div className="flex justify-between text-sm">
              <span>{formatRupiahCompact(collected)}</span>
              <span className="text-xs text-red-500">{pct.toFixed(0)}%</span>
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
        )
      },
    },
    {
      id: "schedule",
      header: "Pelaksanaan",
      cell: ({ row }) => {
        const daysLeft = getDaysRemaining(
          row.original.ends_at,
          row.original.starts_at
        )
        const scheduleLabel = formatDateRange(
          row.original.starts_at ?? null,
          row.original.ends_at ?? null
        )
        return (
          <div>
            <div>{scheduleLabel}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {daysLeft != null && <span>({daysLeft})</span>}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status as DonationStatus} />
      ),
    },
    {
      id: "created_at",
      header: "Tanggal Dibuat",
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
            <Link href={`/dashboard/program/${row.original.id}`}>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/program/${row.original.id}/edit`}>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Ubah
              </DropdownMenuItem>
            </Link>
            {options.onDelete && (
              <DropdownMenuItem
                onClick={() =>
                  options?.onDelete?.(row.original.id, row.original.title)
                }
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}

"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
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
import { Eye, Trash2, MoreHorizontal } from "lucide-react"
import { formatDate, formatRupiah } from "@/lib/format"

export type DonationEvidenceRow = {
  id: string
  full_name: string
  phone_number: string
  payment_method: string
  amount: number
  evidence_url?: string | null
  description?: string | null
  created_at: string
  program_donation?: {
    id: string
    title: string
  } | null
}

export function getDonationColumns(options: {
  onDelete?: (id: string, name: string) => void
}): ColumnDef<DonationEvidenceRow>[] {
  return [
    {
      accessorKey: "full_name",
      header: "Nama Lengkap Donatur",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.full_name}</span>
      ),
    },

    {
      accessorKey: "amount",
      header: "Jumlah Donasi",
      cell: ({ row }) => formatRupiah(Number(row.original.amount)),
    },
    {
      accessorKey: "payment_method",
      header: "Metode Pembayaran",
    },
    {
      id: "program_title",
      header: "Program Donasi",
      cell: ({ row }) => {
        return row.original.program_donation?.title ?? "-"
      },
    },
    {
      accessorKey: "phone_number",
      header: "No HP",
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Donasi",
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
            {row.original.evidence_url && (
              <Link href={row.original.evidence_url} target="_blank">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Bukti
                </DropdownMenuItem>
              </Link>
            )}

            {options.onDelete && (
              <DropdownMenuItem
                onClick={() =>
                  options.onDelete?.(row.original.id, row.original.full_name)
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

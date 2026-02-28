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
import { BankBadge } from "../components/BankBadge"

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
      header: "Donatur",
      cell: ({ row }) => (
        <div>
          <div className="font-bold">{row.original.full_name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span>{row.original.phone_number}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Jumlah Donasi",
      cell: ({ row }) => {
        return (
          <span className="font-bold ">
            {formatRupiah(row.original.amount)}
          </span>
        )
      },
    },
    {
      accessorKey: "payment_method",
      header: "Metode Pembayaran",
      cell: ({ row }) => {
        return (
          <div className="">
            <BankBadge channel={row.original.payment_method} className="" />
          </div>
        )
      },
    },
    {
      id: "program_title",
      header: "Program Donasi",
      cell: ({ row }) => {
        return (
          <div>
            <Link
              href={`/dashboard/program/${row.original.program_donation?.id}`}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 font-medium transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-muted"
            >
              {row.original.program_donation?.title ?? "-"}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Donasi",
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground">
            {formatDate(row.original.created_at)}
          </div>
        )
      },
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
            <Link href={`/dashboard/donation/${row.original.id}`}>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
            </Link>

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

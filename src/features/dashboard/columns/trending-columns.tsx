"use client"

import Link from "next/link"
import { Eye } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { formatRupiahCompact } from "@/lib/format"

import { Button } from "@/components/ui/button"

export type ProgramDonationRow = {
  id: string
  title: string
  collected_amount: number
  target_amount: number
  total_donatur: number
  starts_at: string | null
  ends_at: string | null
}

export function getProgramTrendingColumns(): ColumnDef<ProgramDonationRow>[] {
  return [
    {
      accessorKey: "title",
      header: "Nama Program",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      id: "goal_progress",
      header: "Goal Progress",
      cell: ({ row }) => {
        const collected = Number(row.original.collected_amount) || 0
        const target = Number(row.original.target_amount) || 0
        const pct = target > 0 ? Math.min((collected / target) * 100, 100) : 0
        return (
          <div className="space-y-1 min-w-[120px]">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {formatRupiahCompact(collected)} dari{" "}
              {formatRupiahCompact(target)}
            </div>
          </div>
        )
      },
    },
    {
      id: "progress_percent",
      header: "Progress",
      cell: ({ row }) => {
        const collected = Number(row.original.collected_amount) || 0
        const target = Number(row.original.target_amount) || 0
        const pct = target > 0 ? Math.min((collected / target) * 100, 100) : 0

        const getVariant = () => {
          if (pct <= 33) return "bg-red-100 text-red-700 border-red-200"
          if (pct <= 66)
            return "bg-yellow-100 text-yellow-700 border-yellow-200"
          return "bg-green-100 text-green-700 border-green-200"
        }

        return (
          <div
            className={`items-center w-fit px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getVariant()}`}
          >
            {pct.toFixed(0)}%
          </div>
        )
      },
    },
    {
      accessorKey: "total_donatur",
      header: "Total Donatur",
      cell: ({ row }) =>
        `${row.original.total_donatur ? row.original.total_donatur + " Orang" : "-"} `,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <Link href={`/dashboard/program/${row.original.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 hover:cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span className="">Lihat Detail</span>
          </Button>
        </Link>
      ),
    },
  ]
}

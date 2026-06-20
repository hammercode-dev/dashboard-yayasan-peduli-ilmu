"use client"

import Link from "next/link"
import {
  Eye,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { formatRupiahCompact } from "@/lib/format"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ProgramDonationChildRow = {
  id: string
  title: string
  collected_amount: number
  target_amount: number
  total_donatur: number
  status: string | null
}

export type ProgramDonationRow = {
  id: string
  title: string
  collected_amount: number
  target_amount: number
  total_donatur: number
  starts_at: string | null
  ends_at: string | null
  children: ProgramDonationChildRow[]
}

function ProgressCell({
  collected,
  target,
}: {
  collected: number
  target: number
}) {
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
}

export function getProgramTrendingColumns(): ColumnDef<ProgramDonationRow>[] {
  return [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) => {
        const hasChildren = row.original.children && row.original.children.length > 0
        if (!hasChildren) {
          return <span className="inline-block w-8" />
        }
        return (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              row.toggleExpanded()
            }}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Nama Program",
      cell: ({ row }) => (
        <span className={cn(
          "font-medium",
          row.getIsExpanded() && "font-bold"
        )}>
          {row.original.title}
        </span>
      ),
    },
    {
      id: "goal_progress",
      header: "Goal Progress",
      cell: ({ row }) => {
        const collected = Number(row.original.collected_amount) || 0
        const target = Number(row.original.target_amount) || 0
        return <ProgressCell collected={collected} target={target} />
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

export function getProgramTrendingChildColumns(): ColumnDef<ProgramDonationChildRow>[] {
  return [
    {
      id: "expander",
      header: () => null,
      cell: () => <span className="inline-block w-8" />,
    },
    {
      accessorKey: "title",
      header: "Nama Program",
      cell: ({ row }) => (
        <span className="font-medium text-sm text-muted-foreground">
          {row.original.title}
        </span>
      ),
    },
    {
      id: "goal_progress",
      header: "Goal Progress",
      cell: ({ row }) => {
        const collected = Number(row.original.collected_amount) || 0
        const target = Number(row.original.target_amount) || 0
        return <ProgressCell collected={collected} target={target} />
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

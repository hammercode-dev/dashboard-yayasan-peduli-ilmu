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

  const columns: { key: string; label: string }[] = [
    { key: "title", label: "Nama Program" },
    { key: "progress", label: "Progress" },
    { key: "schedule", label: "Pelaksanaan" },
    { key: "status", label: "Status" },
    { key: "created", label: "Tanggal Dibuat" },
    { key: "actions", label: "Aksi" },
  ]

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.key} className="text-center">
                <div>{column.label}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                Data tidak ditemukan.
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
                        {daysLeft && <span>({daysLeft})</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={donation.status as DonationStatus} />
                  </TableCell>
                  <TableCell>
                    {formatDate(donation.created_at.toString())}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  Eye,
  FolderX,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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

import { ProgramTypeBadge } from "./ProgramTypeBadge"
import { StatusBadge } from "./StatusBadge"
import type { ProgramDonationListItem } from "../types/programDonation"
import type { DonationStatus } from "../types/programDonation"
import {
  formatDate,
  formatDateRange,
  formatRupiahCompact,
  getDaysRemaining,
} from "@/lib/format"
import { cn } from "@/lib/utils"

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

function ActionsMenu({
  id,
  title,
  onDelete,
}: {
  id: string
  title: string
  onDelete?: (id: string, title: string) => void
}) {
  return (
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
        <Link href={`/dashboard/program/${id}`}>
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            Lihat Detail
          </DropdownMenuItem>
        </Link>
        <Link href={`/dashboard/program/${id}/edit`}>
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Ubah
          </DropdownMenuItem>
        </Link>
        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(id, title)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ProgramRow({
  row,
  isChild = false,
  childrenCount = 0,
  isExpanded = false,
  onToggle,
  onDelete,
}: {
  row: ProgramDonationListItem
  isChild?: boolean
  childrenCount?: number
  isExpanded?: boolean
  onToggle?: () => void
  onDelete?: (id: string, title: string) => void
}) {
  const daysLeft = getDaysRemaining(row.ends_at, row.starts_at)
  const scheduleLabel = formatDateRange(
    row.starts_at ?? null,
    row.ends_at ?? null
  )
  const hasChildren = !isChild && childrenCount > 0
  console.log("ini rowwww", row)
  return (
    <TableRow
      className={cn(
        isChild && "bg-muted/30",
        !isChild && hasChildren && "cursor-pointer hover:bg-muted/20"
      )}
      onClick={!isChild && hasChildren ? onToggle : undefined}
    >
      <TableCell className="w-10">
        {!isChild && hasChildren ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={e => {
              e.stopPropagation()
              onToggle?.()
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <span className="inline-block w-8" />
        )}
      </TableCell>
      <TableCell>
        <div className={cn("flex flex-col gap-1")}>
          <span className={cn("font-bold", isChild && "font-medium text-sm")}>
            {row.title}
          </span>
        </div>
      </TableCell>
      {/* <TableCell>
        <ProgramTypeBadge type={isChild ? "child" : "parent"} />
      </TableCell> */}
      <TableCell>
        <ProgressCell
          collected={Number(row.collected_amount) || 0}
          target={Number(row.target_amount) || 0}
        />
      </TableCell>
      <TableCell>
        <div>
          <div>{scheduleLabel}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {daysLeft != null && <span>({daysLeft})</span>}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={row.status as DonationStatus} />
      </TableCell>
      <TableCell>{formatDate(row.created_at)}</TableCell>
      <TableCell onClick={e => e.stopPropagation()}>
        <ActionsMenu id={row.id} title={row.title} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  )
}

interface ProgramDonationAccordionTableProps {
  parents: ProgramDonationListItem[]
  isLoading?: boolean
  onDelete?: (id: string, title: string) => void
}

export function ProgramDonationAccordionTable({
  parents,
  isLoading,
  onDelete,
}: ProgramDonationAccordionTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead className="min-w-24">Nama Program</TableHead>
              {/* <TableHead className="w-40">Tipe</TableHead> */}
              <TableHead>Progress</TableHead>
              <TableHead>Pelaksanaan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : parents.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FolderX className="h-8 w-8" />
                    <p>Tidak ada program donasi.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {parents.map(parent => {
                const childrenCount =
                  parent.childrenCount ?? parent.children?.length ?? 0
                const isExpanded = expandedIds.has(parent.id)

                return (
                  <Fragment key={parent.id}>
                    <ProgramRow
                      row={parent}
                      childrenCount={childrenCount}
                      isExpanded={isExpanded}
                      onToggle={() => toggleExpanded(parent.id)}
                      onDelete={onDelete}
                    />
                    {isExpanded &&
                      parent.children?.map(child => (
                        <ProgramRow
                          key={child.id}
                          row={child}
                          isChild
                          onDelete={onDelete}
                        />
                      ))}
                  </Fragment>
                )
              })}
            </TableBody>
          )}
        </Table>
      </div>
    </TooltipProvider>
  )
}

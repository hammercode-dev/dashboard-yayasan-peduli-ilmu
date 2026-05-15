"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Trash2, Pencil, Eye, Heart, MoreHorizontal } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/format"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type DonorRow = {
  id: string
  name: string
  phone_number: string
  email: string | null
  created_at: string
  updated_at: string | null
}

export function getDonorColumns(options: {
  canManageDonors: boolean
  onDelete?: (id: string, name: string) => void
}): ColumnDef<DonorRow>[] {
  return [
    {
      accessorKey: "donor",
      header: "Donatur",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarFallback className="bg-primary/5 text-primary font-bold">
              {row.original.name?.charAt(0) || <Heart className="size-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.original.name}</span>
            <span className="text-xs text-slate-500">{row.original.phone_number}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{row.original.email ?? "—"}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Terdaftar",
      cell: ({ row }) => (
        <span className="text-sm font-medium">{formatDate(row.original.created_at)}</span>
      ),
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
            <Link href={`/dashboard/donor/${row.original.id}`}>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
            </Link>
            {options.canManageDonors && (
              <Link href={`/dashboard/donor/${row.original.id}/edit`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Ubah
                </DropdownMenuItem>
              </Link>
            )}
            {options.canManageDonors && options.onDelete && (
              <DropdownMenuItem
                onClick={() =>
                  options.onDelete?.(row.original.id, row.original.name)
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

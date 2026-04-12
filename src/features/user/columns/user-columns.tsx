"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Trash2, MoreHorizontal, Pencil } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { formatDate } from "@/lib/format"

export type UserRow = {
  id: string
  email: string
  created_at: string
  updated_at: string
  profiles?: {
    address: string
    avatar_url: string
    full_name: string
    username: string
    phone_number: string
    roles?: {
      name: string
    } | null
  } | null
}

export function getUserColumns(options: {
  onDelete?: (id: string, name: string) => void
}): ColumnDef<UserRow>[] {
  return [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => (
        <div>
          <div className="font-bold">{row.original?.profiles?.full_name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span>{row.original.profiles?.roles?.name ?? "-"}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: ({ row }) => {
        return <span className=" ">{row.original.email ?? "-"}</span>
      },
    },

    {
      id: "phone_number",
      header: "Telepon",
      cell: ({ row }) => {
        return (
          <span className=" ">
            {row.original.profiles?.phone_number ?? "-"}
          </span>
        )
      },
    },

    {
      accessorKey: "address",
      header: "Alamat",
      cell: ({ row }) => {
        return (
          <span className=" ">{row.original.profiles?.address ?? "-"}</span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Dibuat",
      cell: ({ row }) => {
        return <span className=" ">{formatDate(row.original.created_at)}</span>
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

            <Link href={`/dashboard/donation/${row.original.id}/edit`}>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Ubah
              </DropdownMenuItem>
            </Link>

            {options.onDelete && (
              <DropdownMenuItem
                onClick={() =>
                  options.onDelete?.(
                    row.original.id,
                    row.original.profiles?.full_name ?? row.original.email
                  )
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

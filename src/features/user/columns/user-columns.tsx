"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Trash2, Pencil, Eye, User, MoreHorizontal } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/format"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  canManageUsers: boolean
  onDelete?: (id: string, name: string) => void
}): ColumnDef<UserRow>[] {
  return [
    {
      accessorKey: "user",
      header: "User / Identitas",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarImage src={row.original.profiles?.avatar_url} />
            <AvatarFallback className="bg-primary/5 text-primary font-bold">
              {row.original.profiles?.full_name?.charAt(0) || <User className="size-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">
              {row.original.profiles?.full_name || "Tanpa Nama"}
            </span>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="text-xs font-bold py-0.5">
                  {row.original.profiles?.roles?.name ?? "No Role"}
               </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Kontak",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">{row.original.email}</span>
          <div className="flex items-center text-slate-500 text-xs gap-1">
            {row.original.profiles?.phone_number ?? "-"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Alamat",
      cell: ({ row }) => (
        <div className="max-w-[200px] flex items-start gap-1">
          <span className="text-sm text-slate-600 line-clamp-2 leading-tight">
            {row.original.profiles?.address ?? "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Terdaftar",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{formatDate(row.original.created_at)}</span>
        </div>
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
           <Link href={`/dashboard/user/${row.original.id}`}>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
            </Link>
            {options.canManageUsers && (
              <Link href={`/dashboard/user/${row.original.id}/edit`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Ubah
                </DropdownMenuItem>
              </Link>
            )}
            {options.canManageUsers && options.onDelete && (
              <DropdownMenuItem
              onClick={() => options.onDelete?.(row.original.id, row.original.profiles?.full_name || row.original.email)}
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

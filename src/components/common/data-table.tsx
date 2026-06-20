"use client"

import { Fragment } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "../ui/spinner"
import { FolderX } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSubRows?: (row: any) => any[]
  getRowCanExpand?: () => boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  getSubRows,
  getRowCanExpand,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSubRows: getRowCanExpand ? (row: any) => getSubRows?.(row) : undefined,
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-80 space-y-2 text-center"
              >
                <Spinner className="size-6 text-primary mx-auto" />
                <p className="text-sm text-primary">Memuat data...</p>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() &&
                    row.subRows.length > 0 &&
                    row.subRows.map(subRow => (
                      <TableRow key={subRow.id} className="bg-muted/30">
                        {subRow.getVisibleCells().map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-80 text-center"
                >
                  <FolderX className="mb-2 h-8 w-8 mx-auto" />
                  <p className="text-md">Data tidak ditemukan.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </div>
  )
}

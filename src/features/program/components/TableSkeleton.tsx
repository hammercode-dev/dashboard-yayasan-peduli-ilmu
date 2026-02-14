import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface DonationTableSkeletonProps {
  rows?: number
}

export function DonationTableSkeleton({
  rows = 5,
}: DonationTableSkeletonProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Donatur</TableHead>
            <TableHead className="text-right">Jumlah Donasi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-5 w-28 ml-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-36" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-8 w-8 rounded-md mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

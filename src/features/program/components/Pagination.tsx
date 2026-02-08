"use client"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"

interface PaginationProps {
  totalData: number
}

export function Pagination({ totalData }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1

  const totalItems = Math.ceil(totalData / TOTAL_DONATIONS_PER_PAGE)

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  if (totalData <= 1 && totalItems !== 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          className="h-8 w-8"
          aria-label="Halaman pertama"
        >
          <Link href={createPageURL(1)}>
            <ChevronsLeft className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          className="h-8 w-8"
          aria-label="Halaman sebelumnya"
        >
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>

        <span className="px-4 text-sm font-medium">
          Halaman {currentPage} dari {totalItems}
        </span>

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalItems}
          className="h-8 w-8"
          aria-label="Halaman selanjutnya"
        >
          <Link href={createPageURL(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalItems}
          className="h-8 w-8"
          aria-label="Halaman terakhir"
        >
          <Link href={createPageURL(totalItems)}>
            <ChevronsRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

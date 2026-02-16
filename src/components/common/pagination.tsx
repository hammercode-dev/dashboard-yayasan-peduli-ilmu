"use client"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useQueryParams } from "@/hooks/use-query-params"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalPages: number
}

export function Pagination({ totalPages }: PaginationProps) {
  const { getNumberParam, setParam } = useQueryParams()
  const currentPage = getNumberParam("page", 1)

  if (totalPages <= 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          className="h-8 w-8"
          aria-label="Halaman pertama"
          onClick={() => setParam("page", 1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          className="h-8 w-8"
          aria-label="Halaman sebelumnya"
          onClick={() => setParam("page", currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-4 text-sm font-medium">
          Halaman {currentPage} dari {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          className="h-8 w-8"
          aria-label="Halaman selanjutnya"
          onClick={() => setParam("page", currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          className="h-8 w-8"
          aria-label="Halaman terakhir"
          onClick={() => setParam("page", totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

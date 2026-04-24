"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useQueryParams } from "@/hooks/use-query-params"

interface SearchUserProps {
  className?: string
  placeholder?: string
  debounceMs?: number
  isFetching?: boolean
}

export function SearchUser({
  className,
  placeholder = "Cari berdasarkan email atau nama lengkap...",
  debounceMs = 400,
  isFetching = false,
}: SearchUserProps) {
  const { getParam, setParams } = useQueryParams()
  const currentQuery = getParam("query")
  const [inputValue, setInputValue] = useState(currentQuery)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const normalizedCurrent = currentQuery.trim()
      const normalizedInput = inputValue.trim()
      if (normalizedInput === normalizedCurrent) return

      setParams({
        query: normalizedInput || null,
        page: 1,
      })
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [currentQuery, debounceMs, inputValue, setParams])

  const clearSearch = () => {
    setInputValue("")
    setParams({
      query: null,
      page: 1,
    })
  }

  return (
    <div className={cn("relative w-full md:max-w-sm", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-16"
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {isFetching && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {inputValue.length > 0 && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={clearSearch}
            className="h-6 w-6"
            aria-label="Hapus pencarian user"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}

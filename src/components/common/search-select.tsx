"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, Loader2, Search, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "../ui/input"

interface SearchSelectProps<T> {
  items: T[]
  value?: string | number
  onChange: (id: string | number) => void
  onSearch?: (query: string) => void
  isFetching?: boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  onSelect?: (item: T) => void
  getLabel: (item: T) => string
  getId: (item: T) => string | number
}

export function SearchSelect<T>({
  items = [],
  value,
  onChange,
  onSearch,
  isFetching = false,
  placeholder = "Pilih data...",
  searchPlaceholder = "Cari...",
  emptyMessage = "Data tidak ditemukan.",
  onSelect,
  getLabel,
  getId,
}: SearchSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const selectorRef = useRef<HTMLDivElement>(null)

  const selectedItem = useMemo(
    () => items.find(item => String(getId(item)) === String(value)),
    [items, value, getId]
  )

  const handleSelect = (item: T) => {
    const id = getId(item)
    onChange(id)
    onSelect?.(item)
    setIsOpen(false)
    setSearchQuery("")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={selectorRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <span
          className={cn("truncate", !selectedItem && "text-muted-foreground")}
        >
          {selectedItem ? getLabel(selectedItem) : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {isFetching && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+5px)] left-0 right-0 z-50 rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="p-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  onSearch?.(e.target.value)
                }}
                autoFocus
                className="h-9 pl-9 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    onSearch?.("")
                  }}
                  className="absolute right-2 p-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="mt-2 max-h-60 overflow-y-auto">
              {isFetching && items.length === 0 && (
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mencari...
                </div>
              )}

              {!isFetching && items.length === 0 && (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  {emptyMessage}
                </div>
              )}

              {items.map(item => (
                <div
                  key={getId(item)}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm transition-colors hover:bg-accent",
                    String(value) === String(getId(item)) &&
                      "bg-accent font-semibold"
                  )}
                >
                  <span className="truncate">{getLabel(item)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Loader2, Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface DonorSelectItem {
  id: string
  name: string
  phone_number: string
  email: string | null
}

export interface DonorSelectComboboxProps {
  donors: DonorSelectItem[]
  value?: string | null
  onSelect: (donor: DonorSelectItem) => void
  onSearch?: (query: string) => void
  isFetching: boolean
  disabled?: boolean
  className?: string
}

export function DonorSelectCombobox({
  donors = [],
  value,
  onSelect,
  onSearch,
  isFetching,
  disabled = false,
  className,
}: DonorSelectComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const selectorRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(
    () => donors.find(d => String(d.id) === String(value)),
    [donors, value]
  )

  const handleSelect = (donor: DonorSelectItem) => {
    onSelect(donor)
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
    <div className={cn("relative w-full", className)} ref={selectorRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isOpen && "ring-2 ring-ring ring-offset-2",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            !selected && "text-muted-foreground"
          )}
        >
          {selected
            ? `${selected.name} · ${selected.phone_number}`
            : "Cari atau pilih donatur..."}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {isFetching && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform duration-200",
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
                placeholder="Nama, HP, atau email..."
                value={searchQuery}
                onChange={e => {
                  const val = e.target.value
                  setSearchQuery(val)
                  onSearch?.(val)
                }}
                autoFocus
                className="h-9 pl-9 pr-8 focus-visible:ring-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    onSearch?.("")
                  }}
                  className="absolute right-2 rounded-full p-1 hover:bg-muted"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="mt-2 max-h-60 overflow-y-auto custom-scrollbar">
              {isFetching && donors.length === 0 && (
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mencari donatur...
                </div>
              )}

              {!isFetching && donors.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Donatur tidak ditemukan. Isi manual di bawah atau tambah donatur
                  baru.
                </div>
              )}

              {donors.map(donor => (
                <button
                  key={donor.id}
                  type="button"
                  onClick={() => handleSelect(donor)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none flex-col gap-0.5 rounded-sm px-2 py-2 text-left text-sm outline-none transition-colors",
                    "hover:bg-gray-100",
                    String(value) === String(donor.id) &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="truncate font-medium">{donor.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {donor.phone_number}
                  </span>
                  {donor.email && (
                    <span className="truncate text-xs text-muted-foreground">
                      {donor.email}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

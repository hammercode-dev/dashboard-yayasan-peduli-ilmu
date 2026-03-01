"use client"

import { Input } from "@/components/ui/input"
import { ChevronDown, Loader2, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, useMemo } from "react"

interface Program {
  id: string | number
  nama: string
}

interface SearchProgramProps {
  programs: Program[]
  value?: string | number
  onChange: (programId: string | number) => void
  onSearch?: (query: string) => void
  isFetching: boolean
}

export function SearchProgram({
  programs = [],
  value,
  onChange,
  onSearch,
  isFetching,
}: SearchProgramProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const selectorRef = useRef<HTMLDivElement>(null)

  const selectedProgram = useMemo(
    () => programs.find(p => String(p.id) === String(value)),
    [programs, value]
  )

  const handleSelectProgram = (programId: string | number) => {
    onChange(programId)
    setIsOpen(false)
    setSearchQuery("")
  }

  // Close the dropdown when click outside from area component
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
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <span
          className={cn(
            "truncate",
            !selectedProgram && "text-muted-foreground"
          )}
        >
          {selectedProgram ? selectedProgram.nama : "Pilih program tujuan..."}
        </span>
        <div className="flex items-center gap-2">
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+5px)] left-0 right-0 z-50 rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 exit-out">
          <div className="p-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari program..."
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

            <div className="mt-2 max-h-60 overflow-y-auto custom-scrollbar">
              {isFetching && programs.length === 0 && (
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mencari data...
                </div>
              )}

              {!isFetching && programs.length === 0 && (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  Program tidak ditemukan.
                </div>
              )}

              {programs.map(program => (
                <div
                  key={program.id}
                  onClick={() => handleSelectProgram(program.id)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    String(value) === String(program.id) &&
                      "bg-accent text-accent-foreground font-semibold"
                  )}
                >
                  <span className="truncate">{program.nama}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

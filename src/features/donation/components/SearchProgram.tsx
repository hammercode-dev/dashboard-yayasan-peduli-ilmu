"use client"

import { Input } from "@/components/ui/input"
import { ChevronDown, Dot, Loader2, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, useMemo } from "react"

interface Program {
  id: string | number
  nama: string
  displayName?: string
  parent_id?: string | null
}

interface SearchProgramProps {
  programs: Program[]
  value?: string | number
  onChange: (programId: string | number) => void
  onSearch?: (query: string) => void
  isFetching: boolean
  className?: string
}

export function SearchProgram({
  programs = [],
  value,
  onChange,
  onSearch,
  isFetching,
  className,
}: SearchProgramProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const selectorRef = useRef<HTMLDivElement>(null)

  const sortedPrograms = useMemo(() => {
    const parents = programs.filter(p => !p.parent_id)
    const children = programs.filter(p => p.parent_id)
    const ordered: Program[] = []

    for (const parent of parents) {
      ordered.push(parent)
      children
        .filter(c => String(c.parent_id) === String(parent.id))
        .forEach(child => ordered.push(child))
    }

    const listedIds = new Set(ordered.map(p => String(p.id)))
    programs.forEach(p => {
      if (!listedIds.has(String(p.id))) ordered.push(p)
    })

    return ordered
  }, [programs])

  const selectedProgram = useMemo(
    () => programs.find(p => String(p.id) === String(value)),
    [programs, value]
  )

  const handleSelectProgram = (programId: string | number) => {
    onChange(programId)
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

  const getLabel = (program: Program) =>
    program.displayName ?? program.nama

  return (
    <div className={cn("relative w-full", className)} ref={selectorRef}>
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
          {selectedProgram
            ? getLabel(selectedProgram)
            : "Pilih program tujuan..."}
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
                  type="button"
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

              {sortedPrograms.map(program => (
                <div
                  key={program.id}
                  onClick={() => handleSelectProgram(program.id)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    program.parent_id && "pl-6",
                    String(value) === String(program.id) &&
                      "bg-accent text-accent-foreground font-semibold"
                  )}
                >
                  {program.parent_id && (
                    <span className="text-muted-foreground">
                      <Dot />
                    </span>
                  )}
                  <span className="truncate">{getLabel(program)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

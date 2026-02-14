"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DonationStatus } from "@/features/program/types/programDonation"

interface StatusFilterProps {
  query?: string
}

export function StatusFilter({ query }: StatusFilterProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentStatus = searchParams.get("status") || "all"

  const statusOptions: { value: DonationStatus | "all"; label: string }[] = [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Active" },
    { value: "closed", label: "Closed" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ]

  const handleChangeFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1")

    if (value === "all") {
      params.delete("status")
    } else {
      params.set("status", value)
    }

    if (query) {
      params.set("query", query)
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={currentStatus} onValueChange={handleChangeFilter}>
      <SelectTrigger className="w-full md:w-45">
        <SelectValue placeholder="Filter Status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

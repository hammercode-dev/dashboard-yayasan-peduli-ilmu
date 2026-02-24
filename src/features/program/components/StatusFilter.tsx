"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DonationStatus } from "@/features/program/types/programDonation"
import { useQueryParams } from "@/hooks/use-query-params"

export function StatusFilter() {
  const { getParam, setParam } = useQueryParams()
  const currentStatus = getParam("status", "all")

  const statusOptions: { value: DonationStatus | "all"; label: string }[] = [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Active" },
    { value: "closed", label: "Closed" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ]

  const handleChangeFilter = (value: string) => {
    setParam("status", value)
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

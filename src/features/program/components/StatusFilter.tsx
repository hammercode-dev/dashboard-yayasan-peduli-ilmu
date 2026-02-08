import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DonationStatus } from "@/features/program/types/programDonation"

interface StatusFilterProps {
  value: DonationStatus | "all"
  onChange: (value: DonationStatus | "all") => void
}

const statusOptions: { value: DonationStatus | "all"; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
]

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
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

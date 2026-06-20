import { DonationStatus, ProgramType } from "./types/programDonation"

export const PROGRAM_TYPE_OPTIONS: {
  value: ProgramType
  label: string
  description: string
}[] = [
  {
    value: "parent",
    label: "Program Utama",
    description: "Program induk tanpa parent",
  },
  {
    value: "child",
    label: "Sub-program",
    description: "Program turunan dari program utama",
  },
]

export const STATUS_OPTIONS: {
  value: DonationStatus
  label: string
}[] = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
]

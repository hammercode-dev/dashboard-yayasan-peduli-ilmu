import { DonationStatus } from "./types/programDonation"

export const STATUS_OPTIONS: {
  value: DonationStatus
  label: string
}[] = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
]

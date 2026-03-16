import * as React from "react"
import { cn } from "@/lib/utils"
import { DonationStatus } from "@/features/program/types/programDonation"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
  status: DonationStatus
}

const statusConfig: Record<
  DonationStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-status-active text-status-active-foreground hover:bg-status-active/80",
  },
  closed: {
    label: "Closed",
    className:
      "bg-status-closed text-status-closed-foreground hover:bg-status-closed/80",
  },
  draft: {
    label: "Draft",
    className:
      "bg-status-draft text-status-draft-foreground hover:bg-status-draft/80",
  },
  archived: {
    label: "Archived",
    className:
      "bg-status-archived text-status-archived-foreground hover:bg-status-archived/80",
  },
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      className={cn("border-transparent", config.className, className)}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

import * as React from "react"
import { cn } from "@/lib/utils"
import { DonationStatus } from "@/features/program/types/programDonation"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: DonationStatus
}

const statusConfig: Record<
  DonationStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-status-active text-status-active-foreground",
  },
  closed: {
    label: "Closed",
    className: "bg-status-closed text-status-closed-foreground",
  },
  draft: {
    label: "Draft",
    className: "bg-status-draft text-status-draft-foreground",
  },
  archived: {
    label: "Archived",
    className: "bg-status-archived text-status-archived-foreground",
  },
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
      {...props}
    >
      {config.label}
    </div>
  )
}

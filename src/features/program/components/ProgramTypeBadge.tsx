import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProgramType } from "../types/programDonation"

const config: Record<
  ProgramType,
  { label: string; className: string }
> = {
  parent: {
    label: "Program Utama",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
  },
  child: {
    label: "Sub-program",
    className: "bg-violet-100 text-violet-800 hover:bg-violet-100/80",
  },
}

export function ProgramTypeBadge({
  type,
  className,
}: {
  type: ProgramType
  className?: string
}) {
  const item = config[type]
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent font-medium", item.className, className)}
    >
      {item.label}
    </Badge>
  )
}

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type BankChannel = "bsi" | "swift"

interface BankBadgeProps extends React.ComponentProps<typeof Badge> {
  channel?: string | null
}

const bankConfig: Record<BankChannel, { label: string; className: string }> = {
  bsi: {
    label: "Bank BSI",
    className:
      "bg-status-active text-status-active-foreground hover:bg-status-active/80",
  },
  swift: {
    label: "SWIFT",
    className: "bg-primary text-primary-foreground hover:bg-primary/80",
  },
} as const

export function BankBadge({ channel, className, ...props }: BankBadgeProps) {
  const key = channel?.toLowerCase() as BankChannel

  const config = bankConfig[key] ?? {
    label: channel ?? "-",
    className: "bg-muted text-muted-foreground",
  }

  return (
    <Badge
      className={cn("border-transparent", config.className, className)}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

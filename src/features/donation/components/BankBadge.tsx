import { cn } from "@/lib/utils"

type BankChannel = "bsi" | "swift"

interface BankBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  channel?: string | null
}

const bankConfig = {
  bsi: {
    label: "Bank BSI",
    className: "bg-status-active text-status-active-foreground",
  },
  swift: {
    label: "SWIFT",
    className: "bg-primary text-primary-foreground",
  },
} as const

export function BankBadge({ channel, className, ...props }: BankBadgeProps) {
  const key = channel?.toLowerCase() as BankChannel

  const config = bankConfig[key] ?? {
    label: channel ?? "-",
    className: "bg-muted text-muted-foreground",
  }

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

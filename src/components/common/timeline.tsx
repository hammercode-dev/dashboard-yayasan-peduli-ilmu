import { cn } from "@/lib/utils"

export type TimelineStatus = "done" | "active" | "upcoming"

interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  children: React.ReactNode
}

export function Timeline({ children, className, ...props }: TimelineProps) {
  return (
    <ol className={cn("relative flex flex-col gap-0", className)} {...props}>
      {children}
    </ol>
  )
}

interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
  status?: TimelineStatus
  last?: boolean
}

export function TimelineItem({
  children,
  status = "upcoming",
  last = false,
  className,
  ...props
}: TimelineItemProps) {
  return (
    <li
      data-status={status}
      className={cn("group/item relative flex gap-4 pb-8 last:pb-0", className)}
      {...props}
    >
      {!last && (
        <span
          aria-hidden
          className={cn(
            "absolute left-[15px] top-8 h-full w-px",
            status === "done"
              ? "bg-green-500"
              : status === "active"
                ? "bg-linear-to-b from-primary to-border"
                : "bg-border"
          )}
        />
      )}
      {children}
    </li>
  )
}

interface TimelineConnectorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: TimelineStatus
}

export function TimelineConnector({
  children,
  status = "upcoming",
  className,
  ...props
}: TimelineConnectorProps) {
  const base =
    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition-colors"

  const variants = {
    done: "border-green-500 bg-green-500 text-primary-foreground",
    active:
      "border-primary bg-background text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]",
    upcoming: "border-muted-foreground/30 bg-background text-muted-foreground",
  }

  return (
    <span
      aria-hidden
      className={cn(base, variants[status] ?? variants.upcoming, className)}
      {...props}
    >
      {children}
    </span>
  )
}

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function TimelineContent({
  children,
  className,
  ...props
}: TimelineContentProps) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col gap-1 pt-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface TimelineTimeProps extends React.HTMLAttributes<HTMLTimeElement> {
  children: React.ReactNode
}

export function TimelineTime({
  children,
  className,
  ...props
}: TimelineTimeProps) {
  return (
    <time
      className={cn("text-xs font-medium text-muted-foreground", className)}
      {...props}
    >
      {children}
    </time>
  )
}

interface TimelineTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function TimelineTitle({
  children,
  className,
  ...props
}: TimelineTitleProps) {
  return (
    <p
      className={cn(
        "text-sm font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

interface TimelineDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function TimelineDescription({
  children,
  className,
  ...props
}: TimelineDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

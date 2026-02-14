const ID_LOCALE = "id-ID"

export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat(ID_LOCALE, {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats a number into Indonesian Rupiah with compact notation (e.g., 1.5 juta, 2.3 miliar)
 */
export function formatRupiahCompact(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount
  if (!Number.isFinite(n)) return "Rp 0"

  const abs = Math.abs(n)
  const formatter = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  })

  const formatWithSuffix = (value: number, suffix: string) =>
    `Rp ${formatter.format(value)} ${suffix}`

  if (abs >= 1e12) return formatWithSuffix(n / 1e12, "triliun")
  if (abs >= 1e9) return formatWithSuffix(n / 1e9, "miliar")
  if (abs >= 1e6) return formatWithSuffix(n / 1e6, "juta")
  if (abs >= 1e3) return formatWithSuffix(n / 1e3, "ribu")

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n)
}

/**
 * Formats a single date into "Day Month Year" (e.g., 20 Januari 2024)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat(ID_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d)
}

/**
 * Safely parses various date inputs into a Date object or null
 */
export function parseDateSafe(d: string | Date | null): Date | null {
  if (!d) return null
  const date = d instanceof Date ? d : new Date(d)
  return !isNaN(date.getTime()) ? date : null
}

/**
 * Returns a human-readable status of remaining time
 */
export function getDaysRemaining(
  endDate: string | Date | null,
  startDate: string | Date | null,
  now: Date = new Date()
): string | null {
  const end = parseDateSafe(endDate)
  if (!end) return null

  const start = parseDateSafe(startDate)
  const today = new Date(now.setHours(0, 0, 0, 0))

  if (start && today < new Date(start.setHours(0, 0, 0, 0)))
    return "Not yet started"
  if (today > end) return "Already finished"

  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return "Ends today"
  return `${diffDays} day${diffDays === 1 ? "" : "s"} left`
}

/**
 * Formats a start and end date as a range string
 */
export function formatDateRange(
  startDate: string | null,
  endDate: string | null
): string {
  const fmt = (date: string) =>
    new Date(date).toLocaleDateString(ID_LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

  const s = startDate?.trim() ? startDate : null
  const e = endDate?.trim() ? endDate : null

  if (!s && !e) return "Ongoing"
  if (!s) return `Until ${fmt(e!)}`
  if (!e) return `From ${fmt(s)}`
  return `${fmt(s)} → ${fmt(e)}`
}

export type DonationStatus = "active" | "closed" | "draft" | "archived"

export interface Donation {
  id: string
  created_at: string
  updated_at: string
  title: string
  titleEnglish: string
  titleArabic: string
  description: string
  description_en: string
  description_ar: string
  image_url: string
  target_amount: number
  collected_amount: number
  status: DonationStatus
  starts_at: Date
  ends_at: Date
  location: string
  slug: string
  short_description: string
  short_description_en: string
  short_description_ar: string
}

export interface DonationFilters {
  search: string
  status: DonationStatus | "all"
  dateFrom: string
  dateTo: string
  donorName: string
}

export type SortDirection = "asc" | "desc"

export interface SortConfig {
  key: keyof Donation
  direction: SortDirection
}

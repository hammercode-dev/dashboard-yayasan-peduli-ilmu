export type DonationStatus = "active" | "closed" | "draft" | "archived"

export type ProgramType = "parent" | "child"

export interface ProgramDonationParentRef {
  id: string
  title: string
  slug?: string | null
}

export interface ProgramDonationChildSummary {
  id: string
  title: string
  status: DonationStatus | string | null
  target_amount?: number | string | null
  collected_amount?: number | string | null
  slug?: string | null
  starts_at?: string
  ends_at?: string
  created_at?: string
}

export interface ProgramDonationListItem {
  id: string
  title: string
  collected_amount: number
  target_amount: number
  starts_at: string
  ends_at: string
  status: DonationStatus
  created_at: string
  parent_id: string | null
  children?: ProgramDonationListItem[]
  childrenCount?: number
  parent?: ProgramDonationParentRef | null
  total_collected_amount?: number
}

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
  parent_id?: string | null
  parent?: ProgramDonationParentRef | null
  children?: ProgramDonationChildSummary[]
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

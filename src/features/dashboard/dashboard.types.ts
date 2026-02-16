import { Prisma } from "@/generated/prisma"

export interface ProgramDonationStatsDataResponse {
  active: number
  draft: number
  archived: number
  closed: number
  fundsCollected: Prisma.GetProgram_donationAggregateType<{
    _sum: {
      collected_amount: true
    }
  }>
  totalPrograms: number
}

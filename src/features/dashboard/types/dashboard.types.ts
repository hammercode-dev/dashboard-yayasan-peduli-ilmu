import { Prisma } from "@/generated/prisma"
import { getProgramDonationStats, getProgramTrendings } from "../dashboard.dal"

export type ProgramDonationStatsDataResponse = Prisma.PromiseReturnType<
  typeof getProgramDonationStats
>
export type ProgramTrendingsDataResponse = Prisma.PromiseReturnType<
  typeof getProgramTrendings
>

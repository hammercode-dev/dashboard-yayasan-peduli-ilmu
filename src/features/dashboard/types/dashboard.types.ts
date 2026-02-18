import { Prisma } from "@/generated/prisma"
import { getProgramDonationStats } from "../dashboard.dal"

export type ProgramDonationStatsDataResponse = Prisma.PromiseReturnType<
  typeof getProgramDonationStats
>

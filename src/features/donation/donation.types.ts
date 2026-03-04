import { Prisma } from "@/generated/prisma"
import { getDonationEvidenceStats } from "./donation.dal"

export type DonationStatsDataResponse = Prisma.PromiseReturnType<
  typeof getDonationEvidenceStats
>

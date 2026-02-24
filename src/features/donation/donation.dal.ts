import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"
import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"

import { DonationEvidenceFormData } from "./donation.schemas"

export interface UpdateDonationEvidenceInput extends Partial<DonationEvidenceFormData> {
  id: string
}

export const getDonationEvidences = cache(
  async (query: string, currentPage: number) => {
    await verifySession()

    const offset = (currentPage - 1) * TOTAL_DONATIONS_PER_PAGE

    return prisma.donation_evidences.findMany({
      where: {
        full_name: { contains: query || "", mode: "insensitive" },
      },
      include: {
        program_donation: {
          select: {
            id: true,
            title: true,
          },
        },
      },

      take: TOTAL_DONATIONS_PER_PAGE,
      skip: offset,
      orderBy: { uploaded_at: "desc" },
    })
  }
)

export const countDonationEvidences = cache(async (query: string) => {
  await verifySession()

  return prisma.donation_evidences.count({
    where: {
      full_name: { contains: query || "", mode: "insensitive" },
    },
  })
})

import { cache } from "react"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"

export const getProgramDonationStats = cache(async () => {
  await verifySession()

  const [active, draft, archived, closed, fundsCollected, totalPrograms] =
    await Promise.all([
      prisma.program_donation.count({ where: { status: "active" } }),
      prisma.program_donation.count({ where: { status: "draft" } }),
      prisma.program_donation.count({ where: { status: "archived" } }),
      prisma.program_donation.count({ where: { status: "closed" } }),
      prisma.program_donation.aggregate({ _sum: { collected_amount: true } }),
      prisma.program_donation.count(),
    ])

  return { active, draft, archived, closed, fundsCollected, totalPrograms }
})

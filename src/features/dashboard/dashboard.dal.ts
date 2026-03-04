import { cache } from "react"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"

export const getProgramDonationStats = cache(async () => {
  await verifySession()

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const [revenueAgg, activePrograms, totalPrograms, totalDonors, todayStats] =
    await Promise.all([
      prisma.program_donation.aggregate({ _sum: { collected_amount: true } }),
      prisma.program_donation.count({ where: { status: "active" } }),
      prisma.program_donation.count(),
      prisma.donation_evidences.count(),

      prisma.donation_evidences.aggregate({
        where: { donation_upload_at: { gte: startOfToday } },
        _count: { id: true },
        _sum: { amount: true },
      }),
    ])

  return {
    totalRevenues: Number(revenueAgg._sum.collected_amount ?? 0),
    activePrograms,
    totalPrograms,
    totalDonatur: totalDonors,
    todayDonorsCount: todayStats._count.id,
    todayCollectedAmount: Number(todayStats._sum.amount ?? 0),
  }
})

export const getProgramTrendings = cache(async () => {
  await verifySession()

  const trendings = await prisma.program_donation.findMany({
    orderBy: { collected_amount: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      collected_amount: true,
      target_amount: true,
      starts_at: true,
      ends_at: true,

      _count: {
        select: {
          donation_evidences: true,
        },
      },
    },
  })

  const serializedTrendings = trendings.map(trending => ({
    ...trending,
    id: trending.id.toString(),
    collected_amount: trending.collected_amount?.toString() ?? "0",
    target_amount: trending.target_amount?.toString() ?? "0",
    total_donatur: trending._count.donation_evidences,
  }))

  return { trendings: serializedTrendings }
})

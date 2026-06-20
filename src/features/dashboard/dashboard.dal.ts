import { cache } from "react"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"

export const getProgramDonationStats = cache(async () => {
  await verifySession()

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const [revenueAgg, activePrograms, totalPrograms, totalDonors, todayStats] =
    await Promise.all([
      prisma.donation_evidences.aggregate({ _sum: { amount: true } }),
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
    totalRevenues: Number(revenueAgg._sum.amount ?? 0),
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
    where: { parent_id: null },
    take: 10,
    select: {
      id: true,
      title: true,
      target_amount: true,
      starts_at: true,
      ends_at: true,
      children: {
        select: {
          id: true,
          title: true,
          target_amount: true,
          status: true,
        },
      },
    },
  })

  const allProgramIds = trendings.flatMap(p => [p.id, ...p.children.map(c => c.id)])

  const aggregatedData = await prisma.donation_evidences.groupBy({
    by: ["program_id"],
    where: { program_id: { in: allProgramIds } },
    _sum: { amount: true },
  })

  const uniqueDonors = await prisma.donation_evidences.groupBy({
    by: ["program_id", "donor_id"],
    where: { program_id: { in: allProgramIds } },
  })

  const uniqueDonorCountMap = new Map<string, number>()
  for (const row of uniqueDonors) {
    if (row.program_id !== null) {
      const pid = row.program_id.toString()
      uniqueDonorCountMap.set(pid, (uniqueDonorCountMap.get(pid) ?? 0) + 1)
    }
  }

  const dataMap = new Map(
    aggregatedData.map(d => [d.program_id, d])
  )

  const serializedTrendings = trendings.map(parent => {
    const parentCollected = Number(dataMap.get(parent.id)?._sum.amount ?? 0)

    const children = parent.children.map(child => ({
      id: child.id.toString(),
      title: child.title,
      target_amount: Number(child.target_amount ?? 0),
      status: child.status,
      collected_amount: Number(dataMap.get(child.id)?._sum.amount ?? 0),
      total_donatur: uniqueDonorCountMap.get(child.id.toString()) ?? 0,
    }))

    const childrenCollected = children.reduce((sum, c) => sum + c.collected_amount, 0)
    const childrenDonatur = children.reduce((sum, c) => sum + c.total_donatur, 0)

    return {
      id: parent.id.toString(),
      title: parent.title,
      target_amount: Number(parent.target_amount ?? 0),
      collected_amount: parentCollected + childrenCollected,
      total_donatur: uniqueDonorCountMap.get(parent.id.toString()) ?? 0 + childrenDonatur,
      starts_at: parent.starts_at?.toISOString() ?? null,
      ends_at: parent.ends_at?.toISOString() ?? null,
      children,
    }
  })

  serializedTrendings.sort((a, b) => b.collected_amount - a.collected_amount)
  const top5 = serializedTrendings.slice(0, 5)

  return { trendings: top5 }
})

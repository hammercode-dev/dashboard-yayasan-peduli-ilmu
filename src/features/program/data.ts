import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"
import { prisma } from "@/lib/client"
import { DonationStatus } from "./types/programDonation"

export async function fetchStatsDonation() {
  try {
    const [active, draft, archived, closed, fundsCollected, totalPrograms] =
      await Promise.all([
        prisma.program_donation.count({
          where: { status: "active" },
        }),
        prisma.program_donation.count({
          where: { status: "draft" },
        }),
        prisma.program_donation.count({
          where: { status: "archived" },
        }),
        prisma.program_donation.count({
          where: { status: "closed" },
        }),
        prisma.program_donation.aggregate({
          _sum: {
            collected_amount: true,
          },
        }),
        prisma.program_donation.count(),
      ])

    return {
      active,
      draft,
      archived,
      closed,
      fundsCollected,
      totalPrograms,
    }
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Gagal mengambil data program donasi.")
  }
}

export async function fetchCountProgramDonation(query: string, status: string) {
  return await prisma.program_donation.count({
    where: {
      title: {
        contains: query || "",
        mode: "insensitive", // tidak sensitif huruf besar/kecil
      },
      ...(status && status !== "all"
        ? { status: status as DonationStatus }
        : {}),
    },
  })
}

export async function fetchProgramDonations(
  query: string,
  currentPage: number,
  status: string
) {
  const offset = (currentPage - 1) * TOTAL_DONATIONS_PER_PAGE

  return await prisma.program_donation.findMany({
    where: {
      title: {
        contains: query || "",
        mode: "insensitive",
      },
      ...(status && status !== "all"
        ? { status: status as DonationStatus }
        : {}),
    },
    take: TOTAL_DONATIONS_PER_PAGE,
    skip: offset,
    orderBy: { created_at: "desc" },
  })
}

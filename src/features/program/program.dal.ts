import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"
import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"
import { DonationStatus } from "./types/programDonation"
import { ProgramDonationFormData } from "./program.schemas"

export interface UpdateProgramDonationInput extends Partial<ProgramDonationFormData> {
  id: bigint
}

export const getProgramDonations = cache(
  async (query: string, currentPage: number, status: string) => {
    await verifySession()

    const offset = (currentPage - 1) * TOTAL_DONATIONS_PER_PAGE

    return prisma.program_donation.findMany({
      where: {
        title: { contains: query || "", mode: "insensitive" },
        ...(status && status !== "all"
          ? { status: status as DonationStatus }
          : {}),
      },
      take: TOTAL_DONATIONS_PER_PAGE,
      skip: offset,
      orderBy: { created_at: "desc" },
    })
  }
)

export const getProgramDonationById = cache(async (id: bigint) => {
  await verifySession()

  return prisma.program_donation.findUnique({ where: { id } })
})

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

export const countProgramDonations = cache(
  async (query: string, status: string) => {
    await verifySession()

    return prisma.program_donation.count({
      where: {
        title: { contains: query || "", mode: "insensitive" },
        ...(status && status !== "all"
          ? { status: status as DonationStatus }
          : {}),
      },
    })
  }
)

export async function createProgramDonation(input: ProgramDonationFormData) {
  await verifySession()

  return prisma.program_donation.create({
    data: {
      title: input.title,
      slug: input.slug,
      status: input.status,
      location: input.location,
      image_url: input.image_url,
      target_amount: input.target_amount,
      collected_amount: input.collected_amount,
      starts_at: new Date(input.starts_at),
      ends_at: new Date(input.ends_at),
      short_description: input.short_description,
      short_description_en: input.short_description_en,
      short_description_ar: input.short_description_ar,
      description: input.description,
      description_en: input.description_en,
      description_ar: input.description_ar,
      title_en: input.title_en,
      title_ar: input.title_ar,
      updated_at: new Date(),
    },
  })
}

export async function updateProgramDonation(input: UpdateProgramDonationInput) {
  await verifySession()

  const { id, ...fields } = input

  return prisma.program_donation.update({
    where: { id },
    data: {
      ...fields,
      ...(fields.starts_at ? { starts_at: new Date(fields.starts_at) } : {}),
      ...(fields.ends_at ? { ends_at: new Date(fields.ends_at) } : {}),
      updated_at: new Date(),
    },
  })
}

export async function deleteProgramDonation(id: bigint) {
  await verifySession()

  return prisma.program_donation.delete({ where: { id } })
}

import "server-only"
import { cache } from "react"
import { Prisma } from "@/generated/prisma"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"
import { TOTAL_PROGRAMS_PER_PAGE } from "@/constants/data"
import { DonationStatus } from "./types/programDonation"
import {
  ProgramDonationFormData,
  UpdateProgramDonationFormData,
} from "./program.schemas"

export interface UpdateProgramDonationInput extends Partial<UpdateProgramDonationFormData> {
  id: string
}

export const getProgramDonations = cache(
  async (query: string, currentPage: number, status: string) => {
    await verifySession()

    const offset = (currentPage - 1) * TOTAL_PROGRAMS_PER_PAGE

    return prisma.program_donation.findMany({
      where: {
        title: { contains: query || "", mode: "insensitive" },
        ...(status && status !== "all"
          ? { status: status as DonationStatus }
          : {}),
      },
      take: TOTAL_PROGRAMS_PER_PAGE,
      skip: offset,
      orderBy: { created_at: "desc" },
    })
  }
)

export const getProgramDonationById = cache(async (id: bigint) => {
  await verifySession()

  return prisma.program_donation.findUnique({
    where: { id },
    include: {
      program_timeline: { orderBy: { date: "asc" } },
    },
  })
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

function mapTimelineRowToCreate(row: ProgramDonationFormData["program_timeline"][number]) {
  return {
    date: row.date ? new Date(row.date + "T12:00:00.000Z") : null,
    activity: row.activity ?? null,
    activity_en: row.activity_en ?? null,
    activity_ar: row.activity_ar ?? null,
    cost: row.cost ? new Prisma.Decimal(row.cost) : null,
    description: row.description ?? null,
  }
}

export async function createProgramDonation(input: ProgramDonationFormData) {
  await verifySession()

  const timelineRows = input.program_timeline ?? []

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
      program_timeline:
        timelineRows.length > 0
          ? { create: timelineRows.map(mapTimelineRowToCreate) }
          : undefined,
    },
  })
}

export async function updateProgramDonation(input: UpdateProgramDonationInput) {
  await verifySession()

  const { id, program_timeline: timelineInput, ...fields } = input
  const programId = BigInt(id)

  const scalarData: Record<string, unknown> = {
    ...fields,
    ...(fields.starts_at ? { starts_at: new Date(fields.starts_at) } : {}),
    ...(fields.ends_at ? { ends_at: new Date(fields.ends_at) } : {}),
    updated_at: new Date(),
  }
  delete scalarData.program_timeline

  if (timelineInput !== undefined) {
    return prisma.$transaction(async tx => {
      await tx.program_donation.update({
        where: { id: programId },
        data: scalarData as Parameters<typeof tx.program_donation.update>[0]["data"],
      })
      await tx.program_timeline.deleteMany({ where: { program_id: programId } })
      const rows = timelineInput ?? []
      if (rows.length > 0) {
        await tx.program_timeline.createMany({
          data: rows.map(row => ({
            program_id: programId,
            ...mapTimelineRowToCreate(row),
          })),
        })
      }
      return tx.program_donation.findUniqueOrThrow({
        where: { id: programId },
        include: { program_timeline: { orderBy: { date: "asc" } } },
      })
    })
  }

  return prisma.program_donation.update({
    where: { id: programId },
    data: scalarData as Parameters<typeof prisma.program_donation.update>[0]["data"],
  })
}

export async function deleteProgramDonation(id: bigint) {
  await verifySession()

  return prisma.program_donation.delete({ where: { id } })
}

export const getAllProgramDonations = cache(async (query: string) => {
  await verifySession()

  return prisma.program_donation.findMany({
    where: {
      title: { contains: query || "", mode: "insensitive" },
    },
    take: 10,
    orderBy: { created_at: "desc" },
  })
})

import "server-only"
import { cache } from "react"
import { Prisma } from "@/generated/prisma"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"
import type {
  CreateTimelineItemInput,
  UpdateTimelineItemInput,
} from "./timeline.schemas"

export const getTimelineByProgramId = cache(async (programId: number) => {
  await verifySession()

  return prisma.program_timeline.findMany({
    where: { program_id: BigInt(programId) },
    orderBy: { date: "asc" },
  })
})

export async function createTimelineItem(input: CreateTimelineItemInput) {
  await verifySession()

  const programId = BigInt(input.program_id)
  const data = {
    program_id: programId,
    date: input.date ? new Date(input.date + "T12:00:00.000Z") : null,
    activity: input.activity ?? null,
    activity_en: input.activity_en ?? null,
    activity_ar: input.activity_ar ?? null,
    cost: input.cost ? new Prisma.Decimal(input.cost) : null,
    description: input.description ?? null,
  }

  return prisma.program_timeline.create({
    data,
  })
}

export async function updateTimelineItem(
  id: bigint,
  input: UpdateTimelineItemInput
) {
  await verifySession()

  const data: Parameters<typeof prisma.program_timeline.update>[0]["data"] = {}
  if (input.date !== undefined)
    data.date = input.date ? new Date(input.date + "T12:00:00.000Z") : null
  if (input.activity !== undefined) data.activity = input.activity ?? null
  if (input.activity_en !== undefined) data.activity_en = input.activity_en ?? null
  if (input.activity_ar !== undefined) data.activity_ar = input.activity_ar ?? null
  if (input.cost !== undefined)
    data.cost = input.cost ? new Prisma.Decimal(input.cost) : null
  if (input.description !== undefined) data.description = input.description ?? null

  return prisma.program_timeline.update({
    where: { id },
    data,
  })
}

export async function deleteTimelineItem(id: bigint) {
  await verifySession()

  return prisma.program_timeline.delete({ where: { id } })
}

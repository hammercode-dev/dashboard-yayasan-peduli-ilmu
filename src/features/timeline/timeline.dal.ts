import { cache } from "react"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"

export const getTimelineByProgramId = cache(async (programId: number) => {
  await verifySession()

  return prisma.program_timeline.findMany({ where: { program_id: programId } })
})

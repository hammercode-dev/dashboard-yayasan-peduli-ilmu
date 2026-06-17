import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"
import { DonationStatus } from "./types/programDonation"
import {
  ProgramDonationFormData,
  UpdateProgramDonationFormData,
} from "./program.schemas"

export interface UpdateProgramDonationInput extends Partial<UpdateProgramDonationFormData> {
  id: string
}

export class ProgramDonationValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ProgramDonationValidationError"
  }
}

function buildListWhere(query: string, status: string) {
  return {
    parent_id: null,
    title: { contains: query || "", mode: "insensitive" as const },
    ...(status && status !== "all"
      ? { status: status as DonationStatus }
      : {}),
  }
}

export async function validateParentId(
  parentId: bigint | null,
  options?: { excludeProgramId?: bigint }
) {
  if (parentId === null) return

  if (options?.excludeProgramId && parentId === options.excludeProgramId) {
    throw new ProgramDonationValidationError(
      "Program tidak dapat menjadi parent dari dirinya sendiri"
    )
  }

  const parent = await prisma.program_donation.findUnique({
    where: { id: parentId },
    select: { id: true, parent_id: true },
  })

  if (!parent) {
    throw new ProgramDonationValidationError("Program utama tidak ditemukan")
  }

  if (parent.parent_id !== null) {
    throw new ProgramDonationValidationError(
      "Hanya program utama yang dapat dipilih sebagai parent"
    )
  }
}

function resolveParentId(
  input: { program_type?: string; parent_id?: string | null },
  existingParentId?: bigint | null
): bigint | null {
  if (input.program_type === "parent") return null
  if (input.program_type === "child") {
    if (!input.parent_id) {
      throw new ProgramDonationValidationError(
        "Program utama wajib dipilih untuk sub-program"
      )
    }
    return BigInt(input.parent_id)
  }

  if (input.parent_id !== undefined) {
    return input.parent_id ? BigInt(input.parent_id) : null
  }

  return existingParentId ?? null
}

export const getProgramDonations = cache(
  async (query: string, currentPage: number, limit: number, status: string) => {
    await verifySession()

    const offset = (currentPage - 1) * limit

    const programs = await prisma.program_donation.findMany({
      where: buildListWhere(query, status),
      take: limit,
      skip: offset,
      orderBy: { created_at: "desc" },
      include: {
        children: {
          orderBy: { created_at: "desc" },
        },
        _count: {
          select: { children: true },
        },
      },
    })

    const programIds = programs.flatMap(p => [
      p.id,
      ...p.children.map(c => c.id),
    ])

    console.log("program ids", programIds)
    const collectedAmounts = await prisma.donation_evidences.groupBy({
      by: ["program_id"],
      where: {
        program_id: { in: programIds },
      },
      _sum: {
        amount: true,
      },
    })

    const collectedMap = new Map(
      collectedAmounts.map(c => [c.program_id, Number(c._sum.amount) || 0])
    )
    

    return programs.map(program => {
      const parentAmount = collectedMap.get(program.id) || 0
    
      const children = program.children.map(child => ({
        ...child,
        collected_amount: collectedMap.get(child.id) || 0,
      }))
    
      const childrenAmount = children.reduce(
        (sum, child) => sum + child.collected_amount,
        0
      )
    
      return {
        ...program,
        collected_amount: parentAmount + childrenAmount,
        children,
      }
    })
  }
)

export const getProgramDonationById = cache(async (id: bigint) => {
  await verifySession()

  const program = await prisma.program_donation.findUnique({
    where: { id },
    include: {
      program_timeline: { orderBy: { date: "asc" } },
      parent: {
        select: { id: true, title: true, slug: true },
      },
      children: {
        select: {
          id: true,
          title: true,
          status: true,
          target_amount: true,
          slug: true,
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      },
    },
  })

  if (!program) return null

  const allIds = [program.id, ...program.children.map(c => c.id)]

  const collectedAmounts = await prisma.donation_evidences.groupBy({
    by: ["program_id"],
    where: { program_id: { in: allIds } },
    _sum: { amount: true },
  })

  const collectedMap = new Map(
    collectedAmounts.map(c => [c.program_id, Number(c._sum.amount) || 0])
  )

  return {
    ...program,
    collected_amount: collectedMap.get(program.id) || 0,
    children: program.children.map(child => ({
      ...child,
      collected_amount: collectedMap.get(child.id) || 0,
    })),
  }
})

export const countProgramDonations = cache(
  async (query: string, status: string) => {
    await verifySession()

    return prisma.program_donation.count({
      where: buildListWhere(query, status),
    })
  }
)

export const getParentProgramsOnly = cache(async (query?: string) => {
  await verifySession()

  const parents = await prisma.program_donation.findMany({
    where: {
      parent_id: null,
      title: { contains: query || "", mode: "insensitive" },
    },
    select: {
      id: true,
      title: true,
      target_amount: true,
      children: {
        select: {
          id: true,
          target_amount: true,
        },
      },
    },
    orderBy: { title: "asc" },
  })

  return parents.map(parent => ({
    id: parent.id,
    title: parent.title,
    target_amount: parent.target_amount,
    children_target_total: parent.children.reduce(
      (sum, child) => sum + Number(child.target_amount || 0),
      0
    ),
    children_count: parent.children.length,
  }))
})

export async function createProgramDonation(input: ProgramDonationFormData) {
  await verifySession()

  const parentId = resolveParentId(input)
  await validateParentId(parentId)

  return prisma.program_donation.create({
    data: {
      title: input.title,
      slug: input.slug,
      status: input.status,
      location: input.location,
      image_url: input.image_url,
      target_amount: input.target_amount,
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
      parent_id: parentId,
      updated_at: new Date(),
    },
  })
}

export async function updateProgramDonation(input: UpdateProgramDonationInput) {
  await verifySession()

  const { id, program_type, parent_id, ...fields } = input
  const programId = BigInt(id)

  const existing = await prisma.program_donation.findUnique({
    where: { id: programId },
    select: {
      parent_id: true,
      _count: { select: { children: true } },
    },
  })

  if (!existing) {
    throw new ProgramDonationValidationError("Program tidak ditemukan")
  }

  const hasParentIdUpdate =
    parent_id !== undefined || program_type !== undefined

  let resolvedParentId: bigint | null | undefined
  if (hasParentIdUpdate) {
    resolvedParentId = resolveParentId(
      { program_type, parent_id },
      existing.parent_id
    )

    if (
      existing._count.children > 0 &&
      resolvedParentId !== null &&
      resolvedParentId !== undefined
    ) {
      throw new ProgramDonationValidationError(
        "Program utama yang memiliki sub-program tidak dapat diubah menjadi sub-program"
      )
    }

    await validateParentId(resolvedParentId ?? null, {
      excludeProgramId: programId,
    })
  }

  const scalarData: Record<string, unknown> = {
    ...fields,
    ...(fields.starts_at ? { starts_at: new Date(fields.starts_at) } : {}),
    ...(fields.ends_at ? { ends_at: new Date(fields.ends_at) } : {}),
    ...(hasParentIdUpdate ? { parent_id: resolvedParentId ?? null } : {}),
    updated_at: new Date(),
  }

  delete scalarData.program_timeline

  return prisma.$transaction(async tx => {
    await tx.program_donation.update({
      where: { id: programId },
      data: scalarData as Parameters<
        typeof tx.program_donation.update
      >[0]["data"],
    })
    return tx.program_donation.findUniqueOrThrow({
      where: { id: programId },
      include: {
        parent: { select: { id: true, title: true } },
        children: {
          select: { id: true, title: true, status: true },
        },
      },
    })
  })
}

export async function deleteProgramDonation(id: bigint) {
  await verifySession()

  const program = await prisma.program_donation.findUnique({
    where: { id },
    select: { _count: { select: { children: true } } },
  })

  if (program && program._count.children > 0) {
    throw new ProgramDonationValidationError(
      "Hapus sub-program terlebih dahulu sebelum menghapus program utama"
    )
  }

  return prisma.program_donation.delete({ where: { id } })
}

export const getAllProgramDonations = cache(async (query: string) => {
  await verifySession()

  return prisma.program_donation.findMany({
    where: {
      title: { contains: query || "", mode: "insensitive" },
    },
    take: 50,
    orderBy: [{ parent_id: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      parent_id: true,
      parent: {
        select: { id: true, title: true },
      },
    },
  })
})

export const getProgramCollectedAmount = cache(async (programId: bigint) => {
    await verifySession()

    const result = await
  prisma.donation_evidences.aggregate({
      where: { program_id: programId },
      _sum: { amount: true },
    })

    return result._sum.amount ?? 0
  })
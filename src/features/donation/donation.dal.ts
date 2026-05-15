import "server-only"
import { cache } from "react"

import type { Prisma } from "@/generated/prisma"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"

import {
  DonationEvidenceBulkRowData,
  CreateDonationEvidenceFormData,
  UpdateDonationFormData,
} from "./donation.schemas"
import {
  normalizePhone,
  resolveDonorIdForDonation,
} from "@/features/donor/donor.dal"

export interface UpdateDonationEvidenceInput extends Partial<UpdateDonationFormData> {
  id: string
}

const DONOR_LIST_SELECT = {
  id: true,
  name: true,
  phone_number: true,
  email: true,
} satisfies Prisma.donorsSelect

function buildDonationEvidenceWhere(query: string): Prisma.donation_evidencesWhereInput {
  const q = query.trim()
  if (q.length === 0) return {}
  return {
    OR: [
      {
        donors: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone_number: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
      },
      {
        program_donation: {
          title: { contains: q, mode: "insensitive" },
        },
      },
    ],
  }
}

export const getDonationEvidences = cache(
  async (query: string, currentPage: number, limit: number) => {
    await verifySession()

    const offset = (currentPage - 1) * limit

    return prisma.donation_evidences.findMany({
      where: buildDonationEvidenceWhere(query),
      include: {
        donors: { select: DONOR_LIST_SELECT },
        program_donation: {
          select: {
            id: true,
            title: true,
            collected_amount: true,
          },
        },
      },

      take: limit,
      skip: offset,
      orderBy: { created_at: "desc" },
    })
  }
)

export const countDonationEvidences = cache(async (query: string) => {
  await verifySession()

  return prisma.donation_evidences.count({
    where: buildDonationEvidenceWhere(query),
  })
})

export async function deleteDonationEvidence(id: bigint) {
  await verifySession()

  return await prisma.$transaction(async tx => {
    const donation = await tx.donation_evidences.findUnique({
      where: { id },
    })

    if (!donation) {
      throw new Error("Donation evidence not found")
    }

    await tx.donation_evidences.delete({
      where: { id },
    })

    if (donation.program_id !== null && donation.amount !== null) {
      await tx.program_donation.update({
        where: { id: donation.program_id },
        data: {
          collected_amount: {
            decrement: donation.amount,
          },
        },
      })
    }

    return { success: true }
  })
}

export async function createDonationEvidence(input: CreateDonationEvidenceFormData) {
  await verifySession()

  return await prisma.$transaction(async tx => {
    const programId = Number(input.program_id)
    const amount = Number(input.amount)

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0")
    }

    const program = await tx.program_donation.findUnique({
      where: { id: programId },
    })

    if (!program) {
      throw new Error("Program not found")
    }

    await tx.program_donation.update({
      where: { id: programId },
      data: {
        collected_amount: {
          increment: amount,
        },
      },
    })

    const donorId = BigInt(input.donor_id)
    const donor = await tx.donors.findUnique({
      where: { id: donorId },
      select: { id: true },
    })
    if (!donor) {
      throw new Error("Donor not found")
    }

    const donation = await tx.donation_evidences.create({
      data: {
        payment_method: input.payment_method,
        amount: amount,
        donation_upload_at: new Date(input.donation_upload_at),
        program_id: programId,
        evidence_url: input.evidence_url,
        description: input.description,
        donor_id: donorId,
      },
    })

    return donation
  })
}

export const getDonationById = cache(async (id: bigint) => {
  await verifySession()

  return prisma.donation_evidences.findUnique({
    where: { id },
    include: {
      donors: { select: DONOR_LIST_SELECT },
      program_donation: {
        select: {
          id: true,
          title: true,
          collected_amount: true,
        },
      },
    },
  })
})

export async function updateDonationEvidence(
  input: UpdateDonationEvidenceInput
) {
  await verifySession()

  const { id, ...fields } = input
  const idBig = BigInt(id)

  return prisma.$transaction(async tx => {
    const existing = await tx.donation_evidences.findUnique({
      where: { id: idBig },
      include: { donors: true },
    })
    if (!existing || !existing.donors) {
      throw new Error("Donation evidence not found")
    }

    let donorId = existing.donor_id
    const linkedDonor = existing.donors

    const phoneChanged =
      fields.phone_number !== undefined &&
      normalizePhone(fields.phone_number) !==
        normalizePhone(linkedDonor.phone_number)

    if (phoneChanged) {
      donorId = await resolveDonorIdForDonation(tx, {
        name: (fields.full_name ?? linkedDonor.name) ?? "",
        phone_number: fields.phone_number!,
        email:
          fields.email !== undefined ? fields.email : linkedDonor.email,
      })
    } else {
      const donorUpdate: Pick<Prisma.donorsUpdateInput, "name" | "email"> =
        {}
      if (fields.full_name !== undefined) {
        donorUpdate.name = fields.full_name
      }
      if (fields.email !== undefined) {
        const t = fields.email?.trim()
        donorUpdate.email = t && t.length > 0 ? t : null
      }
      if (Object.keys(donorUpdate).length > 0) {
        await tx.donors.update({
          where: { id: existing.donor_id },
          data: donorUpdate,
        })
      }
    }

    return tx.donation_evidences.update({
      where: { id: idBig },
      data: {
        ...(fields.payment_method !== undefined
          ? { payment_method: fields.payment_method }
          : {}),
        ...(fields.amount !== undefined
          ? { amount: Number(fields.amount) }
          : {}),
        ...(fields.evidence_url !== undefined
          ? { evidence_url: fields.evidence_url }
          : {}),
        ...(fields.description !== undefined
          ? { description: fields.description }
          : {}),
        ...(fields.donation_upload_at !== undefined
          ? {
              donation_upload_at: new Date(fields.donation_upload_at),
            }
          : {}),
        ...(fields.program_id !== undefined
          ? { program_id: Number(fields.program_id) }
          : {}),
        donor_id: donorId,
        updated_at: new Date(),
      },
    })
  })
}

export const getDonationEvidenceStats = cache(async () => {
  await verifySession()

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const statsToday = await prisma.donation_evidences.aggregate({
    where: {
      donation_upload_at: { gte: startOfToday },
    },
    _sum: { amount: true },
    _count: { id: true },
  })

  return {
    todayDonorsCount: statsToday._count.id,
    todayCollectedAmount: Number(statsToday._sum.amount ?? 0),
  }
})

export async function bulkCreateDonationEvidence(rows: DonationEvidenceBulkRowData[]) {
  if (rows.length === 0) throw new Error("File kosong")

  const donationsData = rows.map((row, index) => {
    const amount = Number(row.amount)
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Baris ${index + 1}: amount tidak valid`)
    }
    const emailTrim = row.email?.trim()
    return {
      full_name: row.full_name,
      phone_number: normalizePhone(row.phone_number),
      payment_method: row.payment_method,
      amount,
      donation_upload_at: new Date(),
      program_id: Number(row.program_id),
      evidence_url: row.evidence_url,
      description: row.description,
      email: emailTrim && emailTrim.length > 0 ? emailTrim : null,
    }
  })

  return await prisma.$transaction(
    async tx => {
      const donorIdByPhone = new Map<string, bigint>()
      for (const row of donationsData) {
        const key = row.phone_number
        if (donorIdByPhone.has(key)) continue
        const id = await resolveDonorIdForDonation(tx, {
          name: row.full_name,
          phone_number: row.phone_number,
          email: row.email,
        })
        donorIdByPhone.set(key, id)
      }

      const rowsWithDonor = donationsData.map(d => ({
        donor_id: donorIdByPhone.get(d.phone_number)!,
        payment_method: d.payment_method,
        amount: d.amount,
        donation_upload_at: d.donation_upload_at,
        program_id: d.program_id,
        evidence_url: d.evidence_url ?? null,
        description: d.description ?? null,
      }))

      const uniqueProgramIds = [
        ...new Set(rowsWithDonor.map(d => d.program_id)),
      ]
      const programs = await tx.program_donation.findMany({
        where: { id: { in: uniqueProgramIds } },
        select: { id: true },
      })

      if (programs.length !== uniqueProgramIds.length) {
        throw new Error("Beberapa Program ID tidak ditemukan di database")
      }

      const programTotals = rowsWithDonor.reduce(
        (acc, curr) => {
          acc[curr.program_id] = (acc[curr.program_id] || 0) + curr.amount
          return acc
        },
        {} as Record<number, number>
      )

      const sortedIds = uniqueProgramIds.sort((a, b) => a - b)
      for (const id of sortedIds) {
        await tx.program_donation.update({
          where: { id },
          data: { collected_amount: { increment: programTotals[id] } },
        })
      }

      const result = await tx.donation_evidences.createMany({
        data: rowsWithDonor,
      })

      return { inserted: result.count }
    },
    {
      timeout: 10000,
    }
  )
}

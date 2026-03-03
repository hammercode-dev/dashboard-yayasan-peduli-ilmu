import "server-only"
import { cache } from "react"

import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"

import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"

import {
  DonationEvidenceFormData,
  UpdateDonationFormData,
} from "./donation.schemas"

export interface UpdateDonationEvidenceInput extends Partial<UpdateDonationFormData> {
  id: string
}

export const getDonationEvidences = cache(
  async (query: string, currentPage: number) => {
    await verifySession()

    const offset = (currentPage - 1) * TOTAL_DONATIONS_PER_PAGE

    return prisma.donation_evidences.findMany({
      where: {
        full_name: { contains: query || "", mode: "insensitive" },
      },
      include: {
        program_donation: {
          select: {
            id: true,
            title: true,
            collected_amount: true,
          },
        },
      },

      take: TOTAL_DONATIONS_PER_PAGE,
      skip: offset,
      orderBy: { created_at: "desc" },
    })
  }
)

export const countDonationEvidences = cache(async (query: string) => {
  await verifySession()

  return prisma.donation_evidences.count({
    where: {
      full_name: { contains: query || "", mode: "insensitive" },
    },
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

export async function createDonationEvidence(input: DonationEvidenceFormData) {
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

    const donation = await tx.donation_evidences.create({
      data: {
        full_name: input.full_name,
        phone_number: input.phone_number,
        payment_method: input.payment_method,
        amount: amount,
        donation_upload_at: new Date(input.donation_upload_at),
        program_id: programId,
        evidence_url: input.evidence_url,
        description: input.description,
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

  return prisma.donation_evidences.update({
    where: { id: BigInt(id) },
    data: {
      ...fields,
      ...(fields.program_id ? { program_id: Number(fields.program_id) } : {}),
      ...(fields.donation_upload_at
        ? { donation_upload_at: new Date(fields.donation_upload_at) }
        : {}),
      updated_at: new Date(),
    },
  })
}

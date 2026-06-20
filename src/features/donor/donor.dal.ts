import "server-only"
import { cache } from "react"

import { Prisma } from "@/generated/prisma"
import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"
import { requireSuperAdmin } from "@/lib/authorization"

import type { CreateDonorFormData, UpdateDonorFormData } from "./donor.schemas"

export function normalizePhone(phone: string): string {
  return phone.trim()
}

export async function resolveDonorIdForDonation(
  tx: Prisma.TransactionClient,
  input: { name: string; phone_number: string; email?: string | null }
): Promise<bigint> {
  const phone = normalizePhone(input.phone_number)
  const existing = await tx.donors.findUnique({
    where: { phone_number: phone },
  })
  if (existing) return existing.id

  const nameTrimmed = input.name.trim()
  const emailRaw = input.email?.trim()
  const created = await tx.donors.create({
    data: {
      name: nameTrimmed.length > 0 ? nameTrimmed : "(Tanpa nama)",
      phone_number: phone,
      email: emailRaw && emailRaw.length > 0 ? emailRaw : null,
    },
  })
  return created.id
}

export const getDonors = cache(
  async (query: string, currentPage: number, limit: number) => {
    await verifySession()

    const offset = (currentPage - 1) * limit
    const normalizedQuery = query.trim()
    const where =
      normalizedQuery.length > 0
        ? {
            OR: [
              { name: { contains: normalizedQuery, mode: "insensitive" as const } },
              {
                phone_number: {
                  contains: normalizedQuery,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: normalizedQuery,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : undefined

    return prisma.donors.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { created_at: "desc" },
    })
  }
)

export const countDonors = cache(async (query: string) => {
  await verifySession()
  const normalizedQuery = query.trim()
  const where =
    normalizedQuery.length > 0
      ? {
          OR: [
            { name: { contains: normalizedQuery, mode: "insensitive" as const } },
            {
              phone_number: {
                contains: normalizedQuery,
                mode: "insensitive" as const,
              },
            },
            {
              email: { contains: normalizedQuery, mode: "insensitive" as const },
            },
          ],
        }
      : undefined

  return prisma.donors.count({ where })
})

export async function getDonorById(id: bigint) {
  await verifySession()

  return prisma.donors.findUniqueOrThrow({
    where: { id },
  })
}

export async function createDonor(input: CreateDonorFormData) {
  await requireSuperAdmin()

  const phone = normalizePhone(input.phone_number)
  const existing = await prisma.donors.findUnique({
    where: { phone_number: phone },
  })
  if (existing) {
    throw new Error("Donor with this phone number already exists")
  }

  const emailRaw = input.email?.trim()
  return prisma.donors.create({
    data: {
      name: input.name.trim(),
      phone_number: phone,
      email: emailRaw && emailRaw.length > 0 ? emailRaw : null,
    },
  })
}

export async function updateDonor(input: UpdateDonorFormData & { id: bigint }) {
  await requireSuperAdmin()

  const { id, ...fields } = input
  const phone = normalizePhone(fields.phone_number)

  const duplicate = await prisma.donors.findFirst({
    where: {
      phone_number: phone,
      NOT: { id },
    },
  })
  if (duplicate) {
    throw new Error("Donor with this phone number already exists")
  }

  const emailRaw = fields.email?.trim()
  return prisma.donors.update({
    where: { id },
    data: {
      name: fields.name.trim(),
      phone_number: phone,
      email: emailRaw && emailRaw.length > 0 ? emailRaw : null,
    },
  })
}

export async function deleteDonor(id: bigint) {
  await requireSuperAdmin()

  const donationCount = await prisma.donation_evidences.count({
    where: { donor_id: id },
  })
  if (donationCount > 0) {
    throw new Error("Donor has donation history and cannot be deleted")
  }

  await prisma.donors.delete({
    where: { id },
  })
}

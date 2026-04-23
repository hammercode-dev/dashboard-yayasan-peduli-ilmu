import "server-only"
import { cache } from "react"

import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"

import { TOTAL_USERS_PER_PAGE } from "@/constants/data"

export const getUsers = cache(async (query: string, currentPage: number) => {
  await verifySession()

  const offset = (currentPage - 1) * TOTAL_USERS_PER_PAGE

  return prisma.users.findMany({
    where: {
      email: { contains: query || "", mode: "insensitive" },
    },

    select: {
      id: true,
      email: true,
      created_at: true,
      updated_at: true,
      profiles: {
        select: {
          username: true,
          full_name: true,
          phone_number: true,
          address: true,
          roles: {
            select: {
              name: true,
            },
          },
        },
      },
    },

    take: TOTAL_USERS_PER_PAGE,
    skip: offset,
    orderBy: { created_at: "desc" },
  })
})

export const countUsers = cache(async (query: string) => {
  await verifySession()

  return prisma.users.count({
    where: {
      email: { contains: query || "", mode: "insensitive" },
    },
  })
})

export const deleteUser = cache(async (id: string) => {
  await verifySession()

  return prisma.users.delete({
    where: { id  },
  })
})

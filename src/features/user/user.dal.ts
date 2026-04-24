import "server-only"
import { cache } from "react"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/client"
import { verifySession } from "@/lib/session"

import { TOTAL_USERS_PER_PAGE } from "@/constants/data"
import { CreateUserFormData, UpdateUserFormData } from "./user.schemas"

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
    where: { id },
  })
})

export const getRoles = cache(async () => {
  await verifySession()

  return prisma.roles.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  })
})

export async function createUser(input: CreateUserFormData) {
  await verifySession()

  const existingUser = await prisma.users.findUnique({
    where: { email: input.email },
  })

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  const hashedPassword = await bcrypt.hash(input.password, 10)

  return prisma.users.create({
    data: {
      email: input.email,
      password: hashedPassword,
      profiles: {
        create: {
          username: input.username,
          full_name: input.full_name,
          phone_number: input.phone_number,
          address: input.address,
          role_id: BigInt(input.role_id),
        },
      },
    },
    select: {
      id: true,
      email: true,
      created_at: true,
      profiles: {
        select: {
          username: true,
          full_name: true,
          phone_number: true,
          address: true,
          role_id: true,
          roles: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
}

export async function getUserById(id: string) {
  await verifySession()

  return prisma.users.findUniqueOrThrow({
    where: { id },
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
          role_id: true,
          roles: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
}

export async function updateUser(input: UpdateUserFormData & { id: string }) {
  await verifySession()

  const existingUser = await prisma.users.findFirst({
    where: {
      email: input.email,
      NOT: { id: input.id },
    },
  })

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  const passwordData =
    input.password.length > 0
      ? { password: await bcrypt.hash(input.password, 10) }
      : {}

  return prisma.users.update({
    where: { id: input.id },
    data: {
      email: input.email,
      ...passwordData,
      profiles: {
        upsert: {
          update: {
            username: input.username,
            full_name: input.full_name,
            phone_number: input.phone_number,
            address: input.address,
            role_id: BigInt(input.role_id),
          },
          create: {
            username: input.username,
            full_name: input.full_name,
            phone_number: input.phone_number,
            address: input.address,
            role_id: BigInt(input.role_id),
          },
        },
      },
    },
    select: {
      id: true,
      email: true,
      updated_at: true,
      profiles: {
        select: {
          username: true,
          full_name: true,
          phone_number: true,
          address: true,
          role_id: true,
          roles: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
}

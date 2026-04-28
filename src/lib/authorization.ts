import "server-only"

import { verifySession } from "@/lib/session"
import { prisma } from "@/lib/client"
import { isSuperAdminRole, mapRoleNameToCode } from "@/features/auth/roles"

export class ForbiddenError extends Error {
  constructor(message = "FORBIDDEN") {
    super(message)
    this.name = "ForbiddenError"
  }
}

export async function requireSuperAdmin() {
  const session = await verifySession()

  const profile = await prisma.profiles.findUnique({
    where: { id: session.userId },
    select: {
      full_name:true,
      roles: {
        select: {
          name: true,
        },
      },
    },
  })

  const currentRoleCode = mapRoleNameToCode(profile?.roles?.name)

  if (!isSuperAdminRole(currentRoleCode)) {
    throw new ForbiddenError()
  }
}

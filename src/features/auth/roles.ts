export const ROLE_CODES = {
  SUPER_ADMIN: "SUPER_ADMIN",
} as const

export type RoleCode = (typeof ROLE_CODES)[keyof typeof ROLE_CODES]

export function mapRoleNameToCode(roleName: string | null | undefined): RoleCode | null {
  if (!roleName) return null

  const normalizedRoleName = roleName.trim().toUpperCase().replace(/\s+/g, "_")

  if (normalizedRoleName === ROLE_CODES.SUPER_ADMIN) {
    return ROLE_CODES.SUPER_ADMIN
  }

  return null
}

export function isSuperAdminRole(roleCode: string | null | undefined): boolean {
  return roleCode === ROLE_CODES.SUPER_ADMIN
}

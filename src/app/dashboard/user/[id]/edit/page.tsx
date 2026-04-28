import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { isSuperAdminRole } from "@/features/auth/roles"

import EditUserPage from "@/features/user/pages/EditUserPage"

export const metadata: Metadata = {
  title: "Edit User",
  description: "Edit informasi user dengan mudah di dashboard Peduli Ilmu",
}

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!isSuperAdminRole(session?.roleCode)) {
    redirect("/dashboard/user")
  }

  const { id } = await params
  return <EditUserPage id={id} />
}

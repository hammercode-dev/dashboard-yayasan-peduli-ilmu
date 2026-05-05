import CreateUserPage from "@/features/user/pages/CreateUserPage"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { isSuperAdminRole } from "@/features/auth/roles"

export default async function CreateUser() {
  const session = await getSession()

  if (!isSuperAdminRole(session?.roleCode)) {
    redirect("/dashboard/user")
  }

  return <CreateUserPage />
}

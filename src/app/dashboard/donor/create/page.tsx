import CreateDonorPage from "@/features/donor/pages/CreateDonorPage"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { isSuperAdminRole } from "@/features/auth/roles"

export default async function CreateDonor() {
  const session = await getSession()

  if (!isSuperAdminRole(session?.roleCode)) {
    redirect("/dashboard/donor")
  }

  return <CreateDonorPage />
}

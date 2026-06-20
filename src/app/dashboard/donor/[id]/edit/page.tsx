import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { isSuperAdminRole } from "@/features/auth/roles"

import EditDonorPage from "@/features/donor/pages/EditDonorPage"

export const metadata: Metadata = {
  title: "Edit Donatur",
  description: "Ubah data donatur di dashboard Peduli Ilmu",
}

export default async function DonorEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!isSuperAdminRole(session?.roleCode)) {
    redirect("/dashboard/donor")
  }

  const { id } = await params
  return <EditDonorPage id={id} />
}

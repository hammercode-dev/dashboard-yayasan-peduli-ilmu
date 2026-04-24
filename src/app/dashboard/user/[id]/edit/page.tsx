import { Metadata } from "next"

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
  const { id } = await params
  return <EditUserPage id={id} />
}

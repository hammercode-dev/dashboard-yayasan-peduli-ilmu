import { Metadata } from "next"

import DetailUserPage from "@/features/user/pages/DetailUserPage"

export const metadata: Metadata = {
  title: "Detail User",
  description: "Lihat informasi lengkap user di dashboard Peduli Ilmu",
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DetailUserPage id={id} />
}

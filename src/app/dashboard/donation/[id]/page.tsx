import { Metadata } from "next"

import DetailDonationPage from "@/features/donation/pages/DetailDonationPage"

export const metadata: Metadata = {
  title: "Detail Donasi",
  description: "Lihat detail donasi dengan mudah di dashboard Peduli Ilmu",
}

export default async function DonationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DetailDonationPage id={id} />
}

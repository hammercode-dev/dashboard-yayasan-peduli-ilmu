import { Metadata } from "next"

import EditDonationPage from "@/features/donation/pages/EditDonation"

export const metadata: Metadata = {
  title: "Edit Donasi",
  description: "Edit informasi donasi dengan mudah di dashboard Peduli Ilmu",
}

export default async function DonationEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditDonationPage id={id} />
}

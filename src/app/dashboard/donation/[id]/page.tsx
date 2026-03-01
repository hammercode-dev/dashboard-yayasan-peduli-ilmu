import DetailDonationPage from "@/features/donation/pages/DetailDonationPage"

export default async function DonationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DetailDonationPage id={id} />
}

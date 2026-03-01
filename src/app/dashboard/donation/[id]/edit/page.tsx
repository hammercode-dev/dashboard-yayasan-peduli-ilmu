import EditDonationPage from "@/features/donation/pages/EditDonation"

export default async function DonationEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditDonationPage id={id} />
}

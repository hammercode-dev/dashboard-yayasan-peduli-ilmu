import DetailDonorPage from "@/features/donor/pages/DetailDonorPage"

export default async function DonorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DetailDonorPage id={id} />
}

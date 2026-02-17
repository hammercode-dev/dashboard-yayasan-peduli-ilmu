import DetailProgramPage from "@/features/program/pages/DetailProgramPage"

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DetailProgramPage id={id} />
}

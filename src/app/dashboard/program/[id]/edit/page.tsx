import EditProgramPage from "@/features/program/pages/EditProgramPage"

export default async function ProgramEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditProgramPage id={id} />
}

import { fetchCountProgramDonation } from "@/features/program/data"
import ProgramPage from "@/features/program/pages/ProgramPage"

export default async function Program(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
    status?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1
  const status = searchParams?.status || "all"
  const totalData = await fetchCountProgramDonation(query, status)

  return (
    <ProgramPage
      query={query}
      currentPage={currentPage}
      totalData={totalData}
      status={status}
    />
  )
}

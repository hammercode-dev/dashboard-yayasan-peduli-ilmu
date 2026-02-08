import { fetchCountProgramDonationByQuery } from "@/features/program/data"
import ProgramPage from "@/features/program/pages/ProgramPage"

export default async function Program(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1
  const totalData = await fetchCountProgramDonationByQuery(query)

  return (
    <ProgramPage
      query={query}
      currentPage={currentPage}
      totalData={totalData}
    />
  )
}

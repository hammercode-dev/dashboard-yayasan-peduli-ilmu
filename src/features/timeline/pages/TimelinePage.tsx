"use client"

import { useGetAllProgramDonationsQuery } from "@/features/program/program.api"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SearchProgram } from "@/features/donation/components/SearchProgram"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { TimelineEmptyState } from "../components"
import { useGetTimelineByProgramIdQuery } from "../timeline.api"
import TimelineNoData from "../components/TimelineNoData"

export default function TimelinePage() {
  // state
  const [search, setSearch] = useState("")
  const [selectedProgram, setSelectedProgram] = useState<string | number>("")
  const debouncedSearch = useDebounce(search, 300)

  // fetching
  const { data, isFetching } = useGetAllProgramDonationsQuery({
    query: debouncedSearch,
  })
  const { data: dataTimeline, isFetching: isFetchingTimeline } =
    useGetTimelineByProgramIdQuery(Number(selectedProgram))

  // mapping
  const programOptions = data?.data.donations.map((p: any) => ({
    id: p.id,
    nama: p.title,
    collectedAmount: p.collected_amount,
  }))

  // component
  return (
    <section className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Timeline Program</h1>
        <p>Pilih program dahulu untuk melihat timeline</p>
      </div>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <SearchProgram
                className="md:w-96 w-full"
                programs={programOptions}
                value={selectedProgram}
                onChange={id => setSelectedProgram(String(id))}
                onSearch={() => setSearch(debouncedSearch)}
                isFetching={isFetching}
              />
              <Button disabled={!selectedProgram} variant="default">
                Tambah Timeline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <TimelineContent selectedProgram={selectedProgram} isFetchingTimeline={isFetchingTimeline} dataTimeline={dataTimeline} />
    </section>
  )
}

function TimelineContent({
  selectedProgram,
  isFetchingTimeline,
  dataTimeline,
}: {
  selectedProgram: string | number
  isFetchingTimeline: boolean
  dataTimeline: any
}) {
  if (!selectedProgram) return <TimelineEmptyState />
  if (isFetchingTimeline) return <p>Loading...</p>
  if (!dataTimeline?.data?.length) return <TimelineNoData />

  return <p>data {JSON.stringify(dataTimeline.data)}</p>
}
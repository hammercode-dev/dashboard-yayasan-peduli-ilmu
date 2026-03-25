"use client"

import { useGetAllProgramDonationsQuery } from "@/features/program/program.api"
import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { SearchProgram } from "@/features/donation/components/SearchProgram"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { SkeletonTimelineList, TimelineEmptyState } from "../components"
import { useGetTimelineByProgramIdQuery } from "../timeline.api"
import TimelineNoData from "../components/TimelineNoData"
import TimelineEditor from "../components/TimelineEditor"
import type { TimelineEditorItem } from "../components/TimelineEditor"

function createDraftItem(programId: number): TimelineEditorItem {
  return {
    id: `draft-${Date.now()}`,
    date: format(new Date(), "yyyy-MM-dd"),
    activity: "",
    activity_en: "",
    activity_ar: "",
    cost: "",
    description: "",
    program_id: String(programId),
  }
}

export default function TimelinePage() {
  // state
  const [search, setSearch] = useState("")
  const [selectedProgram, setSelectedProgram] = useState<string | number>("")
  const [localDrafts, setLocalDrafts] = useState<TimelineEditorItem[]>([])
  const [pendingExpandIndex, setPendingExpandIndex] = useState<number | null>(
    null
  )
  const debouncedSearch = useDebounce(search, 300)

  // fetching
  const { data, isFetching } = useGetAllProgramDonationsQuery({
    query: debouncedSearch,
  })
  const { data: dataTimeline, isFetching: isFetchingTimeline } =
    useGetTimelineByProgramIdQuery(Number(selectedProgram) || 0, {
      skip: !selectedProgram,
    })

  // mapping
  const programOptions = (data?.data?.donations ?? []).map(
    (p: { id: string; title: string; collected_amount?: string }) => ({
      id: p.id,
      nama: p.title,
      collectedAmount: p.collected_amount,
    })
  )

  const handleAddTimeline = () => {
    if (!selectedProgram) return
    const draft = createDraftItem(Number(selectedProgram))
    const serverCount = (dataTimeline?.data?.length ?? 0) as number
    setLocalDrafts(d => [...d, draft])
    setPendingExpandIndex(serverCount + localDrafts.length)
  }

  const handleDraftSaved = (draftId: string) => {
    setLocalDrafts(d => d.filter(x => x.id !== draftId))
  }

  const handleDraftRemoved = (draftId: string) => {
    setLocalDrafts(d => d.filter(x => x.id !== draftId))
  }

  // component
  return (
    <section className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Timeline Program</h1>
        <p>Pilih program dahulu untuk melihat keseluruhan timeline</p>
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
              <Button
                disabled={!selectedProgram}
                variant="default"
                onClick={handleAddTimeline}
              >
                Tambah Timeline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <TimelineContent
        selectedProgram={selectedProgram}
        isFetchingTimeline={isFetchingTimeline}
        dataTimeline={dataTimeline}
        localDrafts={localDrafts}
        pendingExpandIndex={pendingExpandIndex}
        onExpandApplied={() => setPendingExpandIndex(null)}
        onAddTimeline={handleAddTimeline}
        onDraftSaved={handleDraftSaved}
        onDraftRemoved={handleDraftRemoved}
      />
    </section>
  )
}

function TimelineContent({
  selectedProgram,
  isFetchingTimeline,
  dataTimeline,
  localDrafts,
  pendingExpandIndex,
  onExpandApplied,
  onAddTimeline,
  onDraftSaved,
  onDraftRemoved,
}: {
  selectedProgram: string | number
  isFetchingTimeline: boolean
  dataTimeline: { data?: unknown[] } | undefined
  localDrafts: TimelineEditorItem[]
  pendingExpandIndex: number | null
  onExpandApplied: () => void
  onAddTimeline: () => void
  onDraftSaved: (draftId: string) => void
  onDraftRemoved: (draftId: string) => void
}) {
  const serverItems =
    (dataTimeline?.data as TimelineEditorItem[] | undefined) ?? []
  const items = [...serverItems, ...localDrafts]
  const hasItems = items.length > 0

  if (!selectedProgram) return <TimelineEmptyState />
  if (isFetchingTimeline && localDrafts.length === 0)
    return <SkeletonTimelineList />

  if (!hasItems) return <TimelineNoData onAddTimeline={onAddTimeline} />

  return (
    <Card>
      <CardContent>
        <TimelineEditor
          items={items}
          programId={Number(selectedProgram)}
          pendingExpandIndex={pendingExpandIndex}
          onExpandApplied={onExpandApplied}
          onDraftSaved={onDraftSaved}
          onDraftRemoved={onDraftRemoved}
        />
      </CardContent>
    </Card>
  )
}

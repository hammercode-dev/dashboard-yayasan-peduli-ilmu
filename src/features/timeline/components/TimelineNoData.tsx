import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

interface TimelineNoDataProps {
  onAddTimeline?: () => void
}

export default function TimelineNoData({ onAddTimeline }: TimelineNoDataProps) {
  return (
    <div className="rounded-lg h-72 flex flex-col items-center justify-center gap-2 border border-dashed text-center text-muted-foreground">
      <XCircle className="w-5 h-5 opacity-70" />
      <p className="text-sm">Timeline tidak ditemukan</p>
      <Button variant="outline" size="sm" onClick={onAddTimeline}>
        Tambah Timeline
      </Button>
    </div>
  )
}

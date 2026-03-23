import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function TimelineNoData() {
  return (
    <div className="rounded-lg h-32 flex flex-col items-center justify-center gap-2 border border-dashed text-center text-muted-foreground">
      <XCircle className="w-5 h-5 opacity-70" />
      <p className="text-sm">Timeline Tidak ditemukan</p>
      <Button variant="outline" size="sm">Tambah Timeline</Button>
    </div>
  )
}

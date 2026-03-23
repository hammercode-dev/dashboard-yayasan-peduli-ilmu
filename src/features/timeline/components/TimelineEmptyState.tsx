import { Folder } from "lucide-react"

export default function TimelineEmptyState() {
  return (
    <div className="rounded-lg h-32 flex flex-col items-center justify-center gap-2 border border-dashed text-center text-muted-foreground">
      <Folder className="w-5 h-5 opacity-70" />
      <p className="text-sm">Pilih program untuk melihat timeline</p>
    </div>
  )
}

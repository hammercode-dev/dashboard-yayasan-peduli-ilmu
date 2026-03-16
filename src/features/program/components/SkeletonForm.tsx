import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      {/* CARD: Judul Program */}
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" /> {/* Card Title */}
        </CardHeader>
        <CardContent className="space-y-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-40" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CARD: Deskripsi Singkat */}
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-40" /> {/* Card Title */}
        </CardHeader>
        <CardContent className="space-y-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-48" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CARD: Deskripsi Lengkap (Rich Text Editor) */}
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-44" /> {/* Card Title */}
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-52" /> {/* Label */}
              <Skeleton className="h-48 w-full rounded-md" />{" "}
              {/* Editor Area */}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CARD: Informasi Keuangan */}
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-36" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-8 w-24 rounded-md" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

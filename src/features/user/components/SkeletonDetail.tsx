import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export const SkeletonDetail = () => {
  return (
<Card className="shadow-md border-slate-200 overflow-hidden">
  {/* Header */}
  <CardHeader className="bg-slate-50/80 border-b flex flex-row items-center justify-between gap-4 py-4">
    <div className="flex items-center gap-3">
      <Skeleton className="hidden sm:block h-10 w-10 rounded-full" />
      <Skeleton className="h-6 w-56" />
    </div>

    <Skeleton className="h-10 w-32 rounded-md shrink-0" />
  </CardHeader>

  <CardContent className="p-4 md:p-6 space-y-8">
    {/* Main Info Grid */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-40" />
        </div>
      ))}
    </div>

    {/* Address Section */}
    <div className="bg-blue-50/50 p-4 rounded-xl space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
    </div>

    <Separator />

    {/* Dates Section */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg"
        >
          <Skeleton className="h-5 w-5 rounded" />

          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
  )
}
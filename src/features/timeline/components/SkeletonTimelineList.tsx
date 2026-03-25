import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonTimelineList() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    </div>
  )
} 

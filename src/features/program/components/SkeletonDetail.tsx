import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDetail() {
  return (
    <section className="space-y-6 py-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Skeleton className="h-10 w-full md:col-span-2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </section>
  )
}

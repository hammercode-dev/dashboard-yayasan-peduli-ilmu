import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDetail() {
  return (
    <section className="min-h-screen bg-zinc-50/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b pb-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />{" "}
              {/* Status Badge */}
              <Skeleton className="h-5 w-24 rounded-md" /> {/* ID Badge */}
            </div>
            <Skeleton className="h-8 w-3/4 md:w-[400px]" /> {/* Title */}
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-5 w-32" /> {/* MetaChip 1 */}
              <Skeleton className="h-5 w-28" /> {/* MetaChip 2 */}
              <Skeleton className="h-5 w-36" /> {/* MetaChip 3 */}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Placeholder */}
            <Skeleton className="aspect-video w-full rounded-xl border-2" />

            {/* Tabs Description */}
            <div className="rounded-xl border bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-10" />
                  <Skeleton className="h-8 w-10" />
                  <Skeleton className="h-8 w-10" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            {/* Tabs Timeline/Donatur */}
            <div className="rounded-xl border bg-white p-5">
              <div className="flex gap-4 mb-6">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 pb-6">
                  <Skeleton className="size-2 rounded-full mt-2" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <div className="space-y-4">
            <div className="sticky top-6 rounded-xl border bg-white p-5 space-y-6">
              <Skeleton className="h-4 w-32" /> {/* Status Pendanaan Label */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />{" "}
                {/* Progress Bar */}
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="grid grid-cols-2 gap-4 py-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
              <div className="grid gap-3">
                <Skeleton className="h-10 w-full rounded-md" /> {/* Button 1 */}
                <Skeleton className="h-10 w-full rounded-md" /> {/* Button 2 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

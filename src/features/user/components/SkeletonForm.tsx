import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonForm = () => {
  return (
<form className="space-y-6">
  {/* Informasi Akun */}
  <Card className="shadow-sm">
    <CardHeader>
      <Skeleton className="h-6 w-40" /> 
      <Skeleton className="h-4 w-64 mt-2" />
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Email */}
        <div className="space-y-2 md:col-span-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Profil User */}
  <Card className="shadow-sm">
    <CardHeader>
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-4 w-72 mt-2" />
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Username */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Footer Actions */}
  <div className="sticky bottom-0 bg-background pt-6 flex justify-end gap-3">
    <Skeleton className="h-10 w-24 rounded-md" />
    <Skeleton className="h-10 w-32 rounded-md" />
  </div>
</form>
  )
}
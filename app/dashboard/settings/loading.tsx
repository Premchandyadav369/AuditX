import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <Skeleton className="h-10 w-full max-w-2xl" />
      <Skeleton className="h-12 w-full max-w-xl" />
      <Skeleton className="h-[600px]" />
    </div>
  )
}

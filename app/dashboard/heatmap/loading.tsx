import { Skeleton } from "@/components/ui/skeleton"

export default function HeatmapLoading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function TagsLoading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <Skeleton className="h-10 w-full max-w-2xl" />
      <Skeleton className="h-[150px]" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>
    </div>
  )
}

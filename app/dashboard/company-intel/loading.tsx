export default function Loading() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <div className="h-10 w-96 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full max-w-2xl bg-muted animate-pulse rounded" />
      </div>
      <div className="h-48 bg-muted animate-pulse rounded-lg" />
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-warm-200/80 ${className}`} />
}

export function ShopCardSkeleton() {
  return (
    <div className="min-w-[160px] rounded-3xl bg-white p-4 shadow-card">
      <Skeleton className="mb-3 h-20 w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-card">
      <Skeleton className="mb-3 h-24 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-3 h-3 w-2/3" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

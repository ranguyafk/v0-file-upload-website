export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-muted rounded-xl" />
      <div className="h-8 bg-muted rounded-lg w-3/4" />
      <div className="h-8 bg-muted rounded-lg w-1/2" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-muted rounded-xl" />
        <div className="flex-1">
          <div className="h-6 bg-muted rounded w-32 mb-2" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-10 bg-muted rounded-lg" />
        <div className="h-10 bg-muted rounded-lg" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>

          <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-xl" />
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-24 mb-2" />
                <div className="h-4 bg-muted rounded w-48" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-muted/30 animate-pulse">
              <div className="h-5 bg-muted rounded w-32" />
            </div>
            <div className="divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-16 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

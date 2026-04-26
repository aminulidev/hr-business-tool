import AppShell from '@/components/layout/AppShell';

export default function Loading() {
  return (
    <AppShell>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-pulse">
        {/* Hero Skeleton */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="h-14 w-3/4 mx-auto bg-muted rounded-2xl"></div>
          <div className="h-6 w-5/6 mx-auto bg-muted rounded-lg"></div>
          <div className="h-10 w-48 mx-auto bg-primary/20 rounded-full mt-8"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-12 mt-16">
          {[1, 2, 3].map((category) => (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-lg"></div>
                <div className="h-8 w-48 bg-muted rounded-lg"></div>
                <div className="h-5 w-24 bg-muted rounded-full ml-2"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="h-40 rounded-2xl border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-muted rounded-xl"></div>
                      <div className="h-6 w-32 bg-muted rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-4/5 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

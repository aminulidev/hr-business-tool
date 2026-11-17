import Link from 'next/link';

/**
 * The page frame for loading states: the same background and header bar as
 * AppShell, with the logo, and nothing interactive.
 *
 * loading.tsx files use this instead of AppShell. AppShell is a client
 * component, and every route file that imports it gets its own copy of the
 * header and footer code; the two loading files made every page download the
 * shell three times. This component has no client code of its own, and a
 * loading state is on screen only while the next page's data arrives.
 */
export default function ShellSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient relative">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl shadow-lg relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" prefetch={false} className="flex items-center gap-2">
              <img src="/logo.svg" alt="QuickBizCalc Logo" className="h-9 w-9 drop-shadow-md" />
              <div className="text-lg font-bold tracking-tight text-foreground">
                QuickBiz<span className="text-emerald-600">Calc</span>
              </div>
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}

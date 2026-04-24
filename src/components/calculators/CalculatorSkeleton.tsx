'use client';

import { motion } from 'framer-motion';

export default function CalculatorSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center space-x-2">
        <div className="h-4 w-16 bg-muted rounded"></div>
        <div className="h-4 w-4 bg-muted rounded-full"></div>
        <div className="h-4 w-32 bg-muted rounded"></div>
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="h-16 w-16 bg-muted rounded-2xl shrink-0"></div>
        <div className="space-y-3 flex-1">
          <div className="h-10 w-3/4 bg-muted rounded-lg"></div>
          <div className="h-5 w-full bg-muted rounded"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted rounded"></div>
                <div className="h-12 w-full bg-muted rounded-xl"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted rounded"></div>
                <div className="h-12 w-full bg-muted rounded-xl"></div>
              </div>
            </div>
            <div className="h-12 w-48 bg-primary/20 rounded-xl"></div>
          </div>

          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-32 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-10 w-full bg-muted rounded-lg"></div>
              <div className="h-10 w-full bg-muted rounded-lg"></div>
              <div className="h-10 w-full bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

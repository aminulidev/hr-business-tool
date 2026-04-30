'use client';

import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { SITE_NAME } from '@/lib/calculator-meta';
import { motion } from 'framer-motion';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="py-4 sm:py-8">
      {/* Breadcrumb Navigation */}
      <motion.nav
        aria-label="Breadcrumb"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          <li className="flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Home className="size-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground/50 mx-1" />
          </li>
          <li className="flex items-center">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              All Calculators
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground/50 mx-1" />
          </li>
          <li>
            <span className="text-foreground font-medium" aria-current="page">
              {title}
            </span>
          </li>
        </ol>
      </motion.nav>

      {/* Page Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {/* <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p> */}
        </div>
        <div className="prose-custom">{children}</div>
      </div>
    </div>
  );
}

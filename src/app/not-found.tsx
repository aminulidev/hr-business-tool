'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="flex items-center justify-center mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25">
            <Calculator className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            The calculator you are looking for does not exist or has been moved.
            Browse our collection of 24 free business and HR calculators.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            >
              <Home className="h-4 w-4 mr-2" />
              All Calculators
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

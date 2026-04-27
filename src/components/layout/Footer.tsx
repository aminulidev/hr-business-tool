'use client';

import Link from 'next/link';
import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Brand row */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <Calculator className="h-4 w-4" />
          <span className="text-sm font-medium">QuickBizCalc</span>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground/70 max-w-2xl mx-auto mb-6">
          Free online calculators for small businesses, HR professionals, and
          entrepreneurs. All calculations are for informational purposes only
          and should not be considered financial, tax, or legal advice.
          Please consult a qualified professional for advice specific to your situation.
        </p>

        {/* Legal links - 2 rows for better mobile layout */}
        <nav aria-label="Footer navigation">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground/60 mb-3">
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors duration-200 underline-offset-2 hover:underline"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors duration-200 underline-offset-2 hover:underline"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors duration-200 underline-offset-2 hover:underline"
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-foreground transition-colors duration-200 underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-foreground transition-colors duration-200 underline-offset-2 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="hover:text-foreground transition-colors duration-200 underline-offset-2 hover:underline"
            >
              Cookie Policy
            </Link>
            <Link
              href="/disclaimer"
              className="hover:text-foreground transition-colors duration-200 underline-offset-2 hover:underline"
            >
              Disclaimer
            </Link>
          </div>
        </nav>

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} QuickBizCalc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowLeft, Info, Mail, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculators, type CalculatorMeta } from '@/lib/calculator-meta';

// ─── Search Component ────────────────────────────────────────────────────────

function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results: CalculatorMeta[] = query.trim().length < 2
    ? []
    : calculators
        .filter((c) => {
          const q = query.toLowerCase();
          return (
            c.title.toLowerCase().includes(q) ||
            c.shortDescription.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            c.keywords.some((k) => k.toLowerCase().includes(q))
          );
        })
        .slice(0, 8);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onMouse);
    return () => document.removeEventListener('mousedown', onMouse);
  }, []);

  const handleSelect = (path: string) => { setOpen(false); router.push(path); };

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Search calculators"
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-border/50 bg-background/80 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
          </motion.button>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, width: 36 }}
            animate={{ opacity: 1, width: 220 }}
            exit={{ opacity: 0, width: 36 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
            className="relative flex items-center"
          >
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none z-10" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search calculators…"
              aria-label="Search calculators"
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-emerald-500/40 bg-background text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder:text-muted-foreground/60"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown results */}
      <AnimatePresence>
        {open && query.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border/60 bg-popover shadow-xl shadow-black/10 overflow-hidden z-[60]"
            role="listbox"
            aria-label="Search results"
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No calculators found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <ul>
                {results.map((calc) => {
                  const Icon = calc.icon;
                  return (
                    <li key={calc.slug}>
                      <button
                        type="button"
                        role="option"
                        aria-selected="false"
                        onClick={() => handleSelect(calc.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/60 transition-colors text-left group"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                          <Icon className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{calc.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{calc.category}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHub = pathname === '/';
  const isLegalPage = [
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    '/disclaimer',
  ].includes(pathname);

  return (
    <header className="sticky top-0 z-50 glass-strong relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Back button (on calculator pages only) + Logo */}
          <div className="flex items-center gap-3">
            {!isHub && !isLegalPage && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="mr-1"
                  aria-label="Back to all calculators"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
              <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-foreground">
                    Calc<span className="text-emerald-600">Hub</span>
                  </h1>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Right: Search + Desktop nav + Mobile hamburger */}
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              {/* Global Search — visible on all screen sizes */}
              <SearchBar />

              {/* Desktop-only nav links */}
              <div className="hidden sm:flex items-center gap-2">
                {!isHub && !isLegalPage && (
                  <Link href="/">
                    <Button variant="outline" size="sm" className="text-muted-foreground">
                      <Calculator className="h-3.5 w-3.5 mr-1.5" />
                      All Calculators
                    </Button>
                  </Link>
                )}
                <Link href="/about">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Info className="h-3.5 w-3.5 mr-1.5" />
                    About
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    Contact
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex sm:hidden items-center justify-center h-9 w-9 rounded-lg border border-border/50 bg-background/80 hover:bg-accent text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 glass-strong border-b border-border/50 shadow-lg overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-1">
              {!isHub && !isLegalPage && (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <Calculator className="h-4 w-4" />
                  All Calculators
                </Link>
              )}
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <Info className="h-4 w-4" />
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

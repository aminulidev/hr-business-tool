'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowLeft, Info, Mail, Menu, X, Search, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { getPublishedCalculators, categoryOrder, calculators, type CalculatorMeta } from '@/lib/calculator-meta';
import { searchCalculators, popularCalculators } from '@/lib/search-calculators';

// ─── Search Component ────────────────────────────────────────────────────────

function SearchBar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch('');
    }
  };

  const handleSelect = (path: string) => {
    setOpen(false);
    setSearch('');
    router.push(path);
  };

  const isSearching = search.trim().length > 0;
  const searchResults = isSearching ? searchCalculators(search, getPublishedCalculators()) : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search calculators"
        className="flex items-center cursor-pointer gap-2 h-9 rounded-lg border border-border/50 bg-background/80 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors px-3 w-9 sm:w-auto"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline text-sm">Search calculators…</span>
        <kbd className="hidden sm:inline-flex pointer-events-none ml-1 h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        shouldFilter={false}
        title="Search Calculators"
        description="Search for any business or HR calculator"
        showCloseButton={false}
        className="sm:max-w-xl"
      >
        <CommandInput
          placeholder="Search calculators (e.g. 'roi', 'commission', 'payroll', 'tax')..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[60vh]">
          {isSearching ? (
            searchResults.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <p className="text-sm font-semibold text-foreground">No calculators found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  We couldn&apos;t find any tool matching &ldquo;{search}&rdquo;.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  <span className="text-xs text-muted-foreground self-center mr-1">Try:</span>
                  {['ROI', 'Commission', 'Payroll', 'Overtime', 'Break-Even', 'PTO'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearch(term)}
                      className="text-xs px-2.5 py-1 rounded-md bg-muted hover:bg-accent hover:text-foreground text-muted-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <CommandGroup heading={`Matching Calculators (${searchResults.length})`}>
                {searchResults.map(({ calculator: calc, score }, idx) => {
                  const Icon = calc.icon;
                  const isTopMatch = idx === 0 && score >= 1000;
                  return (
                    <CommandItem
                      key={calc.slug}
                      value={calc.slug}
                      onSelect={() => handleSelect(calc.path)}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer rounded-lg aria-selected:bg-accent"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate text-foreground">{calc.title}</p>
                            {isTopMatch && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 shrink-0">
                                Best Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{calc.shortDescription}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground shrink-0 hidden sm:inline">
                        {calc.category}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )
          ) : (
            <>
              {/* Popular Calculators Quick Access */}
              <CommandGroup heading="Popular Calculators">
                {popularCalculators.map((calc) => {
                  const Icon = calc.icon;
                  return (
                    <CommandItem
                      key={calc.slug}
                      value={calc.slug}
                      onSelect={() => handleSelect(calc.path)}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer rounded-lg aria-selected:bg-accent"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate text-foreground">{calc.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{calc.shortDescription}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground shrink-0 hidden sm:inline">
                        {calc.category}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {/* All Categories */}
              {categoryOrder.map((category) => {
                const group = getPublishedCalculators().filter((c) => c.category === category);
                if (group.length === 0) return null;
                return (
                  <CommandGroup key={category} heading={category}>
                    {group.map((calc) => {
                      const Icon = calc.icon;
                      return (
                        <CommandItem
                          key={calc.slug}
                          value={calc.slug}
                          onSelect={() => handleSelect(calc.path)}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer rounded-lg aria-selected:bg-accent"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate text-foreground">{calc.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{calc.shortDescription}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground shrink-0 hidden sm:inline">
                            {calc.category}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
              })}
            </>
          )}
        </CommandList>

        {/* Footer hint */}
        <div className="border-t px-3 py-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">Esc</kbd>
            close
          </span>
          <span className="ml-auto flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">⌘K</kbd>
          </span>
        </div>
      </CommandDialog>
    </>
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl shadow-lg relative">
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
                <img src="/logo.svg" alt="QuickBizCalc Logo" className="h-9 w-9 drop-shadow-md" />
                <div className="text-lg font-bold tracking-tight text-foreground">
                  QuickBiz<span className="text-emerald-600">Calc</span>
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
              <div className="hidden lg:flex items-center gap-2">
                {!isHub && !isLegalPage && (
                  <Link href="/">
                    <Button variant="outline" size="sm" className="text-muted-foreground cursor-pointer">
                      <Calculator className="h-3.5 w-3.5 mr-1.5" />
                      All Calculators
                    </Button>
                  </Link>
                )}
                <Link href="/blog">
                  <Button variant="ghost" size="sm" className={`cursor-pointer ${pathname.startsWith('/blog') ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    Blog
                  </Button>
                </Link>
                <Link href="/guides">
                  <Button variant="ghost" size="sm" className={`cursor-pointer ${pathname.startsWith('/guides') ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Guides
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" size="sm" className={`cursor-pointer ${pathname === '/about' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Info className="h-3.5 w-3.5 mr-1.5" />
                    About
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" size="sm" className={`cursor-pointer ${pathname === '/contact' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
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
              className="flex lg:hidden items-center justify-center h-9 w-9 rounded-lg border border-border/50 bg-background/80 hover:bg-accent text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            className="absolute top-full left-0 right-0 bg-background border-b border-border/50 shadow-lg overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-1">
              {!isHub && !isLegalPage && (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <Calculator className="h-4 w-4" />
                  All Calculators
                </Link>
              )}
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${pathname.startsWith('/blog') ? 'bg-accent/50 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
              >
                <BookOpen className="h-4 w-4" />
                Blog
              </Link>
              <Link
                href="/guides"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${pathname.startsWith('/guides') ? 'bg-accent/50 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
              >
                <FileText className="h-4 w-4" />
                Guides
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${pathname === '/about' ? 'bg-accent/50 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
              >
                <Info className="h-4 w-4" />
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${pathname === '/contact' ? 'bg-accent/50 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
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

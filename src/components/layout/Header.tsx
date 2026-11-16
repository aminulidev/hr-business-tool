'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowLeft, Info, Mail, Menu, X, Search, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// The dialog pulls in the whole calculator registry, so it is fetched on first use instead of on every page load.
const loadSearchDialog = () => import('./SearchDialog');
const SearchDialog = dynamic(loadSearchDialog, { ssr: false });

// ─── Search Component ────────────────────────────────────────────────────────

function SearchBar() {
  const [open, setOpen] = useState(false);
  // False until the visitor first opens search; the dialog is not rendered (or downloaded) before that.
  const [loaded, setLoaded] = useState(false);

  // Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setLoaded(true);
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openSearch = () => {
    setLoaded(true);
    setOpen(true);
  };
  // Start the download as soon as the visitor shows intent, so the dialog is ready by the click.
  const preload = () => {
    void loadSearchDialog();
  };

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        onPointerEnter={preload}
        onFocus={preload}
        aria-label="Search calculators"
        className="flex items-center cursor-pointer gap-2 h-9 rounded-lg border border-border/50 bg-background/80 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors px-3 w-9 sm:w-auto"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline text-sm">Search calculators…</span>
        <kbd className="hidden sm:inline-flex pointer-events-none ml-1 h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {loaded && <SearchDialog open={open} onOpenChange={setOpen} />}
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

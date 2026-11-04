'use client';

/**
 * MobileResultSheet — Renders calculator children inline on both mobile and
 * desktop (preserving all React event handlers, buttons, and Recharts sizing),
 * while providing a sleek floating "Live Result Bar" on mobile (< 768px)
 * whenever the .result-display panel is scrolled out of view.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles, X } from 'lucide-react';

interface MobileResultSheetProps {
  children: React.ReactNode;
  /** Title shown in the floating bar */
  title?: string;
  /** CSS class for the wrapper */
  className?: string;
}

export default function MobileResultSheet({
  children,
  title = 'Live Result Ready',
  className = '',
}: MobileResultSheetProps) {
  const [hasResult, setHasResult] = useState(false);
  const [isResultInView, setIsResultInView] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [primaryValue, setPrimaryValue] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Detect when .result-display appears, extract primary headline value, and track visibility
  useEffect(() => {
    if (!containerRef.current) return;

    let io: IntersectionObserver | null = null;

    const extractHeadline = (el: Element) => {
      // Grab the first prominent numeric/currency value inside .result-display
      const bigText = el.querySelector(
        '.text-4xl, .text-3xl, .text-2xl, .font-extrabold, [data-result-primary]'
      );
      if (bigText?.textContent) {
        setPrimaryValue(bigText.textContent.trim().slice(0, 28));
      } else {
        setPrimaryValue('');
      }
    };

    const checkForResult = () => {
      const resultEl = containerRef.current?.querySelector('.result-display');
      if (resultEl) {
        setHasResult(true);
        extractHeadline(resultEl);
        if (io) io.disconnect();
        io = new IntersectionObserver(
          ([entry]) => {
            setIsResultInView(entry.isIntersecting);
          },
          { threshold: 0.15 }
        );
        io.observe(resultEl);
      } else {
        setHasResult(false);
        setPrimaryValue('');
      }
    };

    checkForResult();

    const observer = new MutationObserver(checkForResult);
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (io) io.disconnect();
    };
  }, []);

  const scrollToResults = () => {
    const resultEl = containerRef.current?.querySelector('.result-display');
    if (resultEl) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showFloatingBar = isMobile && hasResult && !isResultInView && !dismissed;

  return (
    <div ref={containerRef} className={className}>
      {/* Always render children natively so React buttons and Recharts work on mobile */}
      {children}

      {/* Floating mobile quick-jump bar when results are off-screen */}
      <AnimatePresence>
        {showFloatingBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed inset-x-3 bottom-3 z-40 md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-900/95 dark:bg-slate-900 text-white px-4 py-3 shadow-2xl border border-emerald-500/40 backdrop-blur-md">
              <button
                type="button"
                onClick={scrollToResults}
                className="flex items-center justify-between flex-1 min-w-0 text-left gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                    <Sparkles className="size-3 shrink-0" />
                    <span className="truncate">{title}</span>
                  </div>
                  {primaryValue ? (
                    <p className="text-base font-extrabold tracking-tight text-white truncate">
                      {primaryValue}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-300 truncate">
                      Tap to view full breakdown &amp; charts
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 shrink-0 shadow-sm">
                  View Breakdown
                  <ArrowDown className="size-3.5" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                aria-label="Dismiss quick result bar"
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

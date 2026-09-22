'use client';

/**
 * MobileResultSheet — wraps a calculator result panel as a sticky bottom sheet
 * on mobile (< 768px) so users can see the result without scrolling past the
 * form. On desktop, the sheet is rendered inline (no sticky positioning).
 *
 * Behavior:
 * - On mobile: result panel sticks to bottom of viewport with a "hide/show" toggle
 * - On desktop: result renders inline (no sticky positioning, no toggle)
 * - Sheet auto-shows when a result becomes visible (via MutationObserver on .result-display)
 * - User can collapse/expand the sheet by tapping the header bar
 * - Sheet does NOT appear if there's no result yet
 *
 * Usage: wrap a calculator's result-display div:
 *
 *   <MobileResultSheet>
 *     <div className="result-display">
 *       ... result content ...
 *     </div>
 *   </MobileResultSheet>
 *
 * The component clones children with ref forwarding so it can detect when
 * the result panel becomes visible.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

interface MobileResultSheetProps {
  children: React.ReactNode;
  /** Title shown in the bottom-sheet header */
  title?: string;
  /** CSS class for the wrapper */
  className?: string;
}

export default function MobileResultSheet({
  children,
  title = 'Result',
  className = '',
}: MobileResultSheetProps) {
  const [hasResult, setHasResult] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
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

  // Detect when a result panel appears in the children
  useEffect(() => {
    if (!containerRef.current) return;

    const checkForResult = () => {
      const resultEl = containerRef.current?.querySelector('.result-display');
      setHasResult(!!resultEl);
      if (resultEl) {
        setIsExpanded(true); // auto-expand on new result
      }
    };

    checkForResult();

    const observer = new MutationObserver(checkForResult);
    observer.observe(containerRef.current!, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // On desktop, render children inline (no transformation)
  if (!isMobile) {
    return (
      <div ref={containerRef} className={className}>
        {children}
      </div>
    );
  }

  // On mobile with no result, render children inline (so SSR output matches)
  if (!hasResult) {
    return (
      <div ref={containerRef} className={className}>
        {children}
      </div>
    );
  }

  // On mobile with result: render the form area + sticky bottom sheet
  // The form (children minus the result panel) renders inline.
  // The result panel is duplicated into the bottom sheet.
  // We use CSS to hide the original .result-display so it doesn't appear twice.

  return (
    <div ref={containerRef} className={className}>
      {/* Original children — hide the .result-display on mobile to avoid duplication */}
      <div className="[&_.result-display]:hidden md:[&_.result-display]:block">
        {children}
      </div>

      {/* Mobile sticky bottom sheet */}
      <AnimatePresence>
        {hasResult && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="bg-background border-t-2 border-emerald-500/40 shadow-2xl shadow-black/20 rounded-t-2xl max-h-[80vh] flex flex-col">
              {/* Header bar — tap to collapse/expand */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full px-4 py-3 border-b border-border/40 hover:bg-muted/30 transition-colors"
                aria-label={isExpanded ? 'Collapse result' : 'Expand result'}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold truncate">{title}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Result content — show only when expanded */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-y-auto overscroll-contain"
                    style={{ maxHeight: 'calc(80vh - 50px)' }}
                  >
                    {/* Render a copy of the result panel here */}
                    <ResultPortal containerRef={containerRef} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close button (X) — dismisses the sheet until next calculation */}
              <button
                onClick={() => setHasResult(false)}
                className="absolute -top-3 right-3 size-7 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Dismiss result sheet"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------
// ResultPortal — renders a live copy of the .result-display element
// We can't use React Portal because the original element is in {children}
// which is opaque. Instead, we use MutationObserver to clone the latest
// result HTML into the bottom sheet.
// -----------------------------------------------------------------------

function ResultPortal({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const sync = () => {
      const resultEl = containerRef.current?.querySelector('.result-display') as HTMLElement | null;
      if (resultEl) {
        setHtml(resultEl.innerHTML);
      }
    };

    sync();

    const observer = new MutationObserver(sync);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true, attributes: true, characterData: true });
    }

    return () => observer.disconnect();
  }, [containerRef]);

  return (
    <div
      className="result-display-mobile px-4 py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, ChevronUp, RotateCcw, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalcHistoryEntry } from '@/hooks/useCalcHistory';

interface CalcHistoryPanelProps<T = Record<string, string>> {
  history: CalcHistoryEntry<T>[];
  onRestore: (inputs: T) => void;
  onClear: () => void;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CalcHistoryPanel<T = Record<string, string>>({
  history,
  onRestore,
  onClear,
}: CalcHistoryPanelProps<T>) {
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (history.length === 0) return null;

  const handleClear = () => {
    if (confirmClear) {
      onClear();
      setConfirmClear(false);
      setOpen(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div className="mt-4 border border-border/50 rounded-xl overflow-hidden">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <History className="h-4 w-4 text-emerald-500" />
          Calculation History
          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-semibold">
            {history.length}
          </span>
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Collapsible Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="history-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-border/40">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors group"
                >
                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground w-20">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(entry.timestamp)}
                  </div>

                  {/* Summary */}
                  <p className="flex-1 text-sm text-foreground/80 truncate">{entry.summary}</p>

                  {/* Restore Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestore(entry.inputs)}
                    className="shrink-0 h-7 px-2.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                    title="Restore these inputs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end px-4 py-2.5 bg-muted/20 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className={`h-7 px-3 text-xs transition-colors ${
                  confirmClear
                    ? 'text-red-600 hover:text-red-700 hover:bg-red-500/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Trash2 className="h-3 w-3 mr-1.5" />
                {confirmClear ? 'Click again to confirm' : 'Clear all'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

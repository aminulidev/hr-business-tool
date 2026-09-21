'use client';

import { useCallback, useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// -----------------------------------------------------------------------
// FeedbackWidget — "Was this helpful?" widget shown after every calculator
// Submits to localStorage (no backend required) plus an optional API hook.
// -----------------------------------------------------------------------

const STORAGE_KEY = 'qbc_feedback_v1';
const COOLDOWN_MINUTES = 30; // avoid double-counts within 30 min per page

interface FeedbackEntry {
  slug: string;
  helpful: boolean | null;
  message?: string;
  ts: number;
}

function readStore(): FeedbackEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeStore(entries: FeedbackEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-200)));
  } catch {
    // Storage quota exceeded — silently drop oldest
  }
}

function getSlugFromPath() {
  if (typeof window === 'undefined') return 'unknown';
  const parts = window.location.pathname.split('/');
  const idx = parts.indexOf('calculators');
  return idx !== -1 && parts[idx + 1] ? parts[idx + 1] : 'unknown';
}

export default function FeedbackWidget() {
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [showTextarea, setShowTextarea] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [slug, setSlug] = useState('');

  // On mount: check if user already submitted for this slug within cooldown
  useEffect(() => {
    const s = getSlugFromPath();
    setSlug(s);
    const entries = readStore();
    const recent = entries.find(
      (e) => e.slug === s && Date.now() - e.ts < COOLDOWN_MINUTES * 60 * 1000
    );
    if (recent) {
      setSubmitted(recent.helpful);
    }
  }, []);

  const submit = useCallback(
    async (helpful: boolean | null, message?: string) => {
      const entry: FeedbackEntry = {
        slug,
        helpful,
        message: message?.trim() || undefined,
        ts: Date.now(),
      };
      const entries = readStore();
      entries.push(entry);
      writeStore(entries);

      // Fire-and-forget POST to /api/feedback if available
      try {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
          // keepalive ensures the request survives page unload
          keepalive: true,
        });
      } catch {
        // No-op — local storage is the source of truth
      }
    },
    [slug]
  );

  const handleHelpful = () => {
    setSubmitted(true);
    submit(true);
    toast.success('Thanks for your feedback!', { duration: 2500 });
  };

  const handleNotHelpful = () => {
    setSubmitted(false);
    setShowTextarea(true);
    submit(false);
    toast('Thanks — tell us what was missing?', { duration: 2500 });
  };

  const handleSubmitText = () => {
    submit(false, feedbackText);
    setShowTextarea(false);
    toast.success('Feedback submitted. Thank you!', { duration: 2500 });
    setFeedbackText('');
  };

  const handleDismiss = () => {
    setShowTextarea(false);
    setSubmitted(null);
  };

  // Already submitted — show thank-you state
  if (submitted !== null && !showTextarea) {
    return (
      <div className="flex items-center justify-center gap-3 py-6 text-sm text-muted-foreground">
        <Check className="h-4 w-4 text-emerald-500" />
        <span>Thanks for your feedback{submitted === true ? ' — glad this helped!' : '.'}</span>
      </div>
    );
  }

  // Show textarea after a "Not helpful" click
  if (showTextarea) {
    return (
      <div className="py-6 px-4 sm:px-6 rounded-2xl border bg-muted/30">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-sm">What were you looking for?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your input helps us improve this calculator (optional).
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="e.g., I needed a state-specific version, or a way to compare two offers…"
          className="min-h-[80px] text-sm"
          rows={3}
        />
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Skip
          </Button>
          <Button size="sm" onClick={handleSubmitText} disabled={!feedbackText.trim()}>
            Submit feedback
          </Button>
        </div>
      </div>
    );
  }

  // Default: show the two-button prompt
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 py-6"
      role="region"
      aria-label="Was this calculator helpful?"
    >
      <span className="text-sm text-muted-foreground">Was this calculator helpful?</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleHelpful}
          className="gap-1.5 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Yes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNotHelpful}
          className="gap-1.5 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          No
        </Button>
      </div>
    </div>
  );
}

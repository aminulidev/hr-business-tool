'use client';

/**
 * NewsletterSignup — sign-up form for the occasional "payroll changes" email
 * (at most one a month). Appears in the footer and on /newsletter. Submits to
 * /api/newsletter, which stores the address as a Resend contact. The copy here
 * must only promise what is actually sent: no subscriber counts, no schedule
 * the site does not keep.
 * Persists submitted state in localStorage so the form doesn't reappear
 * for users who have already subscribed.
 */

import { useEffect, useState } from 'react';
import { Mail, Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { track } from '@/lib/analytics';

const STORAGE_KEY = 'qbc_newsletter_subscribed_v1';

interface NewsletterSignupProps {
  variant?: 'inline' | 'banner' | 'footer';
  className?: string;
}

export default function NewsletterSignup({
  variant = 'inline',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dismissed, setDismissed] = useState(false);
  // Honeypot: hidden from people, filled in by form-filling bots; the API discards those sign-ups.
  const [website, setWebsite] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'true') {
        setDismissed(true);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: window.location.pathname, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');

      setConfirmationSent(Boolean(data.confirmationSent));
      if (!data.alreadySubscribed) track('newsletter_signup', { placement: variant });
      setStatus('success');
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {}
      toast.success(data.alreadySubscribed ? 'You are already subscribed.' : 'Subscribed. You are on the list.', { duration: 4000 });
    } catch (err: any) {
      setStatus('error');
      toast.error(err.message || 'Subscription failed. Please try again.');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  };

  if (dismissed) return null;

  // Success state
  if (status === 'success') {
    return (
      <div className={`newsletter-success flex items-center gap-3 ${className}`}>
        <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <Check className="size-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">You&apos;re subscribed!</p>
          <p className="text-xs text-muted-foreground">
            {confirmationSent ? 'A confirmation email is on its way. ' : ''}We email when payroll rules, rates or deadlines change: at most once a month.
          </p>
        </div>
      </div>
    );
  }

  // Variant: banner (full-width with dismiss)
  if (variant === 'banner') {
    return (
      <div
        className={`newsletter-banner relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 sm:p-8 shadow-xl ${className}`}
      >
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="size-4" />
        </button>
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="size-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Payroll updates
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            Payroll changes, when they happen
          </h3>
          <p className="text-sm text-emerald-50/90 mb-4">
            Rate changes, new thresholds and filing deadlines for US payroll, plus new calculators.
            At most one email a month. Free, and you can unsubscribe anytime.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              disabled={status === 'loading'}
              className="bg-white/95 border-0 text-foreground h-11 flex-1"
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-emerald-700 hover:bg-emerald-50 h-11 font-semibold"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="size-4 mr-1 animate-spin" />
                  Subscribing…
                </>
              ) : (
                <>
                  <Mail className="size-4 mr-1" />
                  Subscribe Free
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Variant: inline (compact card)
  return (
    <div
      className={`newsletter-inline rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Mail className="size-4 text-emerald-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-1">
            Get payroll change alerts
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            At most one email a month. Free. Unsubscribe anytime.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              disabled={status === 'loading'}
              className="h-9 flex-1"
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {status === 'loading' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Mail className="size-3.5 mr-1" />
                  Join
                </>
              )}
            </Button>
          </form>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="p-1 rounded-md hover:bg-muted text-muted-foreground shrink-0"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

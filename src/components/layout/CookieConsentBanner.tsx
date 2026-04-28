'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cookie, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'QuickBizCalc_cookie_consent';

type ConsentStatus = 'undecided' | 'accepted' | 'rejected' | 'custom';

interface ConsentPreferences {
  necessary: boolean;   // Always true, cannot be changed
  analytics: boolean;
  advertising: boolean;
}

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: true,
  advertising: true,
};

function getStoredConsent(): ConsentStatus | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored as ConsentStatus | null;
  } catch {
    return null;
  }
}

function saveConsent(status: ConsentStatus) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, status);
    // Dispatch event for other scripts to pick up
    window.dispatchEvent(
      new CustomEvent('cookieConsentChange', { detail: { status } })
    );
  } catch {
    // localStorage not available
  }
}

function saveCustomPreferences(prefs: ConsentPreferences) {
  try {
    localStorage.setItem(`${COOKIE_CONSENT_KEY}_prefs`, JSON.stringify(prefs));
    saveConsent('custom');
  } catch {
    // localStorage not available
  }
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const status = getStoredConsent();
    if (!status) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    saveConsent('accepted');
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    saveConsent('rejected');
    setVisible(false);
  };

  const handleSavePreferences = () => {
    saveCustomPreferences(preferences);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/10 p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <Cookie className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    We value your privacy
                  </h3>
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and serve
                  relevant ads. You can choose which cookies to allow. Read our{' '}
                  <Link
                    href="/cookie-policy"
                    className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                  >
                    Cookie Policy
                  </Link>{' '}
                  for details.
                </p>
              </div>
              <button
                onClick={() => setVisible(false)}
                className="shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Expandable details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3 rounded-xl border border-border/30 bg-muted/20 p-4">
                    {/* Necessary */}
                    <label className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-foreground">Necessary</p>
                        <p className="text-xs text-muted-foreground">
                          Required for basic site functionality. Cannot be disabled.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-600 font-medium">Always active</span>
                        <div className="h-5 w-9 rounded-full bg-emerald-500 relative">
                          <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                        </div>
                      </div>
                    </label>

                    <hr className="border-border/30" />

                    {/* Analytics */}
                    <label className="flex items-center justify-between gap-4 cursor-pointer">
                      <div>
                        <p className="text-xs font-medium text-foreground">Analytics</p>
                        <p className="text-xs text-muted-foreground">
                          Help us understand how visitors use the site (Google Analytics).
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={preferences.analytics}
                        onClick={() =>
                          setPreferences((p) => ({ ...p, analytics: !p.analytics }))
                        }
                        className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                          preferences.analytics ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            preferences.analytics ? 'translate-x-[18px]' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </label>

                    <hr className="border-border/30" />

                    {/* Advertising */}
                    <label className="flex items-center justify-between gap-4 cursor-pointer">
                      <div>
                        <p className="text-xs font-medium text-foreground">Advertising</p>
                        <p className="text-xs text-muted-foreground">
                          Used to deliver relevant ads via Google AdSense.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={preferences.advertising}
                        onClick={() =>
                          setPreferences((p) => ({ ...p, advertising: !p.advertising }))
                        }
                        className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                          preferences.advertising ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            preferences.advertising ? 'translate-x-[18px]' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {!showDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Customize
                </Button>
              )}
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectNonEssential}
                  className="text-xs"
                >
                  Reject non-essential
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  Accept all cookies
                </Button>
                {showDetails && (
                  <Button
                    size="sm"
                    onClick={handleSavePreferences}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    Save preferences
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

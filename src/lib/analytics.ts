// ---------------------------------------------------------------------------
// Event tracking (Phase 19). One helper, called from the shared components
// every calculator already uses, so individual calculators need no tracking
// code. Events go to Google Analytics through gtag when it is loaded; when it
// is not (development, analytics switched off) every call is a no-op.
//
// Events and where they fire:
//   calc_start       first edit of an input on a calculator page   (CalcStartTracker)
//   calc_save        a calculation saved to history                (useCalcHistory)
//   history_restore  a saved calculation restored                  (CalcHistoryPanel)
//   try_example      the example button                            (TryExample)
//   mode_change      a tab chosen on a multi-mode page             (ModeTabs)
//                    or the tax year switched, mode "tax-year-2027" (TaxYearSwitch)
//   share            share link copied                             (ResultActions)
//   copy_result      result text copied                            (ResultActions)
//   print            result printed                                (ResultActions)
//   pdf              result exported as PDF                        (ResultActions)
//   embed_open       embed dialog opened                           (ResultActions)
//   embed_copy       embed code copied                             (EmbedModal)
//   feedback         helpful / not helpful vote or comment         (FeedbackWidget)
//   pay_stub         pay stub printed or downloaded                (PayStubDialog)
//   invoice_export   invoice printed or downloaded                 (InvoiceGenerator)
//   newsletter_signup                                              (NewsletterSignup)
// Every event carries `calculator` (the slug from the URL) and `embedded`.
// ---------------------------------------------------------------------------

export type AnalyticsEvent =
  | 'calc_start'
  | 'calc_save'
  | 'history_restore'
  | 'try_example'
  | 'mode_change'
  | 'share'
  | 'copy_result'
  | 'print'
  | 'pdf'
  | 'embed_open'
  | 'embed_copy'
  | 'feedback'
  | 'pay_stub'
  | 'invoice_export'
  | 'newsletter_signup';

export type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Calculator slug and embed flag for a path such as /calculators/vat-calculator/embed */
export function pageContext(pathname: string): { calculator: string; embedded: boolean } {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('calculators');
  return { calculator: i !== -1 && parts[i + 1] ? parts[i + 1] : 'none', embedded: parts[parts.length - 1] === 'embed' };
}

/** Parameters GA accepts: short strings, numbers and booleans; undefined values dropped */
export function cleanParams(params: EventParams = {}): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    out[k] = typeof v === 'string' ? v.slice(0, 100) : v;
  }
  return out;
}

export function track(event: AnalyticsEvent, params?: EventParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', event, { ...pageContext(window.location.pathname), ...cleanParams(params) });
  } catch {
    // Analytics must never break a calculator.
  }
}

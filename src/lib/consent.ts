// ---------------------------------------------------------------------------
// Cookie consent → Google Consent Mode v2 (Phase 19).
//
// Before this, Google Analytics and AdSense were loaded twice: once by the root
// layout for every visitor, whatever they chose in the cookie banner, and again
// by a consent-gated component for visitors who accepted, which counted their
// page views twice. Now the tags load once and the banner's choice is passed to
// Google as consent signals:
//   - Europe (EEA, UK, Switzerland): everything is denied until the visitor accepts.
//   - Elsewhere, including the US: granted by default, and denied as soon as the
//     visitor rejects or switches a category off.
// With a signal denied, Google's tags set no cookies for that purpose.
//
// The same functions run in two places: here (imported and unit-tested) and in
// the browser, where consentBootstrapScript() inlines their source so the
// defaults are set before any Google tag loads.
// ---------------------------------------------------------------------------

export const CONSENT_KEY = 'QuickBizCalc_cookie_consent';
export const CONSENT_PREFS_KEY = 'QuickBizCalc_cookie_consent_prefs';
export const CONSENT_EVENT = 'cookieConsentChange';

/** Countries where consent must be opt-in: the EEA, the United Kingdom and Switzerland */
export const OPT_IN_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'IS', 'LI', 'NO', 'GB', 'CH',
];

export type ConsentSignal = 'granted' | 'denied';
export interface ConsentState {
  analytics_storage: ConsentSignal;
  ad_storage: ConsentSignal;
  ad_user_data: ConsentSignal;
  ad_personalization: ConsentSignal;
}

/**
 * The consent update for a stored banner choice, or null when the visitor has not chosen yet.
 * Self-contained on purpose: its source is inlined into the page by consentBootstrapScript().
 */
export function consentUpdate(status: string | null, prefsJson: string | null): ConsentState | null {
  if (status !== 'accepted' && status !== 'rejected' && status !== 'custom') return null;
  let analytics = status === 'accepted';
  let advertising = status === 'accepted';
  if (status === 'custom') {
    try {
      const prefs = JSON.parse(prefsJson || '{}') || {};
      analytics = !!prefs.analytics;
      advertising = !!prefs.advertising;
    } catch (e) {
      analytics = false;
      advertising = false;
    }
  }
  const a: ConsentSignal = analytics ? 'granted' : 'denied';
  const d: ConsentSignal = advertising ? 'granted' : 'denied';
  return { analytics_storage: a, ad_storage: d, ad_user_data: d, ad_personalization: d };
}

/** True when the visitor has explicitly allowed analytics; used for tools that record sessions */
export function hasAnalyticsConsent(status: string | null, prefsJson: string | null): boolean {
  return consentUpdate(status, prefsJson)?.analytics_storage === 'granted';
}

const DENIED: ConsentState = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
const GRANTED: ConsentState = { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' };

/**
 * Inline script for the root layout, run before any other script: defines gtag, sets the regional
 * consent defaults, applies a stored choice, and keeps listening for the banner.
 */
export function consentBootstrapScript(): string {
  return `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',${JSON.stringify({ ...DENIED, region: OPT_IN_REGIONS, wait_for_update: 500 })});
gtag('consent','default',${JSON.stringify(GRANTED)});
(function(){
var consentUpdate=${consentUpdate.toString()};
function apply(){try{var u=consentUpdate(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}),localStorage.getItem(${JSON.stringify(CONSENT_PREFS_KEY)}));if(u)gtag('consent','update',u);}catch(e){}}
apply();
window.addEventListener(${JSON.stringify(CONSENT_EVENT)},apply);
})();`;
}

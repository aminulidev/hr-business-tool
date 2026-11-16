'use client';

import { useSyncExternalStore } from 'react';
import Script from 'next/script';
import { CONFIG } from '@/lib/config';
import { CONSENT_EVENT, CONSENT_KEY, CONSENT_PREFS_KEY, hasAnalyticsConsent } from '@/lib/consent';

/**
 * Consent-gated extras. Google Analytics and AdSense are NOT loaded here any more: the root layout
 * loads each once and passes the banner's choice to Google through Consent Mode (see lib/consent.ts).
 * Loading them here as well counted every consenting visitor's page views twice.
 *
 * What remains is Microsoft Clarity, which records sessions and therefore loads only after the
 * visitor has explicitly accepted analytics, and only when NEXT_PUBLIC_CLARITY_ID is configured.
 */

const subscribe = (onChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};
const readConsent = () => {
  try {
    return hasAnalyticsConsent(localStorage.getItem(CONSENT_KEY), localStorage.getItem(CONSENT_PREFS_KEY));
  } catch {
    return false;
  }
};

export default function Scripts() {
  const analyticsAllowed = useSyncExternalStore(subscribe, readConsent, () => false);
  const clarityId = CONFIG.analytics.clarityId;
  if (!analyticsAllowed || !clarityId) return null;
  return (
    <Script id="microsoft-clarity" strategy="lazyOnload">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", ${JSON.stringify(clarityId)});
      `}
    </Script>
  );
}

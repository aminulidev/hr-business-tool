'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { CONFIG } from '@/lib/config';

export default function Scripts() {
  const [consent, setConsent] = useState<{
    analytics: boolean;
    advertising: boolean;
  }>({ analytics: false, advertising: false });

  useEffect(() => {
    const updateConsent = () => {
      const status = localStorage.getItem('calchub_cookie_consent');
      if (status === 'accepted') {
        setConsent({ analytics: true, advertising: true });
      } else if (status === 'custom') {
        try {
          const prefs = JSON.parse(localStorage.getItem('calchub_cookie_consent_prefs') || '{}');
          setConsent({
            analytics: !!prefs.analytics,
            advertising: !!prefs.advertising,
          });
        } catch {
          setConsent({ analytics: false, advertising: false });
        }
      } else {
        setConsent({ analytics: false, advertising: false });
      }
    };

    updateConsent();
    window.addEventListener('cookieConsentChange', updateConsent);
    return () => window.removeEventListener('cookieConsentChange', updateConsent);
  }, []);

  return (
    <>
      {/* GA4 */}
      {consent.analytics && CONFIG.analytics.gaId !== 'G-XXXXXXXXXX' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${CONFIG.analytics.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${CONFIG.analytics.gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Microsoft Clarity */}
      {consent.analytics && CONFIG.analytics.clarityId !== 'XXXXXXXXXX' && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CONFIG.analytics.clarityId}");
          `}
        </Script>
      )}

      {/* Google AdSense */}
      {consent.advertising && CONFIG.monetization.adSenseId !== 'ca-pub-XXXXXXXXXXXXXXXX' && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.monetization.adSenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}

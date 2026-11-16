'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { CONFIG } from '@/lib/config';

/**
 * Loads the AdSense script everywhere except the embed route. Embeds are served inside other
 * people's pages; ads must never appear there (Phase 18), and the root layout cannot see the
 * path, so the check lives in this small client component. Site verification does not depend on
 * it: the google-adsense-account meta tag is emitted for every page by the root metadata.
 * Whether ads may use cookies is decided by the consent signals set in lib/consent.ts.
 */
export default function AdSenseLoader() {
  const pathname = usePathname();
  if (!CONFIG.monetization.adsEnabled || !CONFIG.monetization.adSenseId) return null;
  if (pathname?.endsWith('/embed')) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.monetization.adSenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

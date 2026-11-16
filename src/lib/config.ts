const isProd = process.env.NODE_ENV === 'production';
// Set NEXT_PUBLIC_DISABLE_ANALYTICS=1 for builds that must not report to the live properties:
// Lighthouse runs in CI, local production builds, load tests.
const trackingOff = process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === '1';
const live = isProd && !trackingOff;

export const CONFIG = {
  siteName: 'QuickBizCalc',
  domain: 'www.quickbizcalc.com',
  analytics: {
    // Only expose IDs in production — prevents tracking on localhost/dev
    gaId: live ? (process.env.NEXT_PUBLIC_GA_ID || 'G-2CM19Y298E') : undefined,
    // Microsoft Clarity has no default: it loads only when a real project ID is configured.
    clarityId: live ? (process.env.NEXT_PUBLIC_CLARITY_ID || undefined) : undefined,
  },
  monetization: {
    // Always present: the google-adsense-account meta tag used for site verification needs it.
    adSenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-5551017813379018',
    // Whether the AdSense script itself is loaded.
    adsEnabled: !trackingOff,
  },
};

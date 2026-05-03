const isProd = process.env.NODE_ENV === 'production';

export const CONFIG = {
  siteName: 'QuickBizCalc',
  domain: 'www.quickbizcalc.com',
  analytics: {
    // Only expose IDs in production — prevents tracking on localhost/dev
    gaId: isProd ? (process.env.NEXT_PUBLIC_GA_ID || 'G-2CM19Y298E') : undefined,
    clarityId: isProd ? (process.env.NEXT_PUBLIC_CLARITY_ID || 'XXXXXXXXXX') : undefined,
  },
  monetization: {
    adSenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX',
  },
};

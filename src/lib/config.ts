export const CONFIG = {
  siteName: 'QuickBizCalc',
  domain: 'quickbizcalc.com',
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX',
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || 'XXXXXXXXXX',
  },
  monetization: {
    adSenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX',
  },
};

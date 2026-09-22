import type { Metadata } from 'next';
import AppShell from '@/components/layout/AppShell';
import JobOfferComparison from '@/components/calculators/JobOfferComparison';
import { SITE_URL, SITE_NAME } from '@/lib/calculator-meta';

export const metadata: Metadata = {
  title: 'Free Job Offer Comparison Calculator 2026 — Compare Two Offers Side-by-Side',
  description:
    'Free job offer comparison calculator. Compare two job offers side-by-side including salary, sign-on bonus, 401(k) match, health insurance, PTO value, and commute cost. See which offer is worth more in seconds.',
  keywords: [
    'job offer comparison',
    'compare two job offers',
    'job offer calculator',
    'salary comparison calculator',
    'total compensation calculator',
    'offer evaluation tool',
    'compensation comparison',
    'benefits comparison calculator',
    'job offer analyzer',
    'salary vs benefits calculator',
  ],
  alternates: {
    canonical: `${SITE_URL}/compare/jobs`,
  },
  openGraph: {
    title: 'Free Job Offer Comparison Calculator 2026 — Compare Two Offers Side-by-Side',
    description:
      'Compare two job offers including salary, bonuses, 401(k) match, health insurance, PTO, and commute cost. See which offer wins in seconds.',
    url: `${SITE_URL}/compare/jobs`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1344, height: 768, alt: 'Job Offer Comparison Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Job Offer Comparison Calculator 2026',
    description: 'Compare two job offers including salary, bonuses, 401(k) match, health insurance, PTO, and commute cost.',
    images: ['/og-image.png'],
  },
};

export default function CompareJobsPage() {
  return (
    <AppShell>
      <JobOfferComparison />
    </AppShell>
  );
}

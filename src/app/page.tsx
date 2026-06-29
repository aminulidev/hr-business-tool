import type { Metadata } from 'next';
import AppShell from '@/components/layout/AppShell';
import HubPage from '@/components/calculators/HubPage';
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from '@/lib/calculator-meta';

// Homepage sets its own canonical to prevent ?q= parameter variants
// from being indexed as separate pages (GSC "Alternate page" issue)
export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <AppShell>
      <HubPage />
    </AppShell>
  );
}

import { redirect } from 'next/navigation';

/**
 * /calculators → redirects to homepage (hub page)
 *
 * This route previously returned a 404 because all calculator pages live at
 * /calculators/[slug]. Google had crawled /calculators and reported it as
 * "Not found (404)". A permanent 308 redirect to the homepage fixes the
 * Google Search Console indexing error.
 */
export default function CalculatorsIndexPage() {
  redirect('/');
}

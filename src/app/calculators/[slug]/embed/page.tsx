import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCalculatorBySlug, getAllSlugs, isCalculatorPublished } from '@/lib/calculator-meta';
import { calculatorComponents } from '@/lib/registry/components';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Metadata — noindex so embed pages don't create duplicate content
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  return {
    title: calc ? `${calc.title} — Embed` : 'Calculator Embed',
    robots: { index: false, follow: false },
  };
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Unknown, draft, and merged slugs return a real 404 instead of a streamed 200
export const dynamicParams = false;

// ---------------------------------------------------------------------------
// Embed page — chrome-free calculator shell for iframe embedding
// ---------------------------------------------------------------------------

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc || !isCalculatorPublished(calc)) notFound();

  const CalculatorComponent = calculatorComponents[calc.slug];
  if (!CalculatorComponent) notFound();

  return (
    <div className="embed-page min-h-screen bg-background">
      <CalculatorComponent />
      <div className="text-center py-2 text-xs text-muted-foreground border-t border-border mt-2">
        Powered by{' '}
        <Link
          href={`https://quickbizcalc.com/calculators/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline"
        >
          QuickBizCalc
        </Link>
      </div>
    </div>
  );
}

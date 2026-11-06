import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getCalculatorBySlug,
  getAllSlugs,
  getLiveRelatedTools,
  isCalculatorPublished,
  SITE_URL,
  SITE_NAME,
} from '@/lib/calculator-meta';
import AppShell from '@/components/layout/AppShell';
import { getCategoryHubByName } from '@/lib/category-hubs';
import CalculatorLayoutServer from '@/components/calculators/CalculatorLayoutServer';
import { calculatorComponents } from '@/lib/registry/components';
import type { CalculatorSeoData } from '@/lib/seo-data/types';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Only published slugs exist. Unknown, draft, and merged slugs get a real 404
// status — loading.tsx streams the page, so notFound() inside it would send 200.
export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const calc = getCalculatorBySlug(slug);

    if (!calc) {
      return { title: 'Calculator Not Found' };
    }

    const currentYear = new Date().getFullYear();
    const title = calc.metaTitle || `${calc.title} (${currentYear}) — Free Online Calculator`;
    const fullTitle = calc.metaTitle ? `${calc.metaTitle} | ${SITE_NAME}` : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${calc.path}`;

    return {
      title: title.length > 48 ? { absolute: title } : title,
      description: calc.metaDescription,
      keywords: calc.keywords,
      authors: [{ name: SITE_NAME, url: SITE_URL }],
      creator: SITE_NAME,
      publisher: SITE_NAME,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: fullTitle,
        description: calc.metaDescription,
        url,
        siteName: SITE_NAME,
        type: 'website',
        locale: 'en_US',
        images: [
          {
            url: `/api/og?title=${encodeURIComponent(calc.title)}&category=${encodeURIComponent(calc.category)}&subtitle=${encodeURIComponent(calc.shortDescription)}`,
            width: 1200,
            height: 630,
            alt: calc.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: calc.metaDescription,
        images: [`/api/og?title=${encodeURIComponent(calc.title)}&category=${encodeURIComponent(calc.category)}&subtitle=${encodeURIComponent(calc.shortDescription)}`],
      },
    };
  });
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc || !isCalculatorPublished(calc)) {
    notFound();
  }

  const CalculatorComponent = calculatorComponents[calc.slug];

  if (!CalculatorComponent) {
    notFound();
  }

  let seoData: CalculatorSeoData | null = null;
  try {
    const mod = await import(`@/lib/seo-data/${slug}`);
    seoData = mod.default;
  } catch (e) {
    // If no SEO data exists yet for this slug, fallback gracefully
  }
  const relatedTools = getLiveRelatedTools(seoData?.relatedTools, slug);
  const categoryHub = getCategoryHubByName(calc.category);

  return (
    <AppShell>
      {seoData ? (
        <CalculatorLayoutServer
          title={calc.title}
          description={calc.metaDescription}
          icon={<calc.icon className="h-7 w-7 text-white" />}
          breadcrumbs={[
            categoryHub
              ? { label: categoryHub.shortTitle, href: `/category/${categoryHub.slug}` }
              : { label: 'Calculators', href: '/calculators' },
            { label: calc.title, href: calc.path },
          ]}
          tableOfContents={[
            ...(seoData.howToSteps?.length > 0 ? [{ id: 'how-to-calculate', label: 'How to Calculate' }] : []),
            ...(seoData.formula ? [{ id: 'formula', label: 'Formula' }] : []),
            ...((seoData.commissionStructures?.length ?? 0) > 0 ? [{ id: 'commission-structures', label: 'Common Commission Structures' }] : []),
            ...(seoData.workedExamples?.length > 0 ? [{ id: 'worked-examples', label: 'Worked Examples' }] : []),
            ...((seoData.benchmarkTables?.length ?? 0) > 0 ? [{ id: 'benchmarks-reference', label: 'Benchmarks & Tables' }] : []),
            ...((seoData.deepDiveSections?.length ?? 0) > 0 ? [{ id: 'in-depth-guide', label: 'In-Depth Guide' }] : []),
            ...(seoData.faqs?.length > 0 ? [{ id: 'frequently-asked-questions', label: 'FAQs' }] : []),
            { id: 'statutory-sources', label: 'Statutory Sources' },
            ...(relatedTools.length > 0 ? [{ id: 'related-calculators', label: 'Related Calculators' }] : []),
          ]}
          howToSteps={seoData.howToSteps}
          formula={seoData.formula}
          formulaDescription={seoData.formulaDescription}
          commissionStructures={seoData.commissionStructures}
          workedExamples={seoData.workedExamples}
          benchmarkTables={seoData.benchmarkTables}
          deepDiveSections={seoData.deepDiveSections}
          faqs={seoData.faqs}
          relatedTools={relatedTools}
        >
          <CalculatorComponent />
        </CalculatorLayoutServer>
      ) : (
        <CalculatorComponent />
      )}
    </AppShell>
  );
}

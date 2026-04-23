import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getCalculatorBySlug,
  getAllSlugs,
  SITE_URL,
  SITE_NAME,
} from '@/lib/calculator-meta';
import AppShell from '@/components/layout/AppShell';

// ---------------------------------------------------------------------------
// Dynamic imports — code-split each calculator
// ---------------------------------------------------------------------------

import dynamic from 'next/dynamic';

const SalesCommissionCalculator = dynamic(() => import('@/components/calculators/SalesCommissionCalculator'));
const ProRataSalaryCalculator = dynamic(() => import('@/components/calculators/ProRataSalaryCalculator'));
const SalaryIncreaseCalculator = dynamic(() => import('@/components/calculators/SalaryIncreaseCalculator'));
const PayrollCalculator = dynamic(() => import('@/components/calculators/PayrollCalculator'));
const TimeCardCalculator = dynamic(() => import('@/components/calculators/TimeCardCalculator'));
const ProfitMarginCalculator = dynamic(() => import('@/components/calculators/ProfitMarginCalculator'));
const PostTaxBonusCalculator = dynamic(() => import('@/components/calculators/PostTaxBonusCalculator'));
const ROICalculator = dynamic(() => import('@/components/calculators/ROICalculator'));
const SalaryConverterCalculator = dynamic(() => import('@/components/calculators/SalaryConverterCalculator'));
const OvertimeCalculator = dynamic(() => import('@/components/calculators/OvertimeCalculator'));
const DiscountCalculator = dynamic(() => import('@/components/calculators/DiscountCalculator'));
const TaxBracketCalculator = dynamic(() => import('@/components/calculators/TaxBracketCalculator'));
const AfterTaxIncomeCalculator = dynamic(() => import('@/components/calculators/AfterTaxIncomeCalculator'));
const BusinessDayCalculator = dynamic(() => import('@/components/calculators/BusinessDayCalculator'));
const PropertyTaxCalculator = dynamic(() => import('@/components/calculators/PropertyTaxCalculator'));
const GrossMarginCalculator = dynamic(() => import('@/components/calculators/GrossMarginCalculator'));
const MarkupCalculator = dynamic(() => import('@/components/calculators/MarkupCalculator'));
const TaxRefundCalculator = dynamic(() => import('@/components/calculators/TaxRefundCalculator'));
const DecimalConverterCalculator = dynamic(() => import('@/components/calculators/DecimalConverterCalculator'));
const WagesCalculator = dynamic(() => import('@/components/calculators/WagesCalculator'));
const PayrollDeductionCalculator = dynamic(() => import('@/components/calculators/PayrollDeductionCalculator'));
const SalaryTaxCalculator = dynamic(() => import('@/components/calculators/SalaryTaxCalculator'));
const TimeCardLunchCalculator = dynamic(() => import('@/components/calculators/TimeCardLunchCalculator'));
const HourlyPaycheckCalculator = dynamic(() => import('@/components/calculators/HourlyPaycheckCalculator'));

const componentMap: Record<string, React.ComponentType> = {
  'sales-commission': SalesCommissionCalculator,
  'pro-rata-salary': ProRataSalaryCalculator,
  'salary-increase': SalaryIncreaseCalculator,
  payroll: PayrollCalculator,
  'time-card': TimeCardCalculator,
  'profit-margin': ProfitMarginCalculator,
  'post-tax-bonus': PostTaxBonusCalculator,
  roi: ROICalculator,
  'salary-converter': SalaryConverterCalculator,
  overtime: OvertimeCalculator,
  discount: DiscountCalculator,
  'tax-bracket': TaxBracketCalculator,
  'after-tax-income': AfterTaxIncomeCalculator,
  'business-day': BusinessDayCalculator,
  'property-tax': PropertyTaxCalculator,
  'gross-margin': GrossMarginCalculator,
  markup: MarkupCalculator,
  'tax-refund': TaxRefundCalculator,
  'decimal-converter': DecimalConverterCalculator,
  wages: WagesCalculator,
  'payroll-deduction': PayrollDeductionCalculator,
  'salary-tax': SalaryTaxCalculator,
  'time-card-lunch': TimeCardLunchCalculator,
  'hourly-paycheck': HourlyPaycheckCalculator,
};

// ---------------------------------------------------------------------------
// Static params — generate pages at build time
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Per-page metadata — SEO-optimized for each calculator
// ---------------------------------------------------------------------------

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

    const title = `${calc.title} — Free Online Calculator | ${SITE_NAME}`;
    const url = `${SITE_URL}${calc.path}`;

    return {
      title,
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
        title,
        description: calc.metaDescription,
        url,
        siteName: SITE_NAME,
        type: 'website',
        locale: 'en_US',
        images: [
          {
            url: '/og-image.png',
            width: 1344,
            height: 768,
            alt: calc.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: calc.metaDescription,
        images: ['/og-image.png'],
      },
    };
  });
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    notFound();
  }

  const CalculatorComponent = componentMap[slug];

  if (!CalculatorComponent) {
    notFound();
  }

  return (
    <AppShell>
      <CalculatorComponent />
    </AppShell>
  );
}

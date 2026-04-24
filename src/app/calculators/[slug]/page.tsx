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
import CalculatorSkeleton from '@/components/calculators/CalculatorSkeleton';

const SalesCommissionCalculator = dynamic(() => import('@/components/calculators/SalesCommissionCalculator'), { loading: () => <CalculatorSkeleton /> });
const ProRataSalaryCalculator = dynamic(() => import('@/components/calculators/ProRataSalaryCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalaryIncreaseCalculator = dynamic(() => import('@/components/calculators/SalaryIncreaseCalculator'), { loading: () => <CalculatorSkeleton /> });
const PayrollCalculator = dynamic(() => import('@/components/calculators/PayrollCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeCardCalculator = dynamic(() => import('@/components/calculators/TimeCardCalculator'), { loading: () => <CalculatorSkeleton /> });
const ProfitMarginCalculator = dynamic(() => import('@/components/calculators/ProfitMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const PostTaxBonusCalculator = dynamic(() => import('@/components/calculators/PostTaxBonusCalculator'), { loading: () => <CalculatorSkeleton /> });
const ROICalculator = dynamic(() => import('@/components/calculators/ROICalculator'), { loading: () => <CalculatorSkeleton /> });
const SalaryConverterCalculator = dynamic(() => import('@/components/calculators/SalaryConverterCalculator'), { loading: () => <CalculatorSkeleton /> });
const OvertimeCalculator = dynamic(() => import('@/components/calculators/OvertimeCalculator'), { loading: () => <CalculatorSkeleton /> });
const DiscountCalculator = dynamic(() => import('@/components/calculators/DiscountCalculator'), { loading: () => <CalculatorSkeleton /> });
const TaxBracketCalculator = dynamic(() => import('@/components/calculators/TaxBracketCalculator'), { loading: () => <CalculatorSkeleton /> });
const AfterTaxIncomeCalculator = dynamic(() => import('@/components/calculators/AfterTaxIncomeCalculator'), { loading: () => <CalculatorSkeleton /> });
const BusinessDayCalculator = dynamic(() => import('@/components/calculators/BusinessDayCalculator'), { loading: () => <CalculatorSkeleton /> });
const PropertyTaxCalculator = dynamic(() => import('@/components/calculators/PropertyTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const GrossMarginCalculator = dynamic(() => import('@/components/calculators/GrossMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const MarkupCalculator = dynamic(() => import('@/components/calculators/MarkupCalculator'), { loading: () => <CalculatorSkeleton /> });
const TaxRefundCalculator = dynamic(() => import('@/components/calculators/TaxRefundCalculator'), { loading: () => <CalculatorSkeleton /> });
const DecimalConverterCalculator = dynamic(() => import('@/components/calculators/DecimalConverterCalculator'), { loading: () => <CalculatorSkeleton /> });
const WagesCalculator = dynamic(() => import('@/components/calculators/WagesCalculator'), { loading: () => <CalculatorSkeleton /> });
const PayrollDeductionCalculator = dynamic(() => import('@/components/calculators/PayrollDeductionCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalaryTaxCalculator = dynamic(() => import('@/components/calculators/SalaryTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeCardLunchCalculator = dynamic(() => import('@/components/calculators/TimeCardLunchCalculator'), { loading: () => <CalculatorSkeleton /> });
const HourlyPaycheckCalculator = dynamic(() => import('@/components/calculators/HourlyPaycheckCalculator'), { loading: () => <CalculatorSkeleton /> });
// ── 8 new calculators ──
const SeverancePayCalculator = dynamic(() => import('@/components/calculators/SeverancePayCalculator'), { loading: () => <CalculatorSkeleton /> });
const WorkersCompCalculator = dynamic(() => import('@/components/calculators/WorkersCompCalculator'), { loading: () => <CalculatorSkeleton /> });
const FicaTaxCalculator = dynamic(() => import('@/components/calculators/FicaTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeAndAHalfCalculator = dynamic(() => import('@/components/calculators/TimeAndAHalfCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeTurnoverCalculator = dynamic(() => import('@/components/calculators/EmployeeTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> });
const CostPerHireCalculator = dynamic(() => import('@/components/calculators/CostPerHireCalculator'), { loading: () => <CalculatorSkeleton /> });
const BillableHoursCalculator = dynamic(() => import('@/components/calculators/BillableHoursCalculator'), { loading: () => <CalculatorSkeleton /> });
const RevenuePerEmployeeCalculator = dynamic(() => import('@/components/calculators/RevenuePerEmployeeCalculator'), { loading: () => <CalculatorSkeleton /> });

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
  // ── 8 new calculators ──
  'severance-pay': SeverancePayCalculator,
  'workers-comp': WorkersCompCalculator,
  'fica-tax': FicaTaxCalculator,
  'time-and-a-half': TimeAndAHalfCalculator,
  'employee-turnover': EmployeeTurnoverCalculator,
  'cost-per-hire': CostPerHireCalculator,
  'billable-hours': BillableHoursCalculator,
  'revenue-per-employee': RevenuePerEmployeeCalculator,
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

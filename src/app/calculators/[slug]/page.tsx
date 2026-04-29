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

import SalesCommissionCalculator from '@/components/calculators/SalesCommissionCalculator';
import ProRataSalaryCalculator from '@/components/calculators/ProRataSalaryCalculator';
import SalaryIncreaseCalculator from '@/components/calculators/SalaryIncreaseCalculator';
import PayrollCalculator from '@/components/calculators/PayrollCalculator';
import TimeCardCalculator from '@/components/calculators/TimeCardCalculator';
import ProfitMarginCalculator from '@/components/calculators/ProfitMarginCalculator';
import PostTaxBonusCalculator from '@/components/calculators/PostTaxBonusCalculator';
import ROICalculator from '@/components/calculators/ROICalculator';
import SalaryConverterCalculator from '@/components/calculators/SalaryConverterCalculator';
import OvertimeCalculator from '@/components/calculators/OvertimeCalculator';
import DiscountCalculator from '@/components/calculators/DiscountCalculator';
import TaxBracketCalculator from '@/components/calculators/TaxBracketCalculator';
import AfterTaxIncomeCalculator from '@/components/calculators/AfterTaxIncomeCalculator';
import BusinessDayCalculator from '@/components/calculators/BusinessDayCalculator';
import PropertyTaxCalculator from '@/components/calculators/PropertyTaxCalculator';
import GrossMarginCalculator from '@/components/calculators/GrossMarginCalculator';
import MarkupCalculator from '@/components/calculators/MarkupCalculator';
import TaxRefundCalculator from '@/components/calculators/TaxRefundCalculator';
import DecimalConverterCalculator from '@/components/calculators/DecimalConverterCalculator';
import WagesCalculator from '@/components/calculators/WagesCalculator';
import PayrollDeductionCalculator from '@/components/calculators/PayrollDeductionCalculator';
import SalaryTaxCalculator from '@/components/calculators/SalaryTaxCalculator';
import TimeCardLunchCalculator from '@/components/calculators/TimeCardLunchCalculator';
import HourlyPaycheckCalculator from '@/components/calculators/HourlyPaycheckCalculator';
// ── 8 new calculators ──
import SeverancePayCalculator from '@/components/calculators/SeverancePayCalculator';
import WorkersCompCalculator from '@/components/calculators/WorkersCompCalculator';
import FicaTaxCalculator from '@/components/calculators/FicaTaxCalculator';
import TimeAndAHalfCalculator from '@/components/calculators/TimeAndAHalfCalculator';
import EmployeeTurnoverCalculator from '@/components/calculators/EmployeeTurnoverCalculator';
import CostPerHireCalculator from '@/components/calculators/CostPerHireCalculator';
import BillableHoursCalculator from '@/components/calculators/BillableHoursCalculator';
import RevenuePerEmployeeCalculator from '@/components/calculators/RevenuePerEmployeeCalculator';

const componentMap: Record<string, React.ComponentType> = {
  'commission-calculator': SalesCommissionCalculator,
  'pro-rata-calculator': ProRataSalaryCalculator,
  'salary-increase-calculator': SalaryIncreaseCalculator,
  'payroll-calculator': PayrollCalculator,
  'time-card-calculator': TimeCardCalculator,
  'profit-margin-calculator': ProfitMarginCalculator,
  'bonus-tax-calculator': PostTaxBonusCalculator,
  'roi-calculator': ROICalculator,
  'salary-converter': SalaryConverterCalculator,
  'overtime-calculator': OvertimeCalculator,
  'discount-calculator': DiscountCalculator,
  'tax-bracket-calculator': TaxBracketCalculator,
  'after-tax-income-calculator': AfterTaxIncomeCalculator,
  'business-day-calculator': BusinessDayCalculator,
  'property-tax-calculator': PropertyTaxCalculator,
  'gross-margin-calculator': GrossMarginCalculator,
  'markup-calculator': MarkupCalculator,
  'tax-refund-estimator': TaxRefundCalculator,
  'time-to-decimal-calculator': DecimalConverterCalculator,
  'wages-calculator': WagesCalculator,
  'payroll-deduction-calculator': PayrollDeductionCalculator,
  'salary-tax-calculator': SalaryTaxCalculator,
  'time-card-calculator-with-lunch': TimeCardLunchCalculator,
  'hourly-paycheck-calculator': HourlyPaycheckCalculator,
  // ── 8 new calculators ──
  'severance-pay-calculator': SeverancePayCalculator,
  'workers-comp-calculator': WorkersCompCalculator,
  'fica-tax-calculator': FicaTaxCalculator,
  'time-and-a-half-calculator': TimeAndAHalfCalculator,
  'employee-turnover-calculator': EmployeeTurnoverCalculator,
  'cost-per-hire-calculator': CostPerHireCalculator,
  'billable-hours-calculator': BillableHoursCalculator,
  'revenue-per-employee-calculator': RevenuePerEmployeeCalculator,
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

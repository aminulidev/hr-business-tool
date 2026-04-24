import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCalculatorBySlug, getAllSlugs } from '@/lib/calculator-meta';
import dynamic from 'next/dynamic';

// ---------------------------------------------------------------------------
// Dynamic imports — same map as main calculator page
// ---------------------------------------------------------------------------

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
    title: calc ? `${calc.title} — Embed | CalcHub` : 'Calculator Embed',
    robots: { index: false, follow: false },
  };
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

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
  if (!calc) notFound();

  const CalculatorComponent = componentMap[slug];
  if (!CalculatorComponent) notFound();

  return (
    <div className="embed-page min-h-screen bg-background">
      <CalculatorComponent />
      <div className="text-center py-2 text-xs text-muted-foreground border-t border-border mt-2">
        Powered by{' '}
        <a
          href={`https://calchub.com/calculators/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline"
        >
          CalcHub
        </a>
      </div>
    </div>
  );
}

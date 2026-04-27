import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCalculatorBySlug, getAllSlugs } from '@/lib/calculator-meta';
import dynamic from 'next/dynamic';
import CalculatorSkeleton from '@/components/calculators/CalculatorSkeleton';

// ---------------------------------------------------------------------------
// Dynamic imports — same map as main calculator page
// ---------------------------------------------------------------------------

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
const SeverancePayCalculator = dynamic(() => import('@/components/calculators/SeverancePayCalculator'), { loading: () => <CalculatorSkeleton /> });
const WorkersCompCalculator = dynamic(() => import('@/components/calculators/WorkersCompCalculator'), { loading: () => <CalculatorSkeleton /> });
const FicaTaxCalculator = dynamic(() => import('@/components/calculators/FicaTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeAndAHalfCalculator = dynamic(() => import('@/components/calculators/TimeAndAHalfCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeTurnoverCalculator = dynamic(() => import('@/components/calculators/EmployeeTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> });
const CostPerHireCalculator = dynamic(() => import('@/components/calculators/CostPerHireCalculator'), { loading: () => <CalculatorSkeleton /> });
const BillableHoursCalculator = dynamic(() => import('@/components/calculators/BillableHoursCalculator'), { loading: () => <CalculatorSkeleton /> });
const RevenuePerEmployeeCalculator = dynamic(() => import('@/components/calculators/RevenuePerEmployeeCalculator'), { loading: () => <CalculatorSkeleton /> });

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

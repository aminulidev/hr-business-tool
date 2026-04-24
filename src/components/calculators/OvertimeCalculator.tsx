'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Timer, DollarSign, Clock, Info, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OvertimeMultiplierPreset = '1.5' | '2' | 'custom';

interface OvertimeResult {
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  overtimePremium: number;
  effectiveHourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  hourlyRate: number;
  multiplier: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatNumber = (value: number, decimals: number = 2): string =>
  value.toFixed(decimals);

// ---------------------------------------------------------------------------
// How-to steps
// ---------------------------------------------------------------------------

const howToSteps = [
  'Enter your hourly pay rate — this is the standard amount you earn per hour before any overtime calculations are applied.',
  'Set your regular hours per week. The default is 40 hours, which is the standard full-time threshold under the FLSA. Adjust this if your employer uses a different weekly schedule.',
  'Enter the number of overtime hours you worked during the week. You can either type this directly or use the optional weekly total field below to auto-calculate it.',
  'Choose your overtime multiplier from the dropdown — select 1.5x (time-and-a-half) or 2x (double time), or choose "Custom" to enter any multiplier you need for state-specific or contract-based rates.',
  'Optionally, enter your total weekly hours worked. If this exceeds your regular hours, the calculator will automatically determine your overtime hours for you.',
  'Click "Calculate Overtime Pay" to see your complete pay breakdown including regular pay, overtime pay, total earnings, the overtime premium above your normal rate, and your effective hourly rate for the week.',
];

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

const faqs = [
  {
    question: 'What are the FLSA overtime rules?',
    answer:
      'The Fair Labor Standards Act (FLSA) requires that covered, non-exempt employees be paid at least 1.5 times their regular hourly rate for all hours worked beyond 40 in a single workweek. The FLSA establishes the federal baseline for overtime, but individual states may have their own laws that provide additional protections. For example, some states require overtime for hours worked beyond 8 in a single day. Federal law does not limit the number of hours employees aged 16 and older may work in a week, but overtime must be compensated for hours beyond the 40-hour threshold.',
  },
  {
    question: 'How does California daily overtime work?',
    answer:
      'California has some of the strictest overtime laws in the country. Under California law, non-exempt employees earn 1.5x their regular rate for any hours worked beyond 8 in a single day, and double time (2x) for hours worked beyond 12 in a day. Additionally, the first 8 overtime hours worked in a workweek are compensated at 1.5x, and any hours beyond the first 8 overtime hours in that week are paid at double time. This means California workers can earn overtime even if they work less than 40 total hours in a week, provided any single day exceeds 8 hours.',
  },
  {
    question: 'Who qualifies for overtime pay?',
    answer:
      'Under the FLSA, employees are generally classified as either exempt or non-exempt. Non-exempt employees are entitled to overtime pay, while exempt employees are not. To qualify as exempt, an employee must typically earn at least a minimum salary threshold (set by the Department of Labor), and their job duties must meet specific criteria for executive, administrative, professional, outside sales, or computer professional exemptions. Most hourly workers are non-exempt. If you are unsure about your classification, check with your state labor department or the U.S. Department of Labor.',
  },
  {
    question: 'What is the difference between exempt and non-exempt employees?',
    answer:
      'Non-exempt employees are entitled to minimum wage and overtime pay (1.5x for hours over 40 per week) under the FLSA. They are typically paid hourly and must track their time worked. Exempt employees are excluded from overtime requirements and are generally paid a salary rather than hourly. To qualify as exempt, employees must meet specific duties tests and earn above a salary threshold ($684 per week under current federal rules, though some states have higher thresholds). Exempt employees are expected to complete their job responsibilities regardless of how many hours it takes.',
  },
  {
    question: 'Is holiday pay the same as overtime pay?',
    answer:
      'No, holiday pay and overtime pay are separate concepts. Federal law does not require employers to pay extra for work performed on holidays, Sundays, or weekends. Overtime is triggered only by exceeding 40 hours in a workweek (or daily thresholds in states like California). However, many employers voluntarily offer premium holiday pay rates (such as 1.5x or 2x) as a company policy or through union contracts. If you work overtime hours during a holiday week, the overtime rules still apply — holiday premium pay does not count toward the overtime calculation unless your employer specifically includes it.',
  },
  {
    question: 'Can employers offer comp time instead of overtime pay?',
    answer:
      'Under the FLSA, private-sector employers generally cannot offer compensatory time off (comp time) in place of overtime pay for non-exempt employees. Overtime must be paid as wages. However, there are exceptions for public-sector (government) employers, who may offer comp time at a rate of 1.5 hours for each overtime hour worked, subject to certain limits. Some states have their own rules regarding comp time. If your employer offers comp time instead of overtime pay and you work in the private sector, this may be a violation of federal wage law, and you should consult the Department of Labor or an employment attorney.',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OvertimeCalculator() {
  // Inputs
  const [hourlyRateInput, setHourlyRateInput] = useState('');
  const [regularHoursInput, setRegularHoursInput] = useState('40');
  const [overtimeHoursInput, setOvertimeHoursInput] = useState('');
  const [multiplierPreset, setMultiplierPreset] = useState<OvertimeMultiplierPreset>('1.5');
  const [customMultiplierInput, setCustomMultiplierInput] = useState('1.5');
  const [weeklyHoursInput, setWeeklyHoursInput] = useState('');

  // Results
  const [result, setResult] = useState<OvertimeResult | null>(null);
  const { history, saveEntry, clearHistory } = useCalcHistory<{
    hourlyRateInput: string; regularHoursInput: string; overtimeHoursInput: string;
    multiplierPreset: string; customMultiplierInput: string; weeklyHoursInput: string;
  }>('overtime');

  // Derived overtime hint from weekly total (display only, no side effects)
  const autoOvertimeHint = useMemo(() => {
    const weeklyTotal = parseFloat(weeklyHoursInput);
    const regularHours = parseFloat(regularHoursInput) || 40;
    if (isNaN(weeklyTotal) || weeklyHoursInput === '') return null;
    return Math.max(weeklyTotal - regularHours, 0);
  }, [weeklyHoursInput, regularHoursInput]);

  const handleCalculate = () => {
    const hourlyRate = parseFloat(hourlyRateInput);
    const regularHours = parseFloat(regularHoursInput) || 40;
    // Use auto-calculated overtime from weekly total if available, otherwise use manual input
    const weeklyTotal = parseFloat(weeklyHoursInput);
    let overtimeHours = parseFloat(overtimeHoursInput) || 0;
    if (!isNaN(weeklyTotal) && weeklyHoursInput !== '') {
      overtimeHours = Math.max(weeklyTotal - regularHours, 0);
    }
    const multiplier =
      multiplierPreset === 'custom'
        ? parseFloat(customMultiplierInput) || 1.5
        : parseFloat(multiplierPreset);

    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      setResult(null);
      return;
    }

    const regularPay = hourlyRate * regularHours;
    const overtimePay = hourlyRate * multiplier * overtimeHours;
    const totalPay = regularPay + overtimePay;
    const overtimePremium = hourlyRate * (multiplier - 1) * overtimeHours;
    const totalHours = regularHours + overtimeHours;
    const effectiveHourlyRate = totalHours > 0 ? totalPay / totalHours : 0;

    setResult({
      regularPay,
      overtimePay,
      totalPay,
      overtimePremium,
      effectiveHourlyRate,
      regularHours,
      overtimeHours,
      totalHours,
      hourlyRate,
      multiplier,
    });
    saveEntry(
      { hourlyRateInput, regularHoursInput, overtimeHoursInput, multiplierPreset, customMultiplierInput, weeklyHoursInput },
      `${formatCurrency(totalPay)} total (${formatCurrency(hourlyRate)}/hr × ${multiplier}x, ${overtimeHours}h OT)`
    );
  };

  const handleRestore = (inputs: { hourlyRateInput: string; regularHoursInput: string; overtimeHoursInput: string; multiplierPreset: string; customMultiplierInput: string; weeklyHoursInput: string }) => {
    setHourlyRateInput(inputs.hourlyRateInput);
    setRegularHoursInput(inputs.regularHoursInput);
    setOvertimeHoursInput(inputs.overtimeHoursInput);
    setMultiplierPreset(inputs.multiplierPreset as OvertimeMultiplierPreset);
    setCustomMultiplierInput(inputs.customMultiplierInput);
    setWeeklyHoursInput(inputs.weeklyHoursInput);
    setResult(null);
  };

  const handleReset = () => {
    setHourlyRateInput('');
    setRegularHoursInput('40');
    setOvertimeHoursInput('');
    setMultiplierPreset('1.5');
    setCustomMultiplierInput('1.5');
    setWeeklyHoursInput('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Overtime Pay Calculator"
      description="Calculate your overtime pay with time-and-a-half, double time, or custom multipliers. See exactly how much extra you earn beyond your regular hourly rate."
      icon={<Timer className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Overtime Calculator' },
      ]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Overtime Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={howToSteps}
      formula="Overtime Pay = Hourly Rate × Overtime Multiplier × Overtime Hours"
      formulaDescription="The overtime pay formula multiplies your regular hourly rate by the overtime multiplier and the number of overtime hours worked. For federal FLSA overtime, the standard multiplier is 1.5 (time-and-a-half). Some states and situations require a 2x multiplier (double time). The overtime premium — the extra amount earned above your regular rate — is calculated as Hourly Rate × (Multiplier − 1) × Overtime Hours."
      workedExamples={[
        {
          title: '$25/hr with 5 Hours Overtime at 1.5x',
          description:
            'An employee earning $25 per hour works 45 hours in a week. The regular hours are 40, and overtime hours are 5. Regular pay = $25 × 40 = $1,000. Overtime pay = $25 × 1.5 × 5 = $187.50. Total pay = $1,187.50. The overtime premium (extra earned above regular rate) = $25 × 0.5 × 5 = $62.50. The effective hourly rate for the week is $1,187.50 ÷ 45 = $26.39/hr — significantly higher than the base rate thanks to overtime compensation.',
        },
        {
          title: '$30/hr with 10 Hours Overtime at 2x (Double Time)',
          description:
            'A worker earning $30 per hour works 50 hours during a busy week, with the 10 overtime hours compensated at double time. Regular pay = $30 × 40 = $1,200. Overtime pay = $30 × 2 × 10 = $600. Total pay = $1,800. The overtime premium = $30 × 1 × 10 = $300 — this is the extra amount earned on top of what the 10 hours would have paid at the regular rate. The effective hourly rate is $1,800 ÷ 50 = $36.00/hr. Double time is common in California for hours exceeding 12 in a single day or for certain holiday shifts.',
        },
        {
          title: '$18/hr with 8 Hours at 1.5x and 2 Hours at 2x',
          description:
            'A retail employee earning $18 per hour works 50 hours total. The first 40 hours are regular, hours 41–48 (8 hours) are at time-and-a-half (1.5x), and hours 49–50 (2 hours) are at double time (2x), per California-style rules. Regular pay = $18 × 40 = $720. Tier-1 overtime pay = $18 × 1.5 × 8 = $216. Tier-2 overtime pay = $18 × 2 × 2 = $72. Total overtime pay = $288. Total pay = $1,008. The combined overtime premium = $18 × 0.5 × 8 + $18 × 1 × 2 = $72 + $36 = $108. Effective hourly rate = $1,008 ÷ 50 = $20.16/hr.',
        },
      ]}
      faqs={faqs}
      relatedTools={[
        { slug: 'time-card', title: 'Time Card Calculator', description: 'Convert work hours to decimal format for payroll', icon: 'Clock' },
        { slug: 'time-card-lunch', title: 'Time Card Calculator with Lunch', description: 'Track hours with automatic lunch break deduction', icon: 'Coffee' },
        { slug: 'payroll', title: 'Payroll Calculator', description: 'Calculate take-home pay after taxes and deductions', icon: 'CreditCard' },
        { slug: 'wages', title: 'Wages Calculator', description: 'Calculate gross and net wages from hours worked', icon: 'Banknote' },
        { slug: 'salary-converter', title: 'Salary Converter', description: 'Convert between hourly, monthly, and annual salary', icon: 'DollarSign' },
      ]}
    >
      {/* ================================================================= */}
      {/* Input Form                                                        */}
      {/* ================================================================= */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Row 1: Hourly Rate & Regular Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hourly-rate" className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Hourly Rate ($)
            </Label>
            <Input
              id="hourly-rate"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 25"
              value={hourlyRateInput}
              onChange={(e) => setHourlyRateInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regular-hours" className="text-sm font-medium">
              <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Regular Hours / Week
            </Label>
            <Input
              id="regular-hours"
              type="number"
              min="0"
              step="1"
              placeholder="40"
              value={regularHoursInput}
              onChange={(e) => setRegularHoursInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Standard is 40 hrs under FLSA
            </p>
          </div>
        </div>

        {/* Row 2: Overtime Hours & Multiplier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="overtime-hours" className="text-sm font-medium">
              <Timer className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Overtime Hours Worked
            </Label>
            <Input
              id="overtime-hours"
              type="number"
              min="0"
              step="0.25"
              placeholder="e.g., 5"
              value={overtimeHoursInput}
              onChange={(e) => setOvertimeHoursInput(e.target.value)}
            />
            {autoOvertimeHint !== null && (
              <p className="text-xs text-amber-600 mt-1">
                {autoOvertimeHint > 0
                  ? `Weekly total suggests ${formatNumber(autoOvertimeHint)} OT hrs (will be used on calculate)`
                  : 'Weekly total does not exceed regular hours'
                }
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ot-multiplier" className="text-sm font-medium">
              <TrendingUp className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Overtime Multiplier
            </Label>
            <Select
              value={multiplierPreset}
              onValueChange={(val) => {
                setMultiplierPreset(val as OvertimeMultiplierPreset);
                if (val !== 'custom') {
                  setCustomMultiplierInput(val);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select multiplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5">1.5x — Time-and-a-Half</SelectItem>
                <SelectItem value="2">2x — Double Time</SelectItem>
                <SelectItem value="custom">Custom Multiplier</SelectItem>
              </SelectContent>
            </Select>

            {multiplierPreset === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="number"
                  min="1"
                  step="0.1"
                  placeholder="e.g., 1.5"
                  value={customMultiplierInput}
                  onChange={(e) => setCustomMultiplierInput(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter any multiplier (e.g., 1.25, 2, 3)
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Row 3: Weekly Total (optional auto-calculate) */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
          <Label htmlFor="weekly-hours" className="text-sm font-medium flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            Total Weekly Hours Worked
            <span className="text-xs text-muted-foreground font-normal">(optional — auto-calculates overtime)</span>
          </Label>
          <Input
            id="weekly-hours"
            type="number"
            min="0"
            step="0.25"
            placeholder="e.g., 48"
            value={weeklyHoursInput}
            onChange={(e) => setWeeklyHoursInput(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            If total hours exceed your regular hours ({regularHoursInput || '40'}), overtime hours will be calculated automatically.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            Calculate Overtime Pay
          </Button>
          <Button variant="outline" onClick={handleReset} size="lg">
            Reset
          </Button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Results                                                           */}
      {/* ================================================================= */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8" aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Weekly Pay
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.totalPay)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatNumber(result.totalHours)} total hours ·{' '}
                <span className="font-semibold text-foreground">
                  {formatCurrency(result.effectiveHourlyRate)}/hr effective
                </span>
              </p>
            </div>

            {/* Breakdown Table */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                      Hours
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                      Rate
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Pay
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr>
                    <td className="px-4 py-3 font-medium">Regular Pay</td>
                    <td className="text-center px-4 py-3 text-muted-foreground">
                      {formatNumber(result.regularHours)} hrs
                    </td>
                    <td className="text-center px-4 py-3 text-muted-foreground">
                      {formatCurrency(result.hourlyRate)}/hr
                    </td>
                    <td className="text-right px-4 py-3 font-medium">
                      {formatCurrency(result.regularPay)}
                    </td>
                  </tr>
                  {result.overtimeHours > 0 && (
                    <tr className="text-amber-600">
                      <td className="px-4 py-3 flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5" />
                        Overtime Pay ({result.multiplier}x)
                      </td>
                      <td className="text-center px-4 py-3">
                        {formatNumber(result.overtimeHours)} hrs
                      </td>
                      <td className="text-center px-4 py-3">
                        {formatCurrency(result.hourlyRate * result.multiplier)}/hr
                      </td>
                      <td className="text-right px-4 py-3 font-medium">
                        +{formatCurrency(result.overtimePay)}
                      </td>
                    </tr>
                  )}
                  <tr className="font-bold bg-emerald-500/5">
                    <td className="px-4 py-3 text-emerald-600">Total Pay</td>
                    <td className="text-center px-4 py-3 text-emerald-600">
                      {formatNumber(result.totalHours)} hrs
                    </td>
                    <td className="text-center px-4 py-3 text-emerald-600">
                      {formatCurrency(result.effectiveHourlyRate)}/hr
                    </td>
                    <td className="text-right px-4 py-3 text-emerald-600">
                      {formatCurrency(result.totalPay)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Regular Pay</p>
                <p className="text-lg font-bold">{formatCurrency(result.regularPay)}</p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Overtime Pay</p>
                <p className="text-lg font-bold text-amber-600">
                  {formatCurrency(result.overtimePay)}
                </p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">OT Premium</p>
                <p className="text-lg font-bold text-emerald-600">
                  +{formatCurrency(result.overtimePremium)}
                </p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Effective Rate</p>
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(result.effectiveHourlyRate)}
                  <span className="text-xs text-muted-foreground font-normal">/hr</span>
                </p>
              </div>
            </div>

            {/* Summary Badges */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                Base Rate: {formatCurrency(result.hourlyRate)}/hr
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Multiplier: {result.multiplier}x
              </Badge>
              {result.overtimeHours > 0 && (
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  <Info className="h-3.5 w-3.5 mr-1.5" />
                  OT Premium: +{formatNumber((result.effectiveHourlyRate - result.hourlyRate) / result.hourlyRate * 100)}% over base
                </Badge>
              )}
            </div>

            {/* Pay Split Pie Chart */}
            <div className="print:hidden">
              <p className="text-sm font-medium text-muted-foreground mb-3">Pay Split</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Regular Pay', value: result.regularPay },
                      { name: 'Overtime Pay', value: result.overtimePay },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} />
    </CalculatorLayout>
  );
}

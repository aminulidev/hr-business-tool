'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Calendar, Users, MapPin, Info, AlertCircle, Copy, Check, PiggyBank } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TryExample from './TryExample';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { formatCurrency } from '@/lib/utils';
import {
  calculatePaycheck,
  PERIODS_PER_YEAR,
  TAX_YEAR,
  type FilingStatus,
  type PayFrequency,
  type PaycheckResult,
  type PaycheckState,
  type StateCode,
} from '@/lib/payroll/withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const FREQ_LABELS: Record<PayFrequency, string> = {
  weekly: 'Weekly (52 paychecks)',
  'bi-weekly': 'Bi-Weekly (26 paychecks)',
  'semi-monthly': 'Semi-Monthly (24 paychecks)',
  monthly: 'Monthly (12 paychecks)',
};

const FILING_LABELS: Record<FilingStatus, string> = {
  single: 'Single or Married Filing Separately',
  married: 'Married Filing Jointly',
  hoh: 'Head of Household',
};

// States with exact 2026 withholding tables, alphabetical
const EXACT_STATES: StateCode[] = [...STATE_CODES].sort((a, b) =>
  STATE_PAYCHECK_PAGES[a].name.localeCompare(STATE_PAYCHECK_PAGES[b].name)
);

const NO_TAX_STATES = 'Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming';

// Full-time hours used to turn an annual salary into the engine's hourly input
const SALARY_HOURS_PER_WEEK = 40;
const SALARY_HOURS_PER_YEAR = SALARY_HOURS_PER_WEEK * 52;

function isExactState(s: PaycheckState): s is StateCode {
  return s !== 'none' && s !== 'other';
}

function defaultAllowances(s: PaycheckState, status: FilingStatus): string {
  if (!isExactState(s)) return '0';
  const a = STATE_PAYCHECK_PAGES[s].allowances;
  if (!a) return '0';
  return String(status === 'married' ? a.defaultMarried : a.defaultSingle);
}

interface HistoryInputs {
  hourlyRate: string;
  regularHours: string;
  overtimeHours: string;
  annualSalary: string;
  payFrequency: string;
  filingStatus: string;
  state: string;
  allowances: string;
  customStateRate: string;
  retirementPct: string;
  benefitsPerPeriod: string;
  otherDeductions: string;
  nycResident: string;
}

export type PaycheckMode = 'hourly' | 'salary';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Shared paycheck calculator. `mode="hourly"` takes an hourly rate and hours;
 * `mode="salary"` takes an annual salary. Both run the same 2026 withholding
 * engine used by the state paycheck pages.
 */
export default function HourlyPaycheckCalculator({ mode = 'hourly' }: { mode?: PaycheckMode }) {
  const isSalary = mode === 'salary';
  const historySlug = isSalary ? 'payroll-calculator' : 'hourly-paycheck-calculator';

  const [hourlyRate, setHourlyRate] = useState('');
  const [regularHours, setRegularHours] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [annualSalary, setAnnualSalary] = useState('');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('bi-weekly');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [state, setState] = useState<PaycheckState>('other');
  const [allowances, setAllowances] = useState('0');
  const [customStateRate, setCustomStateRate] = useState('5');
  const [nycResident, setNycResident] = useState(false);
  const [retirementPct, setRetirementPct] = useState('');
  const [benefitsPerPeriod, setBenefitsPerPeriod] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('');
  const [result, setResult] = useState<PaycheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<HistoryInputs>(historySlug);

  const page = isExactState(state) ? STATE_PAYCHECK_PAGES[state] : null;

  const changeState = (v: PaycheckState) => {
    setState(v);
    setAllowances(defaultAllowances(v, filingStatus));
    if (v !== 'NY') setNycResident(false);
    setResult(null);
  };

  const changeFilingStatus = (status: FilingStatus) => {
    // Keep the state allowance default in step with filing status until the user edits it
    if (allowances === defaultAllowances(state, filingStatus)) {
      setAllowances(defaultAllowances(state, status));
    }
    setFilingStatus(status);
    setResult(null);
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const allow = parseInt(allowances || '0', 10);
    const statePct = parseFloat(customStateRate || '0');
    const retPct = parseFloat(retirementPct || '0');
    const benefits = parseFloat(benefitsPerPeriod || '0');
    const other = parseFloat(otherDeductions || '0');

    let rate: number;
    let reg: number;
    let ot: number;
    if (isSalary) {
      const salary = parseFloat(annualSalary);
      if (isNaN(salary) || salary <= 0) {
        setError('Please enter your annual salary.');
        return;
      }
      rate = salary / SALARY_HOURS_PER_YEAR;
      reg = SALARY_HOURS_PER_WEEK;
      ot = 0;
    } else {
      rate = parseFloat(hourlyRate);
      reg = parseFloat(regularHours);
      ot = parseFloat(overtimeHours || '0');
      if (isNaN(rate) || rate <= 0) {
        setError('Please enter your hourly wage.');
        return;
      }
      if (isNaN(reg) || reg < 0 || reg > 168) {
        setError('Please enter regular hours per week between 0 and 168.');
        return;
      }
      if (isNaN(ot) || ot < 0 || reg + ot > 168) {
        setError('Please enter valid overtime hours (total hours cannot exceed 168 per week).');
        return;
      }
    }
    if (page?.allowances && (isNaN(allow) || allow < 0 || allow > 99)) {
      setError(`Please enter your ${page.allowances.label} as a whole number (0 or more).`);
      return;
    }
    if (state === 'other' && (isNaN(statePct) || statePct < 0 || statePct > 20)) {
      setError('Please enter a state tax rate between 0% and 20%.');
      return;
    }
    if (isNaN(retPct) || retPct < 0 || retPct > 100) {
      setError('Please enter a 401(k) contribution between 0% and 100%.');
      return;
    }
    if (isNaN(benefits) || benefits < 0 || isNaN(other) || other < 0) {
      setError('Deductions cannot be negative.');
      return;
    }

    const grossAnnual = (rate * reg + rate * 1.5 * ot) * 52;
    const periods = PERIODS_PER_YEAR[payFrequency];

    const r = calculatePaycheck({
      state,
      hourlyRate: rate,
      regularHoursPerWeek: reg,
      overtimeHoursPerWeek: ot,
      overtimeMultiplier: 1.5,
      payFrequency,
      filingStatus,
      stateAllowances: page?.allowances ? allow : 0,
      nycResident: state === 'NY' && nycResident,
      customStateRate: state === 'other' ? statePct / 100 : undefined,
      preTaxRetirementAnnual: grossAnnual * (retPct / 100),
      preTaxBenefitsAnnual: benefits * periods,
      otherDeductionsPerPeriod: other,
    });
    setResult(r);
    saveEntry(
      {
        hourlyRate,
        regularHours,
        overtimeHours,
        annualSalary,
        payFrequency,
        filingStatus,
        state,
        allowances,
        customStateRate,
        retirementPct,
        benefitsPerPeriod,
        otherDeductions,
        nycResident: nycResident ? '1' : '0',
      },
      isSalary
        ? `${formatCurrency(parseFloat(annualSalary))}/yr → ${formatCurrency(r.netPerPeriod)} take-home per paycheck`
        : `${formatCurrency(rate)}/hr → ${formatCurrency(r.netPerPeriod)} take-home per paycheck`
    );
  };

  const handleRestore = (inputs: HistoryInputs) => {
    setHourlyRate(inputs.hourlyRate);
    setRegularHours(inputs.regularHours);
    setOvertimeHours(inputs.overtimeHours);
    setAnnualSalary(inputs.annualSalary ?? '');
    setPayFrequency(inputs.payFrequency as PayFrequency);
    setFilingStatus(inputs.filingStatus as FilingStatus);
    setState(inputs.state as PaycheckState);
    setAllowances(inputs.allowances);
    setCustomStateRate(inputs.customStateRate);
    setRetirementPct(inputs.retirementPct ?? '');
    setBenefitsPerPeriod(inputs.benefitsPerPeriod ?? '');
    setOtherDeductions(inputs.otherDeductions);
    setNycResident(inputs.nycResident === '1');
    setResult(null);
    setError(null);
  };

  const handleTryExample = () => {
    if (isSalary) {
      setAnnualSalary('65000');
      setRetirementPct('5');
      setBenefitsPerPeriod('150');
    } else {
      setHourlyRate('25');
      setRegularHours('40');
      setOvertimeHours('5');
      setRetirementPct('');
      setBenefitsPerPeriod('');
    }
    setPayFrequency('bi-weekly');
    setFilingStatus('single');
    setState('CA');
    setAllowances(defaultAllowances('CA', 'single'));
    setCustomStateRate('5');
    setNycResident(false);
    setOtherDeductions('');
    setError(null);
    setResult(null);
  };

  const handleReset = () => {
    setHourlyRate('');
    setRegularHours('40');
    setOvertimeHours('0');
    setAnnualSalary('');
    setPayFrequency('bi-weekly');
    setFilingStatus('single');
    setState('other');
    setAllowances('0');
    setCustomStateRate('5');
    setNycResident(false);
    setRetirementPct('');
    setBenefitsPerPeriod('');
    setOtherDeductions('');
    setError(null);
    setResult(null);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const stateLabel =
      state === 'none' ? 'No state income tax' : state === 'other' ? `Flat state rate ${customStateRate}%` : page!.name;
    const payLine = isSalary
      ? `Annual Salary: ${formatCurrency(parseFloat(annualSalary))}`
      : `Hourly Rate: ${formatCurrency(parseFloat(hourlyRate))}/hr (${regularHours} regular + ${overtimeHours || 0} OT hrs/week)`;
    const summary = [
      `--- ${isSalary ? 'Payroll' : 'Hourly Paycheck'} Summary (QuickBizCalc, ${TAX_YEAR}) ---`,
      payLine,
      `Pay Frequency: ${FREQ_LABELS[payFrequency]}`,
      `Filing Status: ${FILING_LABELS[filingStatus]}`,
      `State: ${stateLabel}`,
      `Gross Pay / Paycheck: ${formatCurrency(result.grossPerPeriod)}`,
      ...result.deductions.map((d) => `${d.label}: -${formatCurrency(d.perPeriod)}`),
      `Take-Home Pay / Paycheck: ${formatCurrency(result.netPerPeriod)}`,
      `Take-Home Pay / Year: ${formatCurrency(result.netAnnual)}`,
      ...(isSalary ? [] : [`Take-Home per Hour Worked: ${formatCurrency(result.netPerHour)}`]),
      `Calculated at: https://www.quickbizcalc.com/calculators/${historySlug}`,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resultStateNote =
    state === 'none'
      ? 'no state income tax'
      : state === 'other'
        ? `a flat ${customStateRate}% state income tax estimate`
        : `${page!.name} ${TAX_YEAR} withholding tables`;

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        {/* Pay */}
        {isSalary ? (
          <div className="space-y-2">
            <Label htmlFor="pcSalary" className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Annual Salary ($)
            </Label>
            <Input
              id="pcSalary"
              type="number"
              min="0"
              step="100"
              placeholder="e.g., 65000"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
              className="sm:max-w-sm"
            />
            <p className="text-xs text-muted-foreground">
              Your gross yearly pay before taxes. Paid hourly?{' '}
              <Link href="/calculators/hourly-paycheck-calculator" className="text-emerald-600 hover:underline">
                Use the hourly paycheck calculator
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pcHourlyRate" className="text-sm font-medium">
                <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Hourly Rate ($)
              </Label>
              <Input
                id="pcHourlyRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 25.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pcRegHours" className="text-sm font-medium">
                <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Regular Hours / Week
              </Label>
              <Input
                id="pcRegHours"
                type="number"
                min="0"
                step="0.5"
                value={regularHours}
                onChange={(e) => setRegularHours(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pcOtHours" className="text-sm font-medium">
                Overtime Hours / Week (1.5×)
              </Label>
              <Input
                id="pcOtHours"
                type="number"
                min="0"
                step="0.5"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Pay Frequency & Filing Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pcFrequency" className="text-sm font-medium">
              <Calendar className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Pay Frequency
            </Label>
            <Select value={payFrequency} onValueChange={(v) => { setPayFrequency(v as PayFrequency); setResult(null); }}>
              <SelectTrigger id="pcFrequency" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FREQ_LABELS) as PayFrequency[]).map((f) => (
                  <SelectItem key={f} value={f}>{FREQ_LABELS[f]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pcFiling" className="text-sm font-medium">
              <Users className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Federal Filing Status (W-4 Step 1)
            </Label>
            <Select value={filingStatus} onValueChange={(v) => changeFilingStatus(v as FilingStatus)}>
              <SelectTrigger id="pcFiling" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FILING_LABELS) as FilingStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{FILING_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* State */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pcState" className="text-sm font-medium">
              <MapPin className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              State
            </Label>
            <Select value={state} onValueChange={(v) => changeState(v as PaycheckState)}>
              <SelectTrigger id="pcState" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXACT_STATES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {STATE_PAYCHECK_PAGES[code].name} (exact {TAX_YEAR} tables)
                  </SelectItem>
                ))}
                <SelectItem value="none">No state income tax (AK, NV, NH, SD, TN, WA, WY)</SelectItem>
                <SelectItem value="other">Other state (enter a flat rate)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {page?.allowances && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="space-y-1.5">
                <Label htmlFor="pcAllowances" className="text-xs text-muted-foreground">
                  {page.allowances.label}
                </Label>
                <Input
                  id="pcAllowances"
                  type="number"
                  min="0"
                  step="1"
                  value={allowances}
                  onChange={(e) => setAllowances(e.target.value)}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">{page.allowances.help}</p>
              </div>
              {state === 'NY' && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background px-3 py-2.5 sm:mt-5">
                  <Label htmlFor="pcNyc" className="text-sm">I live in New York City</Label>
                  <Switch id="pcNyc" checked={nycResident} onCheckedChange={(v) => { setNycResident(v); setResult(null); }} />
                </div>
              )}
            </div>
          )}

          {page && !page.allowances && (
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              {page.name} has no state income tax, so only federal income tax, Social Security, and Medicare come out of your paycheck.
            </p>
          )}

          {state === 'none' && (
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              {NO_TAX_STATES} do not tax wages. Only federal income tax, Social Security, and Medicare are withheld.
            </p>
          )}

          {state === 'other' && (
            <div className="space-y-1.5">
              <Label htmlFor="pcStateRate" className="text-xs text-muted-foreground">
                State income tax rate (%)
              </Label>
              <Input
                id="pcStateRate"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={customStateRate}
                onChange={(e) => setCustomStateRate(e.target.value)}
                className="text-sm sm:max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                An estimate. Use your state&apos;s flat rate, or the effective state rate from last year&apos;s return (most workers fall between 2% and 6%).
                Exact {TAX_YEAR} tables are available for {EXACT_STATES.map((c) => STATE_PAYCHECK_PAGES[c].name).join(', ')}.
              </p>
            </div>
          )}

          {page && (
            <p className="text-xs text-muted-foreground">
              Only need {page.name}?{' '}
              <Link href={`/calculators/${page.slug}`} className="text-emerald-600 hover:underline">
                Use the {page.name} hourly paycheck calculator
              </Link>{' '}
              for state-specific minimum wage, overtime, and FAQ details.
            </p>
          )}
        </div>

        {/* Deductions */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
          <p className="text-sm font-semibold flex items-center gap-1.5">
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
            Deductions <span className="text-muted-foreground font-normal text-xs">optional</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pcRetirement" className="text-xs text-muted-foreground">
                401(k) / 403(b) contribution (% of gross)
              </Label>
              <Input
                id="pcRetirement"
                type="number"
                min="0"
                max="100"
                step="0.5"
                placeholder="e.g., 5"
                value={retirementPct}
                onChange={(e) => setRetirementPct(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Pre-tax: lowers income tax, not Social Security or Medicare.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pcBenefits" className="text-xs text-muted-foreground">
                Health &amp; Section 125 benefits ($ per paycheck)
              </Label>
              <Input
                id="pcBenefits"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 150"
                value={benefitsPerPeriod}
                onChange={(e) => setBenefitsPerPeriod(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Pre-tax: lowers income tax and FICA.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pcOther" className="text-xs text-muted-foreground">
                Other after-tax deductions ($ per paycheck)
              </Label>
              <Input
                id="pcOther"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 25"
                value={otherDeductions}
                onChange={(e) => setOtherDeductions(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Union dues, garnishments, Roth 401(k), post-tax insurance.</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex gap-3">
            <TryExample onClick={handleTryExample} />
            <Button onClick={handleReset} variant="outline" size="lg" className="shrink-0">
              Reset
            </Button>
          </div>
          <Button
            onClick={handleCalculate}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {isSalary ? 'Calculate Take-Home Pay' : 'Calculate Paycheck'}
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 px-4 sm:px-6 result-display"
          aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Take-Home Pay per Paycheck</p>
              <p className="text-4xl font-bold text-emerald-600">{formatCurrency(result.netPerPeriod)}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(result.netAnnual)} per year
                {isSalary
                  ? ` · ${formatCurrency(result.netAnnual / 12)} per month`
                  : ` · ${formatCurrency(result.netPerHour)} per hour worked`}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Gross Pay', value: formatCurrency(result.grossPerPeriod), color: 'text-blue-600' },
                {
                  label: 'Total Deductions',
                  value: formatCurrency(result.grossPerPeriod - result.netPerPeriod),
                  color: 'text-amber-600',
                },
                { label: 'Effective Rate', value: `${(result.effectiveRate * 100).toFixed(1)}%`, color: 'text-foreground' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-base sm:text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs"></th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Per Paycheck</th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Per Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr className="font-medium">
                      <td className="px-4 py-2.5">Gross pay</td>
                      <td className="text-right px-4 py-2.5">{formatCurrency(result.grossPerPeriod)}</td>
                      <td className="text-right px-4 py-2.5">{formatCurrency(result.grossAnnual)}</td>
                    </tr>
                    {result.deductions.map((d) => (
                      <tr key={d.key}>
                        <td className="px-4 py-2.5 text-muted-foreground">{d.label}</td>
                        <td className="text-right px-4 py-2.5 text-red-500">−{formatCurrency(d.perPeriod)}</td>
                        <td className="text-right px-4 py-2.5 text-red-500">−{formatCurrency(d.annual)}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold bg-emerald-500/5">
                      <td className="px-4 py-2.5">Take-home pay</td>
                      <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(result.netPerPeriod)}</td>
                      <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(result.netAnnual)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Estimate based on the {TAX_YEAR} IRS percentage method for a standard W-4 and {resultStateNote}. Extra
                  W-4 withholding, local taxes, and employer-specific deductions will change your actual paycheck.
                </p>
              </div>
              <Button onClick={handleCopySummary} variant="outline" size="sm" className="shrink-0">
                {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-600" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {copied ? 'Copied' : 'Copy summary'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {history.length > 0 && (
        <div className="mt-6 px-4 sm:px-6 pb-4">
          <CalcHistoryPanel
            history={history}
            onRestore={handleRestore}
            onClear={clearHistory}
            onDelete={deleteEntry}
          />
        </div>
      )}
    </div>
  );
}

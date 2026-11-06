'use client';

import { useState, useMemo } from 'react';
import { useInitialQuery } from '@/hooks/useSearchParam';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Clock,
  Calendar,
  Users,
  MapPin,
  Info,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Link2,
  Check,
  Receipt,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TryExample from './TryExample';
import { formatCurrency } from '@/lib/utils';
import {
  calculatePaycheck,
  TAX_YEAR,
  type FilingStatus,
  type PayFrequency,
  type PaycheckInput,
  type PaycheckResult,
  type StateCode,
} from '@/lib/payroll/withholding-2026';
import { STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';
import EmployerCostPanel, { ResultViewToggle, type ResultView } from './EmployerCostPanel';
import ReverseSolverCard from './ReverseSolverCard';
import PaycheckScenarioCompare from './PaycheckScenarioCompare';
import PayStubDialog from './PayStubDialog';
import { calculateEmployerCost } from '@/lib/payroll/employer-cost-2026';
import { parseScenarioParams, writeScenarioParams, type CompareScenario } from '@/lib/payroll/scenario-params';

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

interface StateDefaults {
  hourlyRate: string;
  regularHours: string;
  overtimeHours: string;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  allowances: string;
  nycResident: boolean;
  /** ?view=employer opens the employer-cost side of the result */
  view: ResultView;
  /** Scenario B from b_* params, or null */
  compare: CompareScenario | null;
}

const scenarioOf = (d: StateDefaults, state: StateCode): CompareScenario => ({
  state,
  hourlyRate: d.hourlyRate,
  regularHours: d.regularHours,
  overtimeHours: d.overtimeHours,
  annualSalary: '',
  filingStatus: d.filingStatus,
  payFrequency: d.payFrequency,
  retirementPct: '',
});

// Pre-fill $25/hr for instant live calculation on load, overridden by the shareable URL
// query params (?rate=28&hours=40&ot=5&freq=bi-weekly&status=single)
function readDefaults(params: URLSearchParams | null, state: StateCode): StateDefaults {
  const d: StateDefaults = {
    hourlyRate: '25',
    regularHours: '40',
    overtimeHours: '0',
    payFrequency: 'bi-weekly',
    filingStatus: 'single',
    allowances: String(STATE_PAYCHECK_PAGES[state].allowances?.defaultSingle ?? 0),
    nycResident: false,
    view: 'employee',
    compare: null,
  };
  if (!params || !params.toString()) return d;
  const qRate = params.get('rate');
  const qHours = params.get('hours');
  const qOt = params.get('ot');
  const qFreq = params.get('freq') as PayFrequency | null;
  const qStatus = params.get('status') as FilingStatus | null;
  const qAllow = params.get('allowances');
  const qNyc = params.get('nyc');

  if (qRate) d.hourlyRate = qRate;
  if (qHours) d.regularHours = qHours;
  if (qOt) d.overtimeHours = qOt;
  if (qFreq && qFreq in FREQ_LABELS) d.payFrequency = qFreq;
  if (qStatus && qStatus in FILING_LABELS) d.filingStatus = qStatus;
  if (qAllow) d.allowances = qAllow;
  if (qNyc === '1') d.nycResident = true;
  if (params.get('view') === 'employer') d.view = 'employer';
  d.compare = parseScenarioParams(params, scenarioOf(d, state));
  return d;
}

export default function StatePaycheckCalculator({ state }: { state: StateCode }) {
  // The server renders the defaults; once the client knows the query string the form is
  // keyed on it and mounts again with the shared values (no setState inside an effect).
  const query = useInitialQuery();
  return <StatePaycheckForm key={query?.toString() ?? ''} state={state} defaults={readDefaults(query, state)} />;
}

function StatePaycheckForm({ state, defaults }: { state: StateCode; defaults: StateDefaults }) {
  const page = STATE_PAYCHECK_PAGES[state];
  const minWageStr = page.minimumWage.toFixed(2);
  const presets = Array.from(new Set([minWageStr, '20', '25', '30', '40', '50']));

  const [hourlyRate, setHourlyRate] = useState(defaults.hourlyRate);
  const [regularHours, setRegularHours] = useState(defaults.regularHours);
  const [overtimeHours, setOvertimeHours] = useState(defaults.overtimeHours);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(defaults.payFrequency);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(defaults.filingStatus);
  const [allowances, setAllowances] = useState(defaults.allowances);
  const [nycResident, setNycResident] = useState(defaults.nycResident);
  const [linkCopied, setLinkCopied] = useState(false);
  const [view, setView] = useState<ResultView>(defaults.view);
  const [stubOpen, setStubOpen] = useState(false);
  const [scenario, setScenario] = useState<CompareScenario | null>(defaults.compare);

  const handleShareLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('rate', hourlyRate);
    url.searchParams.set('hours', regularHours);
    if (parseFloat(overtimeHours || '0') > 0) url.searchParams.set('ot', overtimeHours);
    url.searchParams.set('freq', payFrequency);
    url.searchParams.set('status', filingStatus);
    if (page.allowances && allowances) url.searchParams.set('allowances', allowances);
    if (state === 'NY' && nycResident) url.searchParams.set('nyc', '1');
    if (view === 'employer') url.searchParams.set('view', 'employer');
    writeScenarioParams(url, scenario, 'hourly');

    const shareUrl = url.toString();
    window.history.replaceState({}, '', shareUrl);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const changeFilingStatus = (status: FilingStatus) => {
    setFilingStatus(status);
    if (page.allowances) {
      const defaults = [page.allowances.defaultSingle, page.allowances.defaultMarried].map(String);
      if (defaults.includes(allowances)) {
        setAllowances(String(status === 'married' ? page.allowances.defaultMarried : page.allowances.defaultSingle));
      }
    }
  };

  const { result, error } = useMemo<{ result: PaycheckResult | null; error: string | null }>(() => {
    const rate = parseFloat(hourlyRate);
    const reg = parseFloat(regularHours);
    const ot = parseFloat(overtimeHours || '0');
    const allow = parseInt(allowances || '0', 10);

    if (isNaN(rate) || rate <= 0) {
      return { result: null, error: 'Please enter an hourly wage above $0.' };
    }
    if (isNaN(reg) || reg < 0 || reg > 168) {
      return { result: null, error: 'Please enter regular hours per week between 0 and 168.' };
    }
    if (isNaN(ot) || ot < 0 || reg + ot > 168) {
      return { result: null, error: 'Please enter valid overtime hours (total hours cannot exceed 168 per week).' };
    }
    if (page.allowances && (isNaN(allow) || allow < 0 || allow > 99)) {
      return { result: null, error: `Please enter your ${page.allowances.label} as a whole number (0 or more).` };
    }

    return {
      result: calculatePaycheck({
        state,
        hourlyRate: rate,
        regularHoursPerWeek: reg,
        overtimeHoursPerWeek: ot,
        overtimeMultiplier: 1.5,
        payFrequency,
        filingStatus,
        stateAllowances: page.allowances ? allow : 0,
        nycResident: state === 'NY' && nycResident,
      }),
      error: null,
    };
  }, [state, hourlyRate, regularHours, overtimeHours, payFrequency, filingStatus, allowances, nycResident, page]);

  // Reverse solver (Phase 16.1): the current settings applied to any candidate hourly rate
  const inputForRate = (rate: number): PaycheckInput | null => {
    if (error) return null;
    return {
      state,
      hourlyRate: rate,
      regularHoursPerWeek: parseFloat(regularHours) || 0,
      overtimeHoursPerWeek: parseFloat(overtimeHours || '0') || 0,
      overtimeMultiplier: 1.5,
      payFrequency,
      filingStatus,
      stateAllowances: page.allowances ? parseInt(allowances || '0', 10) || 0 : 0,
      nycResident: state === 'NY' && nycResident,
    };
  };

  // Scenario compare (Phase 16.1): B may be another state, which is the point on a state page
  const currentScenario: CompareScenario = { state, hourlyRate, regularHours, overtimeHours, annualSalary: '', filingStatus, payFrequency, retirementPct: '' };
  const scenarioBase = result ? inputForRate(parseFloat(hourlyRate) || 0) : null;

  const handleTryExample = () => {
    setHourlyRate('28');
    setRegularHours('40');
    setOvertimeHours('5');
    setPayFrequency('bi-weekly');
    setFilingStatus('single');
    setAllowances(String(page.allowances?.defaultSingle ?? 0));
    setNycResident(state === 'NY');
  };

  const handleReset = () => {
    setHourlyRate('25');
    setRegularHours('40');
    setOvertimeHours('0');
    setPayFrequency('bi-weekly');
    setFilingStatus('single');
    setAllowances(String(page.allowances?.defaultSingle ?? 0));
    setNycResident(false);
  };

  const totalWeeklyHours = Math.max(1, (parseFloat(regularHours) || 0) + (parseFloat(overtimeHours) || 0));
  const totalAnnualHours = totalWeeklyHours * 52;

  // Pay stub preview (Phase 16.1)
  const stubData = result
    ? {
        payFrequency,
        payFrequencyLabel: FREQ_LABELS[payFrequency].replace(/ \(.*\)$/, ''),
        stateName: page.name,
        taxYear: TAX_YEAR,
        isSalary: false,
        hourlyRate: parseFloat(hourlyRate) || 0,
        regularHoursPerWeek: parseFloat(regularHours) || 0,
        overtimeHoursPerWeek: parseFloat(overtimeHours || '0') || 0,
        result,
        employer: calculateEmployerCost({ state, grossAnnual: result.grossAnnual, ficaWagesAnnual: result.ficaWagesAnnual, payFrequency, hoursPerYear: totalAnnualHours }),
        sourceUrl: `https://www.quickbizcalc.com/calculators/${page.slug}`,
      }
    : null;

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        {/* Quick Preset Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            {page.name} Presets:
          </span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setHourlyRate(preset)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                hourlyRate === preset
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
              }`}
            >
              ${preset}/hr{preset === minWageStr ? ' (Min Wage)' : ''}
            </button>
          ))}
        </div>

        {/* Wage & Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spHourlyRate" className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Hourly Wage ($)
            </Label>
            <Input
              id="spHourlyRate"
              type="number"
              min="0"
              step="0.25"
              placeholder={`e.g., ${minWageStr}`}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spRegHours" className="text-sm font-medium">
              <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Regular Hours / Week
            </Label>
            <Input
              id="spRegHours"
              type="number"
              min="0"
              step="0.5"
              value={regularHours}
              onChange={(e) => setRegularHours(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spOtHours" className="text-sm font-medium">
              Overtime Hours / Week (1.5×)
            </Label>
            <Input
              id="spOtHours"
              type="number"
              min="0"
              step="0.5"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
            />
          </div>
        </div>

        {/* Pay Frequency & Filing Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spFrequency" className="text-sm font-medium">
              <Calendar className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Pay Frequency
            </Label>
            <Select value={payFrequency} onValueChange={(v) => setPayFrequency(v as PayFrequency)}>
              <SelectTrigger id="spFrequency" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FREQ_LABELS) as PayFrequency[]).map((f) => (
                  <SelectItem key={f} value={f}>{FREQ_LABELS[f]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="spFiling" className="text-sm font-medium">
              <Users className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Federal Filing Status (W-4)
            </Label>
            <Select value={filingStatus} onValueChange={(v) => changeFilingStatus(v as FilingStatus)}>
              <SelectTrigger id="spFiling" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FILING_LABELS) as FilingStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{FILING_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* State-specific inputs */}
        {page.allowances ? (
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {page.name} Withholding
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="space-y-1.5">
                <Label htmlFor="spAllowances" className="text-xs text-muted-foreground">
                  {page.allowances.label}
                </Label>
                <Input
                  id="spAllowances"
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
                  <Label htmlFor="spNyc" className="text-sm">I live in New York City</Label>
                  <Switch id="spNyc" checked={nycResident} onCheckedChange={(v) => setNycResident(v)} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <p>
              {page.name} has no state income tax and no employee-paid state payroll taxes, so only federal
              income tax, Social Security, and Medicare come out of your paycheck.
            </p>
          </div>
        )}

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
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-3">
            <TryExample onClick={handleTryExample} />
            <Button onClick={handleReset} variant="outline" size="lg" className="shrink-0">
              Reset
            </Button>
          </div>
          <Link
            href="/calculators/hourly-paycheck-calculator"
            className="text-xs font-medium text-emerald-600 hover:underline inline-flex items-center gap-1"
          >
            Add 401(k) &amp; health deductions <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Reverse solver: take-home target → required hourly rate (Phase 16.1) */}
      <div className="mt-4 px-4 sm:px-6">
        <ReverseSolverCard mode="hourly" buildInput={inputForRate} payFrequency={payFrequency} onApply={(rate) => setHourlyRate(rate.toFixed(2))} />
      </div>

      {/* Live Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4 px-4 sm:px-6 result-display"
          aria-live="polite"
        >
          {/* Phase 16.1: the same paycheck from the employer's side */}
          <ResultViewToggle view={view} onChange={setView} />
          {view === 'employer' && (
            <EmployerCostPanel
              state={state}
              stateName={page.name}
              paycheck={result}
              payFrequency={payFrequency}
              hoursPerYear={totalAnnualHours}
              frequencyLabel={FREQ_LABELS[payFrequency]}
            />
          )}
          {view === 'employee' && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live {page.name} {TAX_YEAR} Paycheck Estimate
              </div>
              <p className="text-sm text-muted-foreground font-medium">Net Take-Home Pay per Paycheck</p>
              <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>
                {formatCurrency(result.netPerPeriod)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong className="text-foreground">{formatCurrency(result.netAnnual)}</strong>/year ·{' '}
                <strong className="text-foreground">{formatCurrency(result.netAnnual / 12)}</strong>/month ·{' '}
                <strong className="text-foreground">{formatCurrency(result.netPerHour)}</strong>/hr net after taxes
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Gross Pay', value: formatCurrency(result.grossPerPeriod), color: 'text-blue-600' },
                {
                  label: 'Total Taxes',
                  value: formatCurrency(result.grossPerPeriod - result.netPerPeriod),
                  color: 'text-amber-600',
                },
                { label: 'Effective Tax Rate', value: `${(result.effectiveRate * 100).toFixed(1)}%`, color: 'text-foreground' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-base sm:text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Itemized Table */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Line Item</th>
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
                    <tr className="font-bold bg-emerald-500/5">
                      <td className="px-4 py-2.5">Take-home pay</td>
                      <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(result.netPerPeriod)}</td>
                      <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(result.netAnnual)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Multi-Period Conversion Table */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/50 bg-muted/40">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {page.name} Take-Home Pay Across All Pay Frequencies
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs">Period</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Gross Pay</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Taxes</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Net Take-Home</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      { label: 'Hourly', divisor: totalAnnualHours },
                      { label: 'Daily (8 hrs)', divisor: totalAnnualHours / 8 },
                      { label: 'Weekly (52/yr)', divisor: 52 },
                      { label: 'Bi-Weekly (26/yr)', divisor: 26 },
                      { label: 'Semi-Monthly (24/yr)', divisor: 24 },
                      { label: 'Monthly (12/yr)', divisor: 12 },
                      { label: 'Annual (1/yr)', divisor: 1 },
                    ].map((row) => {
                      const gross = result.grossAnnual / row.divisor;
                      const net = result.netAnnual / row.divisor;
                      const ded = gross - net;
                      return (
                        <tr key={row.label} className="hover:bg-muted/20">
                          <td className="px-4 py-2 font-medium">{row.label}</td>
                          <td className="text-right px-4 py-2">{formatCurrency(gross)}</td>
                          <td className="text-right px-4 py-2 text-red-500">−{formatCurrency(ded)}</td>
                          <td className="text-right px-4 py-2 font-semibold text-emerald-600">{formatCurrency(net)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Estimate based on {TAX_YEAR} IRS and {page.name} withholding formulas for a standard W-4 with no
                  pre-tax deductions. 401(k) contributions, health insurance premiums, or extra W-4 withholding will
                  change your actual paycheck.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  onClick={handleShareLink}
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                >
                  {linkCopied ? <Check className="h-4 w-4 mr-1.5 text-emerald-600" /> : <Link2 className="h-4 w-4 mr-1.5" />}
                  {linkCopied ? 'Share Link Copied!' : 'Share Calculation Link'}
                </Button>
                <Button onClick={() => setStubOpen(true)} variant="outline" size="sm">
                  <Receipt className="h-4 w-4 mr-1.5" />
                  Pay stub preview
                </Button>
              </div>
            </div>
          </div>
          )}
        </motion.div>
      )}

      {stubData && <PayStubDialog open={stubOpen} onOpenChange={setStubOpen} data={stubData} />}

      {/* Scenario compare: this state vs. a raise, another state or a different schedule (Phase 16.1) */}
      {result && (
        <div className="mt-4 px-4 sm:px-6">
          <PaycheckScenarioCompare mode="hourly" base={scenarioBase} baseScenario={currentScenario} scenario={scenario} onChange={setScenario} />
        </div>
      )}
    </div>
  );
}

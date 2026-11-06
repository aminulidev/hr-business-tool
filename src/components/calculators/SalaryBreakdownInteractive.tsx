'use client';

import { useState, useMemo } from 'react';
import { useInitialQuery } from '@/hooks/useSearchParam';
import Link from 'next/link';
import {
  calculatePaycheck,
  type FilingStatus,
  type PayFrequency,
  type StateCode,
  TAX_YEAR,
} from '@/lib/payroll/withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';
import { ArrowRight, Calculator, Check, DollarSign, Link2, MapPin } from 'lucide-react';

interface SalaryBreakdownInteractiveProps {
  initialHourlyRate: number;
  label: string;
}

const usd = (n: number, decimals = 2) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

interface BreakdownDefaults {
  hourlyRate: number;
  state: StateCode;
  filingStatus: FilingStatus;
  regularHours: number;
  overtimeHours: number;
  payFrequency: PayFrequency;
}

// Defaults for the page's wage, overridden by the shareable URL query params
function readDefaults(params: URLSearchParams | null, initialHourlyRate: number): BreakdownDefaults {
  const d: BreakdownDefaults = {
    hourlyRate: initialHourlyRate,
    state: 'TX',
    filingStatus: 'single',
    regularHours: 40,
    overtimeHours: 0,
    payFrequency: 'bi-weekly',
  };
  if (!params || !params.toString()) return d;
  const qRate = parseFloat(params.get('rate') || '');
  const qHours = parseFloat(params.get('hours') || '');
  const qOt = parseFloat(params.get('ot') || '');
  const qState = params.get('state') as StateCode | null;
  const qStatus = params.get('status') as FilingStatus | null;
  const qFreq = params.get('freq') as PayFrequency | null;

  if (!isNaN(qRate) && qRate > 0) d.hourlyRate = qRate;
  if (!isNaN(qHours) && qHours >= 0) d.regularHours = qHours;
  if (!isNaN(qOt) && qOt >= 0) d.overtimeHours = qOt;
  if (qState && STATE_CODES.includes(qState)) d.state = qState;
  if (qStatus && (qStatus === 'single' || qStatus === 'married' || qStatus === 'hoh')) d.filingStatus = qStatus;
  if (qFreq && (qFreq === 'weekly' || qFreq === 'bi-weekly' || qFreq === 'semi-monthly' || qFreq === 'monthly')) {
    d.payFrequency = qFreq;
  }
  return d;
}

export default function SalaryBreakdownInteractive({ initialHourlyRate, label }: SalaryBreakdownInteractiveProps) {
  // The server renders the defaults; once the client knows the query string the form is
  // keyed on it and mounts again with the shared values (no setState inside an effect).
  const query = useInitialQuery();
  return (
    <SalaryBreakdownForm
      key={query?.toString() ?? ''}
      initialHourlyRate={initialHourlyRate}
      label={label}
      defaults={readDefaults(query, initialHourlyRate)}
    />
  );
}

function SalaryBreakdownForm({
  initialHourlyRate,
  label,
  defaults,
}: SalaryBreakdownInteractiveProps & { defaults: BreakdownDefaults }) {
  const [hourlyRate, setHourlyRate] = useState<number>(defaults.hourlyRate);
  const [state, setState] = useState<StateCode>(defaults.state);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(defaults.filingStatus);
  const [regularHours, setRegularHours] = useState<number>(defaults.regularHours);
  const [overtimeHours, setOvertimeHours] = useState<number>(defaults.overtimeHours);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(defaults.payFrequency);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShareLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('state', state);
    url.searchParams.set('status', filingStatus);
    url.searchParams.set('hours', String(regularHours));
    if (overtimeHours > 0) url.searchParams.set('ot', String(overtimeHours));
    url.searchParams.set('freq', payFrequency);
    if (hourlyRate !== initialHourlyRate) url.searchParams.set('rate', String(hourlyRate));

    const shareUrl = url.toString();
    window.history.replaceState({}, '', shareUrl);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const statePage = STATE_PAYCHECK_PAGES[state];

  const result = useMemo(() => {
    const allowances = statePage.allowances
      ? filingStatus === 'married'
        ? statePage.allowances.defaultMarried
        : statePage.allowances.defaultSingle
      : 0;
    return calculatePaycheck({
      state,
      hourlyRate: Math.max(0, hourlyRate || 0),
      regularHoursPerWeek: Math.max(0, regularHours || 0),
      overtimeHoursPerWeek: Math.max(0, overtimeHours || 0),
      overtimeMultiplier: 1.5,
      payFrequency,
      filingStatus,
      stateAllowances: allowances,
    });
  }, [state, hourlyRate, regularHours, overtimeHours, payFrequency, filingStatus, statePage]);

  const netPct = result.grossAnnual > 0 ? Math.round((result.netAnnual / result.grossAnnual) * 100) : 100;
  const taxPct = 100 - netPct;

  return (
    <section
      aria-label={`Interactive ${label} Paycheck Customizer`}
      className="rounded-3xl border border-emerald-500/25 bg-card/90 shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent px-6 py-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Interactive {label} Take-Home Customizer ({TAX_YEAR})
            </h2>
            <p className="text-xs text-muted-foreground">
              Select your state, filing status, weekly hours, and overtime to see your exact {TAX_YEAR} net paycheck
            </p>
          </div>
        </div>
        <Link
          href={`/calculators/${statePage.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20 transition-colors"
        >
          <MapPin className="h-3.5 w-3.5" />
          Full {statePage.name} Paycheck Calculator
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left column: Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sb-state"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                US State (30 States)
              </label>
              <select
                id="sb-state"
                value={state}
                onChange={(e) => setState(e.target.value as StateCode)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {STATE_CODES.map((code) => (
                  <option key={code} value={code}>
                    {STATE_PAYCHECK_PAGES[code].name} ({code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sb-filing"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                W-4 Filing Status
              </label>
              <select
                id="sb-filing"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="hoh">Head of Household</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="sb-rate"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Hourly Wage ($/hr)
              </label>
              <div className="relative">
                <DollarSign className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="sb-rate"
                  type="number"
                  step="0.25"
                  min="1"
                  max="1000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate( parseFloat(e.target.value) || 0 )}
                  className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sb-hours"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Regular Hrs / Wk
              </label>
              <input
                id="sb-hours"
                type="number"
                step="0.5"
                min="1"
                max="80"
                value={regularHours}
                onChange={(e) => setRegularHours(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="sb-ot"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Overtime Hrs (1.5×)
              </label>
              <input
                id="sb-ot"
                type="number"
                step="1"
                min="0"
                max="60"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground mr-1">Quick Schedule:</span>
              {[20, 30, 37.5, 40].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    setRegularHours(h);
                    setOvertimeHours(0);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    regularHours === h && overtimeHours === 0
                      ? 'bg-emerald-600 text-white'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {h}h/wk
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setRegularHours(40);
                  setOvertimeHours(5);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  regularHours === 40 && overtimeHours === 5
                    ? 'bg-emerald-600 text-white'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                40h + 5h OT
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <label htmlFor="sb-freq" className="text-xs text-muted-foreground">
                Paycheck:
              </label>
              <select
                id="sb-freq"
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value as PayFrequency)}
                className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground"
              >
                <option value="weekly">Weekly (52/yr)</option>
                <option value="bi-weekly">Bi-Weekly (26/yr)</option>
                <option value="semi-monthly">Semi-Monthly (24/yr)</option>
                <option value="monthly">Monthly (12/yr)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right column: Instant Result Summary */}
        <div className="lg:col-span-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-background/90 border border-border/60 p-3">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Net Paycheck ({payFrequency})
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {usd(result.netPerPeriod)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Gross: {usd(result.grossPerPeriod)}
                </div>
              </div>

              <div className="rounded-xl bg-background/90 border border-border/60 p-3">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Monthly Take-Home
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-foreground mt-0.5">
                  {usd(result.netAnnual / 12, 0)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Gross: {usd(result.grossAnnual / 12, 0)}/mo
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xl bg-background/90 border border-border/60 p-3">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Annual Take-Home
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-foreground mt-0.5">
                  {usd(result.netAnnual, 0)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Gross: {usd(result.grossAnnual, 0)}/yr
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-emerald-600 dark:text-emerald-400">
                  Take-Home Pay ({netPct}%)
                </span>
                <span className="text-amber-600 dark:text-amber-400">
                  Total Taxes ({taxPct}% · {usd(result.totalDeductionsAnnual, 0)}/yr)
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-amber-500/25 overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, netPct))}%` }}
                />
              </div>
            </div>

            {/* Deduction pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {result.deductions.map((d) => (
                <div
                  key={d.key}
                  className="rounded-lg bg-background/80 border border-border/50 px-2.5 py-1.5"
                >
                  <div className="text-[10px] text-muted-foreground truncate">{d.label}</div>
                  <div className="font-semibold text-foreground">{usd(d.perPeriod)}/chk</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Effective Hourly After Taxes:{' '}
              <strong className="text-foreground">{usd(result.netPerHour)}/hr</strong>
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors"
              >
                {linkCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
                {linkCopied ? 'Link Copied!' : 'Share Custom Link'}
              </button>
              <Link
                href="/calculators/hourly-paycheck-calculator"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
              >
                Add 401(k) &amp; Health Deductions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


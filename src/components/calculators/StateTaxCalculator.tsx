'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from '@/components/motion';
import { ArrowRight, BookmarkPlus, Info, Map as MapIcon } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StateRateInput, StateTaxSelect } from './StateTaxSelect';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TAX_YEAR, type FilingStatus } from '@/lib/payroll/withholding';
import {
  defaultStateAllowances,
  hasPaycheckPage,
  isStateTaxChoice,
  listStateNames,
  STATE_TAX_CODES,
  STATE_TAX_STATES,
  stateMarginalRate,
  statePaycheckPath,
  stateTaxName,
  stateTaxOnWages,
  UNMODELED_STATES,
  type StateTaxChoice,
  type StateTaxLine,
} from '@/lib/payroll/state-tax';

// State figures come from the paycheck engine (src/lib/payroll/state-tax.ts →
// withholding/): the same 2026 rule each state's paycheck page uses. This file
// holds no tax rate. States the engine does not model are not offered by name;
// "Another state" takes a flat rate the visitor enters.

const FILING_LABELS: Record<FilingStatus, string> = {
  single: 'Single or Married Filing Separately',
  married: 'Married Filing Jointly',
  hoh: 'Head of Household',
};

const NO_INCOME_TAX_STATES = STATE_TAX_CODES.filter((c) => STATE_TAX_STATES[c].noIncomeTax);
const NO_TAX_NAMES = NO_INCOME_TAX_STATES.map((c) => STATE_TAX_STATES[c].name);

/** Incomes for the reference table; the visitor's own income is added to them */
const REFERENCE_INCOMES = [40000, 60000, 80000, 100000, 150000, 250000];

interface HistoryInputs {
  grossIncome: string;
  stateCode: string;
  /** Absent in entries saved before the comparison state and filing status were stored */
  compareStateCode?: string;
  filingStatus?: string;
  customRate?: string;
  compareCustomRate?: string;
}

interface StateTaxSnapshot {
  stateName: string;
  grossIncome: number;
  stateTax: number;
  otherDeductions: number;
  effectiveRate: number;
  afterTax: number;
  label: string;
}

interface SideResult {
  name: string;
  incomeTax: number;
  localTax: number;
  payrollTotal: number;
  total: number;
  lines: StateTaxLine[];
  effectiveRate: number;
  marginalRate: number;
  afterIncomeTax: number;
}

function side(state: StateTaxChoice, gross: number, filingStatus: FilingStatus, customRatePct: number): SideResult {
  const input = { state, taxableWages: gross, filingStatus, customRate: customRatePct / 100 };
  const r = stateTaxOnWages(input);
  return {
    name: stateTaxName(state),
    incomeTax: r.incomeTax,
    localTax: r.localTax,
    payrollTotal: r.payrollTotal,
    total: r.total,
    lines: r.lines,
    effectiveRate: gross > 0 ? r.incomeTax / gross : 0,
    marginalRate: stateMarginalRate(input),
    afterIncomeTax: gross - r.incomeTax,
  };
}

function LinesCard({ result, divisor }: { result: SideResult; divisor: number }) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
      <div className="px-4 py-2 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground">{result.name}</div>
      <div className="divide-y divide-border/40 text-xs">
        {result.lines.length === 0 && (
          <div className="px-4 py-2 text-muted-foreground">Nothing is taken from wages at the state level.</div>
        )}
        {result.lines.map((l) => (
          <div key={l.key + l.label} className="flex justify-between gap-3 px-4 py-2">
            <span className="text-muted-foreground">{l.label}</span>
            <span className="font-mono font-semibold">{formatCurrency(l.annual / divisor)}</span>
          </div>
        ))}
        <div className="flex justify-between gap-3 px-4 py-2 bg-muted/20 font-semibold">
          <span>Total state deductions</span>
          <span className="font-mono">{formatCurrency(result.total / divisor)}</span>
        </div>
      </div>
    </div>
  );
}

export default function StateTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState('120000');
  const [stateCode, setStateCode] = useState<StateTaxChoice>('CA');
  const [compareStateCode, setCompareStateCode] = useState<StateTaxChoice>('TX');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [customRate, setCustomRate] = useState('5');
  const [compareCustomRate, setCompareCustomRate] = useState('5');
  const [payPeriod, setPayPeriod] = useState<'annual' | 'monthly' | 'biweekly'>('annual');
  const [compareA, setCompareA] = useState<StateTaxSnapshot | null>(null);
  const [compareB, setCompareB] = useState<StateTaxSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<HistoryInputs>('state-tax-calculator');

  const gross = parseFloat(grossIncome) || 0;
  const ratePct = Math.min(15, Math.max(0, parseFloat(customRate) || 0));
  const compareRatePct = Math.min(15, Math.max(0, parseFloat(compareCustomRate) || 0));

  // Live calculation: every figure below is derived from the inputs, nothing waits for a click
  const result = useMemo(() => {
    if (gross <= 0) return null;
    const a = side(stateCode, gross, filingStatus, ratePct);
    const b = side(compareStateCode, gross, filingStatus, compareRatePct);
    const incomes = [...new Set([...REFERENCE_INCOMES, Math.round(gross)])].sort((x, y) => x - y);
    const table = incomes.map((income) => {
      const ta = stateTaxOnWages({ state: stateCode, taxableWages: income, filingStatus, customRate: ratePct / 100 }).incomeTax;
      const tb = stateTaxOnWages({ state: compareStateCode, taxableWages: income, filingStatus, customRate: compareRatePct / 100 }).incomeTax;
      return { income, a: ta, b: tb, own: income === Math.round(gross) };
    });
    return {
      a,
      b,
      taxDiff: a.incomeTax - b.incomeTax,
      table,
      chart: [
        { name: a.name, amount: a.incomeTax, fill: '#0ea5e9' },
        { name: b.name, amount: b.incomeTax, fill: b.incomeTax === 0 ? '#10b981' : '#f59e0b' },
      ],
    };
  }, [gross, stateCode, compareStateCode, filingStatus, ratePct, compareRatePct]);

  const handleTryExample = () => {
    setGrossIncome('120000');
    setStateCode('CA');
    setCompareStateCode('TX');
    setFilingStatus('single');
  };

  const handleSave = () => {
    if (!result) return;
    saveEntry(
      { grossIncome, stateCode, compareStateCode, filingStatus, customRate, compareCustomRate },
      `${result.a.name} · ${formatCurrency(gross)} · State income tax: ${formatCurrency(result.a.incomeTax)}`,
    );
  };

  const handleReset = () => {
    setGrossIncome('');
    setStateCode('CA');
    setCompareStateCode('TX');
    setFilingStatus('single');
    setCustomRate('5');
    setCompareCustomRate('5');
  };

  const handleRestore = (i: HistoryInputs) => {
    setGrossIncome(i.grossIncome);
    // Entries saved before November 2026 may name a state that is no longer listed
    setStateCode(isStateTaxChoice(i.stateCode) ? i.stateCode : 'other');
    if (isStateTaxChoice(i.compareStateCode)) setCompareStateCode(i.compareStateCode);
    if (i.filingStatus && i.filingStatus in FILING_LABELS) setFilingStatus(i.filingStatus as FilingStatus);
    if (i.customRate) setCustomRate(i.customRate);
    if (i.compareCustomRate) setCompareCustomRate(i.compareCustomRate);
  };

  const snap = (): StateTaxSnapshot | null =>
    result
      ? {
          stateName: result.a.name,
          grossIncome: gross,
          stateTax: result.a.incomeTax,
          otherDeductions: result.a.total - result.a.incomeTax,
          effectiveRate: result.a.effectiveRate,
          afterTax: result.a.afterIncomeTax,
          label: `${result.a.name} · ${formatCurrency(gross)}`,
        }
      : null;

  const divisor = payPeriod === 'monthly' ? 12 : payPeriod === 'biweekly' ? 26 : 1;
  const allowances = stateCode === 'other' ? 0 : defaultStateAllowances(stateCode, filingStatus);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="calculator-form space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="st-gross" className="font-medium">Annual Gross Wages</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                <Input id="st-gross" type="number" step="1000" min="0" placeholder="95,000"
                  value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} className="pl-7" />
              </div>
              <p className="text-[11px] text-muted-foreground">Wages or salary for the year, before any deductions.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="st-status" className="font-medium">Filing Status</Label>
              <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                <SelectTrigger id="st-status" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(FILING_LABELS) as FilingStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{FILING_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">Sets each state&apos;s deduction and bracket schedule.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="st-state" className="font-medium">Your State</Label>
              <StateTaxSelect id="st-state" value={stateCode} onChange={setStateCode} />
              {stateCode === 'other' ? (
                <StateRateInput id="st-rate" value={customRate} onChange={setCustomRate} />
              ) : (
                <p className="text-[11px] text-muted-foreground">Uses the state&apos;s {TAX_YEAR} withholding rule.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="st-compare-state" className="font-medium">Compare With</Label>
              <StateTaxSelect id="st-compare-state" value={compareStateCode} onChange={setCompareStateCode} />
              {compareStateCode === 'other' ? (
                <StateRateInput id="st-compare-rate" value={compareCustomRate} onChange={setCompareCustomRate} />
              ) : (
                <p className="text-[11px] text-muted-foreground">A state you might move to or work in.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <TryExample onClick={handleTryExample} />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button onClick={handleSave} disabled={!result} variant="outline" className="flex-1 sm:flex-none">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save Calculation to History
              </Button>
              <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
            </div>
          </div>
        </div>

        {result && (
          <motion.div initial={false} animate={{ opacity: 1 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{result.a.name} State Income Tax ({TAX_YEAR})</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-cyan-600" data-result-primary>{formatCurrency(result.a.incomeTax / divisor)}</p>

                {/* Pay Period Toggle */}
                <div className="inline-flex items-center rounded-lg bg-background/80 border border-border/50 p-1 text-xs">
                  <span className="text-muted-foreground px-2">Show:</span>
                  {(['annual', 'monthly', 'biweekly'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      aria-pressed={payPeriod === period}
                      onClick={() => setPayPeriod(period)}
                      className={`px-2.5 py-1 rounded-md capitalize font-medium transition ${
                        payPeriod === period ? 'bg-cyan-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-medium">
                    After state income tax: {formatCurrency(result.a.afterIncomeTax / divisor)}{payPeriod !== 'annual' ? ` /${payPeriod}` : ''}
                  </Badge>
                  <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-600 font-medium">
                    Effective rate: {formatPercent(result.a.effectiveRate * 100)}
                  </Badge>
                  <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-600 font-medium">
                    Next $1,000 taxed at {formatPercent(result.a.marginalRate * 100)}
                  </Badge>
                  {stateCode !== compareStateCode && (
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600 font-medium">
                      vs {result.b.name}: {result.taxDiff === 0 ? 'the same tax' : result.taxDiff > 0 ? `${formatCurrency(result.taxDiff / divisor)} more tax` : `${formatCurrency(Math.abs(result.taxDiff) / divisor)} less tax`}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: payPeriod === 'annual' ? 'Gross Annual Pay' : 'Gross Pay', value: formatCurrency(gross / divisor) },
                  { label: `${result.a.name} Income Tax`, value: formatCurrency(result.a.incomeTax / divisor), color: 'text-cyan-600' },
                  { label: `${result.b.name} Income Tax`, value: formatCurrency(result.b.incomeTax / divisor), color: 'text-amber-600' },
                  { label: 'Difference per Year', value: result.taxDiff === 0 ? '$0 (equal)' : formatCurrency(Math.abs(result.taxDiff)), highlight: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center shadow-xs">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-base sm:text-lg font-bold ${m.highlight ? 'text-emerald-600' : (m.color || 'text-foreground')}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Everything each state takes from wages, line by line */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  What each state takes from {formatCurrency(gross)} of wages{payPeriod !== 'annual' ? `, per ${payPeriod === 'monthly' ? 'month' : 'bi-weekly paycheck'}` : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <LinesCard result={result.a} divisor={divisor} />
                  <LinesCard result={result.b} divisor={divisor} />
                </div>
              </div>

              {/* The same comparison at other incomes */}
              <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
                <div className="px-4 py-2 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground">
                  State income tax at other incomes ({FILING_LABELS[filingStatus]})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20 text-muted-foreground">
                        <th className="text-left px-4 py-2 font-medium">Annual wages</th>
                        <th className="text-right px-4 py-2 font-medium">{result.a.name}</th>
                        <th className="text-right px-4 py-2 font-medium">Rate</th>
                        <th className="text-right px-4 py-2 font-medium">{result.b.name}</th>
                        <th className="text-right px-4 py-2 font-medium">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {result.table.map((row) => (
                        <tr key={row.income} className={row.own ? 'bg-cyan-500/10 font-semibold' : ''}>
                          <td className="px-4 py-2">{formatCurrency(row.income)}{row.own ? ' (yours)' : ''}</td>
                          <td className="text-right px-4 py-2 font-mono">{formatCurrency(row.a)}</td>
                          <td className="text-right px-4 py-2 text-muted-foreground">{formatPercent((row.a / row.income) * 100)}</td>
                          <td className="text-right px-4 py-2 font-mono">{formatCurrency(row.b)}</td>
                          <td className="text-right px-4 py-2 text-muted-foreground">{formatPercent((row.b / row.income) * 100)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="h-56 w-full bg-background/60 rounded-xl p-3 border border-border/40">
                <p className="text-xs font-medium text-muted-foreground mb-2">Annual state income tax: {result.a.name} vs. {result.b.name}</p>
                <ResponsiveContainer width="100%" height="85%">
                  <RechartsBarChart data={result.chart} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [formatCurrency(v), 'State income tax']} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {result.chart.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl bg-muted/40 border border-border/40 p-4 text-xs space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <MapIcon className="size-4 text-cyan-600 shrink-0" />
                  How these figures are calculated
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {stateCode === 'other'
                    ? `Your wages times the ${formatPercent(ratePct)} rate you entered, with no deduction. `
                    : STATE_TAX_STATES[stateCode].noIncomeTax
                      ? `${result.a.name} has no income tax on wages. `
                      : `${result.a.name} income tax is the state's ${TAX_YEAR} withholding formula for the year${allowances > 0 ? `, with ${allowances} withholding allowance${allowances === 1 ? '' : 's'}, the number a filer with no dependents normally claims` : ''}: the amount an employer takes out over twelve months. ${hasPaycheckPage(stateCode) ? `It is the same rule the ${result.a.name} paycheck calculator uses. ` : ''}`}
                  The tax on a state return can differ, because a return counts other income, itemized deductions and credits.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>No income tax on wages:</strong> {NO_TAX_NAMES.slice(0, -1).join(', ')} and {NO_TAX_NAMES[NO_TAX_NAMES.length - 1]}.{' '}
                  <strong>Local taxes:</strong> Maryland&apos;s county tax is shown as its own line at the average county rate. City and county income taxes elsewhere, such as New York City&apos;s, are not included.
                </p>
                {UNMODELED_STATES.length > 0 && (
                  <p className="text-muted-foreground leading-relaxed flex items-start gap-1.5">
                    <Info className="size-3.5 shrink-0 mt-0.5" />
                    <span>
                      Not modeled: {listStateNames(UNMODELED_STATES)}. We could not confirm a {TAX_YEAR} withholding formula from the tax agency&apos;s own publication, so choose &quot;Another state&quot; and enter a rate from that agency.
                    </span>
                  </p>
                )}
                <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                  {hasPaycheckPage(stateCode) && (
                    <Link href={statePaycheckPath(stateCode)} className="text-cyan-600 font-medium hover:underline inline-flex items-center gap-1">
                      {result.a.name} paycheck calculator <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                  {hasPaycheckPage(compareStateCode) && compareStateCode !== stateCode && (
                    <Link href={statePaycheckPath(compareStateCode)} className="text-cyan-600 font-medium hover:underline inline-flex items-center gap-1">
                      {result.b.name} paycheck calculator <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                  <Link href="/calculators/payroll-calculator" className="text-cyan-600 font-medium hover:underline inline-flex items-center gap-1">
                    Full paycheck with federal tax and FICA <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'State', valueA: compareA.stateName, valueB: compareB.stateName },
          { label: 'Gross Wages', valueA: formatCurrency(compareA.grossIncome), valueB: formatCurrency(compareB.grossIncome), numA: compareA.grossIncome, numB: compareB.grossIncome },
          { label: 'State Income Tax', valueA: formatCurrency(compareA.stateTax), valueB: formatCurrency(compareB.stateTax), numA: compareA.stateTax, numB: compareB.stateTax },
          { label: 'Other State Deductions', valueA: formatCurrency(compareA.otherDeductions), valueB: formatCurrency(compareB.otherDeductions), numA: compareA.otherDeductions, numB: compareB.otherDeductions },
          { label: 'Effective Rate', valueA: formatPercent(compareA.effectiveRate * 100), valueB: formatPercent(compareB.effectiveRate * 100), numA: compareA.effectiveRate * 100, numB: compareB.effectiveRate * 100 },
          { label: 'After State Income Tax', valueA: formatCurrency(compareA.afterTax), valueB: formatCurrency(compareB.afterTax), numA: compareA.afterTax, numB: compareB.afterTax },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}

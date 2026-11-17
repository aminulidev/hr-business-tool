'use client';

import { useState, useMemo } from 'react';
import { motion } from '@/components/motion';
import { FileCheck } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';
import type { ReturnFilingStatus } from '@/lib/payroll/federal-tax';
import { isStateTaxChoice, stateTaxName, type StateTaxChoice } from '@/lib/payroll/state-tax';
import { computeW2 } from '@/lib/payroll/w2';
import { TAX_YEAR } from '@/lib/payroll/withholding';
import { StateRateInput, StateTaxSelect } from './StateTaxSelect';

type FilingStatus = ReturnFilingStatus;
type PayFreq = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annual';

// State figures come from the paycheck engine (src/lib/payroll/state-tax.ts); no state rate is typed here.
const STATE_HELP_MODELED = 'withholding rule, including state payroll deductions.';
const STATE_HELP_OTHER = 'Your rate is applied to wages after pre-tax deductions.';

const PAY_FREQS: Record<PayFreq, number> = {
  weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12, annual: 1,
};

// No tax figure is typed in this file: federal brackets, FICA and state rules reach it through
// computeW2 (src/lib/payroll/w2.ts), which reads the paycheck engine's tax year.

interface W2Snapshot {
  grossAnnual: number;
  federalTax: number;
  ssTax: number;
  medicareTax: number;
  stateTax: number;
  pretaxDeductions: number;
  netAnnual: number;
  netPerPay: number;
  label: string;
}

export default function W2Calculator() {
  const [grossAnnual, setGrossAnnual] = useState('85000');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [selectedState, setSelectedState] = useState<StateTaxChoice>('CA');
  const [stateRate, setStateRate] = useState('5');
  const [pretax401k, setPretax401k] = useState('6000');
  const [pretaxHsa, setPretaxHsa] = useState('2000');
  const [pretaxOther, setPretaxOther] = useState('1500');
  const [payFreq, setPayFreq] = useState<PayFreq>('biweekly');
  const [calculated, setCalculated] = useState(true);
  const [compareA, setCompareA] = useState<W2Snapshot | null>(null);
  const [compareB, setCompareB] = useState<W2Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    grossAnnual: string; filingStatus: string; stateRate: string; selectedState?: string;
    pretax401k: string; pretaxHsa: string; pretaxOther: string; payFreq: string;
  }>('w-2-calculator');

  const gross = parseFloat(grossAnnual) || 0;
  const sRate = parseFloat(stateRate) || 0;
  const p401k = parseFloat(pretax401k) || 0;
  const pHsa = parseFloat(pretaxHsa) || 0;
  const pOther = parseFloat(pretaxOther) || 0;

  // The math lives in src/lib/payroll/w2.ts, which the article's worked examples run too
  const result = useMemo(() => {
    if (gross <= 0) return null;
    const r = computeW2({ grossAnnual: gross, filingStatus, state: selectedState, customStateRatePct: sRate, pretax401k: p401k, pretaxHsa: pHsa, pretaxOther: pOther });
    return {
      ...r,
      netPerPay: r.netAnnual / PAY_FREQS[payFreq],
      stateDetail: r.stateLines.map((l) => `${l.label}: ${formatCurrency(l.annual)}`).join(' · '),
    };
  }, [gross, filingStatus, selectedState, sRate, p401k, pHsa, pOther, payFreq]);

  const handleTryExample = () => {
    setGrossAnnual('85000');
    setFilingStatus('single');
    setSelectedState('CA');
    setStateRate('5');
    setPretax401k('6000');
    setPretaxHsa('2000');
    setPretaxOther('1500');
    setPayFreq('biweekly');
    setCalculated(true);
  };

  const handleCalculate = () => {
    if (gross > 0 && result) {
      setCalculated(true);
      saveEntry(
        { grossAnnual, filingStatus, stateRate, selectedState, pretax401k, pretaxHsa, pretaxOther, payFreq },
        `W-2 · ${formatCurrency(gross)} · Net: ${formatCurrency(result.netAnnual)}/yr (${formatCurrency(result.netPerPay)}/pay)`,
      );
    }
  };

  const handleReset = () => {
    setGrossAnnual(''); setFilingStatus('single'); setSelectedState('CA'); setStateRate('5');
    setPretax401k('0'); setPretaxHsa('0'); setPretaxOther('0'); setPayFreq('biweekly');
    setCalculated(false);
  };

  const handleRestore = (i: {
    grossAnnual: string; filingStatus: string; stateRate: string; selectedState?: string;
    pretax401k: string; pretaxHsa: string; pretaxOther: string; payFreq: string;
  }) => {
    setGrossAnnual(i.grossAnnual);
    setFilingStatus(i.filingStatus as FilingStatus);
    // Entries saved before November 2026 hold only a rate: restore them as another state at that rate
    setSelectedState(isStateTaxChoice(i.selectedState) ? i.selectedState : 'other');
    setStateRate(i.stateRate);
    setPretax401k(i.pretax401k); setPretaxHsa(i.pretaxHsa); setPretaxOther(i.pretaxOther);
    setPayFreq(i.payFreq as PayFreq);
    setCalculated(true);
  };

  const snap = (): W2Snapshot => result ? {
    grossAnnual: gross,
    federalTax: result.federalTax,
    ssTax: result.ssTax,
    medicareTax: result.medicareTax + result.addMedicare,
    stateTax: result.stateTax,
    pretaxDeductions: result.totalPretax,
    netAnnual: result.netAnnual,
    netPerPay: result.netPerPay,
    label: `${formatCurrency(gross)} · ${payFreq}`,
  } : null as unknown as W2Snapshot;

  const chartData = result ? [
    { name: 'Take-Home', amount: result.netAnnual, fill: '#10b981' },
    { name: 'Federal Tax', amount: result.federalTax, fill: '#3b82f6' },
    { name: 'FICA', amount: result.totalFica, fill: '#f59e0b' },
    { name: 'State Tax', amount: result.stateTax, fill: '#8b5cf6' },
    { name: 'Pretax Deductions', amount: result.totalPretax, fill: '#64748b' },
  ] : [];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="w2-gross" className="font-medium">Annual Gross Salary / Wages</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="w2-gross" type="number" step="1000" min="0" placeholder="85,000"
                value={grossAnnual} onChange={(e) => { setGrossAnnual(e.target.value); setCalculated(true); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Total annual contractual compensation.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="w2-status" className="font-medium">Federal Filing Status</Label>
            <Select value={filingStatus} onValueChange={(v) => { setFilingStatus(v as FilingStatus); setCalculated(true); }}>
              <SelectTrigger id="w2-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="mfj">Married Filing Jointly</SelectItem>
                <SelectItem value="hoh">Head of Household</SelectItem>
                <SelectItem value="mfs">Married Filing Separately</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Governs 2026 federal brackets &amp; standard deduction.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="w2-state-select" className="font-medium">State of Residence</Label>
            <StateTaxSelect id="w2-state-select" value={selectedState} onChange={(v) => { setSelectedState(v); setCalculated(true); }} />
            <p className="text-[11px] text-muted-foreground">
              {selectedState === 'other' ? STATE_HELP_OTHER : `${TAX_YEAR} ${stateTaxName(selectedState)} ${STATE_HELP_MODELED}`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="w2-freq" className="font-medium">Paycheck Frequency</Label>
            <Select value={payFreq} onValueChange={(v) => { setPayFreq(v as PayFreq); setCalculated(true); }}>
              <SelectTrigger id="w2-freq"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="biweekly">Bi-weekly (26 pays/yr)</SelectItem>
                <SelectItem value="semimonthly">Semi-monthly (24 pays/yr)</SelectItem>
                <SelectItem value="monthly">Monthly (12 pays/yr)</SelectItem>
                <SelectItem value="weekly">Weekly (52 pays/yr)</SelectItem>
                <SelectItem value="annual">Annual (1 pay/yr)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Divisor for per-paycheck net take-home.</p>
          </div>
        </div>

        {selectedState === 'other' && (
          <div className="p-3 bg-muted/40 rounded-xl border border-border/50 max-w-sm">
            <StateRateInput id="w2-custom-rate" value={stateRate} onChange={(v) => { setStateRate(v); setCalculated(true); }} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="w2-401k" className="font-medium">Traditional 401(k) / 403(b)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="w2-401k" type="number" step="500" min="0" placeholder="6,000"
                value={pretax401k} onChange={(e) => { setPretax401k(e.target.value); setCalculated(true); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Exempt from income tax; subject to FICA. 2026 cap: $24,500.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="w2-hsa" className="font-medium">Pre-Tax HSA / FSA</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="w2-hsa" type="number" step="100" min="0" placeholder="2,000"
                value={pretaxHsa} onChange={(e) => { setPretaxHsa(e.target.value); setCalculated(true); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Exempt from income tax AND FICA. 2026 cap: $4,400 self / $8,750 family.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="w2-other" className="font-medium">Section 125 Health &amp; Dental</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="w2-other" type="number" step="100" min="0" placeholder="1,500"
                value={pretaxOther} onChange={(e) => { setPretaxOther(e.target.value); setCalculated(true); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Employee-paid medical, dental, vision premiums.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={gross <= 0}
              className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate W-2 Take-Home
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && result && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Net Take-Home per Paycheck ({payFreq})</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(result.netPerPay)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">Annual net: {formatCurrency(result.netAnnual)}</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">Marginal: {formatPercent(result.marginalRate * 100)}</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">Effective: {formatPercent(result.effectiveRate * 100)}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Gross Pay / Paycheck', value: formatCurrency(gross / PAY_FREQS[payFreq]) },
                  { label: 'Total Taxes / Paycheck', value: formatCurrency(result.totalTax / PAY_FREQS[payFreq]), color: 'text-rose-600' },
                  { label: 'Pre-Tax Deductions', value: formatCurrency(result.totalPretax / PAY_FREQS[payFreq]), color: 'text-amber-600' },
                  { label: 'Net Take-Home Pay', value: formatCurrency(result.netPerPay), highlight: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center shadow-xs">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-base sm:text-lg font-bold ${m.highlight ? 'text-emerald-600' : (m.color || 'text-foreground')}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Paycheck Withholding Table */}
              <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground flex justify-between">
                  <span>W-2 Paycheck &amp; Tax Withholding Breakdown</span>
                  <span className="text-[11px] font-normal">Filing: {filingStatus.toUpperCase()} · State: {stateTaxName(selectedState)}{selectedState === 'other' ? ` (${stateRate}%)` : ''}</span>
                </div>
                <div className="divide-y divide-border/40 text-xs">
                  <div className="grid grid-cols-3 gap-2 px-4 py-2 text-[11px] font-medium text-muted-foreground bg-muted/20">
                    <div>Line Item</div>
                    <div className="text-right">Per Paycheck ({payFreq})</div>
                    <div className="text-right">Annual Total</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                    <div className="font-medium">Gross Wages</div>
                    <div className="text-right font-mono">{formatCurrency(gross / PAY_FREQS[payFreq])}</div>
                    <div className="text-right font-mono font-semibold">{formatCurrency(gross)}</div>
                  </div>
                  {result.totalPretax > 0 && (
                    <div className="grid grid-cols-3 gap-2 px-4 py-2.5 text-muted-foreground bg-muted/10">
                      <div>Pre-Tax Deductions (401k, HSA, Sec-125)</div>
                      <div className="text-right font-mono text-amber-600">-{formatCurrency(result.totalPretax / PAY_FREQS[payFreq])}</div>
                      <div className="text-right font-mono text-amber-600">-{formatCurrency(result.totalPretax)}</div>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                    <div>Federal Income Tax Withholding</div>
                    <div className="text-right font-mono text-blue-600">-{formatCurrency(result.federalTax / PAY_FREQS[payFreq])}</div>
                    <div className="text-right font-mono text-blue-600">-{formatCurrency(result.federalTax)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                    <div>Social Security (6.2% FICA OASDI)</div>
                    <div className="text-right font-mono text-blue-600">-{formatCurrency(result.ssTax / PAY_FREQS[payFreq])}</div>
                    <div className="text-right font-mono text-blue-600">-{formatCurrency(result.ssTax)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                    <div>Medicare (1.45% + Add&apos;l 0.9% HI)</div>
                    <div className="text-right font-mono text-blue-600">-{formatCurrency((result.medicareTax + result.addMedicare) / PAY_FREQS[payFreq])}</div>
                    <div className="text-right font-mono text-blue-600">-{formatCurrency(result.medicareTax + result.addMedicare)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                    <div>
                      State Taxes ({stateTaxName(selectedState)})
                      {result.stateDetail && <span className="block text-[10px] text-muted-foreground font-normal">{result.stateDetail}</span>}
                    </div>
                    <div className="text-right font-mono text-purple-600">-{formatCurrency(result.stateTax / PAY_FREQS[payFreq])}</div>
                    <div className="text-right font-mono text-purple-600">-{formatCurrency(result.stateTax)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-4 py-2.5 font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <div>Net Paycheck Take-Home</div>
                    <div className="text-right font-mono">{formatCurrency(result.netPerPay)}</div>
                    <div className="text-right font-mono">{formatCurrency(result.netAnnual)}</div>
                  </div>
                </div>
              </div>

              <div className="h-56 w-full bg-background/60 rounded-xl p-3 border border-border/40">
                <p className="text-xs font-medium text-muted-foreground mb-2">Annual Compensation Allocation (Take-Home vs. Taxes vs. Benefits)</p>
                <ResponsiveContainer width="100%" height="85%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [formatCurrency(v), 'Amount']} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl bg-muted/40 border border-border/40 p-4 text-xs space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <FileCheck className="size-4 text-emerald-600 shrink-0" />
                  Understanding W-2 Wage Boxes &amp; Pre-Tax Savings
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Box 1 vs. Boxes 3 &amp; 5:</strong> Traditional 401(k) / 403(b) contributions reduce your taxable income for federal and state income taxes (Box 1), but do <em>not</em> reduce Social Security (Box 3) or Medicare (Box 5) wages.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Section 125 &amp; HSA Advantage:</strong> Qualified Section 125 cafeteria plans (health, dental, vision insurance) and Health Savings Accounts (HSA) reduce <em>both</em> income taxes and FICA payroll taxes, maximizing net pay efficiency.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Annual', valueA: formatCurrency(compareA.grossAnnual), valueB: formatCurrency(compareB.grossAnnual), numA: compareA.grossAnnual, numB: compareB.grossAnnual },
          { label: 'Federal Tax', valueA: formatCurrency(compareA.federalTax), valueB: formatCurrency(compareB.federalTax), numA: compareA.federalTax, numB: compareB.federalTax },
          { label: 'Social Security', valueA: formatCurrency(compareA.ssTax), valueB: formatCurrency(compareB.ssTax), numA: compareA.ssTax, numB: compareB.ssTax },
          { label: 'Medicare', valueA: formatCurrency(compareA.medicareTax), valueB: formatCurrency(compareB.medicareTax), numA: compareA.medicareTax, numB: compareB.medicareTax },
          { label: 'State Tax', valueA: formatCurrency(compareA.stateTax), valueB: formatCurrency(compareB.stateTax), numA: compareA.stateTax, numB: compareB.stateTax },
          { label: 'Pre-tax Deductions', valueA: formatCurrency(compareA.pretaxDeductions), valueB: formatCurrency(compareB.pretaxDeductions), numA: compareA.pretaxDeductions, numB: compareB.pretaxDeductions },
          { label: 'Net Annual', valueA: formatCurrency(compareA.netAnnual), valueB: formatCurrency(compareB.netAnnual), numA: compareA.netAnnual, numB: compareB.netAnnual },
          { label: 'Net per Pay', valueA: formatCurrency(compareA.netPerPay), valueB: formatCurrency(compareB.netPerPay), numA: compareA.netPerPay, numB: compareB.netPerPay },
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

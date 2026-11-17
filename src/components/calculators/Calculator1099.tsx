'use client';

import { useState, useMemo } from 'react';
import { motion } from '@/components/motion';
import { FileSpreadsheet } from 'lucide-react';
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
import { FEDERAL_STANDARD_DEDUCTIONS, SOCIAL_SECURITY_WAGE_BASE, type ReturnFilingStatus } from '@/lib/payroll/federal-tax';
import { compute1099 } from '@/lib/payroll/form-1099';
import { isStateTaxChoice, stateTaxName, type StateTaxChoice } from '@/lib/payroll/state-tax';
import { TAX_YEAR } from '@/lib/payroll/withholding';
import { StateRateInput, StateTaxSelect } from './StateTaxSelect';

type FilingStatus = ReturnFilingStatus;

// No tax figure is typed in this file: federal brackets, self-employment tax rates and state rules
// reach it through compute1099 (src/lib/payroll/form-1099.ts), which reads the paycheck engine's tax year.
const STD_DED = FEDERAL_STANDARD_DEDUCTIONS;

// State figures come from the paycheck engine (src/lib/payroll/state-tax.ts); no state rate is typed here.
const STATE_HELP_MODELED = 'income tax formula, applied to net profit after the self-employment tax deduction.';
const STATE_HELP_OTHER = 'Your rate is applied to net profit after the self-employment tax deduction.';
const SS_WAGE_BASE = SOCIAL_SECURITY_WAGE_BASE;


interface Snapshot1099 {
  grossIncome: number;
  businessExpenses: number;
  netSE: number;
  secaTax: number;
  qbiDeduction: number;
  federalTax: number;
  totalTax: number;
  afterTax: number;
  label: string;
}

export default function Calculator1099() {
  const [grossIncome, setGrossIncome] = useState('95000');
  const [businessExpenses, setBusinessExpenses] = useState('12000');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [selectedState, setSelectedState] = useState<StateTaxChoice>('CA');
  const [stateRate, setStateRate] = useState('5');
  const [calculated, setCalculated] = useState(true);
  const [compareA, setCompareA] = useState<Snapshot1099 | null>(null);
  const [compareB, setCompareB] = useState<Snapshot1099 | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    grossIncome: string; businessExpenses: string; filingStatus: string; stateRate: string; selectedState?: string;
  }>('1099-calculator');

  const gross = parseFloat(grossIncome) || 0;
  const expenses = parseFloat(businessExpenses) || 0;
  const sRate = parseFloat(stateRate) || 0;

  // The math lives in src/lib/payroll/form-1099.ts, which the article's worked examples run too
  const result = useMemo(() => {
    if (gross <= 0) return null;
    return compute1099({ grossIncome: gross, businessExpenses: expenses, filingStatus, state: selectedState, customStateRatePct: sRate });
  }, [gross, expenses, filingStatus, selectedState, sRate]);

  const handleTryExample = () => {
    setGrossIncome('95000');
    setBusinessExpenses('12000');
    setFilingStatus('single');
    setSelectedState('CA');
    setStateRate('5');
    setCalculated(true);
  };

  const handleCalculate = () => {
    if (gross > 0 && result) {
      setCalculated(true);
      saveEntry(
        { grossIncome, businessExpenses, filingStatus, stateRate, selectedState },
        `1099 · Net ${formatCurrency(result.netSE)} · SECA ${formatCurrency(result.secaTax)} · Total tax ${formatCurrency(result.totalTax)}`,
      );
    }
  };

  const handleReset = () => {
    setGrossIncome(''); setBusinessExpenses('0'); setFilingStatus('single'); setSelectedState('CA'); setStateRate('5');
    setCalculated(false);
  };

  const handleRestore = (i: { grossIncome: string; businessExpenses: string; filingStatus: string; stateRate: string; selectedState?: string }) => {
    setGrossIncome(i.grossIncome); setBusinessExpenses(i.businessExpenses);
    setFilingStatus(i.filingStatus as FilingStatus);
    // Entries saved before November 2026 hold only a rate: restore them as another state at that rate
    setSelectedState(isStateTaxChoice(i.selectedState) ? i.selectedState : 'other');
    setStateRate(i.stateRate);
    setCalculated(true);
  };

  const snap = (): Snapshot1099 => result ? {
    grossIncome: gross,
    businessExpenses: expenses,
    netSE: result.netSE,
    secaTax: result.secaTax,
    qbiDeduction: result.qbiDeduction,
    federalTax: result.federalTax,
    totalTax: result.totalTax,
    afterTax: result.afterTax,
    label: `${formatCurrency(gross)} · ${filingStatus}`,
  } : null as unknown as Snapshot1099;

  const chartData = result ? [
    { name: 'Take-Home', amount: result.afterTax, fill: '#10b981' },
    { name: 'SECA Tax', amount: result.secaTax, fill: '#f59e0b' },
    { name: 'Federal Income Tax', amount: result.federalTax, fill: '#3b82f6' },
    { name: 'State Tax', amount: result.stateTax, fill: '#8b5cf6' },
    { name: 'Business Expenses', amount: expenses, fill: '#64748b' },
  ] : [];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="i9-gross" className="font-medium">1099 Gross Business Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="i9-gross" type="number" step="1000" min="0" placeholder="95,000"
                value={grossIncome} onChange={(e) => { setGrossIncome(e.target.value); setCalculated(true); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Total payments received (1099-NEC / 1099-K / invoices).</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="i9-exp" className="font-medium">Schedule C Deductible Expenses</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="i9-exp" type="number" step="500" min="0" placeholder="12,000"
                value={businessExpenses} onChange={(e) => { setBusinessExpenses(e.target.value); setCalculated(true); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Mileage, equipment, software, home office, subcontractor pay.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="i9-status" className="font-medium">Federal Filing Status</Label>
            <Select value={filingStatus} onValueChange={(v) => { setFilingStatus(v as FilingStatus); setCalculated(true); }}>
              <SelectTrigger id="i9-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="mfj">Married Filing Jointly</SelectItem>
                <SelectItem value="hoh">Head of Household</SelectItem>
                <SelectItem value="mfs">Married Filing Separately</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Standard deduction: {formatCurrency(STD_DED[filingStatus])}.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="i9-state-select" className="font-medium">State of Business / Residence</Label>
            <StateTaxSelect id="i9-state-select" value={selectedState} onChange={(v) => { setSelectedState(v); setCalculated(true); }} />
            <p className="text-[11px] text-muted-foreground">
              {selectedState === 'other' ? STATE_HELP_OTHER : `${TAX_YEAR} ${stateTaxName(selectedState)} ${STATE_HELP_MODELED}`}
            </p>
          </div>
        </div>

        {selectedState === 'other' && (
          <div className="p-3 bg-muted/40 rounded-xl border border-border/50 max-w-sm">
            <StateRateInput id="i9-custom-rate" value={stateRate} onChange={(v) => { setStateRate(v); setCalculated(true); }} />
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={gross <= 0}
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25 flex-1 sm:flex-none">
              Calculate 1099 Taxes
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && result && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Net Annual Spendable Take-Home</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-amber-600">{formatCurrency(result.afterTax)}</p>
                <div className="flex justify-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600 font-medium">
                    Quarterly Est. Tax: {formatCurrency(result.quarterly)} /qtr
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600 font-medium">
                    SECA (15.3%): {formatCurrency(result.secaTax)}
                  </Badge>
                  <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600 font-medium">
                    Effective Tax: {formatPercent(result.effectiveRate * 100)}
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Net Profit (Schedule C)', value: formatCurrency(result.netSE) },
                  { label: 'Total Taxes (SECA+Fed+State)', value: formatCurrency(result.totalTax), color: 'text-rose-600' },
                  { label: '20% QBI Tax Savings (est.)', value: formatCurrency(result.qbiDeduction * 0.22), color: 'text-emerald-600' },
                  { label: 'Quarterly Form 1040-ES', value: formatCurrency(result.quarterly), highlight: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center shadow-xs">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-base sm:text-lg font-bold ${m.highlight ? 'text-amber-600' : (m.color || 'text-foreground')}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Quarterly Estimated Tax Schedule */}
              <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground flex justify-between">
                  <span>IRS Form 1040-ES Quarterly Estimated Tax Schedule</span>
                  <span className="text-[11px] font-normal">Avoid underpayment penalties</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/40 p-3 text-xs text-center bg-muted/10">
                  <div className="p-2 space-y-1">
                    <p className="font-semibold text-foreground">Q1 Payment</p>
                    <p className="text-[11px] text-muted-foreground">Due: April 15</p>
                    <p className="font-bold text-amber-600">{formatCurrency(result.quarterly)}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="font-semibold text-foreground">Q2 Payment</p>
                    <p className="text-[11px] text-muted-foreground">Due: June 15</p>
                    <p className="font-bold text-amber-600">{formatCurrency(result.quarterly)}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="font-semibold text-foreground">Q3 Payment</p>
                    <p className="text-[11px] text-muted-foreground">Due: Sept 15</p>
                    <p className="font-bold text-amber-600">{formatCurrency(result.quarterly)}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="font-semibold text-foreground">Q4 Payment</p>
                    <p className="text-[11px] text-muted-foreground">Due: Jan 15 (next yr)</p>
                    <p className="font-bold text-amber-600">{formatCurrency(result.quarterly)}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
                <div className="px-4 py-2 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground">
                  1099 Tax &amp; Deduction Reconciliation
                </div>
                <div className="divide-y divide-border/40 text-xs">
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">Gross 1099 Revenue:</span><span className="font-semibold">{formatCurrency(gross)}</span></div>
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">Less Deductible Business Expenses:</span><span className="font-semibold text-rose-600">-{formatCurrency(expenses)}</span></div>
                  <div className="flex justify-between px-4 py-2 bg-muted/10"><span className="font-medium">Net Schedule C Profit:</span><span className="font-bold">{formatCurrency(result.netSE)}</span></div>
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">SECA Social Security (12.4% on 92.35% up to ${SS_WAGE_BASE.toLocaleString('en-US')}):</span><span className="font-semibold">{formatCurrency(result.ssPortion)}</span></div>
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">SECA Medicare (2.9% on 92.35%):</span><span className="font-semibold">{formatCurrency(result.medicarePortion)}</span></div>
                  <div className="flex justify-between px-4 py-2 text-blue-600"><span className="font-medium">Total SECA Self-Employment Tax:</span><span className="font-bold">-{formatCurrency(result.secaTax)}</span></div>
                  <div className="flex justify-between px-4 py-2 text-emerald-600"><span className="text-muted-foreground">Above-the-Line 50% SECA Deduction:</span><span>-{formatCurrency(result.secaDeduction)}</span></div>
                  <div className="flex justify-between px-4 py-2 text-emerald-600"><span className="text-muted-foreground">Section 199A QBI Deduction (20%):</span><span>-{formatCurrency(result.qbiDeduction)}</span></div>
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">Federal Income Tax:</span><span className="font-semibold text-blue-600">-{formatCurrency(result.federalTax)}</span></div>
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">Estimated State Income Tax ({stateTaxName(selectedState)}{selectedState === 'other' ? ` @ ${stateRate}%` : ''}):</span><span className="font-semibold text-purple-600">-{formatCurrency(result.stateTax)}</span></div>
                  <div className="flex justify-between px-4 py-2.5 font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400"><span>Net Take-Home Pay (After All Taxes):</span><span className="font-mono">{formatCurrency(result.afterTax)}</span></div>
                </div>
              </div>

              <div className="h-56 w-full bg-background/60 rounded-xl p-3 border border-border/40">
                <p className="text-xs font-medium text-muted-foreground mb-2">1099 Revenue Allocation: Take-Home vs. Taxes vs. Expenses</p>
                <ResponsiveContainer width="100%" height="85%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
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
                  <FileSpreadsheet className="size-4 text-amber-600 shrink-0" />
                  Self-Employment (SECA) &amp; Section 199A QBI Tax Rules (2026)
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>The 15.3% SECA Tax:</strong> 1099 independent contractors pay both the employer (7.65%) and employee (7.65%) shares of Social Security and Medicare. However, you deduct half of SECA tax (7.65%) above-the-line on Form 1040, lowering your federal adjusted gross income.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Section 199A QBI Deduction:</strong> Under the Tax Cuts and Jobs Act, eligible self-employed contractors can deduct up to 20% of their net qualified business income, providing substantial federal income tax savings.
                </p>
                <div className="pt-1 text-[11px] text-muted-foreground">
                  Need to compare 1099 net income against an equivalent W-2 corporate job offer? Use our dedicated <a href="/calculators/contractor-vs-employee-calculator" className="text-amber-600 underline font-medium hover:text-amber-700">1099 vs. W-2 Calculator</a>.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross 1099 Income', valueA: formatCurrency(compareA.grossIncome), valueB: formatCurrency(compareB.grossIncome), numA: compareA.grossIncome, numB: compareB.grossIncome },
          { label: 'Business Expenses', valueA: formatCurrency(compareA.businessExpenses), valueB: formatCurrency(compareB.businessExpenses), numA: compareA.businessExpenses, numB: compareB.businessExpenses },
          { label: 'Net SE Income', valueA: formatCurrency(compareA.netSE), valueB: formatCurrency(compareB.netSE), numA: compareA.netSE, numB: compareB.netSE },
          { label: 'SECA Tax', valueA: formatCurrency(compareA.secaTax), valueB: formatCurrency(compareB.secaTax), numA: compareA.secaTax, numB: compareB.secaTax },
          { label: 'QBI Deduction', valueA: formatCurrency(compareA.qbiDeduction), valueB: formatCurrency(compareB.qbiDeduction), numA: compareA.qbiDeduction, numB: compareB.qbiDeduction },
          { label: 'Federal Income Tax', valueA: formatCurrency(compareA.federalTax), valueB: formatCurrency(compareB.federalTax), numA: compareA.federalTax, numB: compareB.federalTax },
          { label: 'Total Tax', valueA: formatCurrency(compareA.totalTax), valueB: formatCurrency(compareB.totalTax), numA: compareA.totalTax, numB: compareB.totalTax },
          { label: 'Take-Home', valueA: formatCurrency(compareA.afterTax), valueB: formatCurrency(compareB.afterTax), numA: compareA.afterTax, numB: compareB.afterTax },
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

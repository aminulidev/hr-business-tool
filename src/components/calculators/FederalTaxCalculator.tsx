'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
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

type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

interface BracketDef { min: number; max: number; rate: number; }

// 2026 Federal Tax Brackets (IRS Rev. Proc. 2025-32)
const brackets2026: Record<FilingStatus, BracketDef[]> = {
  single: [
    { min: 0, max: 12150, rate: 0.10 },
    { min: 12150, max: 49350, rate: 0.12 },
    { min: 49350, max: 105250, rate: 0.22 },
    { min: 105250, max: 200900, rate: 0.24 },
    { min: 200900, max: 255350, rate: 0.32 },
    { min: 255350, max: 639950, rate: 0.35 },
    { min: 639950, max: Infinity, rate: 0.37 },
  ],
  mfj: [
    { min: 0, max: 24300, rate: 0.10 },
    { min: 24300, max: 98700, rate: 0.12 },
    { min: 98700, max: 210500, rate: 0.22 },
    { min: 210500, max: 401800, rate: 0.24 },
    { min: 401800, max: 510700, rate: 0.32 },
    { min: 510700, max: 766900, rate: 0.35 },
    { min: 766900, max: Infinity, rate: 0.37 },
  ],
  mfs: [
    { min: 0, max: 12150, rate: 0.10 },
    { min: 12150, max: 49350, rate: 0.12 },
    { min: 49350, max: 105250, rate: 0.22 },
    { min: 105250, max: 200900, rate: 0.24 },
    { min: 200900, max: 255350, rate: 0.32 },
    { min: 255350, max: 383450, rate: 0.35 },
    { min: 383450, max: Infinity, rate: 0.37 },
  ],
  hoh: [
    { min: 0, max: 17300, rate: 0.10 },
    { min: 17300, max: 66000, rate: 0.12 },
    { min: 66000, max: 105250, rate: 0.22 },
    { min: 105250, max: 200900, rate: 0.24 },
    { min: 200900, max: 255350, rate: 0.32 },
    { min: 255350, max: 639950, rate: 0.35 },
    { min: 639950, max: Infinity, rate: 0.37 },
  ],
};

const standardDeductions: Record<FilingStatus, number> = {
  single: 15300, mfj: 30600, mfs: 15300, hoh: 22950,
};

const filingStatusLabels: Record<FilingStatus, string> = {
  single: 'Single',
  mfj: 'Married Filing Jointly',
  mfs: 'Married Filing Separately',
  hoh: 'Head of Household',
};

interface FederalTaxSnapshot {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  marginalRate: number;
  effectiveRate: number;
  afterTax: number;
  label: string;
}

export default function FederalTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [deductionMode, setDeductionMode] = useState<'standard' | 'itemized'>('standard');
  const [aboveTheLine, setAboveTheLine] = useState('');
  const [itemizedAmount, setItemizedAmount] = useState('');
  const [payPeriod, setPayPeriod] = useState<'annual' | 'monthly' | 'biweekly'>('annual');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<FederalTaxSnapshot | null>(null);
  const [compareB, setCompareB] = useState<FederalTaxSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    grossIncome: string; filingStatus: string; deductionMode: string; deductions: string;
  }>('federal-tax-calculator');

  const gross = parseFloat(grossIncome) || 0;
  const aboveLineNum = parseFloat(aboveTheLine) || 0;
  const itemizedNum = parseFloat(itemizedAmount) || 0;

  const result = useMemo(() => {
    if (gross <= 0) return null;
    const stdDed = standardDeductions[filingStatus];
    const appliedDeduction = deductionMode === 'standard' 
      ? stdDed + aboveLineNum 
      : Math.max(itemizedNum, 0) + aboveLineNum;
    const taxableIncome = Math.max(0, gross - appliedDeduction);
    const brackets = brackets2026[filingStatus];
    let totalTax = 0;
    let marginalRate = 0;
    const breakdown: { rate: number; incomeInBracket: number; taxInBracket: number; min: number; max: number | null }[] = [];

    for (const b of brackets) {
      if (taxableIncome > b.min) {
        const incomeInBracket = Math.min(taxableIncome, b.max) - b.min;
        const taxInBracket = incomeInBracket * b.rate;
        totalTax += taxInBracket;
        marginalRate = b.rate;
        breakdown.push({ rate: b.rate, incomeInBracket, taxInBracket, min: b.min, max: b.max === Infinity ? null : b.max });
      } else {
        break;
      }
    }

    // 2026 Estimated FICA (Social Security wage cap $176,100 @ 6.2%, Medicare 1.45% uncapped)
    const ssTax = Math.min(gross, 176100) * 0.062;
    const medTax = gross * 0.0145;
    const estFica = ssTax + medTax;
    const effectiveRate = gross > 0 ? totalTax / gross : 0;
    const afterTax = gross - totalTax;

    return { 
      taxableIncome, 
      totalTax, 
      marginalRate, 
      effectiveRate, 
      afterTax, 
      breakdown, 
      stdDed, 
      appliedDeduction, 
      estFica,
      totalWithFica: totalTax + estFica,
      netAfterAllFederal: gross - (totalTax + estFica)
    };
  }, [gross, filingStatus, deductionMode, aboveLineNum, itemizedNum]);

  const handleTryExample = () => {
    setGrossIncome('95000');
    setFilingStatus('single');
    setDeductionMode('standard');
    setAboveTheLine('4500');
    setItemizedAmount('');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (gross > 0 && result) {
      setCalculated(true);
      saveEntry(
        { 
          grossIncome, 
          filingStatus, 
          deductionMode, 
          deductions: deductionMode === 'standard' ? aboveTheLine : itemizedAmount 
        },
        `${filingStatusLabels[filingStatus]} · ${formatCurrency(gross)} · Fed tax: ${formatCurrency(result.totalTax)}`,
      );
    }
  };

  const handleReset = () => {
    setGrossIncome('');
    setFilingStatus('single');
    setDeductionMode('standard');
    setAboveTheLine('');
    setItemizedAmount('');
    setCalculated(false);
  };

  const handleRestore = (i: { grossIncome: string; filingStatus: string; deductionMode?: string; deductions: string }) => {
    setGrossIncome(i.grossIncome);
    setFilingStatus(i.filingStatus as FilingStatus);
    setDeductionMode((i.deductionMode as 'standard' | 'itemized') || 'standard');
    if (i.deductionMode === 'itemized') {
      setItemizedAmount(i.deductions || '');
      setAboveTheLine('');
    } else {
      setAboveTheLine(i.deductions || '');
      setItemizedAmount('');
    }
    setCalculated(true);
  };

  const snap = (): FederalTaxSnapshot => result ? {
    grossIncome: gross,
    taxableIncome: result.taxableIncome,
    totalTax: result.totalTax,
    marginalRate: result.marginalRate,
    effectiveRate: result.effectiveRate,
    afterTax: result.afterTax,
    label: `${filingStatusLabels[filingStatus]} · ${formatCurrency(gross)}`,
  } : null as unknown as FederalTaxSnapshot;

  const chartData = result ? [
    { name: 'After Federal Tax', amount: result.afterTax, fill: '#10b981' },
    { name: 'Federal Income Tax', amount: result.totalTax, fill: '#3b82f6' },
    { name: 'Est. FICA Tax', amount: result.estFica, fill: '#f59e0b' },
  ] : [];

  // Pay period divisors
  const divisor = payPeriod === 'monthly' ? 12 : payPeriod === 'biweekly' ? 26 : 1;

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ft-gross" className="font-medium">Annual Gross Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="ft-gross" type="number" step="1000" min="0" placeholder="85,000"
                value={grossIncome} onChange={(e) => { setGrossIncome(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Total annual wages, tips, and taxable salaries.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ft-status" className="font-medium">IRS Filing Status</Label>
            <Select value={filingStatus} onValueChange={(v) => { setFilingStatus(v as FilingStatus); setCalculated(false); }}>
              <SelectTrigger id="ft-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single ($15,300 Std Ded)</SelectItem>
                <SelectItem value="mfj">Married Filing Jointly ($30,600 Std Ded)</SelectItem>
                <SelectItem value="hoh">Head of Household ($22,950 Std Ded)</SelectItem>
                <SelectItem value="mfs">Married Filing Separately ($15,300 Std Ded)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Governs 2026 bracket thresholds &amp; standard deduction.</p>
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label className="font-medium">Deduction Method</Label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted/50 rounded-lg border border-border/40 text-xs">
              <button
                type="button"
                onClick={() => { setDeductionMode('standard'); setCalculated(false); }}
                className={`py-1.5 px-2 rounded-md font-medium transition ${
                  deductionMode === 'standard' 
                    ? 'bg-background shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Standard Deduction
              </button>
              <button
                type="button"
                onClick={() => { setDeductionMode('itemized'); setCalculated(false); }}
                className={`py-1.5 px-2 rounded-md font-medium transition ${
                  deductionMode === 'itemized' 
                    ? 'bg-background shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Itemize Deductions
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {deductionMode === 'standard' 
                ? `Default 2026 standard deduction is ${formatCurrency(standardDeductions[filingStatus])}.`
                : 'Enter your custom Schedule A itemized deduction total below.'}
            </p>
          </div>
        </div>

        {/* Deduction inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {deductionMode === 'itemized' ? (
            <div className="space-y-2">
              <Label htmlFor="ft-itemized" className="font-medium">Total Itemized Deductions (Schedule A)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                <Input id="ft-itemized" type="number" step="500" min="0" placeholder="e.g. 18,500"
                  value={itemizedAmount} onChange={(e) => { setItemizedAmount(e.target.value); setCalculated(false); }} className="pl-7" />
              </div>
              <p className="text-[11px] text-muted-foreground">Mortgage interest, state/local taxes (SALT max $10k), charitable donations.</p>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <Landmark className="size-3.5 text-emerald-600" />
                Automatic Standard Deduction: {formatCurrency(standardDeductions[filingStatus])}
              </div>
              <p>
                Under Rev. Proc. 2025-32, approximately 90% of filers benefit most by taking this statutory standard deduction without itemizing.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ft-above" className="font-medium">Above-the-Line Adjustments (Optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="ft-above" type="number" step="500" min="0" placeholder="e.g. 4,500"
                value={aboveTheLine} onChange={(e) => { setAboveTheLine(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Pre-tax 401(k), traditional IRA, HSA, or student loan interest (Form 1040 Sch 1).</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={gross <= 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none">
              Calculate Federal Tax
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && result && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">2026 Federal Income Tax Liability</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-blue-600">{formatCurrency(result.totalTax)}</p>
                
                {/* Pay period selector toggle */}
                <div className="inline-flex items-center rounded-lg bg-background/80 border border-border/50 p-1 text-xs">
                  <span className="text-muted-foreground px-2">Show:</span>
                  {(['annual', 'monthly', 'biweekly'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setPayPeriod(period)}
                      className={`px-2.5 py-1 rounded-md capitalize font-medium transition ${
                        payPeriod === period ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-medium">
                    Take-home: {formatCurrency(result.afterTax / divisor)} {payPeriod !== 'annual' ? `/${payPeriod}` : ''}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600 font-medium">
                    Marginal Bracket: {formatPercent(result.marginalRate * 100)}
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600 font-medium">
                    Effective Rate: {formatPercent(result.effectiveRate * 100)}
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Gross Annual Income', value: formatCurrency(gross / divisor) },
                  { label: 'Total Deductions', value: formatCurrency(result.appliedDeduction / divisor) },
                  { label: 'Taxable Income (AGI)', value: formatCurrency(result.taxableIncome / divisor) },
                  { label: 'After-Federal-Tax', value: formatCurrency(result.afterTax / divisor), highlight: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center shadow-xs">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-base sm:text-lg font-bold ${m.highlight ? 'text-emerald-600' : 'text-foreground'}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Bracket Breakdown Table */}
              <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50 flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>IRS Bracket Breakdown — {filingStatusLabels[filingStatus]} (2026)</span>
                  <span className="hidden sm:inline text-[11px] font-normal">Progressive tax formula</span>
                </div>
                <div className="divide-y divide-border/40">
                  <div className="grid grid-cols-4 gap-2 px-4 py-2 text-[11px] font-medium text-muted-foreground bg-muted/20">
                    <div>Bracket Rate</div>
                    <div>Income Range</div>
                    <div className="text-right">Taxable in Tier</div>
                    <div className="text-right">Bracket Tax</div>
                  </div>
                  {result.breakdown.map((b, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 px-4 py-2.5 text-xs">
                      <div className="font-semibold text-foreground">{formatPercent(b.rate * 100)}</div>
                      <div className="text-muted-foreground">
                        {formatCurrency(b.min)} – {b.max === null ? '∞' : formatCurrency(b.max)}
                      </div>
                      <div className="text-right font-mono">{formatCurrency(b.incomeInBracket)}</div>
                      <div className="text-right font-semibold font-mono text-blue-600">{formatCurrency(b.taxInBracket)}</div>
                    </div>
                  ))}
                  <div className="grid grid-cols-4 gap-2 px-4 py-2.5 text-xs font-bold bg-muted/30">
                    <div className="col-span-2">Total Federal Income Tax</div>
                    <div className="text-right font-mono">{formatCurrency(result.taxableIncome)}</div>
                    <div className="text-right font-mono text-blue-600">{formatCurrency(result.totalTax)}</div>
                  </div>
                </div>
              </div>

              {/* Bar Visual */}
              <div className="h-56 w-full bg-background/60 rounded-xl p-3 border border-border/40">
                <p className="text-xs font-medium text-muted-foreground mb-2">Income Allocation &amp; Estimated Taxes</p>
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

              {/* FICA & Net Pay Notice */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-4 text-xs space-y-2">
                <div className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Landmark className="size-4 shrink-0" />
                  Estimated FICA (Social Security &amp; Medicare) Notice
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  In addition to your <strong>{formatCurrency(result.totalTax)}</strong> federal income tax, employees owe mandatory FICA payroll taxes of approximately <strong>{formatCurrency(result.estFica)}</strong> (6.2% Social Security up to $176,100 + 1.45% Medicare uncapped).
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 font-medium text-foreground">
                  <span>Total Federal + FICA: <strong>{formatCurrency(result.totalWithFica)}</strong></span>
                  <span>Estimated Net Take-Home: <strong>{formatCurrency(result.netAfterAllFederal)}</strong></span>
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  For comprehensive multi-state income tax, city wage taxes, and 401(k) paycheck modeling, use our <a href="/calculators/w-2-calculator" className="text-blue-600 underline font-medium hover:text-blue-700">W-2 Paycheck Calculator</a> or <a href="/calculators/salary-tax-calculator" className="text-blue-600 underline font-medium hover:text-blue-700">Salary Tax Calculator</a>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Income', valueA: formatCurrency(compareA.grossIncome), valueB: formatCurrency(compareB.grossIncome), numA: compareA.grossIncome, numB: compareB.grossIncome },
          { label: 'Taxable Income', valueA: formatCurrency(compareA.taxableIncome), valueB: formatCurrency(compareB.taxableIncome), numA: compareA.taxableIncome, numB: compareB.taxableIncome },
          { label: 'Marginal Rate', valueA: formatPercent(compareA.marginalRate * 100), valueB: formatPercent(compareB.marginalRate * 100), numA: compareA.marginalRate * 100, numB: compareB.marginalRate * 100 },
          { label: 'Effective Rate', valueA: formatPercent(compareA.effectiveRate * 100), valueB: formatPercent(compareB.effectiveRate * 100), numA: compareA.effectiveRate * 100, numB: compareB.effectiveRate * 100 },
          { label: 'Federal Tax', valueA: formatCurrency(compareA.totalTax), valueB: formatCurrency(compareB.totalTax), numA: compareA.totalTax, numB: compareB.totalTax },
          { label: 'After-Tax Income', valueA: formatCurrency(compareA.afterTax), valueB: formatCurrency(compareB.afterTax), numA: compareA.afterTax, numB: compareB.afterTax },
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

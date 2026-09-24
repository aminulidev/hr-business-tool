'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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

type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

// 2026 Federal brackets
const FED_BRACKETS: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0, max: 12150, rate: 0.10 }, { min: 12150, max: 49350, rate: 0.12 },
    { min: 49350, max: 105250, rate: 0.22 }, { min: 105250, max: 200900, rate: 0.24 },
    { min: 200900, max: 255350, rate: 0.32 }, { min: 255350, max: 639950, rate: 0.35 },
    { min: 639950, max: Infinity, rate: 0.37 },
  ],
  mfj: [
    { min: 0, max: 24300, rate: 0.10 }, { min: 24300, max: 98700, rate: 0.12 },
    { min: 98700, max: 210500, rate: 0.22 }, { min: 210500, max: 401800, rate: 0.24 },
    { min: 401800, max: 510700, rate: 0.32 }, { min: 510700, max: 766900, rate: 0.35 },
    { min: 766900, max: Infinity, rate: 0.37 },
  ],
  mfs: [
    { min: 0, max: 12150, rate: 0.10 }, { min: 12150, max: 49350, rate: 0.12 },
    { min: 49350, max: 105250, rate: 0.22 }, { min: 105250, max: 200900, rate: 0.24 },
    { min: 200900, max: 255350, rate: 0.32 }, { min: 255350, max: 383450, rate: 0.35 },
    { min: 383450, max: Infinity, rate: 0.37 },
  ],
  hoh: [
    { min: 0, max: 17300, rate: 0.10 }, { min: 17300, max: 66000, rate: 0.12 },
    { min: 66000, max: 105250, rate: 0.22 }, { min: 105250, max: 200900, rate: 0.24 },
    { min: 200900, max: 255350, rate: 0.32 }, { min: 255350, max: 639950, rate: 0.35 },
    { min: 639950, max: Infinity, rate: 0.37 },
  ],
};

const STD_DED: Record<FilingStatus, number> = { single: 15300, mfj: 30600, mfs: 15300, hoh: 22950 };
const QBI_DEDUCTION_RATE = 0.20;
const SS_WAGE_BASE = 176100;
const SS_RATE = 0.124; // SECA SS portion
const MEDICARE_RATE = 0.029; // SECA Medicare portion
const SECA_COMBINED_RATE = SS_RATE + MEDICARE_RATE; // 15.3%

// Approximate average/flat state tax rates for quick 1099 contractor estimation
const STATE_RATES: Record<string, { name: string; rate: number }> = {
  AL: { name: 'Alabama', rate: 4.5 },
  AK: { name: 'Alaska', rate: 0.0 },
  AZ: { name: 'Arizona', rate: 2.5 },
  AR: { name: 'Arkansas', rate: 4.4 },
  CA: { name: 'California', rate: 6.5 },
  CO: { name: 'Colorado', rate: 4.4 },
  CT: { name: 'Connecticut', rate: 5.5 },
  DE: { name: 'Delaware', rate: 5.0 },
  FL: { name: 'Florida', rate: 0.0 },
  GA: { name: 'Georgia', rate: 5.39 },
  HI: { name: 'Hawaii', rate: 7.5 },
  ID: { name: 'Idaho', rate: 5.695 },
  IL: { name: 'Illinois', rate: 4.95 },
  IN: { name: 'Indiana', rate: 3.05 },
  IA: { name: 'Iowa', rate: 5.0 },
  KS: { name: 'Kansas', rate: 5.25 },
  KY: { name: 'Kentucky', rate: 4.0 },
  LA: { name: 'Louisiana', rate: 3.5 },
  ME: { name: 'Maine', rate: 6.0 },
  MD: { name: 'Maryland', rate: 4.75 },
  MA: { name: 'Massachusetts', rate: 5.0 },
  MI: { name: 'Michigan', rate: 4.25 },
  MN: { name: 'Minnesota', rate: 6.8 },
  MS: { name: 'Mississippi', rate: 4.4 },
  MO: { name: 'Missouri', rate: 4.5 },
  MT: { name: 'Montana', rate: 5.9 },
  NE: { name: 'Nebraska', rate: 5.0 },
  NV: { name: 'Nevada', rate: 0.0 },
  NH: { name: 'New Hampshire', rate: 0.0 },
  NJ: { name: 'New Jersey', rate: 5.5 },
  NM: { name: 'New Mexico', rate: 4.5 },
  NY: { name: 'New York', rate: 6.0 },
  NC: { name: 'North Carolina', rate: 4.5 },
  ND: { name: 'North Dakota', rate: 1.95 },
  OH: { name: 'Ohio', rate: 3.5 },
  OK: { name: 'Oklahoma', rate: 4.0 },
  OR: { name: 'Oregon', rate: 7.5 },
  PA: { name: 'Pennsylvania', rate: 3.07 },
  RI: { name: 'Rhode Island', rate: 4.75 },
  SC: { name: 'South Carolina', rate: 5.0 },
  SD: { name: 'South Dakota', rate: 0.0 },
  TN: { name: 'Tennessee', rate: 0.0 },
  TX: { name: 'Texas', rate: 0.0 },
  UT: { name: 'Utah', rate: 4.65 },
  VT: { name: 'Vermont', rate: 5.5 },
  VA: { name: 'Virginia', rate: 5.0 },
  WA: { name: 'Washington', rate: 0.0 },
  WV: { name: 'West Virginia', rate: 4.0 },
  WI: { name: 'Wisconsin', rate: 5.0 },
  WY: { name: 'Wyoming', rate: 0.0 },
  OTHER: { name: 'Custom Rate', rate: 5.0 },
};

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
  const [grossIncome, setGrossIncome] = useState('');
  const [businessExpenses, setBusinessExpenses] = useState('');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [selectedState, setSelectedState] = useState('CA');
  const [stateRate, setStateRate] = useState('6.5');
  const [useCustomStateRate, setUseCustomStateRate] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot1099 | null>(null);
  const [compareB, setCompareB] = useState<Snapshot1099 | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    grossIncome: string; businessExpenses: string; filingStatus: string; stateRate: string;
  }>('1099-calculator');

  const gross = parseFloat(grossIncome) || 0;
  const expenses = parseFloat(businessExpenses) || 0;
  const sRate = parseFloat(stateRate) || 0;

  const result = useMemo(() => {
    if (gross <= 0) return null;
    const netSE = Math.max(0, gross - expenses);

    // SECA: 15.3% on 92.35% of net SE earnings
    const secaTaxable = netSE * 0.9235;
    const ssPortion = Math.min(secaTaxable, SS_WAGE_BASE) * SS_RATE;
    const medicarePortion = secaTaxable * MEDICARE_RATE;
    const secaTax = ssPortion + medicarePortion;

    // 50% of SECA tax is deductible above-the-line
    const secaDeduction = secaTax / 2;

    // QBI Deduction: 20% of net SE income (simplified — assumes below taxable income thresholds)
    const qbiDeduction = netSE * QBI_DEDUCTION_RATE;

    // Taxable income for federal income tax
    const stdDed = STD_DED[filingStatus];
    const taxableIncome = Math.max(0, netSE - secaDeduction - qbiDeduction - stdDed);

    let federalTax = 0;
    for (const b of FED_BRACKETS[filingStatus]) {
      if (taxableIncome > b.min) {
        federalTax += (Math.min(taxableIncome, b.max) - b.min) * b.rate;
      } else break;
    }

    const stateTaxable = Math.max(0, netSE - stdDed * 0.5);
    const stateTax = stateTaxable * (sRate / 100);

    const totalTax = secaTax + federalTax + stateTax;
    const afterTax = netSE - totalTax;
    const marginalRate = FED_BRACKETS[filingStatus].find((b) => taxableIncome > b.min && taxableIncome <= b.max)?.rate || 0;
    const effectiveRate = netSE > 0 ? totalTax / netSE : 0;

    // Quarterly estimated payments
    const quarterly = totalTax / 4;

    return {
      netSE, secaTaxable, secaTax, ssPortion, medicarePortion, secaDeduction,
      qbiDeduction, taxableIncome, federalTax, stateTax, totalTax, afterTax,
      marginalRate, effectiveRate, quarterly,
    };
  }, [gross, expenses, filingStatus, sRate]);

  const handleTryExample = () => {
    setGrossIncome('95000');
    setBusinessExpenses('12000');
    setFilingStatus('single');
    setStateRate('5');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (gross > 0 && result) {
      setCalculated(true);
      saveEntry(
        { grossIncome, businessExpenses, filingStatus, stateRate },
        `1099 · Net ${formatCurrency(result.netSE)} · SECA ${formatCurrency(result.secaTax)} · Total tax ${formatCurrency(result.totalTax)}`,
      );
    }
  };

  const handleReset = () => {
    setGrossIncome(''); setBusinessExpenses('0'); setFilingStatus('single'); setStateRate('5');
    setCalculated(false);
  };

  const handleRestore = (i: { grossIncome: string; businessExpenses: string; filingStatus: string; stateRate: string }) => {
    setGrossIncome(i.grossIncome); setBusinessExpenses(i.businessExpenses);
    setFilingStatus(i.filingStatus as FilingStatus); setStateRate(i.stateRate);
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
                value={grossIncome} onChange={(e) => { setGrossIncome(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Total payments received (1099-NEC / 1099-K / invoices).</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="i9-exp" className="font-medium">Schedule C Deductible Expenses</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="i9-exp" type="number" step="500" min="0" placeholder="12,000"
                value={businessExpenses} onChange={(e) => { setBusinessExpenses(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Mileage, equipment, software, home office, subcontractor pay.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="i9-status" className="font-medium">Federal Filing Status</Label>
            <Select value={filingStatus} onValueChange={(v) => { setFilingStatus(v as FilingStatus); setCalculated(false); }}>
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
            <Select 
              value={selectedState} 
              onValueChange={(v) => { 
                setSelectedState(v); 
                if (v !== 'OTHER') {
                  setStateRate(STATE_RATES[v].rate.toString());
                  setUseCustomStateRate(false);
                } else {
                  setUseCustomStateRate(true);
                }
                setCalculated(false); 
              }}
            >
              <SelectTrigger id="i9-state-select"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(STATE_RATES).map(([code, s]) => (
                  <SelectItem key={code} value={code}>
                    {s.name} {s.rate === 0 ? '(0% no tax)' : `(~${s.rate}%)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Rate: {stateRate}%</span>
              <button 
                type="button" 
                onClick={() => setUseCustomStateRate(!useCustomStateRate)}
                className="text-amber-600 underline hover:text-amber-700"
              >
                {useCustomStateRate ? 'Auto' : 'Edit %'}
              </button>
            </div>
          </div>
        </div>

        {useCustomStateRate && (
          <div className="p-3 bg-muted/40 rounded-xl border border-border/50 max-w-sm space-y-1">
            <Label htmlFor="i9-custom-rate" className="text-xs font-medium">Custom State / Local Income Tax Rate (%)</Label>
            <div className="relative">
              <Input id="i9-custom-rate" type="number" step="0.1" min="0" max="20"
                value={stateRate} onChange={(e) => { setStateRate(e.target.value); setCalculated(false); }} className="h-8 text-xs" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
            </div>
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
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">SECA Social Security (12.4% on 92.35% up to $176,100):</span><span className="font-semibold">{formatCurrency(result.ssPortion)}</span></div>
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">SECA Medicare (2.9% on 92.35%):</span><span className="font-semibold">{formatCurrency(result.medicarePortion)}</span></div>
                  <div className="flex justify-between px-4 py-2 text-blue-600"><span className="font-medium">Total SECA Self-Employment Tax:</span><span className="font-bold">-{formatCurrency(result.secaTax)}</span></div>
                  <div className="flex justify-between px-4 py-2 text-emerald-600"><span className="text-muted-foreground">Above-the-Line 50% SECA Deduction:</span><span>-{formatCurrency(result.secaDeduction)}</span></div>
                  <div className="flex justify-between px-4 py-2 text-emerald-600"><span className="text-muted-foreground">Section 199A QBI Deduction (20%):</span><span>-{formatCurrency(result.qbiDeduction)}</span></div>
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">Federal Income Tax:</span><span className="font-semibold text-blue-600">-{formatCurrency(result.federalTax)}</span></div>
                  <div className="flex justify-between px-4 py-2"><span className="text-muted-foreground">Estimated State Tax ({selectedState} @ {stateRate}%):</span><span className="font-semibold text-purple-600">-{formatCurrency(result.stateTax)}</span></div>
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

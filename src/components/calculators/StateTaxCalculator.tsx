'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon } from 'lucide-react';
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

// ── State Tax Definitions ──
// For progressive states, simplified brackets (top marginal rates shown for reference).
// Source: state DOR websites, 2026 tax year estimates.

type StateTaxInfo = {
  name: string;
  type: 'none' | 'flat' | 'progressive';
  rate?: number; // for flat
  brackets?: { min: number; max: number; rate: number }[];
  stdDeduction?: number; // typical single filer
};

const STATES: Record<string, StateTaxInfo> = {
  AL: { name: 'Alabama', type: 'flat', rate: 0.05, stdDeduction: 3000 },
  AK: { name: 'Alaska', type: 'none' },
  AZ: { name: 'Arizona', type: 'flat', rate: 0.025, stdDeduction: 13850 },
  AR: { name: 'Arkansas', type: 'flat', rate: 0.044, stdDeduction: 2970 },
  CA: {
    name: 'California', type: 'progressive', stdDeduction: 5363,
    brackets: [
      { min: 0, max: 10412, rate: 0.01 },
      { min: 10412, max: 24684, rate: 0.02 },
      { min: 24684, max: 38959, rate: 0.04 },
      { min: 38959, max: 54081, rate: 0.06 },
      { min: 54081, max: 68350, rate: 0.08 },
      { min: 68350, max: 349137, rate: 0.093 },
      { min: 349137, max: 418961, rate: 0.103 },
      { min: 418961, max: 698271, rate: 0.113 },
      { min: 698271, max: Infinity, rate: 0.123 },
    ],
  },
  CO: { name: 'Colorado', type: 'flat', rate: 0.044, stdDeduction: 13850 },
  CT: {
    name: 'Connecticut', type: 'progressive', stdDeduction: 7500,
    brackets: [
      { min: 0, max: 10000, rate: 0.02 },
      { min: 10000, max: 50000, rate: 0.0475 },
      { min: 50000, max: 100000, rate: 0.0553 },
      { min: 100000, max: 200000, rate: 0.0593 },
      { min: 200000, max: 250000, rate: 0.0647 },
      { min: 250000, max: 500000, rate: 0.0693 },
      { min: 500000, max: Infinity, rate: 0.0699 },
    ],
  },
  DE: {
    name: 'Delaware', type: 'progressive', stdDeduction: 3250,
    brackets: [
      { min: 0, max: 2000, rate: 0.0 },
      { min: 2000, max: 5000, rate: 0.022 },
      { min: 5000, max: 10000, rate: 0.039 },
      { min: 10000, max: 20000, rate: 0.048 },
      { min: 20000, max: 25000, rate: 0.052 },
      { min: 25000, max: 60000, rate: 0.0555 },
      { min: 60000, max: Infinity, rate: 0.066 },
    ],
  },
  FL: { name: 'Florida', type: 'none' },
  GA: {
    name: 'Georgia', type: 'flat', rate: 0.0539, stdDeduction: 12000,
  },
  HI: {
    name: 'Hawaii', type: 'progressive', stdDeduction: 2200,
    brackets: [
      { min: 0, max: 2400, rate: 0.014 },
      { min: 2400, max: 4800, rate: 0.032 },
      { min: 4800, max: 9600, rate: 0.055 },
      { min: 9600, max: 14400, rate: 0.064 },
      { min: 14400, max: 19200, rate: 0.068 },
      { min: 19200, max: 36000, rate: 0.072 },
      { min: 36000, max: 48000, rate: 0.079 },
      { min: 48000, max: 150000, rate: 0.082 },
      { min: 150000, max: 175000, rate: 0.089 },
      { min: 175000, max: 200000, rate: 0.093 },
      { min: 200000, max: Infinity, rate: 0.11 },
    ],
  },
  ID: { name: 'Idaho', type: 'flat', rate: 0.05695, stdDeduction: 13850 },
  IL: { name: 'Illinois', type: 'flat', rate: 0.0495, stdDeduction: 2600 },
  IN: { name: 'Indiana', type: 'flat', rate: 0.0305, stdDeduction: 1000 },
  IA: {
    name: 'Iowa', type: 'progressive', stdDeduction: 6505,
    brackets: [
      { min: 0, max: 6555, rate: 0.044 },
      { min: 6555, max: 19665, rate: 0.0482 },
      { min: 19665, max: 32775, rate: 0.057 },
      { min: 32775, max: 78940, rate: 0.06 },
      { min: 78940, max: Infinity, rate: 0.057 },
    ],
  },
  KS: {
    name: 'Kansas', type: 'progressive', stdDeduction: 3830,
    brackets: [
      { min: 0, max: 15000, rate: 0.031 },
      { min: 15000, max: 30000, rate: 0.0525 },
      { min: 30000, max: Infinity, rate: 0.057 },
    ],
  },
  KY: { name: 'Kentucky', type: 'flat', rate: 0.0400, stdDeduction: 3160 },
  LA: {
    name: 'Louisiana', type: 'progressive', stdDeduction: 12500,
    brackets: [
      { min: 0, max: 12500, rate: 0.0185 },
      { min: 12500, max: 50000, rate: 0.0197 },
      { min: 50000, max: Infinity, rate: 0.0245 },
    ],
  },
  ME: {
    name: 'Maine', type: 'progressive', stdDeduction: 14700,
    brackets: [
      { min: 0, max: 24500, rate: 0.058 },
      { min: 24500, max: 114900, rate: 0.0675 },
      { min: 114900, max: Infinity, rate: 0.0715 },
    ],
  },
  MD: {
    name: 'Maryland', type: 'progressive', stdDeduction: 2750,
    brackets: [
      { min: 0, max: 1000, rate: 0.02 },
      { min: 1000, max: 2000, rate: 0.03 },
      { min: 2000, max: 3000, rate: 0.04 },
      { min: 3000, max: 100000, rate: 0.0475 },
      { min: 100000, max: 125000, rate: 0.05 },
      { min: 125000, max: 150000, rate: 0.0525 },
      { min: 150000, max: 250000, rate: 0.055 },
      { min: 250000, max: Infinity, rate: 0.0575 },
    ],
  },
  MA: { name: 'Massachusetts', type: 'flat', rate: 0.05, stdDeduction: 0 },
  MI: { name: 'Michigan', type: 'flat', rate: 0.0425, stdDeduction: 0 },
  MN: {
    name: 'Minnesota', type: 'progressive', stdDeduction: 14625,
    brackets: [
      { min: 0, max: 30540, rate: 0.0535 },
      { min: 30540, max: 101910, rate: 0.068 },
      { min: 101910, max: 195450, rate: 0.0785 },
      { min: 195450, max: Infinity, rate: 0.0985 },
    ],
  },
  MS: { name: 'Mississippi', type: 'flat', rate: 0.044, stdDeduction: 13850 },
  MO: {
    name: 'Missouri', type: 'progressive', stdDeduction: 14100,
    brackets: [
      { min: 0, max: 1323, rate: 0.0 },
      { min: 1323, max: 2646, rate: 0.02 },
      { min: 2646, max: 3969, rate: 0.025 },
      { min: 3969, max: 5292, rate: 0.03 },
      { min: 5292, max: 6615, rate: 0.035 },
      { min: 6615, max: 7938, rate: 0.04 },
      { min: 7938, max: 9261, rate: 0.045 },
      { min: 9261, max: Infinity, rate: 0.047 },
    ],
  },
  MT: { name: 'Montana', type: 'flat', rate: 0.059, stdDeduction: 0 },
  NE: {
    name: 'Nebraska', type: 'progressive', stdDeduction: 8000,
    brackets: [
      { min: 0, max: 4190, rate: 0.0251 },
      { min: 4190, max: 31430, rate: 0.0351 },
      { min: 31430, max: 50307, rate: 0.0501 },
      { min: 50307, max: Infinity, rate: 0.0584 },
    ],
  },
  NV: { name: 'Nevada', type: 'none' },
  NH: { name: 'New Hampshire', type: 'none' },
  NJ: {
    name: 'New Jersey', type: 'progressive', stdDeduction: 1000,
    brackets: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20000, max: 35000, rate: 0.0175 },
      { min: 35000, max: 40000, rate: 0.035 },
      { min: 40000, max: 75000, rate: 0.0553 },
      { min: 75000, max: 500000, rate: 0.0637 },
      { min: 500000, max: 1000000, rate: 0.0897 },
      { min: 1000000, max: Infinity, rate: 0.1075 },
    ],
  },
  NM: {
    name: 'New Mexico', type: 'progressive', stdDeduction: 13850,
    brackets: [
      { min: 0, max: 6000, rate: 0.017 },
      { min: 6000, max: 16000, rate: 0.032 },
      { min: 16000, max: 31500, rate: 0.047 },
      { min: 31500, max: Infinity, rate: 0.049 },
    ],
  },
  NY: {
    name: 'New York', type: 'progressive', stdDeduction: 8000,
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 80650, rate: 0.0585 },
      { min: 80650, max: 215400, rate: 0.0625 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: 5160000, rate: 0.0965 },
      { min: 5160000, max: 25000000, rate: 0.103 },
      { min: 25000000, max: Infinity, rate: 0.109 },
    ],
  },
  NC: { name: 'North Carolina', type: 'flat', rate: 0.045, stdDeduction: 12750 },
  ND: {
    name: 'North Dakota', type: 'progressive', stdDeduction: 15300,
    brackets: [
      { min: 0, max: 41775, rate: 0.0 },
      { min: 41775, max: 68375, rate: 0.0195 },
      { min: 68375, max: 149150, rate: 0.0250 },
      { min: 149150, max: 260900, rate: 0.0264 },
      { min: 260900, max: Infinity, rate: 0.0275 },
    ],
  },
  OH: {
    name: 'Ohio', type: 'progressive', stdDeduction: 0,
    brackets: [
      { min: 0, max: 26050, rate: 0.0 },
      { min: 26050, max: 46000, rate: 0.0285 },
      { min: 46000, max: 92150, rate: 0.0326 },
      { min: 92150, max: 115300, rate: 0.0369 },
      { min: 115300, max: 230550, rate: 0.0399 },
      { min: 230550, max: Infinity, rate: 0.0375 },
    ],
  },
  OK: {
    name: 'Oklahoma', type: 'progressive', stdDeduction: 6350,
    brackets: [
      { min: 0, max: 1000, rate: 0.005 },
      { min: 1000, max: 2500, rate: 0.01 },
      { min: 2500, max: 3750, rate: 0.02 },
      { min: 3750, max: 4900, rate: 0.03 },
      { min: 4900, max: 7200, rate: 0.04 },
      { min: 7200, max: Infinity, rate: 0.0475 },
    ],
  },
  OR: {
    name: 'Oregon', type: 'progressive', stdDeduction: 2930,
    brackets: [
      { min: 0, max: 4100, rate: 0.0475 },
      { min: 4100, max: 10200, rate: 0.0675 },
      { min: 10200, max: 125000, rate: 0.0875 },
      { min: 125000, max: Infinity, rate: 0.099 },
    ],
  },
  PA: { name: 'Pennsylvania', type: 'flat', rate: 0.0307, stdDeduction: 0 },
  RI: {
    name: 'Rhode Island', type: 'progressive', stdDeduction: 10950,
    brackets: [
      { min: 0, max: 73950, rate: 0.0375 },
      { min: 73950, max: 168250, rate: 0.0475 },
      { min: 168250, max: Infinity, rate: 0.0599 },
    ],
  },
  SC: {
    name: 'South Carolina', type: 'progressive', stdDeduction: 13850,
    brackets: [
      { min: 0, max: 3700, rate: 0.0 },
      { min: 3700, max: 16700, rate: 0.03 },
      { min: 16700, max: Infinity, rate: 0.064 },
    ],
  },
  SD: { name: 'South Dakota', type: 'none' },
  TN: { name: 'Tennessee', type: 'none' },
  TX: { name: 'Texas', type: 'none' },
  UT: { name: 'Utah', type: 'flat', rate: 0.0465, stdDeduction: 0 },
  VT: {
    name: 'Vermont', type: 'progressive', stdDeduction: 7050,
    brackets: [
      { min: 0, max: 47150, rate: 0.0335 },
      { min: 47150, max: 114850, rate: 0.066 },
      { min: 114850, max: 230650, rate: 0.076 },
      { min: 230650, max: Infinity, rate: 0.0875 },
    ],
  },
  VA: {
    name: 'Virginia', type: 'progressive', stdDeduction: 8950,
    brackets: [
      { min: 0, max: 3000, rate: 0.02 },
      { min: 3000, max: 5000, rate: 0.03 },
      { min: 5000, max: 17000, rate: 0.05 },
      { min: 17000, max: Infinity, rate: 0.0575 },
    ],
  },
  WA: { name: 'Washington', type: 'none' },
  WV: {
    name: 'West Virginia', type: 'progressive', stdDeduction: 0,
    brackets: [
      { min: 0, max: 10000, rate: 0.0 },
      { min: 10000, max: 25000, rate: 0.03 },
      { min: 25000, max: 40000, rate: 0.04 },
      { min: 40000, max: 60000, rate: 0.045 },
      { min: 60000, max: Infinity, rate: 0.0512 },
    ],
  },
  WI: {
    name: 'Wisconsin', type: 'progressive', stdDeduction: 13830,
    brackets: [
      { min: 0, max: 12920, rate: 0.0354 },
      { min: 12920, max: 25840, rate: 0.0465 },
      { min: 25840, max: 280950, rate: 0.053 },
      { min: 280950, max: Infinity, rate: 0.0765 },
    ],
  },
  WY: { name: 'Wyoming', type: 'none' },
};

interface StateTaxSnapshot {
  stateCode: string;
  grossIncome: number;
  stateTax: number;
  effectiveRate: number;
  afterTax: number;
  label: string;
}

function calculateStateTax(info: StateTaxInfo, gross: number): { tax: number; taxableIncome: number } {
  if (info.type === 'none') return { tax: 0, taxableIncome: 0 };
  const taxable = Math.max(0, gross - (info.stdDeduction || 0));
  if (info.type === 'flat') return { tax: taxable * (info.rate || 0), taxableIncome: taxable };
  // Progressive
  let tax = 0;
  for (const b of info.brackets || []) {
    if (taxable > b.min) {
      tax += (Math.min(taxable, b.max) - b.min) * b.rate;
    } else break;
  }
  return { tax, taxableIncome: taxable };
}

export default function StateTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState('');
  const [stateCode, setStateCode] = useState('CA');
  const [compareStateCode, setCompareStateCode] = useState('TX');
  const [payPeriod, setPayPeriod] = useState<'annual' | 'monthly' | 'biweekly'>('annual');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<StateTaxSnapshot | null>(null);
  const [compareB, setCompareB] = useState<StateTaxSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    grossIncome: string; stateCode: string;
  }>('state-tax-calculator');

  const gross = parseFloat(grossIncome) || 0;
  const info = STATES[stateCode];
  const compareInfo = STATES[compareStateCode];

  const result = useMemo(() => {
    if (gross <= 0) return null;
    const { tax, taxableIncome } = calculateStateTax(info, gross);
    const effectiveRate = gross > 0 ? tax / gross : 0;
    const compareRes = calculateStateTax(compareInfo, gross);
    const taxDiff = tax - compareRes.tax;
    return { 
      tax, 
      taxableIncome, 
      effectiveRate, 
      afterTax: gross - tax,
      compareTax: compareRes.tax,
      compareAfterTax: gross - compareRes.tax,
      taxDiff,
    };
  }, [gross, info, compareInfo]);

  const handleTryExample = () => {
    setGrossIncome('120000');
    setStateCode('CA');
    setCompareStateCode('TX');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (gross > 0 && result) {
      setCalculated(true);
      saveEntry(
        { grossIncome, stateCode },
        `${info.name} · ${formatCurrency(gross)} · State tax: ${formatCurrency(result.tax)}`,
      );
    }
  };

  const handleReset = () => { 
    setGrossIncome(''); 
    setStateCode('CA'); 
    setCompareStateCode('TX');
    setCalculated(false); 
  };
  
  const handleRestore = (i: { grossIncome: string; stateCode: string }) => {
    setGrossIncome(i.grossIncome); 
    setStateCode(i.stateCode); 
    setCalculated(true);
  };

  const snap = (): StateTaxSnapshot => result ? {
    stateCode,
    grossIncome: gross,
    stateTax: result.tax,
    effectiveRate: result.effectiveRate,
    afterTax: result.afterTax,
    label: `${info.name} · ${formatCurrency(gross)}`,
  } : null as unknown as StateTaxSnapshot;

  // Comparison data: tax in selected state vs comparison target state
  const comparisonData = useMemo(() => {
    if (!result) return [];
    return [
      { name: info.name, amount: result.tax, fill: '#0ea5e9' },
      { name: compareInfo.name, amount: result.compareTax, fill: result.compareTax === 0 ? '#10b981' : '#f59e0b' },
    ];
  }, [result, info, compareInfo]);

  const divisor = payPeriod === 'monthly' ? 12 : payPeriod === 'biweekly' ? 26 : 1;

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="st-gross" className="font-medium">Annual Gross Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input id="st-gross" type="number" step="1000" min="0" placeholder="95,000"
                value={grossIncome} onChange={(e) => { setGrossIncome(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
            <p className="text-[11px] text-muted-foreground">Total annual wages or taxable compensation.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="st-state" className="font-medium">Primary State (Residence/Work)</Label>
            <Select value={stateCode} onValueChange={(v) => { setStateCode(v); setCalculated(false); }}>
              <SelectTrigger id="st-state"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(STATES).map(([code, s]) => (
                  <SelectItem key={code} value={code}>
                    {s.name} {s.type === 'none' ? '(no income tax)' : s.type === 'flat' ? `· ${formatPercent((s.rate || 0) * 100)} flat` : '· progressive'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Applies 2026 state tax brackets &amp; standard deduction.</p>
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="st-compare-state" className="font-medium">Relocation / Comparison State</Label>
            <Select value={compareStateCode} onValueChange={(v) => { setCompareStateCode(v); setCalculated(false); }}>
              <SelectTrigger id="st-compare-state"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(STATES).map(([code, s]) => (
                  <SelectItem key={code} value={code}>
                    {s.name} {s.type === 'none' ? '(no income tax)' : s.type === 'flat' ? `· ${formatPercent((s.rate || 0) * 100)} flat` : '· progressive'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Benchmark against low-tax or no-tax states (e.g. TX, FL, WA).</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={gross <= 0}
              className="bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 text-white shadow-lg shadow-cyan-500/25 flex-1 sm:flex-none">
              Calculate State Tax
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && result && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{info.name} State Income Tax (2026)</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-cyan-600">{formatCurrency(result.tax / divisor)}</p>

                {/* Pay Period Toggle */}
                <div className="inline-flex items-center rounded-lg bg-background/80 border border-border/50 p-1 text-xs">
                  <span className="text-muted-foreground px-2">Show:</span>
                  {(['annual', 'monthly', 'biweekly'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
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
                    Take-home: {formatCurrency(result.afterTax / divisor)} {payPeriod !== 'annual' ? `/${payPeriod}` : ''}
                  </Badge>
                  <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-600 font-medium">
                    Effective Rate: {formatPercent(result.effectiveRate * 100)}
                  </Badge>
                  {stateCode !== compareStateCode && (
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600 font-medium">
                      vs {compareInfo.name}: {result.taxDiff > 0 ? `+${formatCurrency(result.taxDiff / divisor)} more tax` : `${formatCurrency(Math.abs(result.taxDiff) / divisor)} less tax`}
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
                  { label: 'Gross Annual Pay', value: formatCurrency(gross / divisor) },
                  { label: `${info.name} Tax`, value: formatCurrency(result.tax / divisor), color: 'text-cyan-600' },
                  { label: `${compareInfo.name} Tax`, value: formatCurrency(result.compareTax / divisor), color: 'text-amber-600' },
                  { label: 'Annual Relocation Diff', value: result.taxDiff === 0 ? '$0 (equal)' : `${formatCurrency(Math.abs(result.taxDiff))} /yr`, highlight: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center shadow-xs">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-base sm:text-lg font-bold ${m.highlight ? 'text-emerald-600' : (m.color || 'text-foreground')}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {info.type === 'progressive' && info.brackets && (
                <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
                  <div className="px-4 py-2 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>{info.name} Progressive Brackets (Single Filer)</span>
                    <span className="text-[11px] font-normal">State standard deduction: {info.stdDeduction ? formatCurrency(info.stdDeduction) : '$0'}</span>
                  </div>
                  <div className="divide-y divide-border/40">
                    <div className="grid grid-cols-4 gap-2 px-4 py-2 text-[11px] font-medium text-muted-foreground bg-muted/20">
                      <div>Rate</div>
                      <div>Bracket Range</div>
                      <div className="text-right">Taxable Tier</div>
                      <div className="text-right">State Tax</div>
                    </div>
                    {info.brackets.map((b, i) => {
                      const isInBracket = result.taxableIncome > b.min;
                      const incomeInBracket = isInBracket ? Math.min(result.taxableIncome, b.max) - b.min : 0;
                      const taxInBracket = incomeInBracket * b.rate;
                      return (
                        <div key={i} className={`grid grid-cols-4 gap-2 px-4 py-2 text-xs ${isInBracket ? '' : 'opacity-40'}`}>
                          <div className="font-semibold text-foreground">{formatPercent(b.rate * 100)}</div>
                          <div className="text-muted-foreground">{formatCurrency(b.min)} – {b.max === Infinity ? '∞' : formatCurrency(b.max)}</div>
                          <div className="text-right font-mono">{isInBracket ? formatCurrency(incomeInBracket) : '—'}</div>
                          <div className="text-right font-semibold font-mono text-cyan-600">{isInBracket ? formatCurrency(taxInBracket) : '—'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {comparisonData.length > 0 && (
                <div className="h-56 w-full bg-background/60 rounded-xl p-3 border border-border/40">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Annual State Tax Comparison: {info.name} vs. {compareInfo.name}</p>
                  <ResponsiveContainer width="100%" height="85%">
                    <RechartsBarChart data={comparisonData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                      <RechartsTooltip formatter={(v: number) => [formatCurrency(v), 'State Tax Liability']} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {comparisonData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="rounded-xl bg-muted/40 border border-border/40 p-4 text-xs space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <MapIcon className="size-4 text-cyan-600 shrink-0" />
                  State Tax &amp; Relocation Dynamics (2026)
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Nine U.S. states levy <strong>no personal wage income tax</strong>: Alaska, Florida, Nevada, New Hampshire (interest &amp; dividends only, expiring 2027), South Dakota, Tennessee, Texas, Washington, and Wyoming.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Local taxes warning:</strong> Certain jurisdictions impose additional local income or city wage taxes not reflected here — for example, New York City (3.078%–3.876%), Philadelphia (3.75%), and Maryland counties (2.25%–3.2%).
                </p>
                <div className="pt-1 text-[11px] text-muted-foreground">
                  For total paycheck net take-home modeling with federal income tax, FICA, and state tax, see our <a href="/calculators/federal-tax-calculator" className="text-cyan-600 underline font-medium hover:text-cyan-700">Federal Tax Calculator</a> and <a href="/calculators/w-2-calculator" className="text-cyan-600 underline font-medium hover:text-cyan-700">W-2 Paycheck Calculator</a>.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'State', valueA: STATES[compareA.stateCode].name, valueB: STATES[compareB.stateCode].name },
          { label: 'Gross Income', valueA: formatCurrency(compareA.grossIncome), valueB: formatCurrency(compareB.grossIncome), numA: compareA.grossIncome, numB: compareB.grossIncome },
          { label: 'State Tax', valueA: formatCurrency(compareA.stateTax), valueB: formatCurrency(compareB.stateTax), numA: compareA.stateTax, numB: compareB.stateTax },
          { label: 'Effective Rate', valueA: formatPercent(compareA.effectiveRate * 100), valueB: formatPercent(compareB.effectiveRate * 100), numA: compareA.effectiveRate * 100, numB: compareB.effectiveRate * 100 },
          { label: 'After State Tax', valueA: formatCurrency(compareA.afterTax), valueB: formatCurrency(compareB.afterTax), numA: compareA.afterTax, numB: compareB.afterTax },
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

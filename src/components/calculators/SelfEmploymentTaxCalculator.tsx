'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserCog, Calendar, DollarSign, Calculator, HelpCircle, ShieldCheck, ArrowRight, Receipt, Split } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

// 2026 SECA statutory constants
const SS_WAGE_BASE = 176100;
const SS_RATE_SE = 0.124; // 12.4% (employer 6.2% + employee 6.2%)
const MEDICARE_RATE_SE = 0.029; // 2.9% (employer 1.45% + employee 1.45%)
const ADD_MEDICARE_RATE = 0.009; // 0.9% additional Medicare
const ADD_MEDICARE_THRESHOLD_SINGLE = 200000;
const ADD_MEDICARE_THRESHOLD_MFJ = 250000;
const NET_SE_FACTOR = 0.9235; // IRC § 1402(a)(12): 92.35% (100% - 7.65%)

interface SESnapshot {
  netSE: number;
  secaTaxable: number;
  ssTax: number;
  medicareTax: number;
  additionalMedicare: number;
  totalSECA: number;
  deductionHalf: number;
  label: string;
}

export default function SelfEmploymentTaxCalculator() {
  const [calculationMode, setCalculationMode] = useState<'net' | 'gross'>('net');
  const [netSEIncome, setNetSEIncome] = useState('80000');
  const [grossRevenue, setGrossRevenue] = useState('110000');
  const [businessExpenses, setBusinessExpenses] = useState('30000');
  const [w2Wages, setW2Wages] = useState('0'); // W-2 wages that already used Social Security base
  const [filingStatus, setFilingStatus] = useState<'single' | 'mfj'>('single');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<SESnapshot | null>(null);
  const [compareB, setCompareB] = useState<SESnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    mode: string;
    netSEIncome: string;
    grossRevenue: string;
    businessExpenses: string;
    w2Wages: string;
    filingStatus: string;
  }>('self-employment-tax-calculator');

  // Compute effective Net SE income based on mode
  const effectiveNetSE = useMemo(() => {
    if (calculationMode === 'net') {
      return parseFloat(netSEIncome) || 0;
    } else {
      const gross = parseFloat(grossRevenue) || 0;
      const exp = parseFloat(businessExpenses) || 0;
      return Math.max(0, gross - exp);
    }
  }, [calculationMode, netSEIncome, grossRevenue, businessExpenses]);

  const existingW2 = parseFloat(w2Wages) || 0;

  const result = useMemo(() => {
    if (effectiveNetSE < 400) {
      return {
        underThreshold: true,
        secaTaxable: 0,
        ssWages: 0,
        remainingSSCap: Math.max(0, SS_WAGE_BASE - existingW2),
        ssTax: 0,
        medicareTax: 0,
        additionalMedicare: 0,
        totalSECA: 0,
        deductionHalf: 0,
        effectiveRate: 0,
        quarterlyPayment: 0,
        equivalentW2Fica: 0,
        extraEmployerHalfPaid: 0,
      };
    }

    // IRC § 1402(a)(12): Schedule SE net earnings subject to SECA
    const secaTaxable = effectiveNetSE * NET_SE_FACTOR;

    // Remaining Social Security cap after existing W-2 employment
    const remainingSSCap = Math.max(0, SS_WAGE_BASE - existingW2);
    const ssWages = Math.min(secaTaxable, remainingSSCap);
    const ssTax = ssWages * SS_RATE_SE;

    // Medicare is uncapped (2.9%)
    const medicareTax = secaTaxable * MEDICARE_RATE_SE;

    // Additional Medicare Tax (0.9%) threshold based on filing status
    const addMedThreshold = filingStatus === 'mfj' ? ADD_MEDICARE_THRESHOLD_MFJ : ADD_MEDICARE_THRESHOLD_SINGLE;
    const combinedIncomeForMedicare = existingW2 + secaTaxable;
    const additionalMedicare = combinedIncomeForMedicare > addMedThreshold
      ? Math.max(0, Math.min(secaTaxable, combinedIncomeForMedicare - addMedThreshold)) * ADD_MEDICARE_RATE
      : 0;

    const totalSECA = ssTax + medicareTax + additionalMedicare;
    const deductionHalf = totalSECA / 2;
    const effectiveRate = effectiveNetSE > 0 ? totalSECA / effectiveNetSE : 0;
    const quarterlyPayment = totalSECA / 4;

    // Comparison with W-2 employee: employee would pay 7.65% FICA on wage equivalent
    const equivalentW2Fica = (Math.min(effectiveNetSE, remainingSSCap) * 0.062) + (effectiveNetSE * 0.0145);
    const extraEmployerHalfPaid = Math.max(0, totalSECA - equivalentW2Fica);

    return {
      underThreshold: false,
      secaTaxable,
      ssWages,
      remainingSSCap,
      ssTax,
      medicareTax,
      additionalMedicare,
      totalSECA,
      deductionHalf,
      effectiveRate,
      quarterlyPayment,
      equivalentW2Fica,
      extraEmployerHalfPaid,
    };
  }, [effectiveNetSE, existingW2, filingStatus]);

  const handleTryExample = () => {
    setCalculationMode('gross');
    setGrossRevenue('120000');
    setBusinessExpenses('35000');
    setW2Wages('0');
    setFilingStatus('single');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (effectiveNetSE > 0 && result) {
      setCalculated(true);
      saveEntry(
        {
          mode: calculationMode,
          netSEIncome: effectiveNetSE.toString(),
          grossRevenue,
          businessExpenses,
          w2Wages,
          filingStatus,
        },
        `Net SE ${formatCurrency(effectiveNetSE)} · SECA ${formatCurrency(result.totalSECA)} · Qtrly ${formatCurrency(result.quarterlyPayment)}`,
      );
    }
  };

  const handleReset = () => {
    setNetSEIncome('');
    setGrossRevenue('');
    setBusinessExpenses('');
    setW2Wages('0');
    setCalculated(false);
  };

  const handleRestore = (i: {
    mode?: string;
    netSEIncome: string;
    grossRevenue?: string;
    businessExpenses?: string;
    w2Wages?: string;
    filingStatus?: string;
  }) => {
    if (i.mode === 'gross') {
      setCalculationMode('gross');
      setGrossRevenue(i.grossRevenue || '0');
      setBusinessExpenses(i.businessExpenses || '0');
    } else {
      setCalculationMode('net');
      setNetSEIncome(i.netSEIncome);
    }
    setW2Wages(i.w2Wages || '0');
    if (i.filingStatus === 'mfj' || i.filingStatus === 'single') {
      setFilingStatus(i.filingStatus);
    }
    setCalculated(true);
  };

  const snap = (): SESnapshot => result ? {
    netSE: effectiveNetSE,
    secaTaxable: result.secaTaxable,
    ssTax: result.ssTax,
    medicareTax: result.medicareTax,
    additionalMedicare: result.additionalMedicare,
    totalSECA: result.totalSECA,
    deductionHalf: result.deductionHalf,
    label: `Net SE: ${formatCurrency(effectiveNetSE)}`,
  } : null as unknown as SESnapshot;

  const chartData = result && !result.underThreshold ? [
    { name: 'Social Security (12.4%)', amount: result.ssTax, fill: '#3b82f6' },
    { name: 'Medicare (2.9%)', amount: result.medicareTax, fill: '#10b981' },
    ...(result.additionalMedicare > 0 ? [{ name: 'Add. Medicare (0.9%)', amount: result.additionalMedicare, fill: '#f43f5e' }] : []),
  ] : [];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Statutory Context Banner */}
        <div className="flex items-start gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
          <UserCog className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">
              2026 IRS Self-Employment Tax (SECA) Rules
            </p>
            <p>
              SECA tax (IRC § 1401) equals <strong>15.3%</strong> total (12.4% Social Security capped at <strong>{formatCurrency(SS_WAGE_BASE)}</strong> + 2.9% uncapped Medicare).
              Per IRC § 1402(a)(12), tax applies only to <strong>92.35%</strong> of net profit, and you deduct 50% above-the-line on Form 1040 Schedule 1.
            </p>
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => { setCalculationMode('net'); setCalculated(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs border transition-all ${
                calculationMode === 'net'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-background hover:bg-muted text-muted-foreground border-border'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Direct Net Profit (Schedule C, Line 31)</span>
            </button>
            <button
              type="button"
              onClick={() => { setCalculationMode('gross'); setCalculated(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs border transition-all ${
                calculationMode === 'gross'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-background hover:bg-muted text-muted-foreground border-border'
              }`}
            >
              <Split className="w-4 h-4" />
              <span>Gross 1099 Revenue Minus Expenses</span>
            </button>
          </div>

          {/* Form Inputs based on Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {calculationMode === 'net' ? (
              <div className="space-y-2 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="se-income" className="font-semibold text-sm">Net Self-Employment Profit</Label>
                  <span className="text-[11px] text-muted-foreground">IRS Form 1040 Schedule C, Line 31</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                  <Input
                    id="se-income"
                    type="number"
                    step="500"
                    min="0"
                    placeholder="80,000"
                    value={netSEIncome}
                    onChange={(e) => { setNetSEIncome(e.target.value); setCalculated(false); }}
                    className="pl-7 text-base font-semibold"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your bottom-line profit after subtracting all deductible business expenses, software, travel, and supplies.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gross-rev" className="font-semibold text-sm">Gross 1099 / Business Revenue</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                    <Input
                      id="gross-rev"
                      type="number"
                      step="1000"
                      min="0"
                      placeholder="110,000"
                      value={grossRevenue}
                      onChange={(e) => { setGrossRevenue(e.target.value); setCalculated(false); }}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Total billings or payments received before any deductions.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-exp" className="font-semibold text-sm">Deductible Business Expenses</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                    <Input
                      id="biz-exp"
                      type="number"
                      step="500"
                      min="0"
                      placeholder="30,000"
                      value={businessExpenses}
                      onChange={(e) => { setBusinessExpenses(e.target.value); setCalculated(false); }}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Mileage, home office, subcontractors, tools, advertising.</p>
                </div>

                <div className="sm:col-span-2 rounded-lg bg-muted/40 border border-border/60 p-3 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Calculated Net Schedule C Profit:</span>
                  <span className="font-bold text-sm text-foreground">{formatCurrency(effectiveNetSE)}</span>
                </div>
              </>
            )}

            {/* Optional W-2 Wages offset (Social Security Cap Coordination) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="w2-wages" className="text-xs font-semibold">W-2 Wages (Day Job, if any)</Label>
                <div title="If you work a W-2 job concurrently, FICA taxes already paid reduce your remaining 2026 $176,100 Social Security cap on self-employment earnings.">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="w2-wages"
                  type="number"
                  step="1000"
                  min="0"
                  placeholder="0"
                  value={w2Wages}
                  onChange={(e) => { setW2Wages(e.target.value); setCalculated(false); }}
                  className="pl-7"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Reduces the $176,100 Social Security wage cap dollar-for-dollar.
              </p>
            </div>

            {/* Filing Status (for Additional Medicare Tax threshold) */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Filing Status (Additional Medicare)</Label>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => { setFilingStatus('single'); setCalculated(false); }}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    filingStatus === 'single'
                      ? 'bg-blue-600/10 border-blue-600 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'bg-background hover:bg-muted text-muted-foreground border-border'
                  }`}
                >
                  Single / HoH ($200k)
                </button>
                <button
                  type="button"
                  onClick={() => { setFilingStatus('mfj'); setCalculated(false); }}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    filingStatus === 'mfj'
                      ? 'bg-blue-600/10 border-blue-600 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'bg-background hover:bg-muted text-muted-foreground border-border'
                  }`}
                >
                  Married Joint ($250k)
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">0.9% Additional Medicare surtax threshold.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={effectiveNetSE <= 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none font-medium"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate SECA Tax
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {/* Calculated Results Display */}
        {calculated && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="result-display mt-2"
            aria-live="polite"
          >
            {result.underThreshold ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-amber-600 mx-auto" />
                <h3 className="text-base font-bold text-amber-800 dark:text-amber-200">No Self-Employment Tax Owed</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Per IRS guidelines under IRC § 1402(b)(2), you do not owe self-employment tax if net earnings are less than <strong>$400</strong> for the entire tax year. You may still owe ordinary income tax if your total combined income exceeds filing thresholds.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-6 space-y-6">
                {/* Hero KPI Card */}
                <div className="text-center space-y-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Total 2026 Self-Employment Tax (SECA)
                  </p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-blue-600 tracking-tight">
                    {formatCurrency(result.totalSECA)}
                  </p>
                  <div className="flex justify-center items-center gap-2 flex-wrap pt-1">
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-medium">
                      Effective Rate: {formatPercent(result.effectiveRate * 100)} of Net Profit
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium">
                      50% Above-the-Line Deduction: {formatCurrency(result.deductionHalf)}
                    </Badge>
                  </div>
                  <div className="flex justify-center gap-2 pt-3">
                    <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2.5 border-primary/30 bg-primary/5 text-primary">
                      {compareA ? '↺ Update Scenario A' : '+ Save Scenario A'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2.5 border-amber-500/30 bg-amber-500/5 text-amber-600">
                      {compareB ? '↺ Update Scenario B' : '+ Save Scenario B'}
                    </Button>
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground font-medium mb-1">Net SE Profit</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(effectiveNetSE)}</p>
                    <p className="text-[10px] text-muted-foreground">Schedule C, Line 31</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground font-medium mb-1">SECA Taxable (92.35%)</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(result.secaTaxable)}</p>
                    <p className="text-[10px] text-muted-foreground">IRC § 1402(a)(12)</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground font-medium mb-1">Social Security (12.4%)</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(result.ssTax)}</p>
                    <p className="text-[10px] text-muted-foreground">Cap: {formatCurrency(SS_WAGE_BASE)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground font-medium mb-1">Medicare (2.9%+)</p>
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(result.medicareTax + result.additionalMedicare)}</p>
                    <p className="text-[10px] text-muted-foreground">Uncapped base</p>
                  </div>
                </div>

                {/* Form 1040-ES Quarterly Estimated Tax Schedule Cards */}
                <div className="rounded-xl border border-blue-500/20 bg-background/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        IRS Form 1040-ES Quarterly Payment Schedule
                      </h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {formatCurrency(result.quarterlyPayment)} / quarter
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Self-employed professionals pay SECA tax through four equal installments to avoid IRS Form 2210 underpayment penalties:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {[
                      { period: 'Q1 Payment', due: 'April 15, 2026', desc: 'Earnings Jan 1 – Mar 31' },
                      { period: 'Q2 Payment', due: 'June 15, 2026', desc: 'Earnings Apr 1 – May 31' },
                      { period: 'Q3 Payment', due: 'September 15, 2026', desc: 'Earnings Jun 1 – Aug 31' },
                      { period: 'Q4 Payment', due: 'January 15, 2027', desc: 'Earnings Sep 1 – Dec 31' },
                    ].map((q, idx) => (
                      <div key={idx} className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-2.5 text-center">
                        <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300">{q.period}</p>
                        <p className="text-xs font-semibold text-foreground mt-0.5">{formatCurrency(result.quarterlyPayment)}</p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1">Due {q.due}</p>
                        <p className="text-[9px] text-muted-foreground">{q.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itemized Calculation & W-2 Parity Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Detailed Math Breakdown */}
                  <div className="rounded-xl border border-border/70 bg-background p-4 space-y-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-foreground pb-1 border-b border-border/50">
                      <Receipt className="w-3.5 h-3.5 text-blue-600" />
                      <span>Statutory SECA Schedule Breakdown</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net SE Earnings:</span>
                      <span className="font-semibold">{formatCurrency(effectiveNetSE)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Statutory Factor (IRC § 1402(a)(12)):</span>
                      <span className="font-semibold font-mono">x 92.35%</span>
                    </div>
                    <div className="flex justify-between border-t border-border/40 pt-1">
                      <span className="text-muted-foreground">Net Taxable for SECA:</span>
                      <span className="font-semibold text-foreground">{formatCurrency(result.secaTaxable)}</span>
                    </div>
                    {existingW2 > 0 && (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400 text-[11px]">
                        <span>Prior W-2 Wages offset:</span>
                        <span>- {formatCurrency(existingW2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SS Taxable (Capped at {formatCurrency(result.remainingSSCap)}):</span>
                      <span className="font-semibold">{formatCurrency(result.ssWages)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social Security (12.4%):</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(result.ssTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medicare (2.9% uncapped):</span>
                      <span className="font-semibold text-emerald-600">{formatCurrency(result.medicareTax)}</span>
                    </div>
                    {result.additionalMedicare > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>Additional Medicare (0.9% over {formatCurrency(filingStatus === 'mfj' ? ADD_MEDICARE_THRESHOLD_MFJ : ADD_MEDICARE_THRESHOLD_SINGLE)}):</span>
                        <span className="font-semibold">{formatCurrency(result.additionalMedicare)}</span>
                      </div>
                    )}
                    <div className="border-t border-border/60 pt-2 flex justify-between font-bold text-sm">
                      <span>Total Annual SECA Tax:</span>
                      <span className="text-blue-600">{formatCurrency(result.totalSECA)}</span>
                    </div>
                    <div className="border-t border-border/40 pt-1.5 flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                      <span>50% Above-the-Line Deduction (Sched 1):</span>
                      <span>- {formatCurrency(result.deductionHalf)}</span>
                    </div>
                  </div>

                  {/* 1099 vs W-2 FICA Parity Card */}
                  <div className="rounded-xl border border-border/70 bg-background p-4 space-y-2.5 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-foreground pb-1 border-b border-border/50">
                        <UserCog className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Self-Employed vs. W-2 Employee Parity</span>
                      </div>
                      <div className="mt-2.5 space-y-2 text-muted-foreground leading-relaxed">
                        <p>
                          A regular W-2 employee only sees <strong>7.65%</strong> deducted from their paycheck because their employer pays the matching <strong>7.65%</strong> behind the scenes.
                        </p>
                        <div className="bg-muted/40 rounded-lg p-2.5 space-y-1.5 text-[11px]">
                          <div className="flex justify-between">
                            <span>W-2 Employee FICA equivalent (7.65%):</span>
                            <span className="font-semibold text-foreground">{formatCurrency(result.equivalentW2Fica)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Employer half you pay as contractor:</span>
                            <span className="font-semibold text-amber-600">+{formatCurrency(result.extraEmployerHalfPaid)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t border-border/50 pt-1">
                            <span>Your total SECA tax burden:</span>
                            <span className="text-foreground">{formatCurrency(result.totalSECA)}</span>
                          </div>
                        </div>
                        <p className="text-[11px]">
                          💡 To compensate for the employer half, the IRS grants an <strong>above-the-line deduction</strong> of {formatCurrency(result.deductionHalf)}, reducing your federal adjusted gross income dollar-for-dollar.
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>Considering an S-Corp election?</span>
                      <a href="/calculators/contractor-vs-employee-calculator" className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium">
                        Compare Entities <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Recharts Tax Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tax Liability Composition
                  </h4>
                  <div className="h-48 w-full bg-background/50 rounded-xl p-2 border border-border/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 11 }} />
                        <RechartsTooltip
                          formatter={(v: number) => [formatCurrency(v), 'Tax Amount']}
                          contentStyle={{ borderRadius: '8px', border: 'none', background: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                        />
                        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                          {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Contextual guidance */}
                <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-xs text-muted-foreground space-y-1">
                  <p>
                    📌 <strong>Tax Filing Reminder:</strong> SECA tax is reported on <strong>Schedule SE (Form 1040)</strong>. It is paid in addition to regular federal and state income taxes. Half of your SECA tax ({formatCurrency(result.deductionHalf)}) is deducted on <strong>Schedule 1 (Form 1040), line 15</strong> before calculating your AGI.
                  </p>
                  <p>
                    For your complete after-tax income, deductions, and state tax, see our <a href="/calculators/1099-calculator" className="text-blue-600 hover:underline font-medium">1099 Tax Calculator</a> or explore our <a href="/calculators/fica-tax-calculator" className="text-blue-600 hover:underline font-medium">W-2 FICA Calculator</a>.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Comparison Drawer */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Net SE Income', valueA: formatCurrency(compareA.netSE), valueB: formatCurrency(compareB.netSE), numA: compareA.netSE, numB: compareB.netSE },
          { label: 'SECA Taxable (92.35%)', valueA: formatCurrency(compareA.secaTaxable), valueB: formatCurrency(compareB.secaTaxable), numA: compareA.secaTaxable, numB: compareB.secaTaxable },
          { label: 'Social Security (12.4%)', valueA: formatCurrency(compareA.ssTax), valueB: formatCurrency(compareB.ssTax), numA: compareA.ssTax, numB: compareB.ssTax },
          { label: 'Medicare (2.9%)', valueA: formatCurrency(compareA.medicareTax), valueB: formatCurrency(compareB.medicareTax), numA: compareA.medicareTax, numB: compareB.medicareTax },
          ...(compareA.additionalMedicare > 0 || compareB.additionalMedicare > 0 ? [{
            label: 'Add. Medicare (0.9%)',
            valueA: formatCurrency(compareA.additionalMedicare),
            valueB: formatCurrency(compareB.additionalMedicare),
            numA: compareA.additionalMedicare,
            numB: compareB.additionalMedicare,
          }] : []),
          { label: 'Total SECA Tax', valueA: formatCurrency(compareA.totalSECA), valueB: formatCurrency(compareB.totalSECA), numA: compareA.totalSECA, numB: compareB.totalSECA },
          { label: '50% Above-the-Line Deduction', valueA: formatCurrency(compareA.deductionHalf), valueB: formatCurrency(compareB.deductionHalf), numA: compareA.deductionHalf, numB: compareB.deductionHalf },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel
              rows={rows}
              labelA={compareA.label}
              labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }}
            />
          </div>
        );
      })()}

      <CalcHistoryPanel
        history={history}
        onRestore={handleRestore}
        onClear={clearHistory}
        onDelete={deleteEntry}
      />
    </div>
  );
}

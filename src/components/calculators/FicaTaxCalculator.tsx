'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

const SS_WAGE_BASE_2025 = 176100;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADD_MEDICARE_RATE = 0.009;
const ADD_MEDICARE_THRESHOLD = 200000;

interface FicaSnapshot { gross: number; employeeSS: number; employeeMedicare: number; additionalMedicare: number; totalEmployee: number; selfEmployed: boolean; label: string; }

export default function FicaTaxCalculator() {
  const [grossWages, setGrossWages] = useState('');
  const [selfEmployed, setSelfEmployed] = useState('employee');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<FicaSnapshot | null>(null);
  const [compareB, setCompareB] = useState<FicaSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ grossWages: string; selfEmployed: string }>('fica-tax');

  const gross = parseFloat(grossWages) || 0;
  const isSE = selfEmployed === 'self-employed';

  const result = useMemo(() => {
    if (gross <= 0) return null;
    const ssWages = Math.min(gross, SS_WAGE_BASE_2025);
    const empSS = ssWages * SS_RATE;
    const empMedicare = gross * MEDICARE_RATE;
    const addMedicare = gross > ADD_MEDICARE_THRESHOLD ? (gross - ADD_MEDICARE_THRESHOLD) * ADD_MEDICARE_RATE : 0;
    const empTotal = empSS + empMedicare + addMedicare;
    const erSS = ssWages * SS_RATE;
    const erMedicare = gross * MEDICARE_RATE;
    const erTotal = erSS + erMedicare;
    const seTotal = isSE ? (empTotal + erTotal) : 0;
    const seDeduction = isSE ? seTotal / 2 : 0;
    return { empSS, empMedicare, addMedicare, empTotal, erSS, erMedicare, erTotal, seTotal, seDeduction, ssWages };
  }, [gross, isSE]);

  const handleCalculate = () => {
    if (gross > 0 && result) {
      setCalculated(true);
      const label = isSE ? 'Self-Employed' : 'Employee';
      saveEntry({ grossWages, selfEmployed }, `${label} · ${formatCurrency(gross)} gross · FICA: ${formatCurrency(isSE ? result.seTotal : result.empTotal)}`);
    }
  };
  const handleReset = () => { setGrossWages(''); setSelfEmployed('employee'); setCalculated(false); };
  const handleRestore = (i: { grossWages: string; selfEmployed: string }) => {
    setGrossWages(i.grossWages); setSelfEmployed(i.selfEmployed); setCalculated(true);
  };

  const snap = (): FicaSnapshot => ({
    gross, employeeSS: result!.empSS, employeeMedicare: result!.empMedicare,
    additionalMedicare: result!.addMedicare, totalEmployee: isSE ? result!.seTotal : result!.empTotal,
    selfEmployed: isSE, label: `${formatCurrency(gross)} (${isSE ? 'Self-Emp.' : 'Employee'})`
  });

  const chartData = result ? [
    { period: 'Social Security', employee: result.empSS, employer: isSE ? result.erSS : result.erSS },
    { period: 'Medicare', employee: result.empMedicare, employer: isSE ? result.erMedicare : result.erMedicare },
    ...(result.addMedicare > 0 ? [{ period: 'Add. Medicare', employee: result.addMedicare, employer: 0 }] : []),
  ] : [];

  return (
    <CalculatorLayout
      title="FICA Tax Calculator"
      description="Calculate Social Security and Medicare FICA taxes for employees and self-employed workers. See employer/employee splits and 2025 wage base limits."
      icon={<Landmark className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'FICA Tax Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={[
        'Enter your annual gross wages or salary — this is your total compensation before any deductions.',
        'Select whether you are an employee or self-employed — self-employed individuals pay both the employee and employer share of FICA taxes.',
        'Click Calculate to see your Social Security tax, Medicare tax, Additional Medicare tax (if applicable), and total FICA withholding.',
        'Review the employer vs employee share breakdown and see how the 2025 Social Security wage base ($176,100) affects your liability.',
      ]}
      formula={'Social Security Tax = min(Gross, $176,100) × 6.2%\nMedicare Tax = Gross × 1.45%\nAdditional Medicare = (Gross − $200,000) × 0.9% (if applicable)\nSelf-Employment Tax = (Employee Share + Employer Share) × 0.9235'}
      formulaDescription="FICA stands for the Federal Insurance Contributions Act. It funds Social Security and Medicare. Employees pay 6.2% SS + 1.45% Medicare = 7.65% total, and employers match this amount. Self-employed workers pay the full 15.3% but deduct half as a business expense."
      workedExamples={[
        { title: 'Standard Employee ($75,000)', description: 'An employee earning $75,000 pays: SS = $75,000 × 6.2% = $4,650. Medicare = $75,000 × 1.45% = $1,087.50. Total FICA: $5,737.50. Employer pays an equal $5,737.50.' },
        { title: 'High Earner ($250,000)', description: 'At $250,000, SS is capped at $176,100 × 6.2% = $10,918.20. Medicare = $250,000 × 1.45% = $3,625. Additional Medicare = ($250,000 − $200,000) × 0.9% = $450. Total employee FICA: $14,993.20.' },
        { title: 'Self-Employed ($80,000)', description: 'A self-employed individual at $80,000 pays the full 15.3%: SS = $4,960, Medicare = $1,160. Total SE tax = $12,240. They can deduct $6,120 (50%) as a business expense on Schedule SE.' },
      ]}
      faqs={[
        { question: 'What is FICA tax?', answer: 'FICA (Federal Insurance Contributions Act) funds Social Security and Medicare. Employees pay 6.2% for Social Security (up to the $176,100 wage base in 2025) and 1.45% for Medicare. Employers match both amounts. Self-employed people pay the combined 15.3%.' },
        { question: 'What is the 2025 Social Security wage base?', answer: 'The 2025 Social Security wage base is $176,100. Wages above this amount are not subject to the 6.2% Social Security tax. However, all wages are subject to the 1.45% Medicare tax with no income cap.' },
        { question: 'What is the Additional Medicare Tax?', answer: 'The Additional Medicare Tax of 0.9% applies to wages, compensation, and self-employment income over $200,000 for single filers ($250,000 for married filing jointly). Only employees pay this — there is no employer match. Employers must withhold it once wages exceed $200,000.' },
        { question: 'How do self-employed workers handle FICA?', answer: 'Self-employed workers pay self-employment (SE) tax, which covers both the employee and employer portions (15.3% total). However, SE tax is calculated on 92.35% of net earnings (not 100%), and you can deduct 50% of the SE tax paid from your gross income on your tax return.' },
      ]}
      relatedTools={[
        { slug: 'payroll', title: 'Payroll Calculator', description: 'Full paycheck after all deductions', icon: 'CreditCard' },
        { slug: 'tax-bracket', title: 'Tax Bracket Calculator', description: 'Federal income tax bracket analysis', icon: 'FileText' },
        { slug: 'after-tax-income', title: 'After-Tax Income', description: 'Net income after all taxes', icon: 'Wallet' },
        { slug: 'payroll-deduction', title: 'Payroll Deduction Calculator', description: 'Detailed paycheck deductions', icon: 'FileMinus' },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gross-wages">Annual Gross Wages</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="gross-wages" type="number" step="1000" min="0" placeholder="75,000"
                value={grossWages} onChange={(e) => { setGrossWages(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment-type">Employment Type</Label>
            <Select value={selfEmployed} onValueChange={(v) => { setSelfEmployed(v); setCalculated(false); }}>
              <SelectTrigger id="employment-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">W-2 Employee</SelectItem>
                <SelectItem value="self-employed">Self-Employed / 1099</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Self-employed pay both shares (15.3% total)</p>
          </div>
        </div>

        {/* 2025 Rate Reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-muted/30 border border-border/30 p-4">
          {[
            { label: 'Social Security', value: '6.2%', note: 'Up to $176,100' },
            { label: 'Medicare', value: '1.45%', note: 'No income cap' },
            { label: 'Add. Medicare', value: '0.9%', note: 'Over $200,000' },
            { label: 'Employer Match', value: '7.65%', note: 'SS + Medicare' },
          ].map((r) => (
            <div key={r.label} className="text-center">
              <p className="text-xs text-muted-foreground">{r.label}</p>
              <p className="text-lg font-bold text-primary">{r.value}</p>
              <p className="text-[10px] text-muted-foreground">{r.note}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleCalculate} disabled={gross <= 0}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-600/25 flex-1 sm:flex-none">
            Calculate FICA Tax
          </Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>

        {calculated && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="result-display" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {isSE ? 'Total Self-Employment Tax' : 'Total Employee FICA Tax'}
                </p>
                <p className="text-4xl font-bold text-blue-600">{formatCurrency(isSE ? result.seTotal : result.empTotal)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">
                    {formatPercent(isSE ? 15.3 : 7.65)} of gross
                  </Badge>
                  {isSE && (
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
                      Deduct {formatCurrency(result.seDeduction)} (50%)
                    </Badge>
                  )}
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Social Security Tax', value: formatCurrency(result.empSS), note: `On ${formatCurrency(result.ssWages)} wages` },
                  { label: 'Medicare Tax', value: formatCurrency(result.empMedicare), note: '1.45% on all wages' },
                  ...(result.addMedicare > 0 ? [{ label: 'Add. Medicare Tax', value: formatCurrency(result.addMedicare), note: '0.9% over $200k' }] : []),
                  { label: isSE ? 'Employer Share (you)' : 'Employer Matches', value: formatCurrency(result.erTotal), note: 'SS + Medicare' },
                  { label: 'Combined FICA', value: formatCurrency(result.empTotal + result.erTotal), note: 'Employee + Employer' },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{m.note}</p>
                  </div>
                ))}
              </div>

              {chartData.length > 0 && (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 11 }} />
                      <RechartsTooltip formatter={(v: number) => [formatCurrency(v)]} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                      <Legend />
                      <Bar dataKey="employee" name="Employee" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="employer" name={isSE ? 'Your Employer Share' : 'Employer Match'} fill="#10b981" radius={[2, 2, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {gross > SS_WAGE_BASE_2025 && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-700 dark:text-amber-300">
                  ⚠️ Your wages exceed the 2025 Social Security wage base of <strong>{formatCurrency(SS_WAGE_BASE_2025)}</strong>. Only wages up to this limit are subject to the 6.2% SS tax. All wages remain subject to Medicare taxes.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Wages', valueA: formatCurrency(compareA.gross), valueB: formatCurrency(compareB.gross), numA: compareA.gross, numB: compareB.gross },
          { label: 'Social Security Tax', valueA: formatCurrency(compareA.employeeSS), valueB: formatCurrency(compareB.employeeSS), numA: compareA.employeeSS, numB: compareB.employeeSS, higherIsBetter: false },
          { label: 'Medicare Tax', valueA: formatCurrency(compareA.employeeMedicare), valueB: formatCurrency(compareB.employeeMedicare), numA: compareA.employeeMedicare, numB: compareB.employeeMedicare, higherIsBetter: false },
          { label: 'Total FICA', valueA: formatCurrency(compareA.totalEmployee), valueB: formatCurrency(compareB.totalEmployee), numA: compareA.totalEmployee, numB: compareB.totalEmployee, higherIsBetter: false },
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
    </CalculatorLayout>
  );
}

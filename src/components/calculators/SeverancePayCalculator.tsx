'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserMinus } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface SevSnap { salary: number; years: number; totalWeeks: number; totalPay: number; label: string; }

export default function SeverancePayCalculator() {
  const [annualSalary, setAnnualSalary] = useState('');
  const [yearsService, setYearsService] = useState('');
  const [weeksPerYear, setWeeksPerYear] = useState('2');
  const [capWeeks, setCapWeeks] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<SevSnap | null>(null);
  const [compareB, setCompareB] = useState<SevSnap | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualSalary: string; yearsService: string; weeksPerYear: string; capWeeks: string }>('severance-pay-calculator');

  const salaryNum = parseFloat(annualSalary) || 0;
  const yearsNum = parseFloat(yearsService) || 0;
  const weeksNum = parseFloat(weeksPerYear) || 2;
  const capNum = parseFloat(capWeeks) || Infinity;
  const weeklyRate = salaryNum / 52;
  const rawWeeks = yearsNum * weeksNum;
  const totalWeeks = capNum < Infinity ? Math.min(rawWeeks, capNum) : rawWeeks;
  const totalPay = weeklyRate * totalWeeks;
  const monthlyEquivalent = totalPay / (totalWeeks / 4.33);
  const estNetPay = totalPay * 0.72; // rough 28% effective tax estimate

  const handleCalculate = () => {
    if (salaryNum > 0 && yearsNum > 0) {
      setCalculated(true);
      saveEntry({ annualSalary, yearsService, weeksPerYear, capWeeks }, `${yearsNum}yr · ${totalWeeks}wks · Severance: ${formatCurrency(totalPay)}`);
    }
  };
  const handleReset = () => { setAnnualSalary(''); setYearsService(''); setWeeksPerYear('2'); setCapWeeks(''); setCalculated(false); };
  const handleRestore = (i: { annualSalary: string; yearsService: string; weeksPerYear: string; capWeeks: string }) => {
    setAnnualSalary(i.annualSalary); setYearsService(i.yearsService); setWeeksPerYear(i.weeksPerYear); setCapWeeks(i.capWeeks); setCalculated(true);
  };
  const snap = (): SevSnap => ({ salary: salaryNum, years: yearsNum, totalWeeks, totalPay, label: `${yearsNum}yr · ${weeksNum}wk/yr` });

  const chartData = [
    { name: 'Severance Pay', amount: totalPay, fill: '#6366f1' },
    { name: 'Est. Take-Home', amount: estNetPay, fill: '#10b981' },
    { name: 'Est. Tax', amount: totalPay - estNetPay, fill: '#f59e0b' },
  ];

  return (
    <CalculatorLayout
      title="Severance Pay Calculator"
      description="Calculate your total severance package based on years of service and salary. See total severance weeks, gross pay, and monthly equivalent."
      icon={<UserMinus className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Severance Pay Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={[
        'Enter your base annual salary — the gross yearly pay used to calculate your weekly severance rate.',
        'Enter your years of service — the number of complete years you worked for the employer.',
        'Select your severance multiplier — typically 1 or 2 weeks of pay per year of service depending on company policy.',
        'Optionally enter a severance cap (maximum weeks) if your company limits total severance payout.',
        'Click Calculate to see your total severance weeks, gross severance pay, and estimated take-home amount.',
      ]}
      formula={'Weekly Rate = Annual Salary / 52\nTotal Severance Weeks = Years of Service × Weeks-per-Year Multiplier\nTotal Severance = Weekly Rate × Total Weeks'}
      formulaDescription="Most US companies calculate severance as 1–2 weeks of pay for each year of service. Some employers offer one month per year for senior employees. The total is often capped at a maximum number of weeks (commonly 26 weeks). There is no federal law requiring severance pay, but many employers provide it as a contractual obligation."
      workedExamples={[
        { title: 'Mid-Career Layoff', description: 'An employee earning $80,000/year with 8 years of service at 2 weeks/year: 8 × 2 = 16 weeks severance. Weekly rate: $1,538.46. Total severance: $24,615.38.' },
        { title: 'Senior Manager', description: 'A manager at $150,000/year with 15 years at 2 weeks/year, capped at 26 weeks: 15 × 2 = 30 weeks → capped at 26 weeks. Total: $75,000.' },
        { title: 'Entry-Level Role', description: 'An employee at $45,000/year with 3 years at 1 week/year: 3 weeks severance. Weekly rate: $865.38. Total: $2,596.15.' },
      ]}
      faqs={[
        { question: 'Is severance pay required by law?', answer: 'No — there is no federal law in the US requiring employers to provide severance pay. Severance is typically governed by employment contracts, company policy, or collective bargaining agreements. The WARN Act requires 60 days notice (or pay in lieu) for mass layoffs at companies with 100+ employees.' },
        { question: 'How is severance pay taxed?', answer: 'Severance pay is fully taxable as ordinary income and is subject to federal income tax, Social Security, and Medicare withholding. Employers typically withhold at the federal supplemental rate of 22% for amounts up to $1 million. Your actual tax rate depends on your total income for the year.' },
        { question: 'What is a typical severance package?', answer: 'The most common formula is 1–2 weeks of pay per year of service. Entry-level employees often receive 1 week/year, while managers and executives may receive 2–4 weeks/year. Packages sometimes include continued health benefits (COBRA), outplacement services, and accelerated vesting of stock.' },
        { question: 'Can I negotiate my severance package?', answer: 'Yes — severance agreements are often negotiable, especially for senior roles. You may be able to negotiate more weeks of pay, extended benefits coverage, or a lump-sum payment. Consulting an employment attorney before signing a severance agreement is advisable, especially if it includes a release of claims.' },
        { question: 'Does severance affect unemployment benefits?', answer: 'It depends on your state. Some states reduce or delay unemployment benefits during the period covered by severance pay. Check with your state unemployment office for specific rules.' },
      ]}
      relatedTools={[
        { slug: 'salary-converter', title: 'Salary Converter', description: 'Convert salary to weekly, monthly rates', icon: 'ArrowLeftRight' },
        { slug: 'after-tax-income-calculator', title: 'After-Tax Income', description: 'Estimate take-home after taxes', icon: 'Wallet' },
        { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Calculate turnover rate & cost', icon: 'Users' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Full paycheck calculation', icon: 'CreditCard' },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annual-salary">Annual Base Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annual-salary" type="number" step="1000" min="0" placeholder="75,000"
                value={annualSalary} onChange={(e) => { setAnnualSalary(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="years-service">Years of Service</Label>
            <Input id="years-service" type="number" step="0.5" min="0" placeholder="5"
              value={yearsService} onChange={(e) => { setYearsService(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weeks-per-year">Severance Multiplier</Label>
            <Select value={weeksPerYear} onValueChange={(v) => { setWeeksPerYear(v); setCalculated(false); }}>
              <SelectTrigger id="weeks-per-year"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 week per year of service</SelectItem>
                <SelectItem value="2">2 weeks per year of service</SelectItem>
                <SelectItem value="3">3 weeks per year of service</SelectItem>
                <SelectItem value="4">4 weeks per year of service (1 month)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Most common: 1–2 weeks per year</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cap-weeks">Severance Cap (weeks) <span className="text-muted-foreground font-normal">optional</span></Label>
            <Input id="cap-weeks" type="number" step="1" min="1" placeholder="e.g. 26"
              value={capWeeks} onChange={(e) => { setCapWeeks(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Leave blank if no cap applies</p>
          </div>
        </div>

        {/* Quick preview */}
        {salaryNum > 0 && yearsNum > 0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-3 text-sm text-indigo-700 dark:text-indigo-300">
            📋 Preview: <strong>{totalWeeks} weeks</strong> severance at <strong>{formatCurrency(weeklyRate)}/week</strong>
            {capNum < Infinity && rawWeeks > capNum && <span className="text-amber-600"> (capped from {rawWeeks} weeks)</span>}
          </motion.div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleCalculate} disabled={salaryNum <= 0 || yearsNum <= 0}
            className="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 flex-1 sm:flex-none">
            Calculate Severance Pay
          </Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="result-display" aria-live="polite">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Gross Severance Pay</p>
                <p className="text-4xl font-bold text-indigo-600">{formatCurrency(totalPay)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-600">{totalWeeks} weeks total</Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">~{formatCurrency(monthlyEquivalent)}/mo equivalent</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Annual Salary', value: formatCurrency(salaryNum) },
                  { label: 'Weekly Rate', value: formatCurrency(weeklyRate) },
                  { label: 'Severance Weeks', value: `${totalWeeks}wks` },
                  { label: 'Est. Take-Home (72%)', value: formatCurrency(estNetPay) },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [formatCurrency(v)]} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                ⚠️ Tax estimate is approximate (28% effective rate assumed). Actual taxes depend on your total annual income. Severance is fully taxable as ordinary income. Consult a tax advisor before negotiating your package.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Annual Salary', valueA: formatCurrency(compareA.salary), valueB: formatCurrency(compareB.salary), numA: compareA.salary, numB: compareB.salary },
          { label: 'Years of Service', valueA: `${compareA.years} yrs`, valueB: `${compareB.years} yrs`, numA: compareA.years, numB: compareB.years },
          { label: 'Total Weeks', valueA: `${compareA.totalWeeks}wks`, valueB: `${compareB.totalWeeks}wks`, numA: compareA.totalWeeks, numB: compareB.totalWeeks },
          { label: 'Total Severance', valueA: formatCurrency(compareA.totalPay), valueB: formatCurrency(compareB.totalPay), numA: compareA.totalPay, numB: compareB.totalPay },
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

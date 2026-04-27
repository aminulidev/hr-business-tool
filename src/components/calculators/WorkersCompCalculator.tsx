'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
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

// Common class codes with typical rates (per $100 payroll) for reference
const CLASS_CODES = [
  { code: '8810', label: 'Clerical / Office', rate: '0.30' },
  { code: '8742', label: 'Sales / Outside Reps', rate: '0.55' },
  { code: '8380', label: 'Auto Service / Mechanics', rate: '2.50' },
  { code: '5645', label: 'Carpentry / Light Construction', rate: '8.50' },
  { code: '5403', label: 'Carpentry / Residential', rate: '14.50' },
  { code: '8017', label: 'Retail Store', rate: '1.20' },
  { code: '7380', label: 'Drivers / Trucking', rate: '5.80' },
  { code: '5022', label: 'Masonry / Stone Work', rate: '7.20' },
  { code: '8832', label: 'Physicians / Medical', rate: '0.75' },
  { code: '8868', label: 'Teachers / Schools', rate: '0.45' },
];

interface WcSnap { annualPayroll: number; rate: number; emr: number; basePremium: number; modifiedPremium: number; perEmployee: number; employees: number; label: string; }

export default function WorkersCompCalculator() {
  const [annualPayroll, setAnnualPayroll] = useState('');
  const [ratePerHundred, setRatePerHundred] = useState('');
  const [emr, setEmr] = useState('1.0');
  const [employees, setEmployees] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<WcSnap | null>(null);
  const [compareB, setCompareB] = useState<WcSnap | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualPayroll: string; ratePerHundred: string; emr: string; employees: string }>('workers-comp-calculator');

  const payrollNum = parseFloat(annualPayroll.replace(/,/g, '')) || 0;
  const rateNum = parseFloat(ratePerHundred) || 0;
  const emrNum = parseFloat(emr) || 1.0;
  const empNum = parseFloat(employees) || 0;

  const basePremium = (payrollNum / 100) * rateNum;
  const modifiedPremium = basePremium * emrNum;
  const perEmployee = empNum > 0 ? modifiedPremium / empNum : 0;
  const effectiveRate = payrollNum > 0 ? (modifiedPremium / payrollNum) * 100 : 0;

  const handleCodeSelect = (code: string) => {
    setSelectedCode(code);
    const found = CLASS_CODES.find(c => c.code === code);
    if (found) { setRatePerHundred(found.rate); setCalculated(false); }
  };

  const handleCalculate = () => {
    if (payrollNum > 0 && rateNum > 0) {
      setCalculated(true);
      saveEntry({ annualPayroll, ratePerHundred, emr, employees }, `Payroll: ${formatCurrency(payrollNum)} · Rate: $${rateNum}/$100 · Premium: ${formatCurrency(modifiedPremium)}`);
    }
  };
  const handleReset = () => { setAnnualPayroll(''); setRatePerHundred(''); setEmr('1.0'); setEmployees(''); setSelectedCode(''); setCalculated(false); };
  const handleRestore = (i: { annualPayroll: string; ratePerHundred: string; emr: string; employees: string }) => {
    setAnnualPayroll(i.annualPayroll); setRatePerHundred(i.ratePerHundred); setEmr(i.emr); setEmployees(i.employees); setCalculated(true);
  };
  const snap = (): WcSnap => ({ annualPayroll: payrollNum, rate: rateNum, emr: emrNum, basePremium, modifiedPremium, perEmployee, employees: empNum, label: `$${rateNum}/$100 · EMR ${emrNum}` });

  return (
    <CalculatorLayout
      title="Workers Comp Calculator"
      description="Estimate your annual workers compensation insurance premium from payroll, classification rate, and experience modification rate (EMR)."
      icon={<ShieldCheck className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Workers Comp Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={[
        'Enter your total annual payroll — the sum of all wages paid to employees covered by workers comp.',
        'Select a job classification code from the quick reference list, or manually enter the rate per $100 of payroll for your industry.',
        'Enter your Experience Modification Rate (EMR). A rate of 1.0 is average. Below 1.0 means fewer claims (lower cost); above 1.0 means higher risk history.',
        'Optionally enter the number of employees to see the cost per employee breakdown.',
        'Click Calculate to see your estimated base premium and modified premium after EMR adjustment.',
      ]}
      formula={'Base Premium = (Annual Payroll / 100) × Rate per $100\nModified Premium = Base Premium × EMR\nCost per Employee = Modified Premium / Number of Employees'}
      formulaDescription="Workers compensation premiums are calculated per $100 of payroll using class-code-specific rates that reflect the injury risk of different occupations. The Experience Modification Rate (EMR) adjusts the premium based on a company's actual claims history versus expected claims for its industry. An EMR below 1.0 reduces the premium; above 1.0 increases it."
      workedExamples={[
        { title: 'Office Company', description: 'Annual payroll of $500,000, clerical rate $0.30/$100, EMR 0.85. Base premium: $1,500. Modified: $1,500 × 0.85 = $1,275. Cost per employee (10 staff): $127.50/employee.' },
        { title: 'Construction Firm', description: 'Annual payroll of $2M, carpentry rate $8.50/$100, EMR 1.2 (above average claims). Base premium: $170,000. Modified: $204,000. Cost per employee (20 workers): $10,200/employee.' },
        { title: 'Retail Store', description: 'Annual payroll of $800,000, retail rate $1.20/$100, EMR 0.95. Base premium: $9,600. Modified: $9,120. 15 employees = $608/employee/year.' },
      ]}
      faqs={[
        { question: 'What is workers compensation insurance?', answer: 'Workers compensation insurance provides wage replacement and medical benefits to employees injured on the job. In exchange, employees give up the right to sue their employer for negligence. It is required by law in almost all US states for employers with one or more employees.' },
        { question: 'What is an EMR (Experience Modification Rate)?', answer: 'The EMR (also called experience mod or X-mod) compares your company\'s actual claim losses to the expected losses for businesses of your type and size. An EMR of 1.0 is the industry average. An EMR of 0.8 means your claims are 20% below average, which reduces your premium by 20%. An EMR of 1.3 means 30% above average.' },
        { question: 'What is a classification code?', answer: 'Workers comp classification codes (class codes) group employees by the type of work they perform. Each code has a different rate per $100 of payroll based on the injury risk associated with that job type. Office workers (8810) might have a rate of $0.30/$100, while roofers might be $25/$100 or more.' },
        { question: 'How can I lower my workers comp premiums?', answer: 'Reduce claims through safety training programs and proper equipment. Implement a return-to-work program for injured employees. Regularly audit your payroll classifications to ensure accuracy. Keep your EMR below 1.0 by preventing accidents. Request a premium audit if you think your payroll is being over-reported.' },
        { question: 'Is workers comp the same in every state?', answer: 'No — workers comp is regulated at the state level. Rates, required coverage, benefits, and class codes vary significantly by state. Some states have monopolistic state funds (WA, ND, OH, WY) where you must buy coverage from the state.' },
      ]}
      relatedTools={[
        { slug: 'cost-per-hire-calculator', title: 'Cost per Hire Calculator', description: 'Total recruiting cost analysis', icon: 'Briefcase' },
        { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate & cost impact', icon: 'Users' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Full employee paycheck calculation', icon: 'CreditCard' },
        { slug: 'severance-pay-calculator', title: 'Severance Pay Calculator', description: 'Calculate severance packages', icon: 'UserMinus' },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* Class Code Quick Reference */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Quick Reference: Common Class Codes</p>
          </div>
          <Select value={selectedCode} onValueChange={handleCodeSelect}>
            <SelectTrigger><SelectValue placeholder="Select a job classification to auto-fill rate…" /></SelectTrigger>
            <SelectContent>
              {CLASS_CODES.map(c => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code} — {c.label} (${c.rate}/$100)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Rates are illustrative averages. Actual rates vary by state and insurer.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annual-payroll">Annual Payroll</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annual-payroll" type="number" step="10000" min="0" placeholder="500,000"
                value={annualPayroll} onChange={(e) => { setAnnualPayroll(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate-per-hundred">Rate per $100 of Payroll</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="rate-per-hundred" type="number" step="0.01" min="0" placeholder="1.20"
                value={ratePerHundred} onChange={(e) => { setRatePerHundred(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
            <p className="text-xs text-muted-foreground">From your policy declarations or class code table</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emr">Experience Modification Rate (EMR)</Label>
            <Input id="emr" type="number" step="0.01" min="0.5" max="3" placeholder="1.00"
              value={emr} onChange={(e) => { setEmr(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">1.0 = average · &lt;1.0 = discount · &gt;1.0 = surcharge</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="num-employees">Number of Employees <span className="text-muted-foreground font-normal">optional</span></Label>
            <Input id="num-employees" type="number" step="1" min="1" placeholder="25"
              value={employees} onChange={(e) => { setEmployees(e.target.value); setCalculated(false); }} />
          </div>
        </div>

        {emrNum !== 1.0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-3 text-sm border ${emrNum < 1 ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-300'}`}>
            {emrNum < 1
              ? `✅ EMR ${emrNum} — Your safety record earns a ${formatPercent((1 - emrNum) * 100)} premium discount.`
              : `⚠️ EMR ${emrNum} — Your claims history adds a ${formatPercent((emrNum - 1) * 100)} surcharge to your base premium.`}
          </motion.div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleCalculate} disabled={payrollNum <= 0 || rateNum <= 0}
            className="bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white shadow-lg shadow-teal-500/25 flex-1 sm:flex-none">
            Calculate Premium
          </Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="result-display" aria-live="polite">
            <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Estimated Annual Premium</p>
                <p className="text-4xl font-bold text-teal-600">{formatCurrency(modifiedPremium)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-teal-500/10 border-teal-500/30 text-teal-600">
                    Effective rate: {formatPercent(effectiveRate)} of payroll
                  </Badge>
                  {emrNum !== 1 && (
                    <Badge variant="outline" className={emrNum < 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-red-500/10 border-red-500/30 text-red-600'}>
                      Base: {formatCurrency(basePremium)} (EMR {emrNum}×)
                    </Badge>
                  )}
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Annual Payroll', value: formatCurrency(payrollNum) },
                  { label: 'Base Premium', value: formatCurrency(basePremium) },
                  { label: 'After EMR Adj.', value: formatCurrency(modifiedPremium) },
                  ...(empNum > 0 ? [{ label: 'Cost per Employee', value: formatCurrency(perEmployee) }] : [{ label: 'Rate / $100', value: `$${rateNum}` }]),
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'Base Premium', amount: basePremium },
                      { name: 'After EMR', amount: modifiedPremium },
                    ]}
                    margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [formatCurrency(v), 'Premium']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="amount" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                <Info className="inline h-3.5 w-3.5 mr-1" />
                This is an estimate only. Actual premiums are set by your state's rating bureau and insurer. Rates shown use illustrative averages — always verify with your insurance carrier for precise quotes.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Annual Payroll', valueA: formatCurrency(compareA.annualPayroll), valueB: formatCurrency(compareB.annualPayroll), numA: compareA.annualPayroll, numB: compareB.annualPayroll },
          { label: 'Rate per $100', valueA: `$${compareA.rate}`, valueB: `$${compareB.rate}`, numA: compareA.rate, numB: compareB.rate, higherIsBetter: false },
          { label: 'EMR', valueA: `${compareA.emr}×`, valueB: `${compareB.emr}×`, numA: compareA.emr, numB: compareB.emr, higherIsBetter: false },
          { label: 'Base Premium', valueA: formatCurrency(compareA.basePremium), valueB: formatCurrency(compareB.basePremium), numA: compareA.basePremium, numB: compareB.basePremium, higherIsBetter: false },
          { label: 'Modified Premium', valueA: formatCurrency(compareA.modifiedPremium), valueB: formatCurrency(compareB.modifiedPremium), numA: compareA.modifiedPremium, numB: compareB.modifiedPremium, higherIsBetter: false },
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

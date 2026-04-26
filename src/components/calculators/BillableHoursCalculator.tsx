'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';
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
import { formatCurrency, formatPercent } from '@/lib/utils';

interface BhSnap { totalHours: number; billableHours: number; utilizationRate: number; billableRevenue: number; label: string; }

export default function BillableHoursCalculator() {
  const [totalHours, setTotalHours] = useState('');
  const [nonBillableHours, setNonBillableHours] = useState('');
  const [billingRate, setBillingRate] = useState('');
  const [period, setPeriod] = useState('week');
  const [targetUtilization, setTargetUtilization] = useState('75');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<BhSnap | null>(null);
  const [compareB, setCompareB] = useState<BhSnap | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalHours: string; nonBillableHours: string; billingRate: string; period: string }>('billable-hours');

  const totalNum = parseFloat(totalHours) || 0;
  const nonBillNum = parseFloat(nonBillableHours) || 0;
  const rateNum = parseFloat(billingRate) || 0;
  const targetPct = parseFloat(targetUtilization) / 100;

  const billableHours = Math.max(totalNum - nonBillNum, 0);
  const utilizationRate = totalNum > 0 ? (billableHours / totalNum) * 100 : 0;
  const billableRevenue = billableHours * rateNum;
  const targetBillableHours = totalNum * targetPct;
  const revenueLost = rateNum > 0 ? Math.max(targetBillableHours - billableHours, 0) * rateNum : 0;

  // Annualized estimates (period multipliers)
  const PERIOD_MULT: Record<string, number> = { week: 50, 'bi-week': 25, month: 12, year: 1 };
  const PERIOD_LABELS: Record<string, string> = { week: 'Weekly', 'bi-week': 'Bi-Weekly', month: 'Monthly', year: 'Annual' };
  const mult = PERIOD_MULT[period] || 50;
  const annualRevenue = billableRevenue * mult;
  const annualHours = billableHours * mult;

  const handleCalculate = () => {
    if (totalNum > 0) {
      setCalculated(true);
      saveEntry({ totalHours, nonBillableHours, billingRate, period }, `${billableHours}h billable · ${utilizationRate.toFixed(1)}% utilization${rateNum > 0 ? ` · ${formatCurrency(billableRevenue)}/${period}` : ''}`);
    }
  };
  const handleReset = () => { setTotalHours(''); setNonBillableHours(''); setBillingRate(''); setPeriod('week'); setTargetUtilization('75'); setCalculated(false); };
  const handleRestore = (i: { totalHours: string; nonBillableHours: string; billingRate: string; period: string }) => {
    setTotalHours(i.totalHours); setNonBillableHours(i.nonBillableHours); setBillingRate(i.billingRate); setPeriod(i.period); setCalculated(true);
  };
  const snap = (): BhSnap => ({ totalHours: totalNum, billableHours, utilizationRate, billableRevenue, label: `${billableHours}h · ${utilizationRate.toFixed(1)}%` });

  const getUtilColor = (u: number) => u >= 80 ? '#10b981' : u >= 65 ? '#f59e0b' : '#ef4444';

  const chartData = [
    { name: 'Billable Hours', hours: billableHours, fill: '#10b981' },
    { name: 'Non-Billable', hours: nonBillNum, fill: '#f59e0b' },
    { name: 'Target Billable', hours: targetBillableHours, fill: '#6366f1' },
  ].filter(d => d.hours > 0);

  return (
    <CalculatorLayout
      title="Billable Hours Calculator"
      description="Calculate your billable hours, utilization rate, and billable revenue. Track how efficiently your work time generates income."
      icon={<Hourglass className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Billable Hours Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={[
        'Enter your total working hours for the period — this is the total time you spend at work, including both billable and non-billable activities.',
        'Enter your non-billable hours — time spent on admin, internal meetings, training, business development, and other non-client work.',
        'Enter your hourly billing rate to calculate billable revenue for the period.',
        'Set your target utilization rate — law firms typically target 75–85%, consultants 65–75%.',
        'Click Calculate to see your billable hours, utilization rate, revenue, and gap from your target.',
      ]}
      formula={'Billable Hours = Total Hours − Non-Billable Hours\nUtilization Rate = Billable Hours / Total Hours × 100\nBillable Revenue = Billable Hours × Hourly Rate'}
      formulaDescription="Utilization rate measures the percentage of total working time that generates client revenue. Law firms and consulting firms typically track this as a key performance indicator. A utilization rate below 65% indicates too much non-billable overhead, while above 85% can lead to burnout."
      workedExamples={[
        { title: 'Consultant (Weekly)', description: '40 total hours. 10 non-billable (meetings, admin, proposals). 30 billable hours. Utilization: 75%. At $200/hr: $6,000/week billable revenue. Annual: $300,000.' },
        { title: 'Lawyer (Weekly)', description: '50 total hours. 8 non-billable (firm management, CLE, admin). 42 billable hours. Utilization: 84%. At $350/hr: $14,700/week. Annual: $735,000.' },
        { title: 'Freelance Designer (Monthly)', description: '160 total hours. 40 non-billable (admin, marketing, client acquisition). 120 billable hours. Utilization: 75%. At $85/hr: $10,200/month. Annual: $122,400.' },
      ]}
      faqs={[
        { question: 'What is a billable hour?', answer: 'A billable hour is time spent directly on client work that can be invoiced. This includes meetings with clients, research, drafting, design work, coding, and other deliverables. Non-billable time includes internal meetings, business development, training, and administrative tasks.' },
        { question: 'What is a good utilization rate?', answer: 'Target utilization rates vary by profession: Law firms: 75–85% for associates, 60–70% for partners. Consulting: 65–75%. IT consulting: 70–80%. Freelancers: 60–70% (since you handle your own business development). Below 60% typically means too much overhead.' },
        { question: 'How do law firms track billable hours?', answer: 'Most law firms use time-tracking software (Clio, TimeSolv, MyCase) where attorneys log time in 6-minute increments (0.1 hour). Partners set annual billable hour targets — typically 1,800–2,200 hours per year for associates. Performance reviews and bonuses are often tied to billable hour targets.' },
        { question: 'How can I increase my billable hours?', answer: 'Delegate administrative tasks, automate invoicing and scheduling, use templates for proposals and contracts, set clear office hours, batch non-billable tasks to specific time blocks, and track time in real-time rather than reconstructing it from memory at day-end.' },
      ]}
      relatedTools={[
        { slug: 'time-card', title: 'Time Card Calculator', description: 'Track clock-in/out hours for payroll', icon: 'Clock' },
        { slug: 'time-card-lunch', title: 'Time Card with Lunch', description: 'Hours minus break deductions', icon: 'Coffee' },
        { slug: 'revenue-per-employee', title: 'Revenue per Employee', description: 'Workforce revenue efficiency', icon: 'Activity' },
        { slug: 'wages', title: 'Wages Calculator', description: 'Calculate gross wages from hours', icon: 'Banknote' },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="period-select">Time Period</Label>
            <Select value={period} onValueChange={(v) => { setPeriod(v); setCalculated(false); }}>
              <SelectTrigger id="period-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly (per week)</SelectItem>
                <SelectItem value="bi-week">Bi-Weekly (per 2 weeks)</SelectItem>
                <SelectItem value="month">Monthly (per month)</SelectItem>
                <SelectItem value="year">Annual (full year)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-util">Target Utilization Rate</Label>
            <Select value={targetUtilization} onValueChange={(v) => { setTargetUtilization(v); setCalculated(false); }}>
              <SelectTrigger id="target-util"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60% — Freelancer / Solo</SelectItem>
                <SelectItem value="65">65% — Consulting baseline</SelectItem>
                <SelectItem value="70">70% — Consulting target</SelectItem>
                <SelectItem value="75">75% — Law / Advisory target</SelectItem>
                <SelectItem value="80">80% — High performance</SelectItem>
                <SelectItem value="85">85% — Top performer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="total-hours">Total Working Hours ({PERIOD_LABELS[period]})</Label>
            <Input id="total-hours" type="number" step="0.5" min="0" placeholder="40"
              value={totalHours} onChange={(e) => { setTotalHours(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="non-billable-hours">Non-Billable Hours</Label>
            <Input id="non-billable-hours" type="number" step="0.5" min="0" placeholder="10"
              value={nonBillableHours} onChange={(e) => { setNonBillableHours(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Admin, meetings, training, proposals</p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="billing-rate">Hourly Billing Rate <span className="text-muted-foreground font-normal">optional</span></Label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="billing-rate" type="number" step="5" min="0" placeholder="150"
                value={billingRate} onChange={(e) => { setBillingRate(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
            <p className="text-xs text-muted-foreground">Leave blank to calculate hours and utilization only</p>
          </div>
        </div>

        {totalNum > 0 && nonBillNum >= 0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border/50 bg-muted/20 p-3 text-sm">
            <span style={{ color: getUtilColor(utilizationRate) }} className="font-semibold">
              {billableHours}h billable
            </span>
            <span className="text-muted-foreground"> of {totalNum}h total · </span>
            <span style={{ color: getUtilColor(utilizationRate) }} className="font-semibold">{utilizationRate.toFixed(1)}% utilization</span>
          </motion.div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleCalculate} disabled={totalNum <= 0}
            className="bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white shadow-lg shadow-teal-500/25 flex-1 sm:flex-none">
            Calculate Billable Hours
          </Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="result-display" aria-live="polite">
            <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Utilization Rate</p>
                <p className="text-4xl font-bold" style={{ color: getUtilColor(utilizationRate) }}>
                  {formatPercent(utilizationRate)}
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-teal-500/10 border-teal-500/30 text-teal-600">
                    {billableHours}h billable
                  </Badge>
                  {rateNum > 0 && (
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
                      {formatCurrency(billableRevenue)} / {period}
                    </Badge>
                  )}
                  {utilizationRate < parseFloat(targetUtilization) && (
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">
                      {(parseFloat(targetUtilization) - utilizationRate).toFixed(1)}% below target
                    </Badge>
                  )}
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              {/* Utilization Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Utilization: {utilizationRate.toFixed(1)}%</span>
                  <span>Target: {targetUtilization}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(utilizationRate, 100)}%`, backgroundColor: getUtilColor(utilizationRate) }} />
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500/40 transition-all"
                    style={{ width: `${Math.min(parseFloat(targetUtilization), 100)}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Billable Hours', value: `${billableHours}h` },
                  { label: 'Non-Billable Hours', value: `${nonBillNum}h` },
                  { label: 'Target Billable', value: `${targetBillableHours.toFixed(1)}h` },
                  ...(rateNum > 0
                    ? [{ label: 'Annual Revenue Est.', value: formatCurrency(annualRevenue) }]
                    : [{ label: 'Annual Billable Hours', value: `${annualHours.toFixed(0)}h` }]),
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>

              {chartData.length > 0 && (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                      <RechartsTooltip formatter={(v: number) => [`${v.toFixed(1)}h`]} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                      <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                        {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {revenueLost > 0 && rateNum > 0 && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-700 dark:text-amber-300">
                  💡 Reaching your {targetUtilization}% target would generate an additional <strong>{formatCurrency(revenueLost)}/{period}</strong> in billable revenue (<strong>{formatCurrency(revenueLost * mult)}/year</strong>).
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Billable Hours', valueA: `${compareA.billableHours}h`, valueB: `${compareB.billableHours}h`, numA: compareA.billableHours, numB: compareB.billableHours },
          { label: 'Utilization Rate', valueA: formatPercent(compareA.utilizationRate), valueB: formatPercent(compareB.utilizationRate), numA: compareA.utilizationRate, numB: compareB.utilizationRate },
          ...(compareA.billableRevenue > 0 ? [{ label: 'Billable Revenue', valueA: formatCurrency(compareA.billableRevenue), valueB: formatCurrency(compareB.billableRevenue), numA: compareA.billableRevenue, numB: compareB.billableRevenue }] : []),
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

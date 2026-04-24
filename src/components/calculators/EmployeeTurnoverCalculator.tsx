'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
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

const BENCHMARKS = [
  { industry: 'Technology', rate: 13.2 },
  { industry: 'Finance', rate: 18.6 },
  { industry: 'Healthcare', rate: 22.4 },
  { industry: 'Retail', rate: 58.1 },
  { industry: 'Hospitality', rate: 73.8 },
  { industry: 'Manufacturing', rate: 39.9 },
  { industry: 'All Industries', rate: 47.2 },
];

interface TurnoverSnap { rate: number; retentionRate: number; costEstimate: number; label: string; }

export default function EmployeeTurnoverCalculator() {
  const [beginHeadcount, setBeginHeadcount] = useState('');
  const [endHeadcount, setEndHeadcount] = useState('');
  const [separations, setSeparations] = useState('');
  const [avgSalary, setAvgSalary] = useState('');
  const [replacementCost, setReplacementCost] = useState('50');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<TurnoverSnap | null>(null);
  const [compareB, setCompareB] = useState<TurnoverSnap | null>(null);
  const { history, saveEntry, clearHistory } = useCalcHistory<{ beginHeadcount: string; endHeadcount: string; separations: string; avgSalary: string }>('employee-turnover');

  const beginNum = parseFloat(beginHeadcount) || 0;
  const endNum = parseFloat(endHeadcount) || 0;
  const sepNum = parseFloat(separations) || 0;
  const salaryNum = parseFloat(avgSalary) || 0;
  const costPct = parseFloat(replacementCost) / 100;

  const avgHeadcount = (beginNum + endNum) / 2;
  const turnoverRate = avgHeadcount > 0 ? (sepNum / avgHeadcount) * 100 : 0;
  const retentionRate = 100 - turnoverRate;
  const costPerEmployee = salaryNum * costPct;
  const totalCost = costPerEmployee * sepNum;

  const handleCalculate = () => {
    if (beginNum > 0 && sepNum > 0) {
      setCalculated(true);
      saveEntry({ beginHeadcount, endHeadcount, separations, avgSalary }, `Turnover: ${turnoverRate.toFixed(1)}% · ${sepNum} employees · Cost: ${salaryNum > 0 ? formatCurrency(totalCost) : 'N/A'}`);
    }
  };
  const handleReset = () => { setBeginHeadcount(''); setEndHeadcount(''); setSeparations(''); setAvgSalary(''); setReplacementCost('50'); setCalculated(false); };
  const handleRestore = (i: { beginHeadcount: string; endHeadcount: string; separations: string; avgSalary: string }) => {
    setBeginHeadcount(i.beginHeadcount); setEndHeadcount(i.endHeadcount); setSeparations(i.separations); setAvgSalary(i.avgSalary); setCalculated(true);
  };
  const snap = (): TurnoverSnap => ({ rate: turnoverRate, retentionRate, costEstimate: totalCost, label: `${turnoverRate.toFixed(1)}% turnover` });

  const pieData = [
    { name: 'Retained Employees', value: Math.max(retentionRate, 0), color: '#10b981' },
    { name: 'Turnover', value: Math.min(turnoverRate, 100), color: '#ef4444' },
  ];

  const getRating = (rate: number) => {
    if (rate < 10) return { label: 'Excellent', color: 'text-emerald-600' };
    if (rate < 20) return { label: 'Good', color: 'text-green-600' };
    if (rate < 35) return { label: 'Average', color: 'text-amber-600' };
    return { label: 'High — Action Needed', color: 'text-red-600' };
  };

  const rating = getRating(turnoverRate);

  return (
    <CalculatorLayout
      title="Employee Turnover Rate Calculator"
      description="Calculate your employee turnover rate, retention rate, and cost of attrition. Compare against industry benchmarks to identify workforce stability issues."
      icon={<Users className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Employee Turnover Rate Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={[
        'Enter your headcount at the beginning of the measurement period (typically January 1 for annual rate).',
        'Enter your headcount at the end of the period (typically December 31).',
        'Enter the number of employees who left (separations) during the period — include voluntary and involuntary separations.',
        'Optionally enter the average salary and replacement cost percentage to calculate the financial cost of turnover.',
        'Click Calculate to see your turnover rate, retention rate, and cost estimate compared to industry benchmarks.',
      ]}
      formula={'Average Headcount = (Beginning + Ending) / 2\nTurnover Rate = (Separations / Average Headcount) × 100\nCost of Turnover = Separations × Average Salary × Replacement Cost %'}
      formulaDescription="The employee turnover rate measures the percentage of the workforce that leaves over a given period. Average headcount smooths out fluctuations from hiring and departures throughout the year. Replacement costs typically range from 50% of salary (entry-level) to 200%+ (senior/specialized roles)."
      workedExamples={[
        { title: 'Tech Startup (50 Employees)', description: 'Beginning: 50, Ending: 52, Separations: 8. Avg headcount: 51. Turnover rate: 8/51 = 15.7% — slightly above tech benchmark of 13.2%. At avg salary $90k and 75% replacement cost: $8 × $67,500 = $540,000 annual cost.' },
        { title: 'Retail Store (30 Employees)', description: 'Beginning: 28, Ending: 32, Separations: 18. Avg headcount: 30. Turnover rate: 18/30 = 60% — slightly above retail average of 58.1%. Cost at $35k avg and 40% replacement: $252,000.' },
        { title: 'Hospital Unit (100 Nurses)', description: 'Beginning: 100, Ending: 98, Separations: 24. Avg headcount: 99. Turnover rate: 24.2% — above healthcare benchmark of 22.4%. At $75k avg and 100% replacement: $1.8M per year.' },
      ]}
      faqs={[
        { question: 'What is a good employee turnover rate?', answer: 'A "good" turnover rate depends heavily on industry. Tech averages 13–18%, healthcare 20–25%, and retail can be 50–70%. Generally, below 10% is excellent, 10–20% is healthy, and above 35% indicates problems worth investigating. Voluntary vs involuntary turnover matters — high voluntary turnover signals engagement or culture issues.' },
        { question: 'What is the cost of employee turnover?', answer: 'Research estimates replacement costs at 50–200% of annual salary. Entry-level roles: 30–50% (recruiting, training, lost productivity). Mid-level: 100–150%. Senior/specialized: 150–200%+. A 2022 Gallup study estimated the US economy loses $1 trillion per year to voluntary employee turnover.' },
        { question: 'What is the difference between voluntary and involuntary turnover?', answer: 'Voluntary turnover occurs when employees choose to leave (resignations, retirements). Involuntary turnover includes layoffs, terminations, and performance-based separations. High voluntary turnover is a key indicator of employee dissatisfaction, poor management, or uncompetitive compensation.' },
        { question: 'How do you reduce employee turnover?', answer: 'Key strategies: competitive compensation and benefits, strong onboarding, career development programs, recognition and feedback culture, flexible work arrangements, and manager training. Exit interviews identify specific reasons employees leave. Tracking turnover by department helps isolate management-related issues.' },
      ]}
      relatedTools={[
        { slug: 'cost-per-hire', title: 'Cost per Hire Calculator', description: 'Measure total recruiting investment', icon: 'Briefcase' },
        { slug: 'revenue-per-employee', title: 'Revenue per Employee', description: 'Workforce productivity metrics', icon: 'Activity' },
        { slug: 'severance-pay', title: 'Severance Pay Calculator', description: 'Calculate departing employee packages', icon: 'UserMinus' },
        { slug: 'salary-increase', title: 'Salary Increase Calculator', description: 'Model compensation improvements', icon: 'TrendingUp' },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="begin-headcount">Beginning Headcount</Label>
            <Input id="begin-headcount" type="number" step="1" min="0" placeholder="100"
              value={beginHeadcount} onChange={(e) => { setBeginHeadcount(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Employees at start of period</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-headcount">Ending Headcount</Label>
            <Input id="end-headcount" type="number" step="1" min="0" placeholder="98"
              value={endHeadcount} onChange={(e) => { setEndHeadcount(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Employees at end of period</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="separations">Number of Separations</Label>
            <Input id="separations" type="number" step="1" min="0" placeholder="15"
              value={separations} onChange={(e) => { setSeparations(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Employees who left (voluntary + involuntary)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avg-salary">Avg. Annual Salary <span className="text-muted-foreground font-normal">optional</span></Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="avg-salary" type="number" step="1000" min="0" placeholder="60,000"
                value={avgSalary} onChange={(e) => { setAvgSalary(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
          {avgSalary && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="replacement-cost">Replacement Cost (% of salary)</Label>
              <Select value={replacementCost} onValueChange={(v) => { setReplacementCost(v); setCalculated(false); }}>
                <SelectTrigger id="replacement-cost"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30% — Entry-level roles</SelectItem>
                  <SelectItem value="50">50% — Junior employees</SelectItem>
                  <SelectItem value="75">75% — Mid-level employees</SelectItem>
                  <SelectItem value="100">100% — Experienced professionals</SelectItem>
                  <SelectItem value="150">150% — Senior / specialized roles</SelectItem>
                  <SelectItem value="200">200% — Executive / highly specialized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleCalculate} disabled={beginNum <= 0 || sepNum <= 0}
            className="bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 text-white shadow-lg shadow-violet-500/25 flex-1 sm:flex-none">
            Calculate Turnover Rate
          </Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="result-display" aria-live="polite">
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Annual Turnover Rate</p>
                <p className={`text-4xl font-bold ${rating.color}`}>{formatPercent(turnoverRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
                    Retention: {formatPercent(retentionRate)}
                  </Badge>
                  <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600">
                    {rating.label}
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Avg Headcount', value: `${avgHeadcount.toFixed(0)} employees` },
                  { label: 'Separations', value: `${sepNum} employees` },
                  { label: 'Retention Rate', value: formatPercent(retentionRate) },
                  ...(salaryNum > 0 ? [{ label: 'Est. Turnover Cost', value: formatCurrency(totalCost) }] : [{ label: 'Turnover Rate', value: formatPercent(turnoverRate) }]),
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Donut Chart */}
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={(v: number) => [`${v.toFixed(1)}%`]} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Legend iconType="circle" />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Industry Benchmarks */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Industry Benchmark Comparison</p>
                <div className="space-y-2">
                  {BENCHMARKS.map((b) => (
                    <div key={b.industry} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-28 shrink-0">{b.industry}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: `${Math.min(b.rate, 100)}%` }} />
                      </div>
                      <span className="text-xs font-medium w-12 text-right">{b.rate}%</span>
                      {turnoverRate <= b.rate
                        ? <span className="text-[10px] text-emerald-600">✓ Better</span>
                        : <span className="text-[10px] text-red-600">↑ Higher</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Turnover Rate', valueA: formatPercent(compareA.rate), valueB: formatPercent(compareB.rate), numA: compareA.rate, numB: compareB.rate, higherIsBetter: false },
          { label: 'Retention Rate', valueA: formatPercent(compareA.retentionRate), valueB: formatPercent(compareB.retentionRate), numA: compareA.retentionRate, numB: compareB.retentionRate },
          ...(compareA.costEstimate > 0 ? [{ label: 'Turnover Cost', valueA: formatCurrency(compareA.costEstimate), valueB: formatCurrency(compareB.costEstimate), numA: compareA.costEstimate, numB: compareB.costEstimate, higherIsBetter: false }] : []),
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} />
    </CalculatorLayout>
  );
}

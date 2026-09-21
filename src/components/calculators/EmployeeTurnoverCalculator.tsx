'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import TryExample from './TryExample';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
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
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ beginHeadcount: string; endHeadcount: string; separations: string; avgSalary: string }>('employee-turnover-calculator');

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

    const handleTryExample = () => {
    setBeginHeadcount('100');
    setEndHeadcount('110');
    setSeparations('15');
    
  };

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
    <div className="w-full">
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

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-6">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCalculate}
              disabled={beginNum <= 0 || sepNum <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
              size="lg"
            >
              Calculate Turnover Rate
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
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
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}

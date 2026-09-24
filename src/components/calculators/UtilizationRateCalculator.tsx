'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell, ReferenceLine } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface UtilizationSnapshot { billableHours: number; totalAvailable: number; utilizationRate: number; revenue: number; label: string; }

const INDUSTRY_BENCHMARKS = [
  { industry: 'Consulting', target: 75, color: '#10b981' },
  { industry: 'Legal', target: 70, color: '#3b82f6' },
  { industry: 'Agency', target: 65, color: '#f59e0b' },
  { industry: 'Accounting', target: 60, color: '#8b5cf6' },
];

export default function UtilizationRateCalculator() {
  const [billableHours, setBillableHours] = useState('');
  const [totalAvailable, setTotalAvailable] = useState('2080');
  const [hourlyRate, setHourlyRate] = useState('');
  const [industry, setIndustry] = useState('Consulting');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<UtilizationSnapshot | null>(null);
  const [compareB, setCompareB] = useState<UtilizationSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ billableHours: string; totalAvailable: string; hourlyRate: string; industry: string }>('utilization-rate-calculator');

  const bh = parseFloat(billableHours) || 0;
  const ta = parseFloat(totalAvailable) || 0;
  const r = parseFloat(hourlyRate) || 0;
  const utilization = ta > 0 ? (bh / ta) * 100 : 0;
  const revenue = bh * r;
  const benchmark = INDUSTRY_BENCHMARKS.find((i) => i.industry === industry)?.target || 75;
  const gap = utilization - benchmark;

  const handleTryExample = () => { setBillableHours('1500'); setTotalAvailable('2080'); setHourlyRate('150'); setIndustry('Consulting'); setCalculated(false); };
  const handleCalculate = () => {
    if (ta > 0 && bh > 0) {
      setCalculated(true);
      saveEntry({ billableHours, totalAvailable, hourlyRate, industry }, `${utilization.toFixed(1)}% utilization · ${industry} target ${benchmark}%`);
    }
  };
  const handleReset = () => { setBillableHours(''); setTotalAvailable('2080'); setHourlyRate(''); setIndustry('Consulting'); setCalculated(false); };
  const handleRestore = (i: { billableHours: string; totalAvailable: string; hourlyRate: string; industry: string }) => {
    setBillableHours(i.billableHours); setTotalAvailable(i.totalAvailable); setHourlyRate(i.hourlyRate); setIndustry(i.industry); setCalculated(true);
  };
  const snap = (): UtilizationSnapshot => ({ billableHours: bh, totalAvailable: ta, utilizationRate: utilization, revenue, label: `${bh}h/${ta}h` });

  const chartData = [{ name: 'Your Rate', value: utilization, fill: utilization >= benchmark ? '#10b981' : '#f59e0b' },
    ...INDUSTRY_BENCHMARKS.map((b) => ({ name: b.industry, value: b.target, fill: b.color }))];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
          <Gauge className="inline h-3 w-3 mr-1" />
          Utilization = billable hours ÷ total available hours. Industry targets: consulting 75%, legal 70%, agency 65%, accounting 60%.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ur-billable">Billable Hours (period)</Label>
            <Input id="ur-billable" type="number" step="1" min="0" placeholder="1500" value={billableHours}
              onChange={(e) => { setBillableHours(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Hours billed to clients in the period.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ur-total">Total Available Hours</Label>
            <Input id="ur-total" type="number" step="1" min="0" placeholder="2080" value={totalAvailable}
              onChange={(e) => { setTotalAvailable(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Full-year = 2,080h (40h × 52w). Subtract PTO/holidays.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ur-rate">Hourly Billable Rate (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ur-rate" type="number" step="5" min="0" placeholder="150" value={hourlyRate}
                onChange={(e) => { setHourlyRate(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ur-industry">Industry Benchmark</Label>
            <select id="ur-industry" value={industry} onChange={(e) => { setIndustry(e.target.value); setCalculated(false); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {INDUSTRY_BENCHMARKS.map((b) => <option key={b.industry} value={b.industry}>{b.industry} ({b.target}% target)</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={ta <= 0 || bh <= 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none">
              Calculate Utilization
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Utilization Rate</p>
                <p className={`text-4xl font-bold ${utilization >= benchmark ? 'text-emerald-600' : 'text-amber-600'}`}>{formatPercent(utilization)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{bh}h billable</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{ta}h available</Badge>
                  <Badge variant="outline" className={gap >= 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-red-500/10 border-red-500/30 text-red-600'}>
                    {gap >= 0 ? '+' : ''}{gap.toFixed(1)}% vs target
                  </Badge>
                  {r > 0 && <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600">Revenue: {formatCurrency(revenue)}</Badge>}
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Billable Hours', value: `${bh}h` },
                  { label: 'Available Hours', value: `${ta}h` },
                  { label: 'Utilization', value: formatPercent(utilization), amber: true },
                  { label: 'Target', value: `${benchmark}%` },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.amber ? (utilization >= benchmark ? 'text-emerald-600' : 'text-amber-600') : ''}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <RechartsTooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 Utilization rate is a key KPI for professional services. Below target means lost revenue; above target risks burnout. Each 5% increase at $150/hr × 2,080h available = $15,600 additional annual revenue per consultant. See <a href="/calculators/billable-hours-calculator" className="text-blue-600 hover:underline">Billable Hours Calculator</a> for full billable revenue tracking.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Billable Hours', valueA: `${compareA.billableHours}h`, valueB: `${compareB.billableHours}h`, numA: compareA.billableHours, numB: compareB.billableHours },
          { label: 'Available Hours', valueA: `${compareA.totalAvailable}h`, valueB: `${compareB.totalAvailable}h`, numA: compareA.totalAvailable, numB: compareB.totalAvailable },
          { label: 'Utilization Rate', valueA: formatPercent(compareA.utilizationRate), valueB: formatPercent(compareB.utilizationRate), numA: compareA.utilizationRate, numB: compareB.utilizationRate },
          ...(compareA.revenue > 0 || compareB.revenue > 0 ? [{
            label: 'Revenue', valueA: formatCurrency(compareA.revenue), valueB: formatCurrency(compareB.revenue),
            numA: compareA.revenue, numB: compareB.revenue,
          }] : []),
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

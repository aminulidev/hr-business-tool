'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, ReferenceLine, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

// 2024 revenue per employee benchmarks (approximate industry averages)
const BENCHMARKS = [
  { industry: 'Technology (SaaS)', rpe: 350000, color: '#6366f1' },
  { industry: 'Finance / Banking', rpe: 280000, color: '#3b82f6' },
  { industry: 'Consulting Services', rpe: 160000, color: '#14b8a6' },
  { industry: 'Healthcare', rpe: 120000, color: '#10b981' },
  { industry: 'Retail', rpe: 95000, color: '#f59e0b' },
  { industry: 'Manufacturing', rpe: 185000, color: '#8b5cf6' },
  { industry: 'Hospitality', rpe: 55000, color: '#ec4899' },
  { industry: 'Construction', rpe: 135000, color: '#f97316' },
];

interface RpeSnap { revenue: number; employees: number; rpe: number; label: string; }

export default function RevenuePerEmployeeCalculator() {
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [numEmployees, setNumEmployees] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<RpeSnap | null>(null);
  const [compareB, setCompareB] = useState<RpeSnap | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualRevenue: string; numEmployees: string }>('revenue-per-employee-calculator');

  const revenueNum = parseFloat(annualRevenue.replace(/,/g, '')) || 0;
  const empNum = parseFloat(numEmployees) || 0;
  const rpe = empNum > 0 ? revenueNum / empNum : 0;

  const getRating = (val: number) => {
    if (val >= 500000) return { label: 'Elite', color: '#6366f1' };
    if (val >= 200000) return { label: 'Above Average', color: '#10b981' };
    if (val >= 100000) return { label: 'Average', color: '#f59e0b' };
    return { label: 'Below Average', color: '#ef4444' };
  };

  const rating = getRating(rpe);

    const handleTryExample = () => {
    setAnnualRevenue('5000000');
    setNumEmployees('25');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (revenueNum > 0 && empNum > 0) {
      setCalculated(true);
      saveEntry({ annualRevenue, numEmployees }, `${empNum} employees · Revenue: ${formatCurrency(revenueNum)} · RPE: ${formatCurrency(rpe)}`);
    }
  };
  const handleReset = () => { setAnnualRevenue(''); setNumEmployees(''); setCalculated(false); };
  const handleRestore = (i: { annualRevenue: string; numEmployees: string }) => {
    setAnnualRevenue(i.annualRevenue); setNumEmployees(i.numEmployees); setCalculated(true);
  };
  const snap = (): RpeSnap => ({ revenue: revenueNum, employees: empNum, rpe, label: `${empNum} FTEs · ${formatCurrency(rpe)}/emp` });

  const chartData = [
    ...BENCHMARKS.map(b => ({ name: b.industry, rpe: b.rpe, color: b.color, isYou: false })),
    { name: 'Your Company', rpe, color: '#ef4444', isYou: true },
  ].sort((a, b) => b.rpe - a.rpe);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annual-revenue">Annual Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annual-revenue" type="number" step="100000" min="0" placeholder="5,000,000"
                value={annualRevenue} onChange={(e) => { setAnnualRevenue(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="num-employees">Number of FTE Employees</Label>
            <Input id="num-employees" type="number" step="1" min="1" placeholder="50"
              value={numEmployees} onChange={(e) => { setNumEmployees(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Full-time equivalents (part-time = 0.5 FTE)</p>
          </div>
        </div>

        {revenueNum > 0 && empNum > 0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border/50 bg-muted/20 p-3 text-sm">
            Revenue per employee: <strong style={{ color: rating.color }}>{formatCurrency(rpe)}</strong>
            <span className="text-muted-foreground ml-2">— {rating.label}</span>
          </motion.div>
        )}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-6">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCalculate}
              disabled={revenueNum <= 0 || empNum <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow-emerald-500/25 text-white shadow-lg"
              size="lg"
            >
              Calculate Revenue per Employee
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="result-display" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Revenue per Employee</p>
                <p className="text-4xl font-bold" style={{ color: rating.color }}>{formatCurrency(rpe)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" style={{ borderColor: `${rating.color}40`, color: rating.color, backgroundColor: `${rating.color}10` }}>
                    {rating.label}
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
                    {empNum} FTE employees
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Annual Revenue', value: formatCurrency(revenueNum) },
                  { label: 'FTE Employees', value: `${empNum}` },
                  { label: 'Revenue per FTE', value: formatCurrency(rpe) },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-base sm:text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Industry Benchmark Chart */}
              <div>
                <p className="text-sm font-medium mb-3">Industry Benchmark Comparison</p>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
                      <RechartsTooltip formatter={(v: number) => [formatCurrency(v), 'Revenue per Employee']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                      {rpe > 0 && <ReferenceLine x={rpe} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'You', position: 'top', fill: '#ef4444', fontSize: 10 }} />}
                      <Bar dataKey="rpe" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, i) => <Cell key={i} fill={entry.color} opacity={entry.isYou ? 1 : 0.7} />)}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Benchmark Table */}
              <div className="space-y-1">
                {BENCHMARKS.sort((a, b) => b.rpe - a.rpe).map((b) => (
                  <div key={b.industry} className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-36 shrink-0">{b.industry}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(b.rpe / 400000) * 100}%`, backgroundColor: b.color }} />
                    </div>
                    <span className="font-medium w-20 text-right">{formatCurrency(b.rpe)}</span>
                    {rpe > 0 && (
                      <span className={`w-14 text-right font-medium ${rpe >= b.rpe ? 'text-emerald-600' : 'text-red-500'}`}>
                        {rpe >= b.rpe ? '✓ Above' : '↓ Below'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Annual Revenue', valueA: formatCurrency(compareA.revenue), valueB: formatCurrency(compareB.revenue), numA: compareA.revenue, numB: compareB.revenue },
          { label: 'FTE Employees', valueA: `${compareA.employees}`, valueB: `${compareB.employees}`, numA: compareA.employees, numB: compareB.employees },
          { label: 'Revenue per Employee', valueA: formatCurrency(compareA.rpe), valueB: formatCurrency(compareB.rpe), numA: compareA.rpe, numB: compareB.rpe },
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
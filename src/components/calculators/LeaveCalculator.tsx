'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarRange } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

interface LeaveSnapshot { totalPTO: number; totalSick: number; totalPersonal: number; usedTotal: number; remaining: number; label: string; }

export default function LeaveCalculator() {
  const [ptoEntitled, setPtoEntitled] = useState('120');
  const [ptoUsed, setPtoUsed] = useState('40');
  const [sickEntitled, setSickEntitled] = useState('40');
  const [sickUsed, setSickUsed] = useState('8');
  const [personalEntitled, setPersonalEntitled] = useState('24');
  const [personalUsed, setPersonalUsed] = useState('8');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<LeaveSnapshot | null>(null);
  const [compareB, setCompareB] = useState<LeaveSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ ptoEntitled: string; ptoUsed: string; sickEntitled: string; sickUsed: string; personalEntitled: string; personalUsed: string }>('leave-calculator');

  const ptoE = parseFloat(ptoEntitled) || 0;
  const ptoU = parseFloat(ptoUsed) || 0;
  const sickE = parseFloat(sickEntitled) || 0;
  const sickU = parseFloat(sickUsed) || 0;
  const persE = parseFloat(personalEntitled) || 0;
  const persU = parseFloat(personalUsed) || 0;

  const totalEntitled = ptoE + sickE + persE;
  const totalUsed = ptoU + sickU + persU;
  const remaining = totalEntitled - totalUsed;
  const usedPct = totalEntitled > 0 ? (totalUsed / totalEntitled) * 100 : 0;

  const handleTryExample = () => { setPtoEntitled('120'); setPtoUsed('40'); setSickEntitled('40'); setSickUsed('8'); setPersonalEntitled('24'); setPersonalUsed('8'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalEntitled > 0) {
      setCalculated(true);
      saveEntry({ ptoEntitled, ptoUsed, sickEntitled, sickUsed, personalEntitled, personalUsed }, `${remaining}h remaining of ${totalEntitled}h · ${usedPct.toFixed(0)}% used`);
    }
  };
  const handleReset = () => { setPtoEntitled('120'); setPtoUsed('0'); setSickEntitled('40'); setSickUsed('0'); setPersonalEntitled('24'); setPersonalUsed('0'); setCalculated(false); };
  const handleRestore = (i: { ptoEntitled: string; ptoUsed: string; sickEntitled: string; sickUsed: string; personalEntitled: string; personalUsed: string }) => {
    setPtoEntitled(i.ptoEntitled); setPtoUsed(i.ptoUsed); setSickEntitled(i.sickEntitled); setSickUsed(i.sickUsed); setPersonalEntitled(i.personalEntitled); setPersonalUsed(i.personalUsed); setCalculated(true);
  };
  const snap = (): LeaveSnapshot => ({ totalPTO: ptoE - ptoU, totalSick: sickE - sickU, totalPersonal: persE - persU, usedTotal: totalUsed, remaining, label: `${remaining}h remaining` });

  const chartData = [
    { name: 'PTO Remaining', value: ptoE - ptoU, fill: '#10b981' },
    { name: 'PTO Used', value: ptoU, fill: '#64748b' },
    { name: 'Sick Remaining', value: sickE - sickU, fill: '#3b82f6' },
    { name: 'Sick Used', value: sickU, fill: '#64748b' },
    { name: 'Personal Remaining', value: persE - persU, fill: '#8b5cf6' },
    { name: 'Personal Used', value: persU, fill: '#64748b' },
  ];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'PTO/Vacation', ent: ptoEntitled, setEnt: setPtoEntitled, used: ptoUsed, setUsed: setPtoUsed, color: 'emerald' },
            { label: 'Sick Leave', ent: sickEntitled, setEnt: setSickEntitled, used: sickUsed, setUsed: setSickUsed, color: 'blue' },
            { label: 'Personal Leave', ent: personalEntitled, setEnt: setPersonalEntitled, used: personalUsed, setUsed: setPersonalUsed, color: 'violet' },
          ].map((row, i) => (
            <div key={i} className={`rounded-xl border border-${row.color}-500/20 bg-${row.color}-500/5 p-4 space-y-3`}>
              <h4 className={`text-sm font-semibold text-${row.color}-700 dark:text-${row.color}-300`}>{row.label}</h4>
              <div className="space-y-2">
                <Label className="text-xs">Entitled (hours)</Label>
                <Input type="number" step="1" min="0" placeholder="120" value={row.ent}
                  onChange={(e) => { row.setEnt(e.target.value); setCalculated(false); }} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Used (hours)</Label>
                <Input type="number" step="1" min="0" placeholder="40" value={row.used}
                  onChange={(e) => { row.setUsed(e.target.value); setCalculated(false); }} />
              </div>
              <div className="text-xs text-muted-foreground">Remaining: <span className="font-semibold">{parseFloat(row.ent) - parseFloat(row.used) || 0}h</span></div>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalEntitled <= 0}
              className="bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 text-white shadow-lg shadow-violet-500/25 flex-1 sm:flex-none">
              Calculate Leave Balance
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Leave Remaining</p>
                <p className="text-4xl font-bold text-violet-600">{remaining}h</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{ptoE - ptoU}h PTO</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{sickE - sickU}h sick</Badge>
                  <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600">{persE - persU}h personal</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{usedPct.toFixed(0)}% used</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Entitled', value: `${totalEntitled}h` },
                  { label: 'Total Used', value: `${totalUsed}h` },
                  { label: 'Remaining', value: `${remaining}h`, amber: true },
                  { label: '% Used', value: `${usedPct.toFixed(0)}%` },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.amber ? 'text-violet-600' : ''}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(v) => `${v}h`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [`${v}h`, '']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 Typical US leave entitlement: 10-15 days PTO (80-120h), 5-10 days sick (40-80h), 2-3 days personal (16-24h). The US is the only OECD country without mandated paid leave — 23% of US workers have zero paid leave. State mandates: CA, NY, WA, MA, OR, AZ, VT, CT, MI, MD, NM, CO, IL, NV, MN, ME require paid sick leave. See <a href="/calculators/sick-leave-calculator" className="text-violet-600 hover:underline">Sick Leave Calculator</a> for state-specific rules.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'PTO Remaining', valueA: `${compareA.totalPTO}h`, valueB: `${compareB.totalPTO}h`, numA: compareA.totalPTO, numB: compareB.totalPTO },
          { label: 'Sick Remaining', valueA: `${compareA.totalSick}h`, valueB: `${compareB.totalSick}h`, numA: compareA.totalSick, numB: compareB.totalSick },
          { label: 'Personal Remaining', valueA: `${compareA.totalPersonal}h`, valueB: `${compareB.totalPersonal}h`, numA: compareA.totalPersonal, numB: compareB.totalPersonal },
          { label: 'Total Used', valueA: `${compareA.usedTotal}h`, valueB: `${compareB.usedTotal}h`, numA: compareA.usedTotal, numB: compareB.usedTotal },
          { label: 'Total Remaining', valueA: `${compareA.remaining}h`, valueB: `${compareB.remaining}h`, numA: compareA.remaining, numB: compareB.remaining },
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

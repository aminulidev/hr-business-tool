'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { rev: number; mau: number; valuePerMau: number; annualValue: number; annualRevenue: number; label: string; }

export default function MauValueCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [totalMau, setTotalMau] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ monthlyRevenue: string; totalMau: string }>('mau-value-calculator');

  const rev = parseFloat(monthlyRevenue) || 0;
  const mau = parseFloat(totalMau) || 0;
  const valuePerMau = mau > 0 ? rev / mau : 0;
  const annualValue = valuePerMau * 12;
  const annualRevenue = rev * 12;

  const handleTryExample = () => { setMonthlyRevenue('50000'); setTotalMau('50000'); setCalculated(false); };
  const handleCalculate = () => {
    if (mau > 0) {
      setCalculated(true);
      saveEntry({ monthlyRevenue, totalMau }, `Value/MAU: ${formatCurrency(valuePerMau)}/mo (${mau.toLocaleString()} MAU)`);
    }
  };
  const handleReset = () => { setMonthlyRevenue(''); setTotalMau(''); setCalculated(false); };
  const handleRestore = (i: { monthlyRevenue: string; totalMau: string }) => { setMonthlyRevenue(i.monthlyRevenue); setTotalMau(i.totalMau); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, mau, valuePerMau, annualValue, annualRevenue, label: `Value/MAU: ${formatCurrency(valuePerMau)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Calculate value per MAU = revenue / monthly active users. Track ARPU per active user.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="monthlyRevenue" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={monthlyRevenue} onChange={(e) => { setMonthlyRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalMau">Monthly Active Users</Label>
            <div className="relative">
              
              <Input id="totalMau" type="number" step="any" min="0" placeholder="50000"
                value={totalMau} onChange={(e) => { setTotalMau(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={mau <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate MAU Value
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Value Per MAU</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(valuePerMau)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Annual value/MAU: ${formatCurrency(annualValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Annual revenue: ${formatCurrency(annualRevenue)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Social $1-10, Gaming $0.50-5, SaaS $50-500'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">MAU</p>
                    <p className={`text-lg font-bold`}>{`{mau.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Value/MAU</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(valuePerMau)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Rev</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(annualRevenue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Value per MAU = monthly revenue / monthly active users. Benchmarks: social $1-10, gaming $0.50-5, SaaS $50-500.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'MAU', valueA: compareA.mau.toLocaleString(), valueB: compareB.mau.toLocaleString(), numA: compareA.mau, numB: compareB.mau }
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

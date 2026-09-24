'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { rev: number; users: number; arpu: number; annualArpu: number; arr: number; label: string; }

export default function ArpuCalculator() {
  const [totalRevenue, setTotalRevenue] = useState('');
  const [totalUsers, setTotalUsers] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalRevenue: string; totalUsers: string }>('arpu-calculator');

  const rev = parseFloat(totalRevenue) || 0;
  const users = parseFloat(totalUsers) || 0;
  const arpu = users > 0 ? rev / users : 0;
  const annualArpu = arpu * 12;
  const arr = arpu * users * 12;

  const handleTryExample = () => { setTotalRevenue('100000'); setTotalUsers('1000'); setCalculated(false); };
  const handleCalculate = () => {
    if (users > 0) {
      setCalculated(true);
      saveEntry({ totalRevenue, totalUsers }, `ARPU: ${formatCurrency(arpu)}/mo (annual: ${formatCurrency(annualArpu)})`);
    }
  };
  const handleReset = () => { setTotalRevenue(''); setTotalUsers(''); setCalculated(false); };
  const handleRestore = (i: { totalRevenue: string; totalUsers: string }) => { setTotalRevenue(i.totalRevenue); setTotalUsers(i.totalUsers); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, users, arpu, annualArpu, arr, label: `ARPU: ${formatCurrency(arpu)}/mo` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate ARPU = total revenue / total users. SaaS benchmarks: SMB $50-200/mo, mid-market $500-2k.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalRevenue">Total Revenue (monthly)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalRevenue" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={totalRevenue} onChange={(e) => { setTotalRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalUsers">Total Active Users</Label>
            <div className="relative">
              
              <Input id="totalUsers" type="number" step="any" min="0" placeholder="1000"
                value={totalUsers} onChange={(e) => { setTotalUsers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={users <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate ARPU
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Average Revenue Per User</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(arpu)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Annual ARPU: ${formatCurrency(annualArpu)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`ARR: ${formatCurrency(arr)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'SMB $50-200, Mid-market $500-2k, Enterprise $5k-50k'}</Badge>
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
                    <p className="text-xs text-muted-foreground mb-1">Users</p>
                    <p className={`text-lg font-bold`}>{`{users}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ARPU</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(arpu)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual ARPU</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(annualArpu)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`ARPU = total revenue / total users. SaaS benchmarks: SMB $50-200/mo, mid-market $500-2k, enterprise $5k-50k.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'ARPU', valueA: formatCurrency(compareA.arpu), valueB: formatCurrency(compareB.arpu), numA: compareA.arpu, numB: compareB.arpu }
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

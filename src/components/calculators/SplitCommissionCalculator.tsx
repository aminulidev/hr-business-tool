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

interface Snapshot { deal: number; rate: number; r1: number; r2: number; totalCommission: number; rep1Commission: number; rep2Commission: number; label: string; }

export default function SplitCommissionCalculator() {
  const [dealValue, setDealValue] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [rep1Split, setRep1Split] = useState('');
  const [rep2Split, setRep2Split] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ dealValue: string; commissionRate: string; rep1Split: string; rep2Split: string }>('split-commission-calculator');

  const deal = parseFloat(dealValue) || 0;
  const rate = parseFloat(commissionRate) || 0;
  const r1 = parseFloat(rep1Split) || 0;
  const r2 = parseFloat(rep2Split) || 0;
  const totalCommission = deal * (rate / 100);
  const rep1Commission = totalCommission * (r1 / 100);
  const rep2Commission = totalCommission * (r2 / 100);

  const handleTryExample = () => { setDealValue('100000'); setCommissionRate('10'); setRep1Split('60'); setRep2Split('40'); setCalculated(false); };
  const handleCalculate = () => {
    if (deal > 0 && rate > 0) {
      setCalculated(true);
      saveEntry({ dealValue, commissionRate, rep1Split, rep2Split }, `Total: ${formatCurrency(totalCommission)} (Rep1: ${formatCurrency(rep1Commission)}, Rep2: ${formatCurrency(rep2Commission)})`);
    }
  };
  const handleReset = () => { setDealValue(''); setCommissionRate('10'); setRep1Split('60'); setRep2Split('40'); setCalculated(false); };
  const handleRestore = (i: { dealValue: string; commissionRate: string; rep1Split: string; rep2Split: string }) => { setDealValue(i.dealValue); setCommissionRate(i.commissionRate); setRep1Split(i.rep1Split); setRep2Split(i.rep2Split); setCalculated(true); };
  const snap = (): Snapshot => ({ deal, rate, r1, r2, totalCommission, rep1Commission, rep2Commission, label: `Total: ${formatCurrency(totalCommission)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Split commission between multiple sales reps on a shared deal. Enter total deal, commission rate, and each rep's split %.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dealValue">Deal Value</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="dealValue" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={dealValue} onChange={(e) => { setDealValue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="commissionRate">Commission Rate (%)</Label>
            <div className="relative">
              
              <Input id="commissionRate" type="number" step="any" min="0" placeholder="10"
                value={commissionRate} onChange={(e) => { setCommissionRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rep1Split">Rep 1 Split (%)</Label>
            <div className="relative">
              
              <Input id="rep1Split" type="number" step="any" min="0" placeholder="60"
                value={rep1Split} onChange={(e) => { setRep1Split(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rep2Split">Rep 2 Split (%)</Label>
            <div className="relative">
              
              <Input id="rep2Split" type="number" step="any" min="0" placeholder="40"
                value={rep2Split} onChange={(e) => { setRep2Split(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={deal <= 0 || rate <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Split Commission
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Commission</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCommission)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Rep 1: ${formatCurrency(rep1Commission)} (${r1}%)`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Rep 2: ${formatCurrency(rep2Commission)} (${r2}%)`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Commission rate: ${rate}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Deal Value</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(deal)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Commission Rate</p>
                    <p className={`text-lg font-bold`}>{`{rate}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Commission</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalCommission)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Rep 1 / Rep 2</p>
                    <p className={`text-lg font-bold`}>{`${formatCurrency(rep1Commission)} / ${formatCurrency(rep2Commission)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Split commission divides commission between multiple reps on shared deals. Common in team-based selling, account handoffs, or co-selling. Split percentages should total 100%. Document split rationale in CRM. See our Commission Split Calculator for rep-vs-company splits.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Deal Value', valueA: formatCurrency(compareA.deal), valueB: formatCurrency(compareB.deal), numA: compareA.deal, numB: compareB.deal },
          { label: 'Total Commission', valueA: formatCurrency(compareA.totalCommission), valueB: formatCurrency(compareB.totalCommission), numA: compareA.totalCommission, numB: compareB.totalCommission },
          { label: 'Rep 1', valueA: formatCurrency(compareA.rep1Commission), valueB: formatCurrency(compareB.rep1Commission), numA: compareA.rep1Commission, numB: compareB.rep1Commission }
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

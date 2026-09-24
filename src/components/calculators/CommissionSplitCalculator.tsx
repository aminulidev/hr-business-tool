'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { commission: number; rs: number; repShare: number; managerShare: number; repTakeHome: number; companyShare: number; label: string; }

export default function CommissionSplitCalculator() {
  const [commissionEarned, setCommissionEarned] = useState('');
  const [repSplit, setRepSplit] = useState('');
  const [managerOverride, setManagerOverride] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ commissionEarned: string; repSplit: string; managerOverride: string }>('commission-split-calculator');

  const commission = parseFloat(commissionEarned) || 0;
  const rs = parseFloat(repSplit) || 0;
  const mo = parseFloat(managerOverride) || 0;
  const repShare = commission * (rs / 100);
  const managerShare = repShare * (mo / 100);
  const repTakeHome = repShare - managerShare;
  const companyShare = commission - repShare;

  const handleTryExample = () => { setCommissionEarned('15000'); setRepSplit('70'); setManagerOverride('5'); setCalculated(false); };
  const handleCalculate = () => {
    if (commission > 0) {
      setCalculated(true);
      saveEntry({ commissionEarned, repSplit, managerOverride }, `Rep take-home: ${formatCurrency(repTakeHome)} (company: ${formatCurrency(companyShare)})`);
    }
  };
  const handleReset = () => { setCommissionEarned(''); setRepSplit('70'); setManagerOverride('5'); setCalculated(false); };
  const handleRestore = (i: { commissionEarned: string; repSplit: string; managerOverride: string }) => { setCommissionEarned(i.commissionEarned); setRepSplit(i.repSplit); setManagerOverride(i.managerOverride); setCalculated(true); };
  const snap = (): Snapshot => ({ commission, rs, repShare, managerShare, repTakeHome, companyShare, label: `Rep: ${formatCurrency(repTakeHome)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <ArrowLeftRight className="inline h-3 w-3 mr-1" />
          {`Calculate commission split between sales rep and company (e.g., 60/40, 70/30). Used for 1099 and independent contractor sales.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commissionEarned">Total Commission Earned</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="commissionEarned" type="number" step="any" min="0" placeholder="15000" className="pl-7"
                value={commissionEarned} onChange={(e) => { setCommissionEarned(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="repSplit">Rep Split (%)</Label>
            <div className="relative">
              
              <Input id="repSplit" type="number" step="any" min="0" placeholder="70"
                value={repSplit} onChange={(e) => { setRepSplit(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerOverride">Manager Override (%)</Label>
            <div className="relative">
              
              <Input id="managerOverride" type="number" step="any" min="0" placeholder="5"
                value={managerOverride} onChange={(e) => { setManagerOverride(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Of rep's split</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={commission <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Commission Split
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Rep Take-Home</p>
                <p className="text-4xl font-bold text-emerald-600">{`${formatCurrency(repTakeHome)}`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Rep gross: ${formatCurrency(repShare)} (${rs}%)`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Manager override: ${formatCurrency(managerShare)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Company: ${formatCurrency(companyShare)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Commission</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(commission)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Rep Split</p>
                    <p className={`text-lg font-bold`}>{`{rs}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Rep Take-Home</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(repTakeHome)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Company Share</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(companyShare)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Commission split = division between rep and company. Common: 60/40, 70/30, 80/20. Manager override = % of rep's commission paid to sales manager. Typical: 5-10%. Used in real estate (broker/agent split), insurance, 1099 sales. See our Split Commission Calculator for multi-rep deal splits.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Commission', valueA: formatCurrency(compareA.commission), valueB: formatCurrency(compareB.commission), numA: compareA.commission, numB: compareB.commission },
          { label: 'Rep Take-Home', valueA: formatCurrency(compareA.repTakeHome), valueB: formatCurrency(compareB.repTakeHome), numA: compareA.repTakeHome, numB: compareB.repTakeHome },
          { label: 'Company', valueA: formatCurrency(compareA.companyShare), valueB: formatCurrency(compareB.companyShare), numA: compareA.companyShare, numB: compareB.companyShare }
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

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { fs: number; is: number; os: number; totalShares: number; founderPct: number; investorPct: number; optionPct: number; label: string; }

export default function CapTableCalculator() {
  const [founderShares, setFounderShares] = useState('');
  const [investorShares, setInvestorShares] = useState('');
  const [optionShares, setOptionShares] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ founderShares: string; investorShares: string; optionShares: string }>('cap-table-calculator');

  const fs = parseFloat(founderShares) || 0;
  const is = parseFloat(investorShares) || 0;
  const os = parseFloat(optionShares) || 0;
  const totalShares = fs + is + os;
  const founderPct = totalShares > 0 ? (fs / totalShares) * 100 : 0;
  const investorPct = totalShares > 0 ? (is / totalShares) * 100 : 0;
  const optionPct = totalShares > 0 ? (os / totalShares) * 100 : 0;

  const handleTryExample = () => { setFounderShares('8000000'); setInvestorShares('4000000'); setOptionShares('1000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalShares > 0) {
      setCalculated(true);
      saveEntry({ founderShares, investorShares, optionShares }, `Founders: ${founderPct.toFixed(1)}%, Investors: ${investorPct.toFixed(1)}%, Options: ${optionPct.toFixed(1)}%`);
    }
  };
  const handleReset = () => { setFounderShares(''); setInvestorShares(''); setOptionShares(''); setCalculated(false); };
  const handleRestore = (i: { founderShares: string; investorShares: string; optionShares: string }) => { setFounderShares(i.founderShares); setInvestorShares(i.investorShares); setOptionShares(i.optionShares); setCalculated(true); };
  const snap = (): Snapshot => ({ fs, is, os, totalShares, founderPct, investorPct, optionPct, label: `Founders: ${founderPct.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Build a cap table showing founder, investor, and employee ownership.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="founderShares">Founder Shares</Label>
            <div className="relative">
              
              <Input id="founderShares" type="number" step="any" min="0" placeholder="8000000"
                value={founderShares} onChange={(e) => { setFounderShares(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="investorShares">Investor Shares</Label>
            <div className="relative">
              
              <Input id="investorShares" type="number" step="any" min="0" placeholder="4000000"
                value={investorShares} onChange={(e) => { setInvestorShares(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="optionShares">Option Pool Shares</Label>
            <div className="relative">
              
              <Input id="optionShares" type="number" step="any" min="0" placeholder="1000000"
                value={optionShares} onChange={(e) => { setOptionShares(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalShares <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Cap Table
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cap Table</p>
                <p className="text-4xl font-bold text-emerald-600">{`{totalShares.toLocaleString()} total shares`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Founders: ${founderPct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Investors: ${investorPct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Options: ${optionPct.toFixed(1)}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Founder Shares</p>
                    <p className={`text-lg font-bold`}>{`{fs.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Investor Shares</p>
                    <p className={`text-lg font-bold`}>{`{is.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Option Pool</p>
                    <p className={`text-lg font-bold`}>{`{os.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Shares</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{totalShares.toLocaleString()}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Cap table shows ownership % = shares / total shares. Typical post-Series A: founders 60-70%, investors 20-30%, options 10-15%.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Founders', valueA: `${compareA.founderPct.toFixed(1)}%`, valueB: `${compareB.founderPct.toFixed(1)}%`, numA: compareA.founderPct, numB: compareB.founderPct },
          { label: 'Investors', valueA: `${compareA.investorPct.toFixed(1)}%`, valueB: `${compareB.investorPct.toFixed(1)}%`, numA: compareA.investorPct, numB: compareB.investorPct }
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

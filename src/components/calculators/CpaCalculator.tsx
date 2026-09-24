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

interface Snapshot { spend: number; conv: number; cpa: number; label: string; }

export default function CpaCalculator() {
  const [totalSpend, setTotalSpend] = useState('');
  const [conversions, setConversions] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalSpend: string; conversions: string }>('cpa-calculator');

  const spend = parseFloat(totalSpend) || 0;
  const conv = parseFloat(conversions) || 0;
  const cpa = conv > 0 ? spend / conv : 0;

  const handleTryExample = () => { setTotalSpend('10000'); setConversions('50'); setCalculated(false); };
  const handleCalculate = () => {
    if (conv > 0) {
      setCalculated(true);
      saveEntry({ totalSpend, conversions }, `CPA: ${formatCurrency(cpa)} (${conv} customers for ${formatCurrency(spend)})`);
    }
  };
  const handleReset = () => { setTotalSpend(''); setConversions(''); setCalculated(false); };
  const handleRestore = (i: { totalSpend: string; conversions: string }) => { setTotalSpend(i.totalSpend); setConversions(i.conversions); setCalculated(true); };
  const snap = (): Snapshot => ({ spend, conv, cpa, label: `CPA: ${formatCurrency(cpa)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`CPA = total spend / customers acquired. Target CPA < LTV/3 for healthy unit economics.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalSpend">Total Spend</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalSpend" type="number" step="any" min="0" placeholder="10000" className="pl-7"
                value={totalSpend} onChange={(e) => { setTotalSpend(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="conversions">Conversions (customers)</Label>
            <div className="relative">
              
              <Input id="conversions" type="number" step="any" min="0" placeholder="50"
                value={conversions} onChange={(e) => { setConversions(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={conv <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate CPA
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cost Per Acquisition (CPA)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(cpa)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Spend: ${formatCurrency(spend)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Conversions: ${conv}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Target CPA < LTV/3'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(spend)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                    <p className={`text-lg font-bold`}>{`{conv}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CPA</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(cpa)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Conv Rate</p>
                    <p className={`text-lg font-bold`}>{`{spend > 0 ? (conv / spend * 100).toFixed(2) : 0}%/$`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`CPA = total spend / customers acquired. Different from CAC (CPA typically paid media only; CAC includes sales team). Target: CPA < LTV/3 for healthy unit economics. Track by channel: Google $100-500, LinkedIn $200-800, Facebook $50-200. See our CAC and CLV Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Spend', valueA: formatCurrency(compareA.spend), valueB: formatCurrency(compareB.spend), numA: compareA.spend, numB: compareB.spend },
          { label: 'Conversions', valueA: String(compareA.conv), valueB: String(compareB.conv), numA: compareA.conv, numB: compareB.conv },
          { label: 'CPA', valueA: formatCurrency(compareA.cpa), valueB: formatCurrency(compareB.cpa), numA: compareA.cpa, numB: compareB.cpa }
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

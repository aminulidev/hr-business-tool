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

interface Snapshot { spend: number; leads: number; cpl: number; label: string; }

export default function LeadCostCalculator() {
  const [totalSpend, setTotalSpend] = useState('');
  const [leadsGenerated, setLeadsGenerated] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalSpend: string; leadsGenerated: string }>('lead-cost-calculator');

  const spend = parseFloat(totalSpend) || 0;
  const leads = parseFloat(leadsGenerated) || 0;
  const cpl = leads > 0 ? spend / leads : 0;
  const spendPerK = spend / 1000;

  const handleTryExample = () => { setTotalSpend('10000'); setLeadsGenerated('200'); setCalculated(false); };
  const handleCalculate = () => {
    if (leads > 0) {
      setCalculated(true);
      saveEntry({ totalSpend, leadsGenerated }, `CPL: ${formatCurrency(cpl)} (${leads} leads for ${formatCurrency(spend)})`);
    }
  };
  const handleReset = () => { setTotalSpend(''); setLeadsGenerated(''); setCalculated(false); };
  const handleRestore = (i: { totalSpend: string; leadsGenerated: string }) => { setTotalSpend(i.totalSpend); setLeadsGenerated(i.leadsGenerated); setCalculated(true); };
  const snap = (): Snapshot => ({ spend, leads, cpl, label: `CPL: ${formatCurrency(cpl)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Cost per lead (CPL) = total spend / leads generated. Track by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalSpend">Total Marketing Spend</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalSpend" type="number" step="any" min="0" placeholder="10000" className="pl-7"
                value={totalSpend} onChange={(e) => { setTotalSpend(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadsGenerated">Leads Generated</Label>
            <div className="relative">
              
              <Input id="leadsGenerated" type="number" step="any" min="0" placeholder="200"
                value={leadsGenerated} onChange={(e) => { setLeadsGenerated(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={leads <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Lead Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cost Per Lead (CPL)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(cpl)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total spend: ${formatCurrency(spend)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Leads: ${leads}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Google Ads $50-200, LinkedIn $75-300'}</Badge>
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
                    <p className="text-xs text-muted-foreground mb-1">Leads</p>
                    <p className={`text-lg font-bold`}>{`{leads}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CPL</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(cpl)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Spend per 1k Leads</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(spendPerK * 1000)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`CPL = total spend / leads generated. Track by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75, content $50-150, events $100-500. Lower = better. But quality matters — track CPL-to-SQL conversion too. See our CAC and CPL Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Spend', valueA: formatCurrency(compareA.spend), valueB: formatCurrency(compareB.spend), numA: compareA.spend, numB: compareB.spend },
          { label: 'Leads', valueA: String(compareA.leads), valueB: String(compareB.leads), numA: compareA.leads, numB: compareB.leads },
          { label: 'CPL', valueA: formatCurrency(compareA.cpl), valueB: formatCurrency(compareB.cpl), numA: compareA.cpl, numB: compareB.cpl }
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

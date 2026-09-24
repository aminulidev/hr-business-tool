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

interface Snapshot { spend: number; l: number; cpl: number; label: string; }

export default function CplCalculator() {
  const [adSpend, setAdSpend] = useState('');
  const [leads, setLeads] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ adSpend: string; leads: string }>('cpl-calculator');

  const spend = parseFloat(adSpend) || 0;
  const l = parseFloat(leads) || 0;
  const cpl = l > 0 ? spend / l : 0;

  const handleTryExample = () => { setAdSpend('5000'); setLeads('100'); setCalculated(false); };
  const handleCalculate = () => {
    if (l > 0) {
      setCalculated(true);
      saveEntry({ adSpend, leads }, `CPL: ${formatCurrency(cpl)} (${l} leads for ${formatCurrency(spend)})`);
    }
  };
  const handleReset = () => { setAdSpend(''); setLeads(''); setCalculated(false); };
  const handleRestore = (i: { adSpend: string; leads: string }) => { setAdSpend(i.adSpend); setLeads(i.leads); setCalculated(true); };
  const snap = (): Snapshot => ({ spend, l, cpl, label: `CPL: ${formatCurrency(cpl)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`CPL = ad spend / leads. Compare CPL by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adSpend">Ad Spend</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="adSpend" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={adSpend} onChange={(e) => { setAdSpend(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leads">Leads Generated</Label>
            <div className="relative">
              
              <Input id="leads" type="number" step="any" min="0" placeholder="100"
                value={leads} onChange={(e) => { setLeads(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={l <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate CPL
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
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Spend: ${formatCurrency(spend)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Leads: ${l}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Google $50-200, LinkedIn $75-300, FB $25-75'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ad Spend</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(spend)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Leads</p>
                    <p className={`text-lg font-bold`}>{`{l}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CPL</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(cpl)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Leads per $1k</p>
                    <p className={`text-lg font-bold`}>{`{(l / spend * 1000).toFixed(1)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`CPL = ad spend / leads. Track by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75, content $50-150. Lower = better. But track lead quality (CPL-to-SQL conversion). See our Lead Cost and CPA Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Spend', valueA: formatCurrency(compareA.spend), valueB: formatCurrency(compareB.spend), numA: compareA.spend, numB: compareB.spend },
          { label: 'Leads', valueA: String(compareA.l), valueB: String(compareB.l), numA: compareA.l, numB: compareB.l },
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

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { billing: number; cost: number; marginDollars: number; marginPct: number; markupPct: number; markupMult: number; label: string; }

export default function AgencyMarginCalculator() {
  const [clientBilling, setClientBilling] = useState('');
  const [contractorCost, setContractorCost] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ clientBilling: string; contractorCost: string }>('agency-margin-calculator');

  const billing = parseFloat(clientBilling) || 0;
  const cost = parseFloat(contractorCost) || 0;
  const marginDollars = billing - cost;
  const marginPct = billing > 0 ? (marginDollars / billing) * 100 : 0;
  const markupPct = cost > 0 ? (marginDollars / cost) * 100 : 0;
  const markupMult = cost > 0 ? billing / cost : 0;

  const handleTryExample = () => { setClientBilling('150'); setContractorCost('75'); setCalculated(false); };
  const handleCalculate = () => {
    if (billing > 0 && cost > 0) {
      setCalculated(true);
      saveEntry({ clientBilling, contractorCost }, `Margin: ${marginPct.toFixed(1)}% (${formatCurrency(marginDollars)}/hr profit)`);
    }
  };
  const handleReset = () => { setClientBilling(''); setContractorCost(''); setCalculated(false); };
  const handleRestore = (i: { clientBilling: string; contractorCost: string }) => { setClientBilling(i.clientBilling); setContractorCost(i.contractorCost); setCalculated(true); };
  const snap = (): Snapshot => ({ billing, cost, marginDollars, marginPct, markupPct, markupMult, label: `Margin: ${marginPct.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Agency margin = (client billing - contractor cost) / client billing x 100. See margin %, markup %, and profit.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientBilling">Client Billing Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="clientBilling" type="number" step="any" min="0" placeholder="150" className="pl-7"
                value={clientBilling} onChange={(e) => { setClientBilling(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractorCost">Contractor Cost Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="contractorCost" type="number" step="any" min="0" placeholder="75" className="pl-7"
                value={contractorCost} onChange={(e) => { setContractorCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={billing <= 0 || cost <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Agency Margin
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Agency Margin</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(marginPct)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Profit: ${formatCurrency(marginDollars)}/hr`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Markup: ${markupPct.toFixed(1)}% (${markupMult.toFixed(2)}x)`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Typical agency margin: 30-50%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Client Billing</p>
                    <p className={`text-lg font-bold`}>{`${formatCurrency(billing)}/hr`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Contractor Cost</p>
                    <p className={`text-lg font-bold`}>{`${formatCurrency(cost)}/hr`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Margin</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(marginPct)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Markup</p>
                    <p className={`text-lg font-bold`}>{`{markupMult.toFixed(2)}x`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Agency margin = (billing - cost) / billing x 100. Markup = (billing - cost) / cost x 100. Typical: creative agency 40-50%, staffing 20-30%, consulting 30-50%. 50% margin = 2x markup (keystone). See our Profit Margin and Markup Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Billing', valueA: `${formatCurrency(compareA.billing)}/hr`, valueB: `${formatCurrency(compareB.billing)}/hr`, numA: compareA.billing, numB: compareB.billing },
          { label: 'Cost', valueA: `${formatCurrency(compareA.cost)}/hr`, valueB: `${formatCurrency(compareB.cost)}/hr`, numA: compareA.cost, numB: compareB.cost },
          { label: 'Margin', valueA: formatPercent(compareA.marginPct), valueB: formatPercent(compareB.marginPct), numA: compareA.marginPct, numB: compareB.marginPct }
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

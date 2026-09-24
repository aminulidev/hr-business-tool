'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Boxes } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { inv: number; cap: number; stg: number; svc: number; rsk: number; totalPct: number; holdingCost: number; capitalCost: number; storageCost: number; label: string; }

export default function InventoryHoldingCostCalculator() {
  const [avgInventoryValue, setAvgInventoryValue] = useState('');
  const [capitalCostPct, setCapitalCostPct] = useState('Cost of capital/opportunity');
  const [storageCostPct, setStorageCostPct] = useState('Warehouse, utilities');
  const [serviceCostPct, setServiceCostPct] = useState('Insurance, tax, IT');
  const [riskCostPct, setRiskCostPct] = useState('Obsolescence, shrinkage');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ avgInventoryValue: string; capitalCostPct: string; storageCostPct: string; serviceCostPct: string; riskCostPct: string }>('inventory-holding-cost-calculator');

  const inv = parseFloat(avgInventoryValue) || 0;
  const cap = parseFloat(capitalCostPct) || 0;
  const stg = parseFloat(storageCostPct) || 0;
  const svc = parseFloat(serviceCostPct) || 0;
  const rsk = parseFloat(riskCostPct) || 0;
  const totalPct = cap + stg + svc + rsk;
  const holdingCost = inv * (totalPct / 100);
  const capitalCost = inv * (cap / 100);
  const storageCost = inv * (stg / 100);

  const handleTryExample = () => { setAvgInventoryValue('200000'); setCapitalCostPct('12'); setStorageCostPct('5'); setServiceCostPct('3'); setRiskCostPct('5'); setCalculated(false); };
  const handleCalculate = () => {
    if (inv > 0) {
      setCalculated(true);
      saveEntry({ avgInventoryValue, capitalCostPct, storageCostPct, serviceCostPct, riskCostPct }, `Holding cost: ${formatCurrency(holdingCost)} (${totalPct.toFixed(1)}% of inventory)`);
    }
  };
  const handleReset = () => { setAvgInventoryValue(''); setCapitalCostPct('12'); setStorageCostPct('5'); setServiceCostPct('3'); setRiskCostPct('5'); setCalculated(false); };
  const handleRestore = (i: { avgInventoryValue: string; capitalCostPct: string; storageCostPct: string; serviceCostPct: string; riskCostPct: string }) => { setAvgInventoryValue(i.avgInventoryValue); setCapitalCostPct(i.capitalCostPct); setStorageCostPct(i.storageCostPct); setServiceCostPct(i.serviceCostPct); setRiskCostPct(i.riskCostPct); setCalculated(true); };
  const snap = (): Snapshot => ({ inv, cap, stg, svc, rsk, totalPct, holdingCost, capitalCost, storageCost, label: `Holding cost: ${formatCurrency(holdingCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Boxes className="inline h-3 w-3 mr-1" />
          {`Inventory holding cost = capital + storage + service + risk costs. Typical: 20-30% of inventory value annually.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="avgInventoryValue">Average Inventory Value</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="avgInventoryValue" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={avgInventoryValue} onChange={(e) => { setAvgInventoryValue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capitalCostPct">Capital Cost (% of inventory)</Label>
            <div className="relative">
              
              <Input id="capitalCostPct" type="number" step="any" min="0" placeholder="12"
                value={capitalCostPct} onChange={(e) => { setCapitalCostPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Cost of capital/opportunity</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storageCostPct">Storage Cost (%)</Label>
            <div className="relative">
              
              <Input id="storageCostPct" type="number" step="any" min="0" placeholder="5"
                value={storageCostPct} onChange={(e) => { setStorageCostPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Warehouse, utilities</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceCostPct">Service Cost (%)</Label>
            <div className="relative">
              
              <Input id="serviceCostPct" type="number" step="any" min="0" placeholder="3"
                value={serviceCostPct} onChange={(e) => { setServiceCostPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Insurance, tax, IT</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="riskCostPct">Risk Cost (%)</Label>
            <div className="relative">
              
              <Input id="riskCostPct" type="number" step="any" min="0" placeholder="5"
                value={riskCostPct} onChange={(e) => { setRiskCostPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Obsolescence, shrinkage</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={inv <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Holding Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Annual Holding Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(holdingCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Holding cost: ${totalPct.toFixed(1)}% of inventory`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Capital cost: ${formatCurrency(capitalCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Benchmark: 20-30% of inventory value'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Inventory Value</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(inv)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total %</p>
                    <p className={`text-lg font-bold`}>{`{totalPct.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Holding Cost</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(holdingCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(holdingCost / 12)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Holding cost = (capital + storage + service + risk) costs. Typical: 20-30% of inventory value annually. Components: capital 12-15%, storage 3-5%, service (insurance/tax) 2-3%, risk (obsolescence/shrinkage) 3-8%. Reduce by: lower inventory levels (EOQ), better forecasting, JIT, cheaper warehouse. See our EOQ and Inventory Turnover Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Inventory Value', valueA: formatCurrency(compareA.inv), valueB: formatCurrency(compareB.inv), numA: compareA.inv, numB: compareB.inv },
          { label: 'Total %', valueA: `${compareA.totalPct.toFixed(1)}%`, valueB: `${compareB.totalPct.toFixed(1)}%`, numA: compareA.totalPct, numB: compareB.totalPct },
          { label: 'Holding Cost', valueA: formatCurrency(compareA.holdingCost), valueB: formatCurrency(compareB.holdingCost), numA: compareA.holdingCost, numB: compareB.holdingCost },
          { label: 'Monthly', valueA: formatCurrency(compareA.holdingCost / 12), valueB: formatCurrency(compareB.holdingCost / 12), numA: compareA.holdingCost / 12, numB: compareB.holdingCost / 12 }
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

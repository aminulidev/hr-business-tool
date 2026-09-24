'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { cost: number; mgn: number; mu: number; sellingPrice: number; marginRealized: number; markupRealized: number; label: string; }

export default function SellingPriceCalculator() {
  const [unitCost, setUnitCost] = useState('');
  const [marginPct, setMarginPct] = useState('');
  const [markupPct, setMarkupPct] = useState('Use this OR margin');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ unitCost: string; marginPct: string; markupPct: string }>('selling-price-calculator');

  const cost = parseFloat(unitCost) || 0;
  const mgn = parseFloat(marginPct) || 0;
  const mu = parseFloat(markupPct) || 0;
  const priceFromMargin = mgn > 0 ? cost / (1 - mgn / 100) : 0;
  const priceFromMarkup = mu > 0 ? cost * (1 + mu / 100) : 0;
  const sellingPrice = mgn > 0 ? priceFromMargin : priceFromMarkup;
  const markupRealized = cost > 0 ? ((sellingPrice - cost) / cost) * 100 : 0;
  const marginRealized = sellingPrice > 0 ? ((sellingPrice - cost) / sellingPrice) * 100 : 0;

  const handleTryExample = () => { setUnitCost('20'); setMarginPct('40'); setMarkupPct('0'); setCalculated(false); };
  const handleCalculate = () => {
    if (cost > 0 && (mgn > 0 || mu > 0)) {
      setCalculated(true);
      saveEntry({ unitCost, marginPct, markupPct }, `Selling price: ${formatCurrency(sellingPrice)} (${marginRealized.toFixed(1)}% margin)`);
    }
  };
  const handleReset = () => { setUnitCost(''); setMarginPct('40'); setMarkupPct('0'); setCalculated(false); };
  const handleRestore = (i: { unitCost: string; marginPct: string; markupPct: string }) => { setUnitCost(i.unitCost); setMarginPct(i.marginPct); setMarkupPct(i.markupPct); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, mgn, mu, sellingPrice, marginRealized, markupRealized, label: `Selling price: ${formatCurrency(sellingPrice)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Tag className="inline h-3 w-3 mr-1" />
          {`Calculate selling price from cost and desired margin or markup. Selling price = cost / (1 - margin%) or cost × (1 + markup%).`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unitCost">Unit Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="unitCost" type="number" step="any" min="0" placeholder="20" className="pl-7"
                value={unitCost} onChange={(e) => { setUnitCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marginPct">Desired Margin %</Label>
            <div className="relative">
              
              <Input id="marginPct" type="number" step="any" min="0" placeholder="40"
                value={marginPct} onChange={(e) => { setMarginPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="markupPct">Or Markup % (alternative)</Label>
            <div className="relative">
              
              <Input id="markupPct" type="number" step="any" min="0" placeholder="0"
                value={markupPct} onChange={(e) => { setMarkupPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Use this OR margin</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cost <= 0 || (mgn <= 0 && mu <= 0)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Selling Price
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Selling Price</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(sellingPrice)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Realized margin: ${marginRealized.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Realized markup: ${markupRealized.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Profit per unit: ${formatCurrency(sellingPrice - cost)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Unit Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Selling Price</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(sellingPrice)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Profit/Unit</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(sellingPrice - cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Margin %</p>
                    <p className={`text-lg font-bold`}>{`{marginRealized.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Selling price = cost / (1 - margin%) for margin-based pricing, OR cost × (1 + markup%) for markup-based. Margin is % of selling price that's profit; markup is % of cost added. 40% margin = 66.7% markup. 50% markup = 33.3% margin. See our Markup Calculator and Retail Margin Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Unit Cost', valueA: formatCurrency(compareA.cost), valueB: formatCurrency(compareB.cost), numA: compareA.cost, numB: compareB.cost },
          { label: 'Selling Price', valueA: formatCurrency(compareA.sellingPrice), valueB: formatCurrency(compareB.sellingPrice), numA: compareA.sellingPrice, numB: compareB.sellingPrice },
          { label: 'Profit/Unit', valueA: formatCurrency(compareA.sellingPrice - compareA.cost), valueB: formatCurrency(compareB.sellingPrice - compareB.cost), numA: compareA.sellingPrice - compareA.cost, numB: compareB.sellingPrice - compareB.cost },
          { label: 'Margin %', valueA: `${compareA.marginRealized.toFixed(1)}%`, valueB: `${compareB.marginRealized.toFixed(1)}%`, numA: compareA.marginRealized, numB: compareB.marginRealized }
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

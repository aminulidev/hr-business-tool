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

interface Snapshot { cost: number; wmu: number; rmu: number; wholesalePrice: number; wholesaleProfit: number; msrp: number; retailProfit: number; label: string; }

export default function WholesalePriceCalculator() {
  const [manufacturingCost, setManufacturingCost] = useState('');
  const [wholesaleMargin, setWholesaleMargin] = useState('Your profit margin');
  const [retailerMarkup, setRetailerMarkup] = useState('Keystone = 2x');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ manufacturingCost: string; wholesaleMargin: string; retailerMarkup: string }>('wholesale-price-calculator');

  const cost = parseFloat(manufacturingCost) || 0;
  const wmu = parseFloat(wholesaleMargin) || 0;
  const rmu = parseFloat(retailerMarkup) || 2;
  const wholesalePrice = cost / (1 - wmu / 100);
  const wholesaleProfit = wholesalePrice - cost;
  const msrp = wholesalePrice * rmu;
  const retailProfit = msrp - wholesalePrice;

  const handleTryExample = () => { setManufacturingCost('10'); setWholesaleMargin('50'); setRetailerMarkup('2'); setCalculated(false); };
  const handleCalculate = () => {
    if (cost > 0 && wmu < 100) {
      setCalculated(true);
      saveEntry({ manufacturingCost, wholesaleMargin, retailerMarkup }, `Wholesale: ${formatCurrency(wholesalePrice)}, MSRP: ${formatCurrency(msrp)}`);
    }
  };
  const handleReset = () => { setManufacturingCost(''); setWholesaleMargin('50'); setRetailerMarkup('2'); setCalculated(false); };
  const handleRestore = (i: { manufacturingCost: string; wholesaleMargin: string; retailerMarkup: string }) => { setManufacturingCost(i.manufacturingCost); setWholesaleMargin(i.wholesaleMargin); setRetailerMarkup(i.retailerMarkup); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, wmu, rmu, wholesalePrice, wholesaleProfit, msrp, retailProfit, label: `Wholesale: ${formatCurrency(wholesalePrice)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Tag className="inline h-3 w-3 mr-1" />
          {`Wholesale price = manufacturing cost × (1 + wholesale margin%). Retailer typically adds 2x markup (keystone) for MSRP.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manufacturingCost">Manufacturing Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="manufacturingCost" type="number" step="any" min="0" placeholder="10" className="pl-7"
                value={manufacturingCost} onChange={(e) => { setManufacturingCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wholesaleMargin">Wholesale Margin %</Label>
            <div className="relative">
              
              <Input id="wholesaleMargin" type="number" step="any" min="0" placeholder="50"
                value={wholesaleMargin} onChange={(e) => { setWholesaleMargin(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Your profit margin</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="retailerMarkup">Retailer Markup (x)</Label>
            <div className="relative">
              
              <Input id="retailerMarkup" type="number" step="any" min="0" placeholder="2"
                value={retailerMarkup} onChange={(e) => { setRetailerMarkup(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Keystone = 2x</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cost <= 0 || wmu >= 100}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Wholesale Price
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Wholesale Price</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(wholesalePrice)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Your profit: ${formatCurrency(wholesaleProfit)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Suggested MSRP: ${formatCurrency(msrp)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Retailer profit: ${formatCurrency(retailProfit)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Mfg Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Wholesale Price</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(wholesalePrice)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">MSRP</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(msrp)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Retailer Profit</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(retailProfit)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Wholesale price = manufacturing cost / (1 - wholesale margin%). Typical wholesale margin: 40-60%. Retailer markup: 2x (keystone) to 3x. MSRP = wholesale × retailer markup. Example: $10 cost, 50% wholesale margin = $20 wholesale, 2x retailer = $40 MSRP. See our Retail Margin Calculator and Markup Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Mfg Cost', valueA: formatCurrency(compareA.cost), valueB: formatCurrency(compareB.cost), numA: compareA.cost, numB: compareB.cost },
          { label: 'Wholesale', valueA: formatCurrency(compareA.wholesalePrice), valueB: formatCurrency(compareB.wholesalePrice), numA: compareA.wholesalePrice, numB: compareB.wholesalePrice },
          { label: 'MSRP', valueA: formatCurrency(compareA.msrp), valueB: formatCurrency(compareB.msrp), numA: compareA.msrp, numB: compareB.msrp },
          { label: 'Wholesale Profit', valueA: formatCurrency(compareA.wholesaleProfit), valueB: formatCurrency(compareB.wholesaleProfit), numA: compareA.wholesaleProfit, numB: compareB.wholesaleProfit }
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

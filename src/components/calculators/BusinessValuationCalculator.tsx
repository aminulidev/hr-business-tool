'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { rev: number; eb: number; ast: number; rmu: number; emu: number; revValue: number; ebitdaValue: number; assetValue: number; lowEstimate: number; highEstimate: number; midEstimate: number; label: string; }

export default function BusinessValuationCalculator() {
  const [revenue, setRevenue] = useState('');
  const [ebitda, setEbitda] = useState('');
  const [assets, setAssets] = useState('');
  const [revMultiple, setRevMultiple] = useState('Industry: 0.5-3x');
  const [ebitdaMultiple, setEbitdaMultiple] = useState('Industry: 3-8x');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ revenue: string; ebitda: string; assets: string; revMultiple: string; ebitdaMultiple: string }>('business-valuation-calculator');

  const rev = parseFloat(revenue) || 0;
  const eb = parseFloat(ebitda) || 0;
  const ast = parseFloat(assets) || 0;
  const rmu = parseFloat(revMultiple) || 0;
  const emu = parseFloat(ebitdaMultiple) || 0;
  const revValue = rev * rmu;
  const ebitdaValue = eb * emu;
  const assetValue = ast;
  const lowEstimate = Math.min(revValue, ebitdaValue, assetValue);
  const highEstimate = Math.max(revValue, ebitdaValue, assetValue);
  const midEstimate = (revValue + ebitdaValue + assetValue) / 3;

  const handleTryExample = () => { setRevenue('2000000'); setEbitda('400000'); setAssets('800000'); setRevMultiple('1.5'); setEbitdaMultiple('4'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0 || eb > 0 || ast > 0) {
      setCalculated(true);
      saveEntry({ revenue, ebitda, assets, revMultiple, ebitdaMultiple }, `Valuation: ${formatCurrency(midEstimate)} (range ${formatCurrency(lowEstimate)} - ${formatCurrency(highEstimate)})`);
    }
  };
  const handleReset = () => { setRevenue(''); setEbitda(''); setAssets(''); setRevMultiple('1.5'); setEbitdaMultiple('4'); setCalculated(false); };
  const handleRestore = (i: { revenue: string; ebitda: string; assets: string; revMultiple: string; ebitdaMultiple: string }) => { setRevenue(i.revenue); setEbitda(i.ebitda); setAssets(i.assets); setRevMultiple(i.revMultiple); setEbitdaMultiple(i.ebitdaMultiple); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, eb, ast, rmu, emu, revValue, ebitdaValue, assetValue, lowEstimate, highEstimate, midEstimate, label: `Valuation: ${formatCurrency(midEstimate)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Building className="inline h-3 w-3 mr-1" />
          {`Business valuation using revenue multiple, EBITDA multiple, and asset-based methods. See valuation range and methodology comparison.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Annual Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="2000000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ebitda">Annual EBITDA</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ebitda" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={ebitda} onChange={(e) => { setEbitda(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assets">Net Assets (book value)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="assets" type="number" step="any" min="0" placeholder="800000" className="pl-7"
                value={assets} onChange={(e) => { setAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="revMultiple">Revenue Multiple (x)</Label>
            <div className="relative">
              
              <Input id="revMultiple" type="number" step="any" min="0" placeholder="1.5"
                value={revMultiple} onChange={(e) => { setRevMultiple(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Industry: 0.5-3x</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ebitdaMultiple">EBITDA Multiple (x)</Label>
            <div className="relative">
              
              <Input id="ebitdaMultiple" type="number" step="any" min="0" placeholder="4"
                value={ebitdaMultiple} onChange={(e) => { setEbitdaMultiple(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Industry: 3-8x</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0 && eb <= 0 && ast <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Business Value
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Business Valuation Range</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(midEstimate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Revenue-based: ${formatCurrency(revValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`EBITDA-based: ${formatCurrency(ebitdaValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Asset-based: ${formatCurrency(assetValue)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Low</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(lowEstimate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Mid</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(midEstimate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">High</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(highEstimate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Range</p>
                    <p className={`text-lg font-bold`}>{`{formatCurrency(lowEstimate)} - {formatCurrency(highEstimate)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Business valuation methods: (1) Revenue multiple (typical 0.5-3x for small business, 5-10x SaaS), (2) EBITDA multiple (3-8x typical, 10-15x tech), (3) Asset-based (book value). Mid estimate = average of methods. True value = what buyer will pay. Hire a business appraiser for formal valuation. Multiples vary by industry, growth, and market conditions.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'EBITDA', valueA: formatCurrency(compareA.eb), valueB: formatCurrency(compareB.eb), numA: compareA.eb, numB: compareB.eb },
          { label: 'Mid Valuation', valueA: formatCurrency(compareA.midEstimate), valueB: formatCurrency(compareB.midEstimate), numA: compareA.midEstimate, numB: compareB.midEstimate },
          { label: 'High', valueA: formatCurrency(compareA.highEstimate), valueB: formatCurrency(compareB.highEstimate), numA: compareA.highEstimate, numB: compareB.highEstimate }
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

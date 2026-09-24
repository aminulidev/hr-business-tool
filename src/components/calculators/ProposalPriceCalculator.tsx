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

interface Snapshot { lh: number; ar: number; mat: number; sub: number; oh: number; con: number; pf: number; laborCost: number; overhead: number; subtotal: number; contingency: number; totalCost: number; profit: number; price: number; label: string; }

export default function ProposalPriceCalculator() {
  const [laborHours, setLaborHours] = useState('');
  const [avgRate, setAvgRate] = useState('');
  const [materials, setMaterials] = useState('');
  const [subcontractors, setSubcontractors] = useState('');
  const [overheadPct, setOverheadPct] = useState('');
  const [contingencyPct, setContingencyPct] = useState('');
  const [profitPct, setProfitPct] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ laborHours: string; avgRate: string; materials: string; subcontractors: string; overheadPct: string; contingencyPct: string; profitPct: string }>('proposal-price-calculator');

  const lh = parseFloat(laborHours) || 0;
  const ar = parseFloat(avgRate) || 0;
  const mat = parseFloat(materials) || 0;
  const sub = parseFloat(subcontractors) || 0;
  const oh = parseFloat(overheadPct) || 0;
  const con = parseFloat(contingencyPct) || 0;
  const pf = parseFloat(profitPct) || 0;
  const laborCost = lh * ar;
  const overhead = laborCost * (oh / 100);
  const subtotal = laborCost + overhead + mat + sub;
  const contingency = subtotal * (con / 100);
  const totalCost = subtotal + contingency;
  const profit = totalCost * (pf / 100);
  const price = totalCost + profit;

  const handleTryExample = () => { setLaborHours('200'); setAvgRate('85'); setMaterials('5000'); setSubcontractors('8000'); setOverheadPct('30'); setContingencyPct('10'); setProfitPct('20'); setCalculated(false); };
  const handleCalculate = () => {
    if (lh > 0) {
      setCalculated(true);
      saveEntry({ laborHours, avgRate, materials, subcontractors, overheadPct, contingencyPct, profitPct }, `Price: ${formatCurrency(price)} (cost ${formatCurrency(totalCost)}, profit ${formatCurrency(profit)})`);
    }
  };
  const handleReset = () => { setLaborHours(''); setAvgRate(''); setMaterials(''); setSubcontractors(''); setOverheadPct('30'); setContingencyPct('10'); setProfitPct('20'); setCalculated(false); };
  const handleRestore = (i: { laborHours: string; avgRate: string; materials: string; subcontractors: string; overheadPct: string; contingencyPct: string; profitPct: string }) => { setLaborHours(i.laborHours); setAvgRate(i.avgRate); setMaterials(i.materials); setSubcontractors(i.subcontractors); setOverheadPct(i.overheadPct); setContingencyPct(i.contingencyPct); setProfitPct(i.profitPct); setCalculated(true); };
  const snap = (): Snapshot => ({ lh, ar, mat, sub, oh, con, pf, laborCost, overhead, subtotal, contingency, totalCost, profit, price, label: `Price: ${formatCurrency(price)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Calculate proposal price for RFPs: labor, materials, subcontractors, overhead, contingency, and profit margin.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="laborHours">Total Labor Hours</Label>
            <div className="relative">
              
              <Input id="laborHours" type="number" step="any" min="0" placeholder="200"
                value={laborHours} onChange={(e) => { setLaborHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgRate">Average Hourly Rate</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="avgRate" type="number" step="any" min="0" placeholder="85" className="pl-7"
                value={avgRate} onChange={(e) => { setAvgRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="materials">Materials/Equipment</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="materials" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={materials} onChange={(e) => { setMaterials(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcontractors">Subcontractor Costs</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="subcontractors" type="number" step="any" min="0" placeholder="8000" className="pl-7"
                value={subcontractors} onChange={(e) => { setSubcontractors(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overheadPct">Overhead (% of labor)</Label>
            <div className="relative">
              
              <Input id="overheadPct" type="number" step="any" min="0" placeholder="30"
                value={overheadPct} onChange={(e) => { setOverheadPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contingencyPct">Contingency (%)</Label>
            <div className="relative">
              
              <Input id="contingencyPct" type="number" step="any" min="0" placeholder="10"
                value={contingencyPct} onChange={(e) => { setContingencyPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profitPct">Profit Margin (%)</Label>
            <div className="relative">
              
              <Input id="profitPct" type="number" step="any" min="0" placeholder="20"
                value={profitPct} onChange={(e) => { setProfitPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={lh <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Proposal Price
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Proposal Price</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(price)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total cost: ${formatCurrency(totalCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Profit: ${formatCurrency(profit)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Contingency: ${formatCurrency(contingency)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Labor Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(laborCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Proposal Price</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(price)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Profit</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(profit)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Proposal price = (labor + overhead + materials + subcontractors + contingency) x (1 + profit margin). Overhead: 25-35% of labor. Contingency: 10-20% for unknowns. Profit: 15-25% typical. See our Project Pricing and Quote Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost },
          { label: 'Proposal Price', valueA: formatCurrency(compareA.price), valueB: formatCurrency(compareB.price), numA: compareA.price, numB: compareB.price },
          { label: 'Profit', valueA: formatCurrency(compareA.profit), valueB: formatCurrency(compareB.profit), numA: compareA.profit, numB: compareB.profit }
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

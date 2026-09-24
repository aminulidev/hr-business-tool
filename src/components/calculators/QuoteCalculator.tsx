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

interface Snapshot { lh: number; lr: number; mat: number; sub: number; oh: number; pf: number; tx: number; laborCost: number; overhead: number; subtotal: number; profit: number; beforeTax: number; tax: number; total: number; label: string; }

export default function QuoteCalculator() {
  const [laborHours, setLaborHours] = useState('');
  const [laborRate, setLaborRate] = useState('');
  const [materials, setMaterials] = useState('');
  const [subcontractors, setSubcontractors] = useState('');
  const [overheadPct, setOverheadPct] = useState('');
  const [profitPct, setProfitPct] = useState('');
  const [taxPct, setTaxPct] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ laborHours: string; laborRate: string; materials: string; subcontractors: string; overheadPct: string; profitPct: string; taxPct: string }>('quote-calculator');

  const lh = parseFloat(laborHours) || 0;
  const lr = parseFloat(laborRate) || 0;
  const mat = parseFloat(materials) || 0;
  const sub = parseFloat(subcontractors) || 0;
  const oh = parseFloat(overheadPct) || 0;
  const pf = parseFloat(profitPct) || 0;
  const tx = parseFloat(taxPct) || 0;
  const laborCost = lh * lr;
  const overhead = laborCost * (oh / 100);
  const subtotal = laborCost + overhead + mat + sub;
  const profit = subtotal * (pf / 100);
  const beforeTax = subtotal + profit;
  const tax = beforeTax * (tx / 100);
  const total = beforeTax + tax;

  const handleTryExample = () => { setLaborHours('50'); setLaborRate('85'); setMaterials('1500'); setSubcontractors('2000'); setOverheadPct('25'); setProfitPct('20'); setTaxPct('0'); setCalculated(false); };
  const handleCalculate = () => {
    if (lh > 0) {
      setCalculated(true);
      saveEntry({ laborHours, laborRate, materials, subcontractors, overheadPct, profitPct, taxPct }, `Quote: ${formatCurrency(total)} (profit ${formatCurrency(profit)})`);
    }
  };
  const handleReset = () => { setLaborHours(''); setLaborRate(''); setMaterials(''); setSubcontractors(''); setOverheadPct('25'); setProfitPct('20'); setTaxPct('0'); setCalculated(false); };
  const handleRestore = (i: { laborHours: string; laborRate: string; materials: string; subcontractors: string; overheadPct: string; profitPct: string; taxPct: string }) => { setLaborHours(i.laborHours); setLaborRate(i.laborRate); setMaterials(i.materials); setSubcontractors(i.subcontractors); setOverheadPct(i.overheadPct); setProfitPct(i.profitPct); setTaxPct(i.taxPct); setCalculated(true); };
  const snap = (): Snapshot => ({ lh, lr, mat, sub, oh, pf, tx, laborCost, overhead, subtotal, profit, beforeTax, tax, total, label: `Quote: ${formatCurrency(total)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Generate a client quote from labor, materials, subcontractors, overhead, profit margin, and tax.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="laborHours">Labor Hours</Label>
            <div className="relative">
              
              <Input id="laborHours" type="number" step="any" min="0" placeholder="50"
                value={laborHours} onChange={(e) => { setLaborHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="laborRate">Labor Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="laborRate" type="number" step="any" min="0" placeholder="85" className="pl-7"
                value={laborRate} onChange={(e) => { setLaborRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="materials">Materials/Parts</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="materials" type="number" step="any" min="0" placeholder="1500" className="pl-7"
                value={materials} onChange={(e) => { setMaterials(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcontractors">Subcontractor Costs</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="subcontractors" type="number" step="any" min="0" placeholder="2000" className="pl-7"
                value={subcontractors} onChange={(e) => { setSubcontractors(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overheadPct">Overhead (% of labor)</Label>
            <div className="relative">
              
              <Input id="overheadPct" type="number" step="any" min="0" placeholder="25"
                value={overheadPct} onChange={(e) => { setOverheadPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profitPct">Profit Margin (%)</Label>
            <div className="relative">
              
              <Input id="profitPct" type="number" step="any" min="0" placeholder="20"
                value={profitPct} onChange={(e) => { setProfitPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxPct">Sales Tax (%)</Label>
            <div className="relative">
              
              <Input id="taxPct" type="number" step="any" min="0" placeholder="0"
                value={taxPct} onChange={(e) => { setTaxPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">0 for B2B services</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={lh <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Quote
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Quote Total</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(total)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Subtotal: ${formatCurrency(subtotal)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Profit: ${formatCurrency(profit)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Before tax: ${formatCurrency(beforeTax)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Labor</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(laborCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Before Tax</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(beforeTax)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Quote Total</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(total)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Quote = (labor + overhead + materials + subcontractors) x (1 + profit%) x (1 + tax%). For B2B services, tax is usually 0%. Include terms: valid 30 days, 50% deposit, net 30 on balance. See our Invoice and Estimate Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Subtotal', valueA: formatCurrency(compareA.subtotal), valueB: formatCurrency(compareB.subtotal), numA: compareA.subtotal, numB: compareB.subtotal },
          { label: 'Before Tax', valueA: formatCurrency(compareA.beforeTax), valueB: formatCurrency(compareB.beforeTax), numA: compareA.beforeTax, numB: compareB.beforeTax },
          { label: 'Total', valueA: formatCurrency(compareA.total), valueB: formatCurrency(compareB.total), numA: compareA.total, numB: compareB.total }
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

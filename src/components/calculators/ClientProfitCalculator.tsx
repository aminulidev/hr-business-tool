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

interface Snapshot { rev: number; lh: number; lr: number; sub: number; sw: number; laborCost: number; totalCost: number; profit: number; margin: number; effectiveRate: number; label: string; }

export default function ClientProfitCalculator() {
  const [clientRevenue, setClientRevenue] = useState('');
  const [laborHours, setLaborHours] = useState('');
  const [laborRate, setLaborRate] = useState('');
  const [subcontractor, setSubcontractor] = useState('');
  const [software, setSoftware] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ clientRevenue: string; laborHours: string; laborRate: string; subcontractor: string; software: string }>('client-profit-calculator');

  const rev = parseFloat(clientRevenue) || 0;
  const lh = parseFloat(laborHours) || 0;
  const lr = parseFloat(laborRate) || 0;
  const sub = parseFloat(subcontractor) || 0;
  const sw = parseFloat(software) || 0;
  const laborCost = lh * lr;
  const totalCost = laborCost + sub + sw;
  const profit = rev - totalCost;
  const margin = rev > 0 ? (profit / rev) * 100 : 0;
  const effectiveRate = lh > 0 ? rev / lh : 0;

  const handleTryExample = () => { setClientRevenue('5000'); setLaborHours('30'); setLaborRate('40'); setSubcontractor('500'); setSoftware('200'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ clientRevenue, laborHours, laborRate, subcontractor, software }, `Profit: ${formatCurrency(profit)}/mo (${margin.toFixed(1)}% margin)`);
    }
  };
  const handleReset = () => { setClientRevenue(''); setLaborHours(''); setLaborRate(''); setSubcontractor(''); setSoftware(''); setCalculated(false); };
  const handleRestore = (i: { clientRevenue: string; laborHours: string; laborRate: string; subcontractor: string; software: string }) => { setClientRevenue(i.clientRevenue); setLaborHours(i.laborHours); setLaborRate(i.laborRate); setSubcontractor(i.subcontractor); setSoftware(i.software); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, lh, lr, sub, sw, laborCost, totalCost, profit, margin, effectiveRate, label: `Profit: ${formatCurrency(profit)}/mo` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate profit per client: client revenue minus direct costs (labor, materials, subcontractors) and overhead.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientRevenue">Client Revenue (monthly)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="clientRevenue" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={clientRevenue} onChange={(e) => { setClientRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="laborHours">Hours Invested per Month</Label>
            <div className="relative">
              
              <Input id="laborHours" type="number" step="any" min="0" placeholder="30"
                value={laborHours} onChange={(e) => { setLaborHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="laborRate">Your Hourly Cost Rate</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="laborRate" type="number" step="any" min="0" placeholder="40" className="pl-7"
                value={laborRate} onChange={(e) => { setLaborRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcontractor">Subcontractor Costs</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="subcontractor" type="number" step="any" min="0" placeholder="500" className="pl-7"
                value={subcontractor} onChange={(e) => { setSubcontractor(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="software">Software/Tools for Client</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="software" type="number" step="any" min="0" placeholder="200" className="pl-7"
                value={software} onChange={(e) => { setSoftware(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Client Profit
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Client Profit</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(profit)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Margin: ${margin.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Profit/hour: ${formatCurrency(effectiveRate)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Revenue: ${formatCurrency(rev)}/mo`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Profit</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(profit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Profit/Hour</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(effectiveRate)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Client profit = (retainer + project revenue) - (hours x cost rate) - direct costs. Track per client to identify high-profit (expand), break-even (optimize), and loss clients (reprice or fire). See our Agency Margin Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'Profit', valueA: formatCurrency(compareA.profit), valueB: formatCurrency(compareB.profit), numA: compareA.profit, numB: compareB.profit },
          { label: 'Margin', valueA: `${compareA.margin.toFixed(1)}%`, valueB: `${compareB.margin.toFixed(1)}%`, numA: compareA.margin, numB: compareB.margin }
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

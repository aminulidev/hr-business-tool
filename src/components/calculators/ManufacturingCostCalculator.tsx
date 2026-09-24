'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { dm: number; dl: number; oh: number; bwip: number; ewip: number; totalMfgCost: number; cogm: number; perUnit: number; label: string; }

export default function ManufacturingCostCalculator() {
  const [directMaterials, setDirectMaterials] = useState('');
  const [directLabor, setDirectLabor] = useState('');
  const [mfgOverhead, setMfgOverhead] = useState('');
  const [beginningWIP, setBeginningWIP] = useState('');
  const [endingWIP, setEndingWIP] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ directMaterials: string; directLabor: string; mfgOverhead: string; beginningWIP: string; endingWIP: string }>('manufacturing-cost-calculator');

  const dm = parseFloat(directMaterials) || 0;
  const dl = parseFloat(directLabor) || 0;
  const oh = parseFloat(mfgOverhead) || 0;
  const bwip = parseFloat(beginningWIP) || 0;
  const ewip = parseFloat(endingWIP) || 0;
  const totalMfgCost = dm + dl + oh;
  const cogm = bwip + totalMfgCost - ewip;
  const perUnit = cogm > 0 && 1000 > 0 ? cogm / 1000 : 0;

  const handleTryExample = () => { setDirectMaterials('150000'); setDirectLabor('100000'); setMfgOverhead('80000'); setBeginningWIP('20000'); setEndingWIP('15000'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalMfgCost > 0) {
      setCalculated(true);
      saveEntry({ directMaterials, directLabor, mfgOverhead, beginningWIP, endingWIP }, `Mfg cost: ${formatCurrency(totalMfgCost)} (COGM: ${formatCurrency(cogm)})`);
    }
  };
  const handleReset = () => { setDirectMaterials(''); setDirectLabor(''); setMfgOverhead(''); setBeginningWIP(''); setEndingWIP(''); setCalculated(false); };
  const handleRestore = (i: { directMaterials: string; directLabor: string; mfgOverhead: string; beginningWIP: string; endingWIP: string }) => { setDirectMaterials(i.directMaterials); setDirectLabor(i.directLabor); setMfgOverhead(i.mfgOverhead); setBeginningWIP(i.beginningWIP); setEndingWIP(i.endingWIP); setCalculated(true); };
  const snap = (): Snapshot => ({ dm, dl, oh, bwip, ewip, totalMfgCost, cogm, perUnit, label: `Mfg: ${formatCurrency(totalMfgCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Building2 className="inline h-3 w-3 mr-1" />
          {`Calculate total manufacturing cost: direct materials + direct labor + manufacturing overhead.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="directMaterials">Direct Materials</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="directMaterials" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={directMaterials} onChange={(e) => { setDirectMaterials(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="directLabor">Direct Labor</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="directLabor" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={directLabor} onChange={(e) => { setDirectLabor(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mfgOverhead">Manufacturing Overhead</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="mfgOverhead" type="number" step="any" min="0" placeholder="80000" className="pl-7"
                value={mfgOverhead} onChange={(e) => { setMfgOverhead(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="beginningWIP">Beginning WIP</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="beginningWIP" type="number" step="any" min="0" placeholder="20000" className="pl-7"
                value={beginningWIP} onChange={(e) => { setBeginningWIP(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endingWIP">Ending WIP</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="endingWIP" type="number" step="any" min="0" placeholder="15000" className="pl-7"
                value={endingWIP} onChange={(e) => { setEndingWIP(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalMfgCost <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Mfg Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Manufacturing Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalMfgCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`COGM: ${formatCurrency(cogm)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Direct materials: ${formatCurrency(dm)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Direct labor: ${formatCurrency(dl)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Direct Materials</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dm)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Direct Labor</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dl)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Mfg Overhead</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(oh)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Mfg Cost</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalMfgCost)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Total manufacturing cost = direct materials + direct labor + manufacturing overhead. COGM (cost of goods manufactured) = beginning WIP + total mfg cost - ending WIP. Per unit cost = COGM / units produced. Used for product pricing and inventory valuation.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Mfg', valueA: formatCurrency(compareA.totalMfgCost), valueB: formatCurrency(compareB.totalMfgCost), numA: compareA.totalMfgCost, numB: compareB.totalMfgCost },
          { label: 'COGM', valueA: formatCurrency(compareA.cogm), valueB: formatCurrency(compareB.cogm), numA: compareA.cogm, numB: compareB.cogm }
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

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { rev: number; ni: number; currentRatio: number; quickRatio: number; debtRatio: number; interestCov: number; netMargin: number; roa: number; roe: number; assetTurn: number; label: string; }

export default function FinancialRatioCalculator() {
  const [revenue, setRevenue] = useState('');
  const [netIncome, setNetIncome] = useState('');
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiab, setCurrentLiab] = useState('');
  const [inventory, setInventory] = useState('');
  const [totalAssets, setTotalAssets] = useState('');
  const [totalLiab, setTotalLiab] = useState('');
  const [ebit, setEbit] = useState('');
  const [interest, setInterest] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ revenue: string; netIncome: string; currentAssets: string; currentLiab: string; inventory: string; totalAssets: string; totalLiab: string; ebit: string; interest: string }>('financial-ratio-calculator');

  const rev = parseFloat(revenue) || 0;
  const ni = parseFloat(netIncome) || 0;
  const ca = parseFloat(currentAssets) || 0;
  const cl = parseFloat(currentLiab) || 0;
  const inv = parseFloat(inventory) || 0;
  const ta = parseFloat(totalAssets) || 0;
  const tl = parseFloat(totalLiab) || 0;
  const eb = parseFloat(ebit) || 0;
  const intr = parseFloat(interest) || 0;
  const currentRatio = cl > 0 ? ca / cl : 0;
  const quickRatio = cl > 0 ? (ca - inv) / cl : 0;
  const debtRatio = ta > 0 ? (tl / ta) * 100 : 0;
  const interestCov = intr > 0 ? eb / intr : 0;
  const netMargin = rev > 0 ? (ni / rev) * 100 : 0;
  const roa = ta > 0 ? (ni / ta) * 100 : 0;
  const equity = ta - tl;
  const roe = equity > 0 ? (ni / equity) * 100 : 0;
  const assetTurn = ta > 0 ? rev / ta : 0;

  const handleTryExample = () => { setRevenue('1000000'); setNetIncome('100000'); setCurrentAssets('400000'); setCurrentLiab('200000'); setInventory('100000'); setTotalAssets('800000'); setTotalLiab('400000'); setEbit('150000'); setInterest('30000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ revenue, netIncome, currentAssets, currentLiab, inventory, totalAssets, totalLiab, ebit, interest }, `CR ${currentRatio.toFixed(2)}x, NM ${netMargin.toFixed(1)}%, ROE ${roe.toFixed(1)}%`);
    }
  };
  const handleReset = () => { setRevenue(''); setNetIncome(''); setCurrentAssets(''); setCurrentLiab(''); setInventory(''); setTotalAssets(''); setTotalLiab(''); setEbit(''); setInterest(''); setCalculated(false); };
  const handleRestore = (i: { revenue: string; netIncome: string; currentAssets: string; currentLiab: string; inventory: string; totalAssets: string; totalLiab: string; ebit: string; interest: string }) => { setRevenue(i.revenue); setNetIncome(i.netIncome); setCurrentAssets(i.currentAssets); setCurrentLiab(i.currentLiab); setInventory(i.inventory); setTotalAssets(i.totalAssets); setTotalLiab(i.totalLiab); setEbit(i.ebit); setInterest(i.interest); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, ni, currentRatio, quickRatio, debtRatio, interestCov, netMargin, roa, roe, assetTurn, label: `CR ${currentRatio.toFixed(2)}x, NM ${netMargin.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Calculator className="inline h-3 w-3 mr-1" />
          {`Calculate 12 key financial ratios in one place: liquidity, solvency, profitability, efficiency. Full ratio analysis.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="netIncome">Net Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="netIncome" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={netIncome} onChange={(e) => { setNetIncome(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentAssets">Current Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentAssets" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={currentAssets} onChange={(e) => { setCurrentAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentLiab">Current Liabilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentLiab" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={currentLiab} onChange={(e) => { setCurrentLiab(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventory">Inventory</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="inventory" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={inventory} onChange={(e) => { setInventory(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalAssets">Total Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalAssets" type="number" step="any" min="0" placeholder="800000" className="pl-7"
                value={totalAssets} onChange={(e) => { setTotalAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalLiab">Total Liabilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalLiab" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={totalLiab} onChange={(e) => { setTotalLiab(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ebit">EBIT</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ebit" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={ebit} onChange={(e) => { setEbit(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest">Interest Expense</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="interest" type="number" step="any" min="0" placeholder="30000" className="pl-7"
                value={interest} onChange={(e) => { setInterest(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate All Ratios
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Key Financial Ratios</p>
                <p className="text-4xl font-bold text-emerald-600">{`${currentRatio.toFixed(2)}x CR`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Net margin: ${netMargin.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`ROE: ${roe.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Debt ratio: ${debtRatio.toFixed(1)}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current Ratio</p>
                    <p className={`text-lg font-bold`}>{`{currentRatio.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Quick Ratio</p>
                    <p className={`text-lg font-bold`}>{`{quickRatio.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Margin</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{netMargin.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ROE</p>
                    <p className={`text-lg font-bold`}>{`{roe.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Comprehensive ratio analysis: Liquidity (current, quick), Solvency (debt ratio, interest coverage), Profitability (net margin, ROA, ROE), Efficiency (asset turnover, inventory turnover). Each ratio benchmarks differently by industry. Use for financial statement analysis, loan applications, investor reporting. See individual calculators for detailed analysis of each ratio.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Current Ratio', valueA: `${compareA.currentRatio.toFixed(2)}x`, valueB: `${compareB.currentRatio.toFixed(2)}x`, numA: compareA.currentRatio, numB: compareB.currentRatio },
          { label: 'Net Margin', valueA: `${compareA.netMargin.toFixed(1)}%`, valueB: `${compareB.netMargin.toFixed(1)}%`, numA: compareA.netMargin, numB: compareB.netMargin },
          { label: 'ROE', valueA: `${compareA.roe.toFixed(1)}%`, valueB: `${compareB.roe.toFixed(1)}%`, numA: compareA.roe, numB: compareB.roe },
          { label: 'Debt Ratio', valueA: `${compareA.debtRatio.toFixed(1)}%`, valueB: `${compareB.debtRatio.toFixed(1)}%`, numA: compareA.debtRatio, numB: compareB.debtRatio }
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

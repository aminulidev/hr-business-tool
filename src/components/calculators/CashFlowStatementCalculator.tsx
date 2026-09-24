'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { ni: number; dep: number; wc: number; cx: number; fin: number; operatingCF: number; investingCF: number; financingCF: number; netCF: number; label: string; }

export default function CashFlowStatementCalculator() {
  const [netIncome, setNetIncome] = useState('');
  const [depreciation, setDepreciation] = useState('');
  const [wcChanges, setWcChanges] = useState('');
  const [capex, setCapex] = useState('');
  const [financing, setFinancing] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ netIncome: string; depreciation: string; wcChanges: string; capex: string; financing: string }>('cash-flow-statement-calculator');

  const ni = parseFloat(netIncome) || 0;
  const dep = parseFloat(depreciation) || 0;
  const wc = parseFloat(wcChanges) || 0;
  const cx = parseFloat(capex) || 0;
  const fin = parseFloat(financing) || 0;
  const operatingCF = ni + dep + wc;
  const investingCF = cx;
  const financingCF = fin;
  const netCF = operatingCF + investingCF + financingCF;

  const handleTryExample = () => { setNetIncome('100000'); setDepreciation('30000'); setWcChanges('-10000'); setCapex('-50000'); setFinancing('20000'); setCalculated(false); };
  const handleCalculate = () => {
    if (ni !== 0 || operatingCF !== 0) {
      setCalculated(true);
      saveEntry({ netIncome, depreciation, wcChanges, capex, financing }, `Net CF: ${formatCurrency(netCF)} (Op: ${formatCurrency(operatingCF)}, Inv: ${formatCurrency(investingCF)}, Fin: ${formatCurrency(financingCF)})`);
    }
  };
  const handleReset = () => { setNetIncome(''); setDepreciation(''); setWcChanges(''); setCapex(''); setFinancing(''); setCalculated(false); };
  const handleRestore = (i: { netIncome: string; depreciation: string; wcChanges: string; capex: string; financing: string }) => { setNetIncome(i.netIncome); setDepreciation(i.depreciation); setWcChanges(i.wcChanges); setCapex(i.capex); setFinancing(i.financing); setCalculated(true); };
  const snap = (): Snapshot => ({ ni, dep, wc, cx, fin, operatingCF, investingCF, financingCF, netCF, label: `Net CF: ${formatCurrency(netCF)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Wallet className="inline h-3 w-3 mr-1" />
          {`Build a cash flow statement: operating, investing, and financing activities.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="netIncome">Net Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="netIncome" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={netIncome} onChange={(e) => { setNetIncome(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="depreciation">Depreciation & Amortization</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="depreciation" type="number" step="any" min="0" placeholder="30000" className="pl-7"
                value={depreciation} onChange={(e) => { setDepreciation(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wcChanges">Working Capital Changes</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="wcChanges" type="number" step="any" min="0" placeholder="-10000" className="pl-7"
                value={wcChanges} onChange={(e) => { setWcChanges(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capex">Capital Expenditures</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="capex" type="number" step="any" min="0" placeholder="-50000" className="pl-7"
                value={capex} onChange={(e) => { setCapex(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="financing">Financing Activities (net)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="financing" type="number" step="any" min="0" placeholder="20000" className="pl-7"
                value={financing} onChange={(e) => { setFinancing(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={false}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Cash Flow
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Net Cash Flow</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(netCF)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Operating: ${formatCurrency(operatingCF)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Investing: ${formatCurrency(investingCF)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Financing: ${formatCurrency(financingCF)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Operating CF</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(operatingCF)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Investing CF</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(investingCF)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Financing CF</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(financingCF)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net CF</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(netCF)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Cash flow statement: Operating (net income + non-cash + WC changes), Investing (capex, asset sales), Financing (debt, equity, dividends). Net CF = OCF + ICF + FCF. Positive OCF = healthy operations.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Operating', valueA: formatCurrency(compareA.operatingCF), valueB: formatCurrency(compareB.operatingCF), numA: compareA.operatingCF, numB: compareB.operatingCF },
          { label: 'Net CF', valueA: formatCurrency(compareA.netCF), valueB: formatCurrency(compareB.netCF), numA: compareA.netCF, numB: compareB.netCF }
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

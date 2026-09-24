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

interface Snapshot { ni: number; dep: number; sbc: number; wc: number; cx: number; ocf: number; fcf: number; label: string; }

export default function OperatingCashFlowCalculator() {
  const [netIncome, setNetIncome] = useState('');
  const [depreciation, setDepreciation] = useState('');
  const [stockComp, setStockComp] = useState('');
  const [wcChange, setWcChange] = useState('Negative if WC increased');
  const [capex, setCapex] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ netIncome: string; depreciation: string; stockComp: string; wcChange: string; capex: string }>('operating-cash-flow-calculator');

  const ni = parseFloat(netIncome) || 0;
  const dep = parseFloat(depreciation) || 0;
  const sbc = parseFloat(stockComp) || 0;
  const wc = parseFloat(wcChange) || 0;
  const cx = parseFloat(capex) || 0;
  const ocf = ni + dep + sbc + wc;
  const fcf = ocf - cx;
  const ocfMargin = 0;

  const handleTryExample = () => { setNetIncome('200000'); setDepreciation('50000'); setStockComp('30000'); setWcChange('-20000'); setCapex('80000'); setCalculated(false); };
  const handleCalculate = () => {
    if (ni !== 0 || dep !== 0) {
      setCalculated(true);
      saveEntry({ netIncome, depreciation, stockComp, wcChange, capex }, `OCF: ${formatCurrency(ocf)}, FCF: ${formatCurrency(fcf)}`);
    }
  };
  const handleReset = () => { setNetIncome(''); setDepreciation(''); setStockComp(''); setWcChange(''); setCapex(''); setCalculated(false); };
  const handleRestore = (i: { netIncome: string; depreciation: string; stockComp: string; wcChange: string; capex: string }) => { setNetIncome(i.netIncome); setDepreciation(i.depreciation); setStockComp(i.stockComp); setWcChange(i.wcChange); setCapex(i.capex); setCalculated(true); };
  const snap = (): Snapshot => ({ ni, dep, sbc, wc, cx, ocf, fcf, label: `OCF: ${formatCurrency(ocf)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Wallet className="inline h-3 w-3 mr-1" />
          {`Operating cash flow = net income + non-cash expenses ± working capital changes (indirect method). Free cash flow = OCF - capex.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="netIncome">Net Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="netIncome" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={netIncome} onChange={(e) => { setNetIncome(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="depreciation">Depreciation & Amortization</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="depreciation" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={depreciation} onChange={(e) => { setDepreciation(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockComp">Stock-Based Compensation</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="stockComp" type="number" step="any" min="0" placeholder="30000" className="pl-7"
                value={stockComp} onChange={(e) => { setStockComp(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wcChange">Change in Working Capital</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="wcChange" type="number" step="any" min="0" placeholder="-20000" className="pl-7"
                value={wcChange} onChange={(e) => { setWcChange(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Negative if WC increased</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capex">Capital Expenditures (for FCF)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="capex" type="number" step="any" min="0" placeholder="80000" className="pl-7"
                value={capex} onChange={(e) => { setCapex(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={false}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Operating Cash Flow
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Operating Cash Flow</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(ocf)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Free cash flow: ${formatCurrency(fcf)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Capex: ${formatCurrency(cx)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{fcf > 0 ? "FCF positive" : "FCF negative"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Income</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ni)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Non-Cash Add-backs</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dep + sbc)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">OCF</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(ocf)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Free Cash Flow</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(fcf)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Operating cash flow (OCF) = net income + non-cash expenses (depreciation, amortization, stock comp) ± working capital changes. Indirect method. Free cash flow (FCF) = OCF - capex. OCF measures cash from operations; FCF measures cash available to investors. FCF positive = self-sustaining. FCF negative = needs external funding. Critical for valuation (DCF) and liquidity.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Net Income', valueA: formatCurrency(compareA.ni), valueB: formatCurrency(compareB.ni), numA: compareA.ni, numB: compareB.ni },
          { label: 'OCF', valueA: formatCurrency(compareA.ocf), valueB: formatCurrency(compareB.ocf), numA: compareA.ocf, numB: compareB.ocf },
          { label: 'FCF', valueA: formatCurrency(compareA.fcf), valueB: formatCurrency(compareB.fcf), numA: compareA.fcf, numB: compareB.fcf }
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

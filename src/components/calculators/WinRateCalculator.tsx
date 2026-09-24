'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { won: number; lost: number; closed: number; winRate: number; lossRate: number; label: string; }

export default function WinRateCalculator() {
  const [wonDeals, setWonDeals] = useState('');
  const [lostDeals, setLostDeals] = useState('');
  const [openDeals, setOpenDeals] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ wonDeals: string; lostDeals: string; openDeals: string }>('win-rate-calculator');

  const won = parseFloat(wonDeals) || 0;
  const lost = parseFloat(lostDeals) || 0;
  const open = parseFloat(openDeals) || 0;
  const closed = won + lost;
  const winRate = closed > 0 ? (won / closed) * 100 : 0;
  const lossRate = closed > 0 ? (lost / closed) * 100 : 0;

  const handleTryExample = () => { setWonDeals('25'); setLostDeals('60'); setOpenDeals('15'); setCalculated(false); };
  const handleCalculate = () => {
    if (closed > 0) {
      setCalculated(true);
      saveEntry({ wonDeals, lostDeals, openDeals }, `Win rate: ${winRate.toFixed(1)}% (${won}/${closed})`);
    }
  };
  const handleReset = () => { setWonDeals(''); setLostDeals(''); setOpenDeals(''); setCalculated(false); };
  const handleRestore = (i: { wonDeals: string; lostDeals: string; openDeals: string }) => { setWonDeals(i.wonDeals); setLostDeals(i.lostDeals); setOpenDeals(i.openDeals); setCalculated(true); };
  const snap = (): Snapshot => ({ won, lost, closed, winRate, lossRate, label: `Win rate: ${winRate.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Calculate sales win rate = won deals / total deals × 100. Industry: SaaS 25-35%, enterprise 20-30%, SMB 30-40%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wonDeals">Won Deals</Label>
            <div className="relative">
              
              <Input id="wonDeals" type="number" step="any" min="0" placeholder="25"
                value={wonDeals} onChange={(e) => { setWonDeals(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lostDeals">Lost Deals</Label>
            <div className="relative">
              
              <Input id="lostDeals" type="number" step="any" min="0" placeholder="60"
                value={lostDeals} onChange={(e) => { setLostDeals(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="openDeals">Open Deals (excluded)</Label>
            <div className="relative">
              
              <Input id="openDeals" type="number" step="any" min="0" placeholder="15"
                value={openDeals} onChange={(e) => { setOpenDeals(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={(won + lost) <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Win Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Win Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(winRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Loss rate: ${formatPercent(lossRate)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`${closed} closed deals`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'SaaS 25-35%, Enterprise 20-30%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Won</p>
                    <p className={`text-lg font-bold`}>{`{won}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lost</p>
                    <p className={`text-lg font-bold`}>{`{lost}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(winRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Closed</p>
                    <p className={`text-lg font-bold`}>{`{closed}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Win rate = won deals / (won + lost) × 100. Exclude open deals. Industry: SaaS 25-35%, enterprise 20-30%, SMB 30-40%, retail 40-50%. Track by rep, segment, deal size. Low win rate = qualification, pricing, or competitive issues. See our Conversion Rate Calculator for funnel conversion.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Won', valueA: String(compareA.won), valueB: String(compareB.won), numA: compareA.won, numB: compareB.won },
          { label: 'Lost', valueA: String(compareA.lost), valueB: String(compareB.lost), numA: compareA.lost, numB: compareB.lost },
          { label: 'Win Rate', valueA: formatPercent(compareA.winRate), valueB: formatPercent(compareB.winRate), numA: compareA.winRate, numB: compareB.winRate }
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

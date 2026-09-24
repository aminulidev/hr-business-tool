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

interface Snapshot { cost: number; sp: number; pp: number; ep: number; starterMargin: number; proMargin: number; enterpriseMargin: number; priceToCost: number; label: string; }

export default function SaasPricingCalculator() {
  const [costPerUser, setCostPerUser] = useState('');
  const [starterPrice, setStarterPrice] = useState('');
  const [proPrice, setProPrice] = useState('');
  const [enterprisePrice, setEnterprisePrice] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ costPerUser: string; starterPrice: string; proPrice: string; enterprisePrice: string }>('saas-pricing-calculator');

  const cost = parseFloat(costPerUser) || 0;
  const sp = parseFloat(starterPrice) || 0;
  const pp = parseFloat(proPrice) || 0;
  const ep = parseFloat(enterprisePrice) || 0;
  const starterMargin = sp > 0 ? ((sp - cost) / sp) * 100 : 0;
  const proMargin = pp > 0 ? ((pp - cost) / pp) * 100 : 0;
  const enterpriseMargin = ep > 0 ? ((ep - cost) / ep) * 100 : 0;
  const priceToCost = cost > 0 ? pp / cost : 0;

  const handleTryExample = () => { setCostPerUser('5'); setStarterPrice('15'); setProPrice('50'); setEnterprisePrice('200'); setCalculated(false); };
  const handleCalculate = () => {
    if (sp > 0 || pp > 0) {
      setCalculated(true);
      saveEntry({ costPerUser, starterPrice, proPrice, enterprisePrice }, `Pricing: Starter ${formatCurrency(sp)}, Pro ${formatCurrency(pp)}, Enterprise ${formatCurrency(ep)}`);
    }
  };
  const handleReset = () => { setCostPerUser('5'); setStarterPrice(''); setProPrice(''); setEnterprisePrice(''); setCalculated(false); };
  const handleRestore = (i: { costPerUser: string; starterPrice: string; proPrice: string; enterprisePrice: string }) => { setCostPerUser(i.costPerUser); setStarterPrice(i.starterPrice); setProPrice(i.proPrice); setEnterprisePrice(i.enterprisePrice); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, sp, pp, ep, starterMargin, proMargin, enterpriseMargin, priceToCost, label: `Pro: ${formatCurrency(pp)}/mo` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Tag className="inline h-3 w-3 mr-1" />
          {`Calculate SaaS pricing tiers based on cost per user, target margin, and willingness to pay.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costPerUser">Cost per User/Month</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="costPerUser" type="number" step="any" min="0" placeholder="5" className="pl-7"
                value={costPerUser} onChange={(e) => { setCostPerUser(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="starterPrice">Starter Tier Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="starterPrice" type="number" step="any" min="0" placeholder="15" className="pl-7"
                value={starterPrice} onChange={(e) => { setStarterPrice(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="proPrice">Pro Tier Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="proPrice" type="number" step="any" min="0" placeholder="50" className="pl-7"
                value={proPrice} onChange={(e) => { setProPrice(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="enterprisePrice">Enterprise Tier Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="enterprisePrice" type="number" step="any" min="0" placeholder="200" className="pl-7"
                value={enterprisePrice} onChange={(e) => { setEnterprisePrice(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={sp <= 0 && pp <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Pricing
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">SaaS Pricing Tiers</p>
                <p className="text-4xl font-bold text-emerald-600">{`Starter: ${formatCurrency(sp)}/mo`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Pro: ${formatCurrency(pp)}/mo (${proMargin.toFixed(0)}% margin)`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Enterprise: ${formatCurrency(ep)}/mo (${enterpriseMargin.toFixed(0)}% margin)`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Price-to-cost: ${priceToCost.toFixed(1)}x`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost/User</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Starter</p>
                    <p className={`text-lg font-bold`}>{`${formatCurrency(sp)}/mo`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pro</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`${formatCurrency(pp)}/mo`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Enterprise</p>
                    <p className={`text-lg font-bold`}>{`${formatCurrency(ep)}/mo`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`SaaS tiers: Starter (entry), Pro (2-3x starter), Enterprise (5-10x starter). Target 80%+ gross margin.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Starter', valueA: `${formatCurrency(compareA.sp)}/mo`, valueB: `${formatCurrency(compareB.sp)}/mo`, numA: compareA.sp, numB: compareB.sp },
          { label: 'Pro', valueA: `${formatCurrency(compareA.pp)}/mo`, valueB: `${formatCurrency(compareB.pp)}/mo`, numA: compareA.pp, numB: compareB.pp }
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

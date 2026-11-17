'use client';

import { useMemo, useState } from 'react';
import { motion } from '@/components/motion';
import { BookmarkPlus, Info, Droplets, Scale, TrendingUp, Gauge, AlertTriangle } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { formatCurrency } from '@/lib/utils';
import {
  computeFinancialRatios,
  FAMILIES,
  formatRatio,
  isRatioFamily,
  RATIO_DEFAULTS,
  type Assessment,
  type FinancialStatementInput,
  type RatioFamily,
} from '@/lib/pricing/financial-ratios';

// Phase 17: the roe, roa, debt-ratio, current-ratio, quick-ratio, interest-coverage
// and asset-turnover pages fold into this one; ?family= opens the matching tab.

type Key = keyof FinancialStatementInput;
const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const FIELDS: { key: Key; label: string; group: 'income' | 'assets' | 'liabilities'; help?: string }[] = [
  { key: 'revenue', label: 'Revenue', group: 'income' },
  { key: 'cogs', label: 'Cost of goods sold', group: 'income' },
  { key: 'ebit', label: 'Operating income (EBIT)', group: 'income' },
  { key: 'depreciation', label: 'Depreciation & amortization', group: 'income', help: 'Added back for EBITDA' },
  { key: 'interestExpense', label: 'Interest expense', group: 'income' },
  { key: 'principalRepayments', label: 'Principal repaid this period', group: 'income', help: 'For debt service coverage' },
  { key: 'netIncome', label: 'Net income', group: 'income' },
  { key: 'cash', label: 'Cash', group: 'assets' },
  { key: 'marketableSecurities', label: 'Marketable securities', group: 'assets' },
  { key: 'receivables', label: 'Accounts receivable', group: 'assets' },
  { key: 'inventory', label: 'Inventory', group: 'assets' },
  { key: 'otherCurrentAssets', label: 'Other current assets', group: 'assets' },
  { key: 'totalAssets', label: 'Total assets', group: 'assets' },
  { key: 'currentLiabilities', label: 'Current liabilities', group: 'liabilities' },
  { key: 'accountsPayable', label: 'of which accounts payable', group: 'liabilities' },
  { key: 'totalDebt', label: 'Interest-bearing debt (all)', group: 'liabilities' },
  { key: 'totalLiabilities', label: 'Total liabilities', group: 'liabilities' },
  { key: 'equity', label: "Shareholders' equity", group: 'liabilities' },
];
const GROUP_LABEL = { income: 'Income statement (period)', assets: 'Assets (period end)', liabilities: 'Liabilities & equity (period end)' };
const FAMILY_ICON: Record<RatioFamily, typeof Droplets> = { liquidity: Droplets, leverage: Scale, profitability: TrendingUp, efficiency: Gauge };
const TONE: Record<Assessment, string> = { strong: 'text-emerald-600 border-emerald-500/30 bg-emerald-500/5', ok: 'text-amber-600 border-amber-500/30 bg-amber-500/5', weak: 'text-red-600 border-red-500/30 bg-red-500/5' };
const TONE_LABEL: Record<Assessment, string> = { strong: 'Strong', ok: 'Acceptable', weak: 'Watch' };

export default function FinancialRatioSuite() {
  const urlFamily = useSearchParam('family');
  const [familyOverride, setFamily] = useState<RatioFamily | 'all' | null>(null);
  const family: RatioFamily | 'all' = familyOverride ?? (isRatioFamily(urlFamily) ? urlFamily : 'all');

  const [v, setV] = useState<Record<Key, string>>(() => Object.fromEntries(Object.entries(RATIO_DEFAULTS).map(([k, val]) => [k, String(val)])) as Record<Key, string>);
  const set = (k: Key) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('financial-ratio-calculator');

  const input = useMemo(() => Object.fromEntries(FIELDS.map((f) => [f.key, num(v[f.key])])) as unknown as FinancialStatementInput, [v]);
  const r = useMemo(() => computeFinancialRatios(input), [input]);
  const valid = input.revenue > 0 || input.totalAssets > 0;
  const shown = family === 'all' ? FAMILIES : FAMILIES.filter((f) => f.value === family);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <p className="text-xs text-muted-foreground rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
          Enter the figures once from your income statement and balance sheet; every ratio updates together. Use the same period for both (year-end balances with the year&apos;s income statement). Leave anything you do not have at 0 and the ratios that need it show as —.
        </p>
        {(['income', 'assets', 'liabilities'] as const).map((g) => (
          <div key={g} className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
            <p className="text-sm font-semibold">{GROUP_LABEL[g]}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {FIELDS.filter((f) => f.group === g).map((f) => (
                <div key={f.key} className="space-y-1">
                  <Label htmlFor={`fr-${f.key}`} className="text-xs text-muted-foreground">{f.label}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input id={`fr-${f.key}`} type="number" inputMode="decimal" step="1000" value={v[f.key]} onChange={(e) => set(f.key)(e.target.value)} className="text-sm pl-7" />
                  </div>
                  {f.help && <p className="text-[11px] text-muted-foreground">{f.help}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
        {Math.abs(r.balanceGap) > 0.5 && (
          <p className="text-xs text-amber-600 flex items-start gap-1.5"><AlertTriangle className="h-4 w-4 shrink-0" /> Total assets − total liabilities − equity = {formatCurrency(r.balanceGap)}. A balance sheet should net to zero; check the three totals.</p>
        )}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={() => setV(Object.fromEntries(Object.entries(RATIO_DEFAULTS).map(([k, val]) => [k, String(val)])) as Record<Key, string>)} />
          <Button onClick={() => valid && saveEntry(v, `Current ${formatRatio(r.byFamily.liquidity[0].value, 'x')} · D/E ${formatRatio(r.byFamily.leverage[1].value, 'x')} · ROE ${formatRatio(r.byFamily.profitability[4].value, '%')}`)} disabled={!valid} className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25" size="lg">
            <BookmarkPlus className="h-4 w-4 mr-2" /> Save Calculation to History
          </Button>
        </div>
      </div>

      {valid && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="result-display px-4 sm:px-6" aria-live="polite">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Ratio family">
              <button type="button" role="tab" aria-selected={family === 'all'} onClick={() => setFamily('all')} className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-medium ${family === 'all' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>All ratios</button>
              {FAMILIES.map((f) => {
                const Icon = FAMILY_ICON[f.value];
                return (
                  <button key={f.value} type="button" role="tab" aria-selected={family === f.value} onClick={() => setFamily(f.value)} className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs sm:text-sm font-medium ${family === f.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Icon className="h-3.5 w-3.5 hidden sm:inline" />{f.label}
                  </button>
                );
              })}
            </div>

            {shown.map((f) => (
              <div key={f.value} className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">{f.label}</h3>
                  <p className="text-xs text-muted-foreground">{f.question}</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {r.byFamily[f.value].map((x) => (
                    <div key={x.key} className={`rounded-xl border p-3 bg-background ${x.assessment ? TONE[x.assessment] : 'border-border/50'}`}>
                      <p className="text-xs text-muted-foreground">{x.label}</p>
                      <p className="text-xl font-bold mt-0.5">{formatRatio(x.value, x.format)}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{x.assessment ? `${TONE_LABEL[x.assessment]} · ` : ''}rule of thumb {x.range}</p>
                    </div>
                  ))}
                </div>
                {f.value === 'profitability' && r.dupont.roe !== null && (
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">DuPont decomposition of ROE</p>
                    <p className="font-mono text-xs sm:text-sm">
                      {formatRatio(r.dupont.roe, '%')} ROE = {formatRatio(r.dupont.netMargin, '%')} net margin × {formatRatio(r.dupont.assetTurnover, 'x')} asset turnover × {formatRatio(r.dupont.equityMultiplier, 'x')} equity multiplier
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Which leg is doing the work? High ROE from the multiplier is leverage, not operating performance.</p>
                  </div>
                )}
                <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                  <table className="w-full text-xs sm:text-sm">
                    <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-3 py-2 font-medium">Ratio</th><th className="text-left px-3 py-2 font-medium">Formula</th><th className="text-right px-3 py-2 font-medium">Value</th><th className="text-left px-3 py-2 font-medium hidden sm:table-cell">Reading</th></tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {r.byFamily[f.value].map((x) => (
                        <tr key={x.key}><td className="px-3 py-2 font-medium">{x.label}</td><td className="px-3 py-2 text-muted-foreground font-mono text-[11px]">{x.formula}</td><td className="px-3 py-2 text-right font-semibold">{formatRatio(x.value, x.format)}</td><td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">{x.note}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Ranges are general rules of thumb, not industry statistics: a utility, a grocer and a software company all sit in different places. Compare with your own trend and with the sector averages linked in the sources below.</p>
          </div>
        </motion.div>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

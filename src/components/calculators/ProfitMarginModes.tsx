'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus, Info } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { formatCurrency } from '@/lib/utils';
import {
  computeContribution,
  computeMarginLadder,
  computeWholesaleChain,
  CONTRIBUTION_DEFAULTS,
  MARGIN_LADDER_DEFAULTS,
  MARGIN_RANGES,
  WHOLESALE_DEFAULTS,
} from '@/lib/pricing/margins';

// Three modes folded into the Profit Margin & Markup Calculator (Phase 17):
// income-statement margin ladder, contribution margin & break-even, and the
// wholesale → retail price chain.

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;

function Field({ id, label, value, onChange, prefix, suffix, step = 'any', help }: { id: string; label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; step?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input id={id} type="number" inputMode="decimal" min="0" step={step} value={value} onChange={(e) => onChange(e.target.value)} className={`text-sm ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

function Kpi({ label, value, color = 'text-foreground' }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-base sm:text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

const Result = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="result-display mt-4" aria-live="polite">
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-5">{children}</div>
  </motion.div>
);

const Actions = ({ onExample, onSave, disabled }: { onExample: () => void; onSave: () => void; disabled: boolean }) => (
  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
    <TryExample onClick={onExample} />
    <Button onClick={onSave} disabled={disabled} className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25" size="lg">
      <BookmarkPlus className="h-4 w-4 mr-2" /> Save Calculation to History
    </Button>
  </div>
);

// ───────────────────────── gross → operating → net

export function StatementMarginMode() {
  const d = MARGIN_LADDER_DEFAULTS;
  const [v, setV] = useState({ revenue: String(d.revenue), cogs: String(d.cogs), opex: String(d.operatingExpenses), da: String(d.depreciation), interest: String(d.interest), taxes: String(d.taxes) });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('net-margin-calculator');
  const r = useMemo(() => computeMarginLadder({ revenue: num(v.revenue), cogs: num(v.cogs), operatingExpenses: num(v.opex), depreciation: num(v.da), interest: num(v.interest), taxes: num(v.taxes) }), [v]);
  const valid = num(v.revenue) > 0;
  const tone = (m: number) => (m < 0 ? 'text-red-600' : m < 5 ? 'text-amber-600' : 'text-emerald-600');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="ml-rev" label="Revenue (net sales)" value={v.revenue} onChange={set('revenue')} prefix="$" step="1000" />
        <Field id="ml-cogs" label="Cost of goods sold" value={v.cogs} onChange={set('cogs')} prefix="$" step="1000" help="Materials, direct labor, cost of sales" />
        <Field id="ml-opex" label="Operating expenses" value={v.opex} onChange={set('opex')} prefix="$" step="1000" help="Rent, salaries, marketing, admin (SG&A)" />
        <Field id="ml-da" label="Depreciation & amortization" value={v.da} onChange={set('da')} prefix="$" step="1000" />
        <Field id="ml-int" label="Interest expense" value={v.interest} onChange={set('interest')} prefix="$" step="500" />
        <Field id="ml-tax" label="Income taxes" value={v.taxes} onChange={set('taxes')} prefix="$" step="500" />
      </div>
      <Actions onExample={() => setV({ revenue: '1200000', cogs: '540000', opex: '420000', da: '30000', interest: '18000', taxes: '40000' })} onSave={() => valid && saveEntry(v, `Gross ${pct(r.grossMargin)} · Operating ${pct(r.operatingMargin)} · Net ${pct(r.netMargin)}`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Gross margin" value={pct(r.grossMargin)} color={tone(r.grossMargin)} />
            <Kpi label="EBITDA margin" value={pct(r.ebitdaMargin)} color={tone(r.ebitdaMargin)} />
            <Kpi label="Operating margin" value={pct(r.operatingMargin)} color={tone(r.operatingMargin)} />
            <Kpi label="Net margin" value={pct(r.netMargin)} color={tone(r.netMargin)} />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Line</th><th className="text-right px-4 py-2 font-medium">Amount</th><th className="text-right px-4 py-2 font-medium">% of revenue</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                <tr className="font-medium"><td className="px-4 py-2">Revenue</td><td className="text-right px-4 py-2">{formatCurrency(num(v.revenue))}</td><td className="text-right px-4 py-2">100.0%</td></tr>
                <tr><td className="px-4 py-2 text-muted-foreground">− {r.layers[0].label}</td><td className="text-right px-4 py-2 text-red-500">{formatCurrency(r.layers[0].amount)}</td><td className="text-right px-4 py-2 text-muted-foreground">{pct(r.layers[0].pctOfRevenue)}</td></tr>
                <tr className="font-semibold bg-muted/20"><td className="px-4 py-2">= Gross profit</td><td className="text-right px-4 py-2">{formatCurrency(r.grossProfit)}</td><td className="text-right px-4 py-2">{pct(r.grossMargin)}</td></tr>
                <tr><td className="px-4 py-2 text-muted-foreground">− {r.layers[1].label}</td><td className="text-right px-4 py-2 text-red-500">{formatCurrency(r.layers[1].amount)}</td><td className="text-right px-4 py-2 text-muted-foreground">{pct(r.layers[1].pctOfRevenue)}</td></tr>
                <tr className="font-semibold bg-muted/20"><td className="px-4 py-2">= EBITDA</td><td className="text-right px-4 py-2">{formatCurrency(r.ebitda)}</td><td className="text-right px-4 py-2">{pct(r.ebitdaMargin)}</td></tr>
                <tr><td className="px-4 py-2 text-muted-foreground">− {r.layers[2].label}</td><td className="text-right px-4 py-2 text-red-500">{formatCurrency(r.layers[2].amount)}</td><td className="text-right px-4 py-2 text-muted-foreground">{pct(r.layers[2].pctOfRevenue)}</td></tr>
                <tr className="font-semibold bg-muted/20"><td className="px-4 py-2">= Operating income (EBIT)</td><td className="text-right px-4 py-2">{formatCurrency(r.operatingIncome)}</td><td className="text-right px-4 py-2">{pct(r.operatingMargin)}</td></tr>
                <tr><td className="px-4 py-2 text-muted-foreground">− {r.layers[3].label}</td><td className="text-right px-4 py-2 text-red-500">{formatCurrency(r.layers[3].amount)}</td><td className="text-right px-4 py-2 text-muted-foreground">{pct(r.layers[3].pctOfRevenue)}</td></tr>
                <tr className="font-semibold bg-muted/20"><td className="px-4 py-2">= Pre-tax income</td><td className="text-right px-4 py-2">{formatCurrency(r.pretaxIncome)}</td><td className="text-right px-4 py-2">{pct(r.pretaxMargin)}</td></tr>
                <tr><td className="px-4 py-2 text-muted-foreground">− {r.layers[4].label}</td><td className="text-right px-4 py-2 text-red-500">{formatCurrency(r.layers[4].amount)}</td><td className="text-right px-4 py-2 text-muted-foreground">{pct(r.layers[4].pctOfRevenue)}</td></tr>
                <tr className="font-bold bg-emerald-500/5"><td className="px-4 py-2">= Net income</td><td className={`text-right px-4 py-2 ${tone(r.netMargin)}`}>{formatCurrency(r.netIncome)}</td><td className={`text-right px-4 py-2 ${tone(r.netMargin)}`}>{pct(r.netMargin)}</td></tr>
              </tbody>
            </table>
          </div>
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">Typical ranges by sector</summary>
            <div className="overflow-x-auto mt-2 rounded-lg border border-border/50">
              <table className="w-full text-xs">
                <thead><tr className="bg-muted/30"><th className="text-left px-3 py-1.5">Sector</th><th className="text-right px-3 py-1.5">Gross</th><th className="text-right px-3 py-1.5">Operating</th><th className="text-right px-3 py-1.5">Net</th></tr></thead>
                <tbody className="divide-y divide-border/30">{MARGIN_RANGES.map((x) => <tr key={x.label}><td className="px-3 py-1.5">{x.label}</td><td className="text-right px-3 py-1.5">{x.gross}</td><td className="text-right px-3 py-1.5">{x.operating}</td><td className="text-right px-3 py-1.5">{x.net}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="mt-2 flex items-start gap-1.5"><Info className="h-3.5 w-3.5 mt-0.5 shrink-0" /> Rules of thumb. For measured industry averages use the NYU Stern margin dataset linked in the sources below.</p>
          </details>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── contribution margin & break-even

export function ContributionMarginMode() {
  const d = CONTRIBUTION_DEFAULTS;
  const [price, setPrice] = useState(String(d.price));
  const [vc, setVc] = useState(String(d.variableCost));
  const [units, setUnits] = useState(String(d.units));
  const [fixed, setFixed] = useState(String(d.fixedCosts));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('contribution-margin-calculator');
  const r = useMemo(() => computeContribution({ price: num(price), variableCost: num(vc), units: num(units), fixedCosts: num(fixed) }), [price, vc, units, fixed]);
  const valid = num(price) > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="cm-price" label="Selling price per unit" value={price} onChange={setPrice} prefix="$" step="0.5" />
        <Field id="cm-vc" label="Variable cost per unit" value={vc} onChange={setVc} prefix="$" step="0.5" help="Materials, piece labor, shipping, fees" />
        <Field id="cm-units" label="Units sold (per period)" value={units} onChange={setUnits} step="10" />
        <Field id="cm-fixed" label="Fixed costs (per period)" value={fixed} onChange={setFixed} prefix="$" step="500" help="Rent, salaries, insurance, software" />
      </div>
      <Actions onExample={() => { setPrice('50'); setVc('20'); setUnits('1000'); setFixed('18000'); }} onSave={() => valid && saveEntry({ price, vc, units, fixed }, `CM ${formatCurrency(r.cmPerUnit)}/unit (${pct(r.cmRatio)}) · break-even ${r.breakEvenUnits ?? '—'} units`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Contribution margin per unit</p>
            <p className={`text-4xl sm:text-5xl font-extrabold ${r.cmPerUnit > 0 ? 'text-emerald-600' : 'text-red-600'}`} data-result-primary>{formatCurrency(r.cmPerUnit)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">{pct(r.cmRatio)}</strong> contribution margin ratio · variable costs take <strong className="text-foreground">{pct(r.variableCostRatio)}</strong> of each sale
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Total contribution" value={formatCurrency(r.totalContribution)} color="text-emerald-600" />
            <Kpi label="Operating income after fixed costs" value={formatCurrency(r.operatingIncome)} color={r.operatingIncome >= 0 ? 'text-emerald-600' : 'text-red-600'} />
            <Kpi label="Break-even units" value={r.breakEvenUnits === null ? 'Never (unit loses money)' : r.breakEvenUnits.toLocaleString('en-US')} />
            <Kpi label="Break-even revenue" value={r.breakEvenRevenue === null ? '—' : formatCurrency(r.breakEvenRevenue)} />
          </div>
          {r.breakEvenUnits !== null && (
            <div className="rounded-xl bg-background border border-border/50 p-4 text-sm space-y-2">
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-red-500/30" style={{ width: `${Math.min(100, (r.breakEvenUnits / Math.max(num(units), r.breakEvenUnits)) * 100)}%` }} />
                <div className="absolute inset-y-0 w-1 bg-emerald-600" style={{ left: `${Math.min(99, (num(units) / Math.max(num(units), r.breakEvenUnits)) * 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">
                {r.marginOfSafety !== null && r.marginOfSafety >= 0
                  ? `Sales can fall ${pct(r.marginOfSafety)} (${Math.round(num(units) - r.breakEvenUnits).toLocaleString('en-US')} units) before you lose money — the margin of safety.`
                  : `You are ${Math.round(r.breakEvenUnits - num(units)).toLocaleString('en-US')} units short of break-even.`}
                {r.operatingLeverage !== null && ` Operating leverage ${r.operatingLeverage}×: a 10% rise in sales lifts operating income about ${(r.operatingLeverage * 10).toFixed(0)}%.`}
              </p>
            </div>
          )}
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setPrice(i.price ?? ''); setVc(i.vc ?? ''); setUnits(i.units ?? ''); setFixed(i.fixed ?? ''); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── wholesale → retail chain

export function WholesaleChainMode() {
  const d = WHOLESALE_DEFAULTS;
  const [cost, setCost] = useState(String(d.unitCost));
  const [wm, setWm] = useState(String(d.wholesaleMarginPct));
  const [mult, setMult] = useState(String(d.retailMultiplier));
  const [dist, setDist] = useState('0');
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('wholesale-price-calculator');
  const r = useMemo(() => computeWholesaleChain({ unitCost: num(cost), wholesaleMarginPct: num(wm), retailMultiplier: num(mult) || 1, distributorMarginPct: num(dist) }), [cost, wm, mult, dist]);
  const valid = num(cost) > 0;
  const colors = ['bg-slate-400', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-500'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="wc-cost" label="Cost to make / buy one unit" value={cost} onChange={setCost} prefix="$" step="0.5" />
        <Field id="wc-wm" label="Your margin on wholesale" value={wm} onChange={setWm} suffix="%" step="1" help="50% = you double your cost" />
        <Field id="wc-mult" label="Retailer multiplier" value={mult} onChange={setMult} suffix="×" step="0.1" help="2× = keystone (50% retail margin), 2.2–2.5× boutiques" />
        <Field id="wc-dist" label="Distributor margin (optional)" value={dist} onChange={setDist} suffix="%" step="1" help="0 = sell direct to retailers" />
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {[['Keystone', '2'], ['Boutique 2.3×', '2.3'], ['Grocery 1.4×', '1.4'], ['Online marketplace 1.7×', '1.7']].map(([l, m]) => (
          <button key={l} type="button" onClick={() => setMult(m)} className={`px-2.5 py-1 rounded-full border ${mult === m ? 'bg-emerald-600 text-white border-emerald-600' : 'border-border/60 text-muted-foreground hover:text-foreground'}`}>{l}</button>
        ))}
      </div>
      <Actions onExample={() => { setCost('12'); setWm('50'); setMult('2'); setDist('0'); }} onSave={() => valid && saveEntry({ cost, wm, mult, dist }, `Cost ${formatCurrency(num(cost))} → wholesale ${formatCurrency(r.wholesalePrice)} → retail ${formatCurrency(r.retailPrice)}`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Your cost" value={formatCurrency(num(cost))} />
            <Kpi label="Wholesale price" value={formatCurrency(r.wholesalePrice)} color="text-emerald-600" />
            {r.distributorPrice !== null && <Kpi label="Distributor price" value={formatCurrency(r.distributorPrice)} color="text-amber-600" />}
            <Kpi label="Retail price (MSRP)" value={formatCurrency(r.retailPrice)} color="text-blue-600" />
            {r.distributorPrice === null && <Kpi label="Your markup on cost" value={pct(r.makerMarkup, 0)} />}
          </div>
          <div className="rounded-xl bg-background border border-border/50 p-4 space-y-3">
            <p className="text-xs font-semibold">Where each retail dollar goes</p>
            <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-muted">
              {r.shares.map((s, i) => <div key={s.label} style={{ width: `${s.share * 100}%` }} className={`${colors[i % colors.length]} h-full`} title={s.label} />)}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {r.shares.map((s, i) => <span key={s.label} className="inline-flex items-center gap-1.5"><span className={`size-2.5 rounded-sm ${colors[i % colors.length]}`} />{s.label} {formatCurrency(s.amount)} ({pct(s.share * 100, 0)})</span>)}
            </div>
            <p className="text-xs text-muted-foreground">
              You keep {formatCurrency(r.makerProfit)} per unit ({pct(r.makerMarkup, 0)} markup, {pct(num(wm), 0)} margin on wholesale); the retailer keeps {formatCurrency(r.retailerProfit)} ({pct(r.retailerMargin, 0)} retail margin). If you also sell direct at the retail price, your direct margin is {pct(((r.retailPrice - num(cost)) / r.retailPrice) * 100, 0)} before the extra selling costs direct sales carry.
            </p>
          </div>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setCost(i.cost ?? ''); setWm(i.wm ?? '50'); setMult(i.mult ?? '2'); setDist(i.dist ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

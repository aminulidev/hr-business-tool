'use client';

import { useMemo, useState } from 'react';
import { motion } from '@/components/motion';
import { BookmarkPlus, Info, Megaphone, Target, Filter, Plus, Trash2 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { formatCurrency } from '@/lib/utils';
import {
  BUDGET_DEFAULTS,
  computeBudget,
  computeFunnel,
  computeStages,
  FUNNEL_DEFAULTS,
  isMarketingMode,
  MARKETING_MODES,
  STAGE_DEFAULTS,
  type MarketingMode,
} from '@/lib/pricing/marketing';

// Phase 17: cpm, cpc, cpl, cpa, marketing-roi and conversion-rate pages 301 here with ?mode=…

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const int = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
const pct = (n: number | null, d = 1) => (n === null ? '—' : `${n.toFixed(d)}%`);
const money = (n: number | null) => (n === null ? '—' : formatCurrency(n));

function Field({ id, label, value, onChange, prefix, suffix, step = 'any', help }: { id: string; label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; step?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input id={id} type="number" inputMode="decimal" min="0" step={step} value={value} onChange={(e) => onChange(e.target.value)} className={`text-sm ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}
function Kpi({ label, value, sub, color = 'text-foreground' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-base sm:text-lg font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
const Result = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="result-display mt-2" aria-live="polite">
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

// ───────────────────────── campaign metrics

function FunnelMode() {
  const d = FUNNEL_DEFAULTS;
  const [v, setV] = useState({ spend: String(d.spend), imp: String(d.impressions), clicks: String(d.clicks), leads: String(d.leads), cust: String(d.customers), rpc: String(d.revenuePerCustomer), gm: String(d.grossMarginPct) });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('cpc-calculator');
  const r = useMemo(() => computeFunnel({ spend: num(v.spend), impressions: num(v.imp), clicks: num(v.clicks), leads: num(v.leads), customers: num(v.cust), revenuePerCustomer: num(v.rpc), grossMarginPct: num(v.gm) }), [v]);
  const valid = num(v.spend) > 0;
  const steps = [
    { label: 'Impressions', count: num(v.imp), cost: r.cpm, costLabel: 'CPM (per 1,000)', rate: null as number | null, rateLabel: '' },
    { label: 'Clicks', count: num(v.clicks), cost: r.cpc, costLabel: 'CPC', rate: r.ctr, rateLabel: 'CTR' },
    { label: 'Leads', count: num(v.leads), cost: r.cpl, costLabel: 'CPL', rate: r.leadRate, rateLabel: 'click → lead' },
    { label: 'Customers', count: num(v.cust), cost: r.cpa, costLabel: 'CPA / CAC', rate: r.closeRate, rateLabel: 'lead → customer' },
  ];
  const tone = r.profitRoi === null ? 'text-foreground' : r.profitRoi < 0 ? 'text-red-600' : 'text-emerald-600';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="mf-spend" label="Ad spend" value={v.spend} onChange={set('spend')} prefix="$" step="100" />
        <Field id="mf-imp" label="Impressions" value={v.imp} onChange={set('imp')} step="1000" help="Leave 0 if you only buy clicks" />
        <Field id="mf-clicks" label="Clicks" value={v.clicks} onChange={set('clicks')} step="10" />
        <Field id="mf-leads" label="Leads / sign-ups" value={v.leads} onChange={set('leads')} step="1" help="0 if there is no lead step" />
        <Field id="mf-cust" label="Customers / conversions" value={v.cust} onChange={set('cust')} step="1" />
        <Field id="mf-rpc" label="Revenue per customer" value={v.rpc} onChange={set('rpc')} prefix="$" step="10" help="First order or first-year value" />
        <Field id="mf-gm" label="Gross margin" value={v.gm} onChange={set('gm')} suffix="%" step="1" help="Sets the profit-based ROI and break-even CPA" />
      </div>
      <Actions onExample={() => setV({ spend: '12000', imp: '1500000', clicks: '18000', leads: '540', cust: '54', rpc: '650', gm: '60' })} onSave={() => valid && saveEntry(v, `CPC ${money(r.cpc)} · CPL ${money(r.cpl)} · CPA ${money(r.cpa)} · ROAS ${r.roas ?? '—'}×`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Cost per customer (CPA)</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{money(r.cpa)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">break-even CPA <strong className="text-foreground">{formatCurrency(r.breakEvenCpa)}</strong> ({v.gm || 0}% margin on {formatCurrency(num(v.rpc))}) · ROAS <strong className="text-foreground">{r.roas === null ? '—' : `${r.roas}×`}</strong> · profit after ad spend <strong className={tone}>{formatCurrency(r.netProfit)}</strong></p>
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Stage</th><th className="text-right px-4 py-2 font-medium">Count</th><th className="text-right px-4 py-2 font-medium">Conversion</th><th className="text-right px-4 py-2 font-medium">Unit cost</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {steps.filter((s) => s.count > 0).map((s) => (
                  <tr key={s.label}><td className="px-4 py-2 font-medium">{s.label}</td><td className="text-right px-4 py-2">{int(s.count)}</td><td className="text-right px-4 py-2 text-muted-foreground">{s.rate === null ? '—' : `${pct(s.rate, 2)} ${s.rateLabel}`}</td><td className="text-right px-4 py-2 font-semibold">{money(s.cost)} <span className="text-xs font-normal text-muted-foreground">{s.costLabel}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Revenue" value={formatCurrency(r.revenue)} sub={`${int(num(v.cust))} × ${formatCurrency(num(v.rpc))}`} />
            <Kpi label="ROAS" value={r.roas === null ? '—' : `${r.roas}×`} sub={r.breakEvenRoas ? `break-even ${r.breakEvenRoas}×` : undefined} color="text-blue-600" />
            <Kpi label="ROI on revenue" value={pct(r.roi, 0)} sub="(revenue − spend) ÷ spend" />
            <Kpi label="ROI on gross profit" value={pct(r.profitRoi, 0)} sub="(gross profit − spend) ÷ spend" color={tone} />
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Each unit cost is spend ÷ the count at that stage; each conversion is the count ÷ the stage above. Revenue-based ROI flatters campaigns; the profit-based figure, which deducts cost of goods, is the one that decides whether to scale. Overall click-to-customer rate: {pct(r.clickToCustomer, 2)}; ad spend is {r.costOfSale === null ? '—' : `${(r.costOfSale * 100).toFixed(1)}%`} of revenue.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── budget & targets

function BudgetMode() {
  const d = BUDGET_DEFAULTS;
  const [v, setV] = useState({ cust: String(d.targetCustomers), ctr: String(d.ctrPct), lr: String(d.leadRatePct), cr: String(d.closeRatePct), cpc: String(d.cpc), cpm: String(d.cpm), rpc: String(d.revenuePerCustomer), gm: String(d.grossMarginPct), roas: String(d.targetRoas) });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('marketing-roi-calculator');
  const r = useMemo(() => computeBudget({ targetCustomers: num(v.cust), ctrPct: num(v.ctr), leadRatePct: num(v.lr), closeRatePct: num(v.cr), cpc: num(v.cpc), cpm: num(v.cpm), revenuePerCustomer: num(v.rpc), grossMarginPct: num(v.gm), targetRoas: num(v.roas) }), [v]);
  const headroomTone = r?.cpaHeadroom === null || r?.cpaHeadroom === undefined ? 'text-foreground' : r.cpaHeadroom > 1 ? 'text-red-600' : r.cpaHeadroom > 0.75 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Field id="mb-cust" label="Customers you need" value={v.cust} onChange={set('cust')} step="1" />
        <Field id="mb-cr" label="Lead → customer rate" value={v.cr} onChange={set('cr')} suffix="%" step="0.5" />
        <Field id="mb-lr" label="Click → lead rate" value={v.lr} onChange={set('lr')} suffix="%" step="0.5" />
        <Field id="mb-ctr" label="Click-through rate" value={v.ctr} onChange={set('ctr')} suffix="%" step="0.1" help="Only needed for impressions / CPM" />
        <Field id="mb-cpc" label="Expected CPC" value={v.cpc} onChange={set('cpc')} prefix="$" step="0.05" help="Set 0 to price on CPM instead" />
        <Field id="mb-cpm" label="Expected CPM" value={v.cpm} onChange={set('cpm')} prefix="$" step="0.5" help="Used when CPC is 0" />
        <Field id="mb-rpc" label="Revenue per customer" value={v.rpc} onChange={set('rpc')} prefix="$" step="10" />
        <Field id="mb-gm" label="Gross margin" value={v.gm} onChange={set('gm')} suffix="%" step="1" />
        <Field id="mb-roas" label="Target ROAS" value={v.roas} onChange={set('roas')} suffix="×" step="0.5" help="e.g. 4 = $4 revenue per $1" />
      </div>
      <Actions onExample={() => setV({ cust: '100', ctr: '1.2', lr: '3', cr: '10', cpc: '0.7', cpm: '0', rpc: '650', gm: '60', roas: '4' })} onSave={() => r && saveEntry(v, `${v.cust} customers need ${formatCurrency(r.budget)} · max CPA ${formatCurrency(r.breakEvenCpa)}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter the customers you need and non-zero lead and close rates.</p>}
      {r && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Budget to win {int(num(v.cust))} customers</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(r.budget)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground"><strong className="text-foreground">{int(r.clicksNeeded)}</strong> clicks → <strong className="text-foreground">{int(r.leadsNeeded)}</strong> leads → {int(num(v.cust))} customers · expected CPA <strong className={headroomTone}>{money(r.expectedCpa)}</strong> vs break-even <strong className="text-foreground">{formatCurrency(r.breakEvenCpa)}</strong> · expected ROAS <strong className="text-foreground">{r.expectedRoas ?? '—'}×</strong></p>
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <div className="px-4 py-2 border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">The most you can pay at each stage</div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Metric</th><th className="text-right px-4 py-2 font-medium">Expected</th><th className="text-right px-4 py-2 font-medium">Break-even ceiling</th><th className="text-right px-4 py-2 font-medium">For {v.roas || 0}× ROAS</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                <tr><td className="px-4 py-2 font-medium">Cost per customer (CPA)</td><td className={`text-right px-4 py-2 ${headroomTone}`}>{money(r.expectedCpa)}</td><td className="text-right px-4 py-2">{formatCurrency(r.breakEvenCpa)}</td><td className="text-right px-4 py-2">{money(r.targetCpa)}</td></tr>
                <tr><td className="px-4 py-2 font-medium">Cost per lead (CPL)</td><td className="text-right px-4 py-2">{money(r.expectedCpl)}</td><td className="text-right px-4 py-2">{formatCurrency(r.breakEvenCpl)}</td><td className="text-right px-4 py-2">{r.targetCpa === null ? '—' : formatCurrency(r.targetCpa * (num(v.cr) / 100))}</td></tr>
                <tr><td className="px-4 py-2 font-medium">Cost per click (CPC)</td><td className="text-right px-4 py-2">{num(v.cpc) > 0 ? formatCurrency(num(v.cpc)) : '—'}</td><td className="text-right px-4 py-2">{formatCurrency(r.breakEvenCpc)}</td><td className="text-right px-4 py-2">{money(r.targetCpc)}</td></tr>
                <tr><td className="px-4 py-2 font-medium">Cost per 1,000 impressions (CPM)</td><td className="text-right px-4 py-2">{num(v.cpm) > 0 ? formatCurrency(num(v.cpm)) : '—'}</td><td className="text-right px-4 py-2">{r.breakEvenCpm > 0 ? formatCurrency(r.breakEvenCpm) : '—'}</td><td className="text-right px-4 py-2">{r.targetCpc !== null && num(v.ctr) > 0 ? formatCurrency(r.targetCpc * (num(v.ctr) / 100) * 1000) : '—'}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Impressions needed" value={r.impressionsNeeded > 0 ? int(r.impressionsNeeded) : '—'} />
            <Kpi label="Expected revenue" value={formatCurrency(r.expectedRevenue)} />
            <Kpi label="Expected gross profit" value={formatCurrency(r.expectedRevenue * (num(v.gm) / 100))} color="text-blue-600" />
            <Kpi label="Profit after ad spend" value={formatCurrency(r.expectedRevenue * (num(v.gm) / 100) - r.budget)} color={r.expectedRevenue * (num(v.gm) / 100) - r.budget >= 0 ? 'text-emerald-600' : 'text-red-600'} />
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Break-even CPA = revenue per customer × gross margin; divide by the close rate for the CPL ceiling, by the lead rate for the CPC ceiling, and multiply by CTR × 1,000 for CPM. If the expected CPA is above the ceiling you lose money on every customer before overhead; aim for a clear margin below it.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── funnel stages

type StageRow = { id: number; name: string; count: string };
let nextId = 10;

function StagesMode() {
  const [rows, setRows] = useState<StageRow[]>(() => STAGE_DEFAULTS.map((s, i) => ({ id: i + 1, name: s.name, count: String(s.count) })));
  const [spend, setSpend] = useState('5000');
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('conversion-rate-calculator');
  const r = useMemo(() => computeStages(rows.map((x) => ({ name: x.name, count: num(x.count) })), num(spend)), [rows, spend]);
  const valid = r.stages.length >= 2 && r.stages[0].count > 0;
  const update = (id: number, field: 'name' | 'count', value: string) => setRows((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  const top = r.stages[0]?.count ?? 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        {rows.map((row, i) => (
          <div key={row.id} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
            <Input aria-label={`Stage ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, 'name', e.target.value)} className="text-sm flex-1" placeholder="Stage name" />
            <Input aria-label={`Stage ${i + 1} count`} type="number" min="0" step="1" value={row.count} onChange={(e) => update(row.id, 'count', e.target.value)} className="text-sm w-28" />
            <Button type="button" variant="ghost" size="icon" aria-label="Remove stage" onClick={() => setRows((p) => (p.length > 2 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Button type="button" variant="outline" size="sm" disabled={rows.length >= 8} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', count: '' }])}><Plus className="h-4 w-4 mr-1" /> Add stage</Button>
          <div className="w-44"><Field id="ms-spend" label="Spend on this funnel (optional)" value={spend} onChange={setSpend} prefix="$" step="100" /></div>
        </div>
      </div>
      <Actions onExample={() => { setRows(STAGE_DEFAULTS.map((s, i) => ({ id: i + 1, name: s.name, count: String(s.count) }))); setSpend('5000'); }} onSave={() => valid && saveEntry({ rows: JSON.stringify(rows), spend }, `${r.stages[0].name} → ${r.stages[r.stages.length - 1].name}: ${pct(r.overallRate, 2)} overall`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Overall conversion, {r.stages[0].name.toLowerCase()} → {r.stages[r.stages.length - 1].name.toLowerCase()}</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{pct(r.overallRate, 2)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">it takes <strong className="text-foreground">{r.topPerBottom}</strong> {r.stages[0].name.toLowerCase()} to produce one {r.stages[r.stages.length - 1].name.toLowerCase().replace(/s$/, '')}{r.bottomIfWeakestPlus10 !== null && <> · lifting the weakest stage by 10% would give <strong className="text-foreground">{r.bottomIfWeakestPlus10}</strong> instead of {r.stages[r.stages.length - 1].count}</>}</p>
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Stage</th><th className="text-right px-4 py-2 font-medium">Count</th><th className="text-right px-4 py-2 font-medium">From previous</th><th className="text-right px-4 py-2 font-medium">From top</th>{num(spend) > 0 && <th className="text-right px-4 py-2 font-medium">Cost each</th>}</tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.stages.map((s, i) => (
                  <tr key={i} className={s.biggestDrop ? 'bg-red-500/5' : ''}>
                    <td className="px-4 py-2 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-emerald-500/70" style={{ width: `${Math.max(4, (s.count / top) * 120)}px` }} />
                        {s.name}{s.biggestDrop && <span className="text-[10px] uppercase tracking-wider text-red-600 font-semibold">biggest drop</span>}
                      </div>
                    </td>
                    <td className="text-right px-4 py-2">{int(s.count)}</td>
                    <td className={`text-right px-4 py-2 ${s.biggestDrop ? 'text-red-600 font-semibold' : ''}`}>{pct(s.fromPrevious)}</td>
                    <td className="text-right px-4 py-2 text-muted-foreground">{pct(s.fromTop, 2)}</td>
                    {num(spend) > 0 && <td className="text-right px-4 py-2">{money(s.costEach)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> The weakest stage is the cheapest place to improve: a relative 10% gain there flows straight to the bottom of the funnel, while adding volume at the top costs money at every stage below it.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as StageRow[]; if (Array.isArray(p)) setRows(p); } catch {} setSpend(i.spend ?? ''); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── suite

const MODE_ICON: Record<MarketingMode, typeof Megaphone> = { funnel: Megaphone, budget: Target, stages: Filter };

export default function MarketingCostSuite() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<MarketingMode | null>(null);
  const mode: MarketingMode = override ?? (isMarketingMode(urlMode) ? urlMode : 'funnel');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Marketing cost mode">
          {MARKETING_MODES.map((m) => {
            const Icon = MODE_ICON[m.value];
            return (
              <button key={m.value} type="button" role="tab" aria-selected={mode === m.value} onClick={() => setMode(m.value)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === m.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-4 w-4" /><span className="hidden sm:inline">{m.label}</span><span className="sm:hidden">{m.short}</span>
              </button>
            );
          })}
        </div>
        {mode === 'funnel' && <FunnelMode />}
        {mode === 'budget' && <BudgetMode />}
        {mode === 'stages' && <StagesMode />}
      </div>
    </div>
  );
}

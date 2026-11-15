'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus, Info, Plus, Trash2, GitBranch, TrendingUp, Users } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { formatCurrency } from '@/lib/utils';
import {
  computeGrowth,
  computePipeline,
  computeRetention,
  FORECAST_MODES,
  GROWTH_DEFAULTS,
  isForecastMode,
  PIPELINE_DEFAULTS,
  RETENTION_DEFAULTS,
  type ForecastMode,
} from '@/lib/pricing/sales-forecast';

// Phase 17: revenue-forecast, pipeline, win-rate, revenue-growth and
// customer-retention pages 301 here with ?mode=…

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const int = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
const pct = (n: number | null, d = 1) => (n === null ? '—' : `${n.toFixed(d)}%`);

function Field({ id, label, value, onChange, prefix, suffix, step = 'any', help }: { id: string; label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; step?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input id={id} type="number" inputMode="decimal" step={step} value={value} onChange={(e) => onChange(e.target.value)} className={`text-sm ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-10' : ''}`} />
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

// ───────────────────────── pipeline

type StageRow = { id: number; name: string; value: string; prob: string; deals: string };
let nextId = 10;
const defaultRows = () => PIPELINE_DEFAULTS.stages.map((s, i) => ({ id: i + 1, name: s.name, value: String(s.value), prob: String(s.probabilityPct), deals: String(s.deals) }));

function PipelineMode() {
  const d = PIPELINE_DEFAULTS;
  const [rows, setRows] = useState<StageRow[]>(defaultRows);
  const [v, setV] = useState({ quota: String(d.quota), won: String(d.wonDeals), lost: String(d.lostDeals), cycle: String(d.salesCycleDays), window: String(d.forecastDays), deal: String(d.averageDealSize) });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('sales-forecast-calculator');
  const r = useMemo(() => computePipeline({ stages: rows.map((x) => ({ name: x.name || 'Stage', value: num(x.value), probabilityPct: num(x.prob), deals: num(x.deals) })), quota: num(v.quota), wonDeals: num(v.won), lostDeals: num(v.lost), salesCycleDays: num(v.cycle), forecastDays: num(v.window), averageDealSize: num(v.deal) }), [rows, v]);
  const valid = r.totalPipeline > 0;
  const update = (id: number, field: keyof StageRow, value: string) => setRows((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  const gapTone = r.gap > 0 ? 'text-red-600' : 'text-emerald-600';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground"><th className="text-left py-1 pr-2 font-medium">Stage</th><th className="text-left py-1 px-2 font-medium">Open value</th><th className="text-left py-1 px-2 font-medium">Close probability</th><th className="text-left py-1 px-2 font-medium">Deals</th><th className="text-right py-1 pl-2 font-medium">Weighted</th><th /></tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td className="py-1 pr-2"><Input aria-label={`Stage ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, 'name', e.target.value)} className="text-sm min-w-[9rem]" /></td>
                  <td className="py-1 px-2"><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Stage ${i + 1} value`} type="number" min="0" step="10000" value={row.value} onChange={(e) => update(row.id, 'value', e.target.value)} className="text-sm w-32 pl-6" /></div></td>
                  <td className="py-1 px-2"><div className="relative"><Input aria-label={`Stage ${i + 1} probability`} type="number" min="0" max="100" step="5" value={row.prob} onChange={(e) => update(row.id, 'prob', e.target.value)} className="text-sm w-24 pr-7" /><span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span></div></td>
                  <td className="py-1 px-2"><Input aria-label={`Stage ${i + 1} deals`} type="number" min="0" step="1" value={row.deals} onChange={(e) => update(row.id, 'deals', e.target.value)} className="text-sm w-20" /></td>
                  <td className="py-1 pl-2 text-right whitespace-nowrap">{formatCurrency(num(row.value) * (num(row.prob) / 100))}</td>
                  <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove stage" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={rows.length >= 8} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', value: '', prob: '50', deals: '' }])}><Plus className="h-4 w-4 mr-1" /> Add stage</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Field id="pl-quota" label="Quota / target for the period" value={v.quota} onChange={set('quota')} prefix="$" step="10000" />
        <Field id="pl-won" label="Deals won (trailing period)" value={v.won} onChange={set('won')} step="1" help="For the historical win rate" />
        <Field id="pl-lost" label="Deals lost (trailing period)" value={v.lost} onChange={set('lost')} step="1" />
        <Field id="pl-cycle" label="Average sales cycle" value={v.cycle} onChange={set('cycle')} suffix="days" step="5" />
        <Field id="pl-window" label="Forecast window" value={v.window} onChange={set('window')} suffix="days" step="5" help="Quarter = 90" />
        <Field id="pl-deal" label="Average deal size" value={v.deal} onChange={set('deal')} prefix="$" step="1000" />
      </div>
      <Actions onExample={() => { setRows(defaultRows()); setV({ quota: '600000', won: '25', lost: '60', cycle: '90', window: '90', deal: '30000' }); }} onSave={() => valid && saveEntry({ rows: JSON.stringify(rows), ...v }, `Weighted ${formatCurrency(r.forecastInWindow)} vs quota ${formatCurrency(num(v.quota))} · win rate ${pct(r.winRate)}`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Forecast for the next {v.window || 0} days</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(r.forecastInWindow)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">weighted pipeline <strong className="text-foreground">{formatCurrency(r.weightedPipeline)}</strong>{r.timingFactor < 1 && <> × {Math.round(r.timingFactor * 100)}% closing in the window</>} · {num(v.quota) > 0 && <>quota {formatCurrency(num(v.quota))} → <strong className={gapTone}>{r.gap > 0 ? `${formatCurrency(r.gap)} short` : `${formatCurrency(-r.gap)} ahead`}</strong></>}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Total open pipeline" value={formatCurrency(r.totalPipeline)} sub={`${r.totalDeals} deals`} />
            <Kpi label="Historical win rate" value={pct(r.winRate)} sub={r.winRate !== null ? `${v.won} won / ${int(num(v.won) + num(v.lost))} closed` : 'enter won and lost'} color="text-blue-600" />
            <Kpi label="Pipeline coverage" value={r.coverage === null ? '—' : `${r.coverage.toFixed(1)}×`} sub="open pipeline ÷ quota (3× is the usual rule)" color={r.coverage !== null && r.coverage < 3 ? 'text-amber-600' : 'text-emerald-600'} />
            <Kpi label="Pipeline needed for quota" value={r.pipelineNeeded === null ? '—' : formatCurrency(r.pipelineNeeded)} sub={r.dealsNeeded !== null ? `≈ ${r.dealsNeeded} deals at ${formatCurrency(num(v.deal))}` : undefined} />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Stage</th><th className="text-right px-4 py-2 font-medium">Open value</th><th className="text-right px-4 py-2 font-medium">Probability</th><th className="text-right px-4 py-2 font-medium">Weighted</th><th className="text-right px-4 py-2 font-medium">Share of pipeline</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.stages.map((s, i) => <tr key={i}><td className="px-4 py-2 font-medium">{s.name}</td><td className="text-right px-4 py-2">{formatCurrency(s.value)}</td><td className="text-right px-4 py-2 text-muted-foreground">{s.probabilityPct}%</td><td className="text-right px-4 py-2 font-semibold">{formatCurrency(s.weighted)}</td><td className="text-right px-4 py-2 text-muted-foreground">{pct(s.share * 100, 0)}</td></tr>)}
                <tr className="font-bold bg-emerald-500/5"><td className="px-4 py-2">Total</td><td className="text-right px-4 py-2">{formatCurrency(r.totalPipeline)}</td><td className="text-right px-4 py-2">{pct(r.totalPipeline > 0 ? (r.weightedPipeline / r.totalPipeline) * 100 : null, 0)}</td><td className="text-right px-4 py-2 text-emerald-600">{formatCurrency(r.weightedPipeline)}</td><td className="text-right px-4 py-2">100%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Stage-weighted forecast = Σ open value × stage probability. {r.winRateForecast !== null && <>Win-rate forecast (total × {pct(r.winRate)}) = {formatCurrency(r.winRateForecast)}; the two agree when stage probabilities reflect history. </>}{r.gap > 0 && r.pipelineToAdd !== null && <>To close the gap, source about <strong className="text-foreground">{formatCurrency(r.pipelineToAdd)}</strong> of new pipeline now (at the current win rate and cycle time).</>}</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as StageRow[]; if (Array.isArray(p)) setRows(p); } catch {} setV((p) => ({ ...p, quota: i.quota ?? p.quota, won: i.won ?? p.won, lost: i.lost ?? p.lost, cycle: i.cycle ?? p.cycle, window: i.window ?? p.window, deal: i.deal ?? p.deal })); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── growth

function GrowthMode() {
  const d = GROWTH_DEFAULTS;
  const [v, setV] = useState({ prev: String(d.previousRevenue), curr: String(d.currentRevenue), months: String(d.periodMonths), periods: String(d.projectPeriods), rate: '', band: String(d.bandPts) });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('revenue-growth-calculator');
  const r = useMemo(() => computeGrowth({ previousRevenue: num(v.prev), currentRevenue: num(v.curr), periodMonths: num(v.months) || 12, projectPeriods: num(v.periods), projectionRatePct: v.rate.trim() === '' ? null : num(v.rate), bandPts: num(v.band) }), [v]);
  const valid = num(v.curr) > 0;
  const periodWord = num(v.months) === 12 ? 'year' : num(v.months) === 1 ? 'month' : num(v.months) === 3 ? 'quarter' : `${v.months}-month period`;
  const tone = r.growthPct === null ? 'text-foreground' : r.growthPct < 0 ? 'text-red-600' : 'text-emerald-600';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Field id="gr-prev" label={`Previous ${periodWord} revenue`} value={v.prev} onChange={set('prev')} prefix="$" step="10000" />
        <Field id="gr-curr" label={`Current ${periodWord} revenue`} value={v.curr} onChange={set('curr')} prefix="$" step="10000" />
        <Field id="gr-months" label="Period length" value={v.months} onChange={set('months')} suffix="months" step="1" help="12 = annual, 3 = quarterly, 1 = monthly" />
        <Field id="gr-periods" label="Project forward" value={v.periods} onChange={set('periods')} suffix="periods" step="1" />
        <Field id="gr-rate" label="Growth rate to project at" value={v.rate} onChange={set('rate')} suffix="% / period" step="0.5" help={`Blank = the measured ${pct(r.growthPct)}`} />
        <Field id="gr-band" label="Optimistic / conservative band" value={v.band} onChange={set('band')} suffix="± pts" step="1" />
      </div>
      <Actions onExample={() => setV({ prev: '1000000', curr: '1200000', months: '12', periods: '3', rate: '', band: '5' })} onSave={() => valid && saveEntry(v, `Growth ${pct(r.growthPct)} · ${v.periods} periods at ${pct(r.rateUsedPct)} → ${formatCurrency(r.endBase)}`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Revenue growth, {periodWord} over {periodWord}</p>
            <p className={`text-4xl sm:text-5xl font-extrabold ${tone}`} data-result-primary>{pct(r.growthPct)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground"><strong className="text-foreground">{formatCurrency(r.absoluteGrowth)}</strong> absolute · annualised <strong className="text-foreground">{pct(r.annualizedPct)}</strong> · monthly compound <strong className="text-foreground">{pct(r.monthlyPct, 2)}</strong>{r.doublingPeriods !== null && <> · doubles every <strong className="text-foreground">{r.doublingPeriods}</strong> {periodWord}s at {pct(r.rateUsedPct)}</>}</p>
          </div>
          {r.projection.length > 0 && (
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <div className="px-4 py-2 border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projection at {pct(r.rateUsedPct)} per {periodWord} (band ±{v.band || 0} pts)</div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Period</th><th className="text-right px-4 py-2 font-medium">Conservative</th><th className="text-right px-4 py-2 font-medium">Base</th><th className="text-right px-4 py-2 font-medium">Optimistic</th></tr></thead>
                <tbody className="divide-y divide-border/30">
                  <tr className="text-muted-foreground"><td className="px-4 py-2">Now</td><td className="text-right px-4 py-2">{formatCurrency(num(v.curr))}</td><td className="text-right px-4 py-2">{formatCurrency(num(v.curr))}</td><td className="text-right px-4 py-2">{formatCurrency(num(v.curr))}</td></tr>
                  {r.projection.slice(0, 24).map((p) => <tr key={p.period}><td className="px-4 py-2">+{p.period}</td><td className="text-right px-4 py-2 text-amber-600">{formatCurrency(p.conservative)}</td><td className="text-right px-4 py-2 font-semibold">{formatCurrency(p.base)}</td><td className="text-right px-4 py-2 text-emerald-600">{formatCurrency(p.optimistic)}</td></tr>)}
                  {r.projection.length > 24 && <tr className="font-semibold"><td className="px-4 py-2">+{r.projection.length}</td><td className="text-right px-4 py-2 text-amber-600">{formatCurrency(r.endConservative)}</td><td className="text-right px-4 py-2">{formatCurrency(r.endBase)}</td><td className="text-right px-4 py-2 text-emerald-600">{formatCurrency(r.endOptimistic)}</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Growth = (current − previous) ÷ previous. The projection compounds the chosen rate each period; a band of a few points widens quickly because compounding amplifies small rate differences, which is the honest picture of forecast uncertainty.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── retention

function RetentionMode() {
  const d = RETENTION_DEFAULTS;
  const [v, setV] = useState({ start: String(d.startCustomers), end: String(d.endCustomers), added: String(d.newCustomers), months: String(d.periodMonths), rpc: String(d.revenuePerCustomerMonthly) });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('customer-retention-calculator');
  const r = useMemo(() => computeRetention({ startCustomers: num(v.start), endCustomers: num(v.end), newCustomers: num(v.added), periodMonths: num(v.months) || 1, revenuePerCustomerMonthly: num(v.rpc) }), [v]);
  const valid = num(v.start) > 0;
  const tone = r.retentionPct === null ? 'text-foreground' : r.retentionPct >= 95 ? 'text-emerald-600' : r.retentionPct >= 85 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field id="rt-start" label="Customers at start" value={v.start} onChange={set('start')} step="10" />
        <Field id="rt-end" label="Customers at end" value={v.end} onChange={set('end')} step="10" />
        <Field id="rt-new" label="New customers added" value={v.added} onChange={set('added')} step="5" help="Excluded from retention" />
        <Field id="rt-months" label="Period length" value={v.months} onChange={set('months')} suffix="months" step="1" />
        <Field id="rt-rpc" label="Revenue per customer (optional)" value={v.rpc} onChange={set('rpc')} prefix="$" step="10" help="Per month, to price the churn" />
      </div>
      <Actions onExample={() => setV({ start: '500', end: '480', added: '50', months: '1', rpc: '120' })} onSave={() => valid && saveEntry(v, `Retention ${pct(r.retentionPct)} · churn ${pct(r.churnPct)} · lifetime ${r.averageLifetimeMonths ?? '—'} months`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Customer retention rate</p>
            <p className={`text-4xl sm:text-5xl font-extrabold ${tone}`} data-result-primary>{pct(r.retentionPct)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground"><strong className="text-foreground">{int(r.retained)}</strong> of {int(num(v.start))} kept · churn <strong className="text-foreground">{pct(r.churnPct)}</strong> ({int(r.churned)} lost) · annualised retention <strong className="text-foreground">{pct(r.annualRetentionPct)}</strong>{r.averageLifetimeMonths !== null && <> · average customer lifetime <strong className="text-foreground">{r.averageLifetimeMonths}</strong> months</>}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Net customer growth" value={pct(r.netGrowthPct)} sub={`${int(num(v.end))} vs ${int(num(v.start))}`} color={r.netGrowthPct !== null && r.netGrowthPct < 0 ? 'text-red-600' : 'text-emerald-600'} />
            <Kpi label="New customers just to stand still" value={`${int(r.replacementPerPeriod)} / period`} />
            <Kpi label="Revenue lost to churn" value={r.churnedRevenuePeriod === null ? 'add revenue per customer' : formatCurrency(r.churnedRevenuePeriod)} sub={r.churnedRevenueAnnual !== null ? `≈ ${formatCurrency(r.churnedRevenueAnnual)} a year` : undefined} color="text-amber-600" />
            <Kpi label="Cohort left after 12 months" value={r.cohortAfter12Months === null ? '—' : int(r.cohortAfter12Months)} sub="of today's customers, with no new ones" />
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Retention = (end − new) ÷ start. New customers are excluded so that growth cannot hide churn. Annualised figures compound the period rate; lifetime is 1 ÷ monthly churn, the simplest input to a customer lifetime value.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── suite

const MODE_ICON: Record<ForecastMode, typeof GitBranch> = { pipeline: GitBranch, growth: TrendingUp, retention: Users };

export default function SalesForecastSuite() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<ForecastMode | null>(null);
  const mode: ForecastMode = override ?? (isForecastMode(urlMode) ? urlMode : 'pipeline');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Forecast mode">
          {FORECAST_MODES.map((m) => {
            const Icon = MODE_ICON[m.value];
            return (
              <button key={m.value} type="button" role="tab" aria-selected={mode === m.value} onClick={() => setMode(m.value)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === m.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-4 w-4" /><span className="hidden sm:inline">{m.label}</span><span className="sm:hidden">{m.short}</span>
              </button>
            );
          })}
        </div>
        {mode === 'pipeline' && <PipelineMode />}
        {mode === 'growth' && <GrowthMode />}
        {mode === 'retention' && <RetentionMode />}
      </div>
    </div>
  );
}

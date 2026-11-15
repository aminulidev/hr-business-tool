'use client';

import { useMemo, useState } from 'react';
import { DollarSign, Info, Plus, Scale, Trash2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Actions, Field, Headline, int, Kpi, ModeTabs, Note, num, pct, Result, Th, usd } from './suite-ui';
import { CLV_DEFAULTS, CLV_MODES, computeClv, computeLtvCac, computeMau, isClvMode, LTV_CAC_DEFAULTS, MAU_DEFAULTS, type ClvMode, type Verdict } from '@/lib/pricing/saas-metrics';

// Phase 17: the ltv-cac-ratio and mau-value pages 301 here with ?mode=ltv-cac|mau.

let nextId = 100;
const verdictColor: Record<Verdict['level'], string> = { bad: 'text-red-500', thin: 'text-amber-600', healthy: 'text-emerald-600', 'under-investing': 'text-blue-600' };

// ───────────────────────── CLV

function ClvModeView() {
  const d = CLV_DEFAULTS;
  const [arpu, setArpu] = useState(String(d.arpu));
  const [gm, setGm] = useState(String(d.grossMarginPct));
  const [churn, setChurn] = useState(String(d.monthlyChurnPct));
  const [cac, setCac] = useState(String(d.cac));
  const [cap, setCap] = useState(String(d.capMonths));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('customer-lifetime-value-calculator');
  const r = useMemo(() => computeClv({ arpu: num(arpu), grossMarginPct: num(gm), monthlyChurnPct: num(churn), cac: num(cac), capMonths: num(cap) }), [arpu, gm, churn, cac, cap]);
  const sensitivity = useMemo(() => [1, 2, 3, 5, 8].map((c) => ({ churn: c, r: computeClv({ arpu: num(arpu), grossMarginPct: num(gm), monthlyChurnPct: c, cac: num(cac), capMonths: num(cap) }) })), [arpu, gm, cac, cap]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field id="clv-arpu" label="Monthly revenue per customer (ARPU)" value={arpu} onChange={setArpu} prefix="$" step="5" />
        <Field id="clv-gm" label="Gross margin" value={gm} onChange={setGm} suffix="%" step="1" help="After hosting, support, payment fees" />
        <Field id="clv-churn" label="Monthly customer churn" value={churn} onChange={setChurn} suffix="%" step="0.1" />
        <Field id="clv-cac" label="Customer acquisition cost" value={cac} onChange={setCac} prefix="$" step="50" help="0 = skip the ratio" />
        <Field id="clv-cap" label="Cap lifetime at" value={cap} onChange={setCap} suffix="months" step="12" help="0 = no cap; investors often use 36–60" />
      </div>
      <Actions onExample={() => { setArpu('100'); setGm('80'); setChurn('3'); setCac('800'); setCap('60'); }} onSave={() => r && saveEntry({ arpu, gm, churn, cac, cap }, `CLV ${usd(r.clv)} · ${r.lifetimeUsedMonths} mo lifetime${r.ltvCac !== null ? ` · LTV:CAC ${r.ltvCac}:1` : ''}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter the monthly revenue per customer.</p>}
      {r && (
        <Result>
          <Headline label="Customer lifetime value (gross-margin basis)" value={usd(r.clv)}>
            <strong className="text-foreground">{usd(r.grossProfitMonthly, 2)}</strong> gross profit a month × <strong className="text-foreground">{r.lifetimeUsedMonths}</strong> months{r.capped ? <> (capped{r.lifetimeMonths !== null ? `; uncapped lifetime ${r.lifetimeMonths} months` : ''})</> : null} · revenue over the lifetime <strong className="text-foreground">{usd(r.clvRevenue)}</strong>
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="LTV:CAC" value={r.ltvCac === null ? '—' : `${r.ltvCac}:1`} sub={r.verdict.label} color={verdictColor[r.verdict.level]} />
            <Kpi label="CAC payback" value={r.paybackMonths === null ? '—' : `${r.paybackMonths} mo`} sub="CAC ÷ monthly gross profit" color="text-blue-600" />
            <Kpi label="Max CAC for 3:1" value={usd(r.maxCacAt3x)} sub="CLV ÷ 3" />
            <Kpi label="Annual churn" value={pct(r.annualChurnPct)} sub={`from ${pct(num(churn), 1)} a month`} color="text-red-500" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <div className="px-3 py-2 border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Same customer, different churn</div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 text-xs text-muted-foreground"><Th>Monthly churn</Th><Th right>Annual churn</Th><Th right>Lifetime</Th><Th right>CLV</Th><Th right>LTV:CAC</Th><Th right>Max CAC at 3:1</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {sensitivity.map(({ churn: c, r: x }) => x && <tr key={c} className={c === num(churn) ? 'bg-emerald-500/5 font-semibold' : ''}><td className="px-3 py-2">{c}%</td><td className="text-right px-3 py-2">{pct(x.annualChurnPct)}</td><td className="text-right px-3 py-2">{x.lifetimeUsedMonths} mo{x.capped ? '*' : ''}</td><td className="text-right px-3 py-2 text-emerald-600">{usd(x.clv)}</td><td className="text-right px-3 py-2">{x.ltvCac === null ? '—' : `${x.ltvCac}:1`}</td><td className="text-right px-3 py-2">{usd(x.maxCacAt3x)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />CLV = ARPU × gross margin ÷ monthly churn, i.e. monthly gross profit × average lifetime (1 ÷ churn). Use gross profit, not revenue: a $100 customer at 80% margin is worth $80 a month to spend against. Halving churn doubles CLV; a 10% price rise adds 10%. * = lifetime capped.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setArpu(i.arpu ?? ''); setGm(i.gm ?? '80'); setChurn(i.churn ?? '3'); setCac(i.cac ?? '0'); setCap(i.cap ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── LTV:CAC by channel

type ChannelRowState = { id: number; name: string; spend: string; customers: string };
const toChannelRows = () => LTV_CAC_DEFAULTS.channels.map((c, i) => ({ id: i + 1, name: c.name, spend: String(c.spend), customers: String(c.customers) }));

function LtvCacModeView() {
  const [ltv, setLtv] = useState(String(LTV_CAC_DEFAULTS.ltv));
  const [rows, setRows] = useState<ChannelRowState[]>(toChannelRows);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('ltv-cac-ratio-calculator');
  const r = useMemo(() => computeLtvCac({ ltv: num(ltv), channels: rows.map((x) => ({ name: x.name || 'Channel', spend: num(x.spend), customers: num(x.customers) })) }), [ltv, rows]);
  const update = (id: number, patch: Partial<ChannelRowState>) => setRows((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field id="lc-ltv" label="Customer lifetime value (gross-margin CLV)" value={ltv} onChange={setLtv} prefix="$" step="100" help="From the Lifetime value tab" />
        <div className="sm:col-span-2 rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
          <p className="text-xs font-semibold">Acquisition spend and customers won, by channel (sales + marketing, same period)</p>
          {rows.map((row, i) => (
            <div key={row.id} className="grid grid-cols-[1fr_7rem_6rem_2.5rem] items-center gap-2">
              <Input aria-label={`Channel ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, { name: e.target.value })} className="text-sm" placeholder="Channel" />
              <div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Channel ${i + 1} spend`} type="number" min="0" step="500" value={row.spend} onChange={(e) => update(row.id, { spend: e.target.value })} className="text-sm pl-6" /></div>
              <Input aria-label={`Channel ${i + 1} customers`} type="number" min="0" step="1" value={row.customers} onChange={(e) => update(row.id, { customers: e.target.value })} className="text-sm" placeholder="Customers" />
              <Button type="button" variant="ghost" size="icon" aria-label="Remove channel" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" disabled={rows.length >= 8} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', spend: '', customers: '' }])}><Plus className="h-4 w-4 mr-1" /> Add channel</Button>
        </div>
      </div>
      <Actions onExample={() => { setLtv('2700'); setRows(toChannelRows()); }} onSave={() => r && saveEntry({ ltv, rows: JSON.stringify(rows) }, `LTV:CAC ${r.blendedRatio === null ? '—' : `${r.blendedRatio}:1`} · blended CAC ${usd(r.blendedCac)}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter a lifetime value.</p>}
      {r && (
        <Result>
          <Headline label="Blended LTV:CAC" value={r.blendedRatio === null ? '—' : `${r.blendedRatio}:1`}>
            <span className={verdictColor[r.verdict.level]}>{r.verdict.label}</span> · blended CAC <strong className="text-foreground">{usd(r.blendedCac)}</strong> ({usd(r.totalSpend)} ÷ {int(r.totalCustomers)}) · max CAC for 3:1 <strong className="text-foreground">{usd(r.maxCacAt3x)}</strong>
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Channel</Th><Th right>Spend</Th><Th right>Customers</Th><Th right>CAC</Th><Th right>LTV:CAC</Th><Th right>Lifetime return − spend</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.channels.map((c, i) => <tr key={i} className={c.name === r.bestChannel ? 'bg-emerald-500/5' : c.name === r.worstChannel ? 'bg-red-500/5' : ''}><td className="px-3 py-2 font-medium">{c.name}{c.name === r.bestChannel && <span className="ml-2 text-[10px] uppercase text-emerald-600">best</span>}{c.name === r.worstChannel && <span className="ml-2 text-[10px] uppercase text-red-500">weakest</span>}</td><td className="text-right px-3 py-2">{usd(c.spend)}</td><td className="text-right px-3 py-2">{int(c.customers)}</td><td className="text-right px-3 py-2">{usd(c.cac)}</td><td className={`text-right px-3 py-2 font-semibold ${verdictColor[c.verdict.level]}`}>{c.ratio === null ? '—' : `${c.ratio}:1`}</td><td className={`text-right px-3 py-2 ${c.netReturn < 0 ? 'text-red-500' : ''}`}>{c.netReturn < 0 ? '−' : ''}{usd(Math.abs(c.netReturn))}</td></tr>)}
              </tbody>
            </table>
          </div>
          <Note><Scale className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />CAC = fully loaded sales and marketing spend ÷ new customers won from it in the same period. Compare the ratio by channel rather than blended: a 3:1 average can hide one channel at 9:1 and another below 2:1. Move budget from the weakest channel toward the best one until their ratios converge.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setLtv(i.ltv ?? ''); try { const p = JSON.parse(i.rows) as ChannelRowState[]; if (Array.isArray(p)) setRows(p); } catch {} }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── value per active user

function MauModeView() {
  const d = MAU_DEFAULTS;
  const [rev, setRev] = useState(String(d.monthlyRevenue));
  const [mau, setMau] = useState(String(d.mau));
  const [dau, setDau] = useState(String(d.dau));
  const [paying, setPaying] = useState(String(d.payingUsers));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('mau-value-calculator');
  const r = useMemo(() => computeMau({ monthlyRevenue: num(rev), mau: num(mau), dau: num(dau), payingUsers: num(paying) }), [rev, mau, dau, paying]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="mau-rev" label="Monthly revenue" value={rev} onChange={setRev} prefix="$" step="1000" help="Subscriptions, ads, in-app purchases" />
        <Field id="mau-mau" label="Monthly active users (MAU)" value={mau} onChange={setMau} step="1000" />
        <Field id="mau-dau" label="Daily active users (optional)" value={dau} onChange={setDau} step="500" help="Average DAU over the month" />
        <Field id="mau-pay" label="Paying users (optional)" value={paying} onChange={setPaying} step="100" />
      </div>
      <Actions onExample={() => { setRev('50000'); setMau('50000'); setDau('12000'); setPaying('2000'); }} onSave={() => r && saveEntry({ rev, mau, dau, paying }, `${usd(r.arpuPerMau, 2)} per MAU · ${usd(r.annualValuePerMau, 2)} a year${r.arppu !== null ? ` · ARPPU ${usd(r.arppu, 2)}` : ''}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter monthly active users.</p>}
      {r && (
        <Result>
          <Headline label="Revenue per monthly active user" value={usd(r.arpuPerMau, 2)}>
            <strong className="text-foreground">{usd(r.annualValuePerMau, 2)}</strong> a year per active user{r.arppu !== null ? <> · paying users spend <strong className="text-foreground">{usd(r.arppu, 2)}</strong> a month (ARPPU)</> : null}
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Paying share of MAU" value={pct(r.payingSharePct)} sub={r.payingSharePct === null ? 'enter paying users' : `${int(num(paying))} of ${int(num(mau))}`} color="text-emerald-600" />
            <Kpi label="ARPPU" value={usd(r.arppu, 2)} sub="revenue ÷ paying users" />
            <Kpi label="Stickiness (DAU ÷ MAU)" value={pct(r.stickinessPct)} sub={r.revenuePerDau === null ? 'enter DAU' : `${usd(r.revenuePerDau, 2)} revenue per DAU`} color="text-blue-600" />
            <Kpi label="+1 point of paying users" value={r.revenuePerPayingPoint === null ? '—' : `+${usd(r.revenuePerPayingPoint)}`} sub="monthly revenue at current ARPPU" color="text-emerald-600" />
          </div>
          <Note><Users className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Revenue per MAU is the whole-audience figure that ad-funded and freemium products are valued on; ARPPU shows what a paying user is worth, and the paying share links the two (ARPU per MAU = ARPPU × paying share). DAU ÷ MAU measures how habitual the product is; consumer apps regarded as sticky sit around 20% and above, and daily-use tools well past 50%.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setRev(i.rev ?? ''); setMau(i.mau ?? ''); setDau(i.dau ?? '0'); setPaying(i.paying ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

const ICONS = { clv: DollarSign, 'ltv-cac': Scale, mau: Users };

export default function CustomerLifetimeValueCalculator() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<ClvMode | null>(null);
  const mode: ClvMode = override ?? (isClvMode(urlMode) ? urlMode : 'clv');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <ModeTabs modes={CLV_MODES} mode={mode} onChange={setMode} label="Lifetime value calculator mode" icons={ICONS} />
        {mode === 'clv' && <ClvModeView />}
        {mode === 'ltv-cac' && <LtvCacModeView />}
        {mode === 'mau' && <MauModeView />}
      </div>
    </div>
  );
}

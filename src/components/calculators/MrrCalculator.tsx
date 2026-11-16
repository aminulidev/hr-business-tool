'use client';

import { useMemo, useState } from 'react';
import { ArrowDownUp, Filter, Info, Layers, Plus, Tag, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Actions, Field, Headline, int, Kpi, ModeTabs, Note, num, pct, Result, Th, usd } from './suite-ui';
import {
  BILLING_OPTIONS,
  computeFunnel,
  computeMovements,
  computeMrr,
  computePricing,
  CONTRACT_DEFAULTS,
  FUNNEL_DEFAULTS,
  isMrrMode,
  MOVEMENTS_DEFAULTS,
  MRR_DEFAULTS,
  MRR_MODES,
  normalizeContract,
  PRICING_DEFAULTS,
  type Billing,
  type FunnelModel,
  type MrrMode,
} from '@/lib/pricing/saas-metrics';

// Phase 17: the ARR, ARPU, ACV, expansion-MRR, trial-conversion, free-to-paid
// and SaaS-pricing pages 301 here with ?mode=mrr|movements|funnel|pricing.

let nextId = 100;
const selectCls = 'h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

// ───────────────────────── MRR, ARR & ARPU

type PlanRowState = { id: number; name: string; customers: string; price: string; billing: Billing; termYears: string };
const toPlanRows = () => MRR_DEFAULTS.plans.map((p, i) => ({ id: i + 1, name: p.name, customers: String(p.customers), price: String(p.price), billing: p.billing, termYears: String(p.termYears ?? 2) }));

function MrrMode() {
  const [rows, setRows] = useState<PlanRowState[]>(toPlanRows);
  const [tcv, setTcv] = useState(String(CONTRACT_DEFAULTS.totalContractValue));
  const [term, setTerm] = useState(String(CONTRACT_DEFAULTS.termMonths));
  const [oneTime, setOneTime] = useState(String(CONTRACT_DEFAULTS.oneTimeFees));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('mrr-calculator');
  const r = useMemo(() => computeMrr({ plans: rows.map((x) => ({ name: x.name || 'Plan', customers: num(x.customers), price: num(x.price), billing: x.billing, termYears: num(x.termYears) || 1 })) }), [rows]);
  const c = useMemo(() => normalizeContract({ totalContractValue: num(tcv), termMonths: num(term), oneTimeFees: num(oneTime) }), [tcv, term, oneTime]);
  const update = (id: number, patch: Partial<PlanRowState>) => setRows((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <p className="text-xs font-semibold">Active paying customers by plan</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground"><th className="text-left py-1 pr-2 font-medium">Plan</th><th className="text-left py-1 px-2 font-medium">Customers</th><th className="text-left py-1 px-2 font-medium">Price per bill</th><th className="text-left py-1 px-2 font-medium">Billing</th><th /></tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td className="py-1 pr-2"><Input aria-label={`Plan ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, { name: e.target.value })} className="text-sm min-w-[8rem]" placeholder="Plan" /></td>
                  <td className="py-1 px-2"><Input aria-label={`Plan ${i + 1} customers`} type="number" min="0" step="1" value={row.customers} onChange={(e) => update(row.id, { customers: e.target.value })} className="text-sm w-24" /></td>
                  <td className="py-1 px-2"><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Plan ${i + 1} price`} type="number" min="0" step="1" value={row.price} onChange={(e) => update(row.id, { price: e.target.value })} className="text-sm w-28 pl-6" /></div></td>
                  <td className="py-1 px-2">
                    <div className="flex items-center gap-1">
                      <select aria-label={`Plan ${i + 1} billing`} value={row.billing} onChange={(e) => update(row.id, { billing: e.target.value as Billing })} className={selectCls}>
                        {BILLING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      {row.billing === 'multi' && <div className="relative"><Input aria-label={`Plan ${i + 1} term years`} type="number" min="1" step="1" value={row.termYears} onChange={(e) => update(row.id, { termYears: e.target.value })} className="text-sm w-20 pr-8" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">yrs</span></div>}
                    </div>
                  </td>
                  <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove plan" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={rows.length >= 10} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', customers: '', price: '', billing: 'monthly', termYears: '2' }])}><Plus className="h-4 w-4 mr-1" /> Add plan</Button>
      </div>
      <Actions onExample={() => { setRows(toPlanRows()); setTcv('40000'); setTerm('12'); setOneTime('4000'); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), tcv, term, oneTime }, `MRR ${usd(r.mrr)} · ARR ${usd(r.arr)} · ${int(r.customers)} customers · ARPA ${usd(r.arpa, 2)}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter at least one plan with customers and a price.</p>}
      {r && (
        <Result>
          <Headline label="Monthly recurring revenue" value={usd(r.mrr)}>
            ARR <strong className="text-foreground">{usd(r.arr)}</strong> · <strong className="text-foreground">{int(r.customers)}</strong> paying customers · ARPA <strong className="text-foreground">{usd(r.arpa, 2)}</strong> a month ({usd(r.acv)} a year)
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Plan</Th><Th right>Customers</Th><Th right>MRR / customer</Th><Th right>ACV / customer</Th><Th right>MRR</Th><Th right>Share of MRR</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.plans.map((p, i) => <tr key={i}><td className="px-3 py-2 font-medium">{p.name}</td><td className="text-right px-3 py-2">{int(p.customers)} <span className="text-xs text-muted-foreground">({pct(p.customerShare, 0)})</span></td><td className="text-right px-3 py-2">{usd(p.mrrPerCustomer, 2)}</td><td className="text-right px-3 py-2">{usd(p.acvPerCustomer)}</td><td className="text-right px-3 py-2 font-semibold">{usd(p.mrr)}</td><td className="text-right px-3 py-2">{pct(p.mrrShare)}</td></tr>)}
                <tr className="font-bold bg-muted/20"><td className="px-3 py-2">Total</td><td className="text-right px-3 py-2">{int(r.customers)}</td><td className="text-right px-3 py-2">{usd(r.arpa, 2)}</td><td className="text-right px-3 py-2">{usd(r.acv)}</td><td className="text-right px-3 py-2 text-emerald-600">{usd(r.mrr)}</td><td className="text-right px-3 py-2">100%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-xl bg-background border border-border/50 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Normalize a contract: ACV, TCV and MRR</p>
            <div className="grid grid-cols-3 gap-3">
              <Field id="ct-tcv" label="Total contract value" value={tcv} onChange={setTcv} prefix="$" step="1000" />
              <Field id="ct-term" label="Term" value={term} onChange={setTerm} suffix="months" step="1" />
              <Field id="ct-one" label="One-time fees inside it" value={oneTime} onChange={setOneTime} prefix="$" step="500" />
            </div>
            {c && <div className="grid grid-cols-3 gap-3"><Kpi label="ACV" value={usd(c.acv)} sub="recurring ÷ years" color="text-emerald-600" /><Kpi label="Adds to MRR" value={usd(c.mrr)} sub={`for ${c.termMonths} months`} /><Kpi label="Excluded from MRR" value={usd(c.oneTimeFees)} sub="setup, services" color="text-amber-600" /></div>}
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />MRR counts only contractually recurring subscription revenue, normalized to a month: an annual plan contributes 1/12 of its price each month, a quarterly plan 1/3. One-time fees, services and uncommitted overages stay out. ARR = MRR × 12; ARPA (average revenue per account) = MRR ÷ paying customers; ACV = ARPA × 12.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as PlanRowState[]; if (Array.isArray(p)) setRows(p); } catch {} setTcv(i.tcv ?? ''); setTerm(i.term ?? '12'); setOneTime(i.oneTime ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── net new MRR

function MovementsMode() {
  const d = MOVEMENTS_DEFAULTS;
  const [start, setStart] = useState(String(d.startingMrr));
  const [newMrr, setNewMrr] = useState(String(d.newMrr));
  const [upsell, setUpsell] = useState(String(d.upsellMrr));
  const [seats, setSeats] = useState(String(d.seatMrr));
  const [cross, setCross] = useState(String(d.crossSellMrr));
  const [react, setReact] = useState(String(d.reactivationMrr));
  const [contraction, setContraction] = useState(String(d.contractionMrr));
  const [churned, setChurned] = useState(String(d.churnedMrr));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('expansion-mrr-calculator');
  const r = useMemo(() => computeMovements({ startingMrr: num(start), newMrr: num(newMrr), upsellMrr: num(upsell), seatMrr: num(seats), crossSellMrr: num(cross), reactivationMrr: num(react), contractionMrr: num(contraction), churnedMrr: num(churned) }), [start, newMrr, upsell, seats, cross, react, contraction, churned]);
  const inputs = { start, newMrr, upsell, seats, cross, react, contraction, churned };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="mv-start" label="Starting MRR" value={start} onChange={setStart} prefix="$" step="1000" />
        <Field id="mv-new" label="New business MRR" value={newMrr} onChange={setNewMrr} prefix="$" step="100" help="Brand-new customers" />
        <Field id="mv-react" label="Reactivation MRR" value={react} onChange={setReact} prefix="$" step="100" help="Returning churned customers" />
        <Field id="mv-churn" label="Churned MRR" value={churned} onChange={setChurned} prefix="$" step="100" help="Cancellations" />
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-3">
        <p className="text-xs font-semibold">Expansion from existing customers</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field id="mv-up" label="Upsells / plan upgrades" value={upsell} onChange={setUpsell} prefix="$" step="100" />
          <Field id="mv-seat" label="Added seats / usage" value={seats} onChange={setSeats} prefix="$" step="100" />
          <Field id="mv-cross" label="Cross-sell / add-ons" value={cross} onChange={setCross} prefix="$" step="100" />
          <Field id="mv-contr" label="Contraction (downgrades)" value={contraction} onChange={setContraction} prefix="$" step="100" />
        </div>
      </div>
      <Actions onExample={() => { setStart('100000'); setNewMrr('6000'); setUpsell('3000'); setSeats('2000'); setCross('1000'); setReact('500'); setContraction('1500'); setChurned('3000'); }} onSave={() => r && saveEntry(inputs, `Net new MRR ${usd(r.netNewMrr)} (${pct(r.growthPct)}) → ${usd(r.endingMrr)} · NRR ${pct(r.nrrPct)}`)} disabled={!r} />
      {r && (
        <Result>
          <Headline label="Net new MRR" value={`${r.netNewMrr < 0 ? '−' : '+'}${usd(Math.abs(r.netNewMrr))}`}>
            {usd(num(start))} → <strong className="text-foreground">{usd(r.endingMrr)}</strong> ending MRR · <strong className="text-foreground">{pct(r.growthPct)}</strong> month-over-month · quick ratio <strong className="text-foreground">{r.quickRatio === null ? '∞' : `${r.quickRatio}×`}</strong>
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border/30">
                {r.bridge.map((b) => <tr key={b.label} className={b.kind === 'end' ? 'font-bold bg-emerald-500/5' : b.kind === 'start' ? 'font-semibold bg-muted/20' : ''}><td className="px-3 py-2">{b.label}</td><td className={`text-right px-3 py-2 ${b.kind === 'gain' ? 'text-emerald-600' : b.kind === 'loss' ? 'text-red-500' : ''}`}>{b.kind === 'gain' && b.amount > 0 ? '+' : ''}{b.amount < 0 ? '−' : ''}{usd(Math.abs(b.amount))}</td><td className="text-right px-3 py-2 text-xs text-muted-foreground w-24">{b.kind === 'gain' || b.kind === 'loss' ? pct((b.amount / num(start)) * 100) : ''}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Expansion MRR" value={usd(r.expansionMrr)} sub={`${pct(r.expansionPctOfStart)} of starting MRR · ${pct(r.expansionShareOfGainsPct, 0)} of gains`} color="text-emerald-600" />
            <Kpi label="Gross revenue churn" value={pct(r.grossRevenueChurnPct)} sub={`GRR ${pct(r.grrPct)}`} color="text-red-500" />
            <Kpi label="Net revenue churn" value={pct(r.netRevenueChurnPct)} sub={`NRR ${pct(r.nrrPct)}${r.netRevenueChurnPct < 0 ? ' · net negative churn' : ''}`} color={r.netRevenueChurnPct <= 0 ? 'text-emerald-600' : 'text-amber-600'} />
            <Kpi label="At this pace" value={pct(r.annualizedGrowthPct, 0)} sub={r.monthsToDouble ? `a year · doubles in ${r.monthsToDouble} months · ${usd(r.mrrIn12Months)} in 12` : 'a year'} color="text-blue-600" />
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Net new MRR = new + expansion + reactivation − contraction − churned. The quick ratio divides what you gained by what you lost; above 4× is the usual “efficient growth” mark. Expansion counted here is upsell, seats and cross-sell from customers you already had; new logos never count as expansion.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setStart(i.start ?? ''); setNewMrr(i.newMrr ?? '0'); setUpsell(i.upsell ?? '0'); setSeats(i.seats ?? '0'); setCross(i.cross ?? '0'); setReact(i.react ?? '0'); setContraction(i.contraction ?? '0'); setChurned(i.churned ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── trial & freemium funnel

function FunnelMode() {
  const d = FUNNEL_DEFAULTS;
  const [model, setModel] = useState<FunnelModel>(d.model);
  const [signups, setSignups] = useState(String(d.signups));
  const [conversions, setConversions] = useState(String(d.conversions));
  const [arpu, setArpu] = useState(String(d.arpu));
  const [target, setTarget] = useState(String(d.targetNewMrr));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('trial-conversion-calculator');
  const r = useMemo(() => computeFunnel({ model, signups: num(signups), conversions: num(conversions), arpu: num(arpu), targetNewMrr: num(target) }), [model, signups, conversions, arpu, target]);
  const isTrial = model === 'trial';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(['trial', 'freemium'] as FunnelModel[]).map((m) => <button key={m} type="button" onClick={() => setModel(m)} className={`rounded-full px-3 py-1 text-xs font-medium border transition ${model === m ? 'bg-emerald-600 text-white border-emerald-600' : 'border-border text-muted-foreground hover:text-foreground'}`}>{m === 'trial' ? 'Free trial → paid' : 'Freemium → paid'}</button>)}
        <span className="text-xs text-muted-foreground">{isTrial ? 'Time-boxed trial; measure a sign-up cohort to its decision.' : 'Free tier with no time limit; measure free users at the start of the period.'}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="fn-signups" label={isTrial ? 'Trial sign-ups in the period' : 'Free users at start of period'} value={signups} onChange={setSignups} step="10" />
        <Field id="fn-conv" label="Converted to paid" value={conversions} onChange={setConversions} step="1" />
        <Field id="fn-arpu" label="Monthly price they pay (ARPU)" value={arpu} onChange={setArpu} prefix="$" step="1" />
        <Field id="fn-target" label="New MRR you need per period" value={target} onChange={setTarget} prefix="$" step="500" />
      </div>
      <Actions onExample={() => { setModel('trial'); setSignups('1000'); setConversions('180'); setArpu('49'); setTarget('15000'); }} onSave={() => r && saveEntry({ model, signups, conversions, arpu, target }, `${isTrial ? 'Trial' : 'Free-to-paid'} conversion ${pct(r.conversionRatePct)} · ${usd(r.newMrr)} new MRR`)} disabled={!r} />
      {r && (
        <Result>
          <Headline label={isTrial ? 'Trial-to-paid conversion rate' : 'Free-to-paid conversion rate'} value={pct(r.conversionRatePct)}>
            <strong className="text-foreground">{int(num(conversions))}</strong> of {int(num(signups))} {isTrial ? 'trials' : 'free users'} converted · <strong className="text-foreground">{usd(r.newMrr)}</strong> new MRR ({usd(r.newArr)} ARR) · each {isTrial ? 'sign-up' : 'free user'} worth <strong className="text-foreground">{usd(r.valuePerSignup, 2)}</strong> of MRR
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label={`Conversions for ${usd(num(target))}`} value={int(r.conversionsNeeded)} sub={`at ${usd(num(arpu))} each`} />
            <Kpi label={`${isTrial ? 'Sign-ups' : 'Free users'} needed`} value={int(r.signupsNeeded)} sub={r.extraSignupsNeeded > 0 ? `${int(r.extraSignupsNeeded)} more than now` : 'already enough'} color={r.extraSignupsNeeded > 0 ? 'text-amber-600' : 'text-emerald-600'} />
            <Kpi label="Or a conversion rate of" value={pct(r.rateNeededPct)} sub={`with today's ${int(num(signups))}`} color="text-blue-600" />
            <Kpi label="Each +1 point of conversion" value={`+${usd(r.mrrPerRatePoint)}`} sub="MRR per period" color="text-emerald-600" />
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Opt-in free trials commonly convert somewhere in the teens to mid-twenties percent; trials that take a card up front convert much higher but attract fewer sign-ups; freemium tiers usually convert a few percent of free users. Those are ranges, not targets: the number that matters is whether the extra MRR per point of conversion beats the cost of the next sign-up.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setModel(i.model === 'freemium' ? 'freemium' : 'trial'); setSignups(i.signups ?? ''); setConversions(i.conversions ?? ''); setArpu(i.arpu ?? ''); setTarget(i.target ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── pricing tiers

type TierRow = { id: number; name: string; price: string; customers: string };
const toTierRows = () => PRICING_DEFAULTS.tiers.map((t, i) => ({ id: i + 1, name: t.name, price: String(t.price), customers: String(t.customers) }));

function PricingMode() {
  const [rows, setRows] = useState<TierRow[]>(toTierRows);
  const [cost, setCost] = useState(String(PRICING_DEFAULTS.costPerUser));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('saas-pricing-calculator');
  const r = useMemo(() => computePricing({ costPerUser: num(cost), tiers: rows.map((x) => ({ name: x.name || 'Tier', price: num(x.price), customers: num(x.customers) })) }), [rows, cost]);
  const update = (id: number, patch: Partial<TierRow>) => setRows((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field id="pr-cost" label="Monthly cost to serve one customer" value={cost} onChange={setCost} prefix="$" step="0.5" help="Hosting, support, payment fees, third-party APIs" />
        <div className="sm:col-span-2 rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
          <p className="text-xs font-semibold">Tiers, lowest to highest</p>
          {rows.map((row, i) => (
            <div key={row.id} className="grid grid-cols-[1fr_6.5rem_6rem_2.5rem] items-center gap-2">
              <Input aria-label={`Tier ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, { name: e.target.value })} className="text-sm" placeholder="Tier" />
              <div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Tier ${i + 1} monthly price`} type="number" min="0" step="1" value={row.price} onChange={(e) => update(row.id, { price: e.target.value })} className="text-sm pl-6 pr-8" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">/mo</span></div>
              <Input aria-label={`Tier ${i + 1} customers`} type="number" min="0" step="1" value={row.customers} onChange={(e) => update(row.id, { customers: e.target.value })} className="text-sm" placeholder="Customers" />
              <Button type="button" variant="ghost" size="icon" aria-label="Remove tier" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" disabled={rows.length >= 6} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', price: '', customers: '0' }])}><Plus className="h-4 w-4 mr-1" /> Add tier</Button>
        </div>
      </div>
      <Actions onExample={() => { setRows(toTierRows()); setCost('6'); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), cost }, `${r.tiers.length} tiers · blended ARPU ${usd(r.blendedArpu, 2)} · margin ${pct(r.blendedMarginPct)}`)} disabled={!r} />
      {r && (
        <Result>
          <Headline label="Blended gross margin across tiers" value={pct(r.blendedMarginPct)}>
            {r.customers > 0 ? <>MRR <strong className="text-foreground">{usd(r.mrr)}</strong> from {int(r.customers)} customers · blended ARPU <strong className="text-foreground">{usd(r.blendedArpu, 2)}</strong> · gross profit <strong className="text-foreground">{usd(r.grossProfit)}</strong> a month · </> : null}price ladder <strong className="text-foreground">{r.ladderRatio}×</strong> bottom to top
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Tier</Th><Th right>Price</Th><Th right>Step-up</Th><Th right>Gross profit / user</Th><Th right>Margin</Th><Th right>Customers</Th><Th right>MRR</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.tiers.map((t, i) => <tr key={i}><td className="px-3 py-2 font-medium">{t.name}</td><td className="text-right px-3 py-2">{usd(t.price, 2)}</td><td className="text-right px-3 py-2 text-muted-foreground">{t.stepUp === null ? '—' : `${t.stepUp}×`}</td><td className={`text-right px-3 py-2 ${t.grossProfitPerUser < 0 ? 'text-red-500' : ''}`}>{usd(t.grossProfitPerUser, 2)}</td><td className={`text-right px-3 py-2 font-semibold ${t.grossMarginPct < 0 ? 'text-red-500' : t.grossMarginPct < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>{pct(t.grossMarginPct)}</td><td className="text-right px-3 py-2">{int(t.customers)} <span className="text-xs text-muted-foreground">({pct(t.customerSharePct, 0)})</span></td><td className="text-right px-3 py-2">{usd(t.mrr)} <span className="text-xs text-muted-foreground">({pct(t.mrrSharePct, 0)})</span></td></tr>)}
              </tbody>
            </table>
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Gross margin per tier = (price − cost to serve) ÷ price. Any tier priced below {usd(r.breakEvenPrice, 2)} loses money on every user. Good-better-best ladders usually step up 2–3× per tier so each upgrade is a real decision; a blended margin in the 70–85% range is what subscription software investors expect to see.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as TierRow[]; if (Array.isArray(p)) setRows(p); } catch {} setCost(i.cost ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── page

const ICONS = { mrr: Layers, movements: ArrowDownUp, funnel: Filter, pricing: Tag };

export default function MrrCalculator() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<MrrMode | null>(null);
  const mode: MrrMode = override ?? (isMrrMode(urlMode) ? urlMode : 'mrr');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <ModeTabs modes={MRR_MODES} mode={mode} onChange={setMode} label="MRR calculator mode" icons={ICONS} />
        {mode === 'mrr' && <MrrMode />}
        {mode === 'movements' && <MovementsMode />}
        {mode === 'funnel' && <FunnelMode />}
        {mode === 'pricing' && <PricingMode />}
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { motion } from '@/components/motion';
import { BookmarkPlus, Plus, Trash2 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { formatCurrency } from '@/lib/utils';
import { ATTAINMENT_STEPS, BONUS_DEFAULTS, computeBonusOte, computeCommissionSplit, SPLIT_DEFAULTS, type SplitParty } from '@/lib/pricing/commission';

// Two modes folded into the Sales Commission Calculator (Phase 17): splitting a
// commission between parties, and bonus / accelerator / on-target earnings plans.

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
    <Button onClick={onSave} disabled={disabled} className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25">
      <BookmarkPlus className="h-4 w-4 mr-2" /> Save Calculation to History
    </Button>
  </div>
);

// ───────────────────────── commission split

type PartyRow = { id: number; name: string; share: string };
let nextId = 10;

export function CommissionSplitMode() {
  const d = SPLIT_DEFAULTS;
  const [sale, setSale] = useState(String(d.saleAmount));
  const [rate, setRate] = useState(String(d.commissionRatePct));
  const [house, setHouse] = useState(String(d.houseCutPct));
  const [fees, setFees] = useState(String(d.flatFees));
  const [override, setOverride] = useState(String(d.managerOverridePct));
  const [rows, setRows] = useState<PartyRow[]>(d.parties.map((p, i) => ({ id: i + 1, name: p.name, share: String(p.sharePct) })));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('commission-split-calculator');

  const parties: SplitParty[] = rows.map((r) => ({ name: r.name, sharePct: num(r.share) }));
  const r = useMemo(() => computeCommissionSplit({ saleAmount: num(sale), commissionRatePct: num(rate), houseCutPct: num(house), flatFees: num(fees), managerOverridePct: num(override), parties }), [sale, rate, house, fees, override, parties]);
  const valid = r.grossCommission > 0;
  const update = (id: number, field: 'name' | 'share', value: string) => setRows((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-cyan-500', 'bg-rose-500'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field id="cs-sale" label="Sale amount" value={sale} onChange={setSale} prefix="$" step="1000" />
        <Field id="cs-rate" label="Commission rate" value={rate} onChange={setRate} suffix="%" step="0.25" />
        <Field id="cs-house" label="House / brokerage cut" value={house} onChange={setHouse} suffix="%" step="1" help="Off the top, % of gross" />
        <Field id="cs-fees" label="Flat fees off the top" value={fees} onChange={setFees} prefix="$" step="25" help="Transaction, desk, E&O fees" />
        <Field id="cs-override" label="Manager override" value={override} onChange={setOverride} suffix="%" step="0.5" help="% of gross, paid before the split" />
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <p className="text-xs font-semibold">Who shares the pool (shares should add up to 100%)</p>
        {rows.map((row, i) => (
          <div key={row.id} className="flex items-center gap-2">
            <Input aria-label={`Party ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, 'name', e.target.value)} className="text-sm flex-1" placeholder="Name or role" />
            <div className="relative w-28">
              <Input aria-label={`Party ${i + 1} share`} type="number" min="0" max="100" step="1" value={row.share} onChange={(e) => update(row.id, 'share', e.target.value)} className="text-sm pr-7" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Remove party" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" size="sm" disabled={rows.length >= 5} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', share: '' }])}><Plus className="h-4 w-4 mr-1" /> Add party</Button>
          <span className={`text-xs ${Math.abs(r.unallocatedPct) < 0.01 ? 'text-muted-foreground' : 'text-amber-600'}`}>Shares total {pct(r.totalSharePct, 0)}{Math.abs(r.unallocatedPct) >= 0.01 ? ` — ${r.unallocatedPct > 0 ? 'unallocated' : 'over-allocated'} ${pct(Math.abs(r.unallocatedPct), 0)}` : ''}</span>
        </div>
      </div>
      <Actions onExample={() => { setSale('450000'); setRate('3'); setHouse('20'); setFees('395'); setOverride('0'); setRows([{ id: 1, name: 'Listing agent', share: '60' }, { id: 2, name: 'Co-agent / referral', share: '40' }]); }} onSave={() => valid && saveEntry({ sale, rate, house, fees, override, rows: JSON.stringify(rows) }, `${formatCurrency(r.grossCommission)} gross → ${r.parties.map((p) => `${p.name || 'party'} ${formatCurrency(p.amount)}`).join(', ')}`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{r.parties[0]?.name || 'First party'} receives</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(r.parties[0]?.amount ?? 0)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              of a <strong className="text-foreground">{formatCurrency(r.grossCommission)}</strong> gross commission
              {r.effectiveRateOnSale !== null && <> · <strong className="text-foreground">{pct(r.effectiveRateOnSale, 2)}</strong> of the sale</>}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Gross commission" value={formatCurrency(r.grossCommission)} />
            <Kpi label="House cut + fees" value={formatCurrency(r.houseCut + r.flatFees)} color="text-amber-600" />
            {r.managerOverride > 0 ? <Kpi label="Manager override" value={formatCurrency(r.managerOverride)} color="text-violet-600" /> : <Kpi label="Pool to split" value={formatCurrency(r.pool)} color="text-blue-600" />}
            <Kpi label={r.managerOverride > 0 ? 'Pool to split' : 'Share allocated'} value={r.managerOverride > 0 ? formatCurrency(r.pool) : pct(r.totalSharePct, 0)} color="text-blue-600" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 p-4 space-y-2">
            <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-muted">
              {r.houseCut + r.flatFees > 0 && <div style={{ width: `${((r.houseCut + r.flatFees) / r.grossCommission) * 100}%` }} className="bg-amber-500 h-full" title="House cut and fees" />}
              {r.managerOverride > 0 && <div style={{ width: `${(r.managerOverride / r.grossCommission) * 100}%` }} className="bg-violet-500 h-full" title="Manager override" />}
              {r.parties.map((p, i) => <div key={i} style={{ width: `${p.pctOfGross}%` }} className={`${colors[i % colors.length]} h-full`} title={p.name} />)}
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border/30">
                <tr><td className="py-1.5 text-muted-foreground">House / brokerage cut ({house || 0}%)</td><td className="py-1.5 text-right">{formatCurrency(r.houseCut)}</td></tr>
                {r.flatFees > 0 && <tr><td className="py-1.5 text-muted-foreground">Flat fees</td><td className="py-1.5 text-right">{formatCurrency(r.flatFees)}</td></tr>}
                {r.managerOverride > 0 && <tr><td className="py-1.5 text-muted-foreground">Manager override ({override}%)</td><td className="py-1.5 text-right">{formatCurrency(r.managerOverride)}</td></tr>}
                {r.parties.map((p, i) => <tr key={i} className="font-medium"><td className="py-1.5">{p.name || `Party ${i + 1}`} ({pct(p.sharePct, 0)} of pool, {pct(p.pctOfGross, 1)} of gross)</td><td className="py-1.5 text-right text-emerald-600">{formatCurrency(p.amount)}</td></tr>)}
                {Math.abs(r.unallocatedPct) >= 0.01 && <tr><td className="py-1.5 text-amber-600">{r.unallocatedPct > 0 ? 'Unallocated' : 'Over-allocated'}</td><td className="py-1.5 text-right text-amber-600">{formatCurrency(Math.abs(r.unallocatedAmount))}</td></tr>}
              </tbody>
            </table>
          </div>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setSale(i.sale ?? ''); setRate(i.rate ?? ''); setHouse(i.house ?? '0'); setFees(i.fees ?? '0'); setOverride(i.override ?? '0'); try { const p = JSON.parse(i.rows) as PartyRow[]; if (Array.isArray(p)) setRows(p); } catch {} }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── bonus, accelerator & OTE

const toBonusInput = (v: Record<string, string>, att: number) => ({
  baseSalary: num(v.base),
  quota: num(v.quota),
  commissionRatePct: num(v.rate),
  acceleratorMultiplier: num(v.accel) || 1,
  bonusAtQuota: num(v.bonus),
  bonusPer10PtsOver: num(v.kicker),
  bonusThresholdPct: num(v.threshold),
  spiffs: num(v.spiffs),
  attainmentPct: att,
});

export function BonusOteMode() {
  const d = BONUS_DEFAULTS;
  const [v, setV] = useState<Record<string, string>>({ base: String(d.baseSalary), quota: String(d.quota), rate: String(d.commissionRatePct), accel: String(d.acceleratorMultiplier), bonus: String(d.bonusAtQuota), kicker: String(d.bonusPer10PtsOver), threshold: String(d.bonusThresholdPct), spiffs: String(d.spiffs), att: String(d.attainmentPct) });
  const set = (k: string) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('sales-bonus-calculator');
  const r = useMemo(() => computeBonusOte(toBonusInput(v, num(v.att))), [v]);
  const ladder = useMemo(() => ATTAINMENT_STEPS.map((a) => ({ a, r: computeBonusOte(toBonusInput(v, a)) })), [v]);
  const valid = r.ote > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Field id="bo-base" label="Base salary" value={v.base} onChange={set('base')} prefix="$" step="1000" />
        <Field id="bo-quota" label="Annual quota" value={v.quota} onChange={set('quota')} prefix="$" step="10000" />
        <Field id="bo-rate" label="Commission rate to quota" value={v.rate} onChange={set('rate')} suffix="%" step="0.25" />
        <Field id="bo-accel" label="Accelerator above quota" value={v.accel} onChange={set('accel')} suffix="×" step="0.1" help="1.5 = rate × 1.5 past 100%" />
        <Field id="bo-att" label="Attainment to evaluate" value={v.att} onChange={set('att')} suffix="%" step="5" />
        <Field id="bo-bonus" label="Bonus at 100% of quota" value={v.bonus} onChange={set('bonus')} prefix="$" step="500" help="0 for pure commission plans" />
        <Field id="bo-threshold" label="Bonus starts at" value={v.threshold} onChange={set('threshold')} suffix="%" step="5" help="Pro-rata from here to 100%" />
        <Field id="bo-kicker" label="Kicker per 10 pts over" value={v.kicker} onChange={set('kicker')} prefix="$" step="500" help="Extra bonus per full 10 points above 100%" />
        <Field id="bo-spiffs" label="SPIFFs & flat incentives" value={v.spiffs} onChange={set('spiffs')} prefix="$" step="500" help="Expected for the year" />
      </div>
      <Actions onExample={() => setV({ base: '70000', quota: '800000', rate: '7', accel: '1.5', bonus: '10000', kicker: '2500', threshold: '80', spiffs: '3000', att: '110' })} onSave={() => valid && saveEntry(v, `OTE ${formatCurrency(r.ote)} · at ${v.att}%: ${formatCurrency(r.totalEarnings)}`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Total earnings at {v.att || 0}% of quota</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(r.totalEarnings)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">{pct(r.pctOfOte, 0)}</strong> of on-target earnings (OTE <strong className="text-foreground">{formatCurrency(r.ote)}</strong>) · pay mix <strong className="text-foreground">{pct(100 - r.payMixVariablePct, 0)}/{pct(r.payMixVariablePct, 0)}</strong> base/variable
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Kpi label="Base salary" value={formatCurrency(num(v.base))} />
            <Kpi label="Commission to quota" value={formatCurrency(r.commissionToQuota)} color="text-emerald-600" />
            <Kpi label="Accelerated commission" value={formatCurrency(r.commissionAbove)} color="text-emerald-600" />
            <Kpi label="Bonus + kickers" value={formatCurrency(r.bonus)} color="text-blue-600" />
            <Kpi label="SPIFFs" value={formatCurrency(r.spiffs)} color="text-violet-600" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <div className="px-4 py-2 border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earnings curve by attainment</div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Attainment</th><th className="text-right px-4 py-2 font-medium">Sales</th><th className="text-right px-4 py-2 font-medium">Commission</th><th className="text-right px-4 py-2 font-medium">Bonus</th><th className="text-right px-4 py-2 font-medium">Total earnings</th><th className="text-right px-4 py-2 font-medium">% of OTE</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {ladder.map(({ a, r: x }) => (
                  <tr key={a} className={a === 100 ? 'bg-emerald-500/5 font-medium' : ''}>
                    <td className="px-4 py-2">{a}%</td>
                    <td className="text-right px-4 py-2 text-muted-foreground">{formatCurrency(x.actualSales)}</td>
                    <td className="text-right px-4 py-2">{formatCurrency(x.commission)}</td>
                    <td className="text-right px-4 py-2">{formatCurrency(x.bonus)}</td>
                    <td className="text-right px-4 py-2 font-semibold text-emerald-600">{formatCurrency(x.totalEarnings)}</td>
                    <td className="text-right px-4 py-2 text-muted-foreground">{pct(x.pctOfOte, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">Commission is paid at the base rate up to quota and at rate × accelerator above it. The bonus is zero below the threshold, scales in a straight line from the threshold to 100%, pays in full at 100% and adds the kicker for every full 10 points above. Each extra $1 of sales at {v.att || 0}% attainment is worth {formatCurrency(r.earningsPerSalesDollar)} to the rep.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

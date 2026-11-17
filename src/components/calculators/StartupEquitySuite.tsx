'use client';

import { useMemo, useState } from 'react';
import { motion } from '@/components/motion';
import { BookmarkPlus, Info, Plus, Trash2, PieChart, FileText, Users, Handshake } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { formatCurrency } from '@/lib/utils';
import {
  computeFounderSplit,
  computePool,
  computeRound,
  computeSafes,
  EQUITY_MODES,
  FOUNDER_DEFAULTS,
  GRANT_RANGES,
  isEquityMode,
  POOL_DEFAULTS,
  ROUND_DEFAULTS,
  SAFE_DEFAULTS,
  SPLIT_FACTORS,
  type EquityMode,
} from '@/lib/pricing/startup-equity';

// Phase 17: startup-valuation, equity-dilution, cap-table, safe-note,
// option-pool and founder-equity-split pages 301 here with ?mode=…

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const int = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
const pct = (n: number | null | undefined, d = 2) => (n === null || n === undefined ? '—' : `${n.toFixed(d)}%`);
const price = (n: number) => `$${n.toFixed(4)}`;
let nextId = 100;

function Field({ id, label, value, onChange, prefix, suffix, step = 'any', help }: { id: string; label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; step?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input id={id} type="number" inputMode="decimal" min="0" step={step} value={value} onChange={(e) => onChange(e.target.value)} className={`text-sm ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-10' : ''}`} />
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
const Th = ({ children, right }: { children: React.ReactNode; right?: boolean }) => <th className={`${right ? 'text-right' : 'text-left'} px-3 py-2 font-medium`}>{children}</th>;

// ───────────────────────── priced round

type HolderRow = { id: number; name: string; shares: string };

function RoundMode() {
  const d = ROUND_DEFAULTS;
  const [rows, setRows] = useState<HolderRow[]>(d.holders.map((h, i) => ({ id: i + 1, name: h.name, shares: String(h.shares) })));
  const [pre, setPre] = useState(String(d.preMoney));
  const [inv, setInv] = useState(String(d.investment));
  const [pool, setPool] = useState(String(d.poolPct));
  const [existingPool, setExistingPool] = useState(String(d.existingPoolShares));
  const [shuffle, setShuffle] = useState(d.poolInPreMoney);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('cap-table-calculator');
  const r = useMemo(() => computeRound({ holders: rows.map((x) => ({ name: x.name || 'Holder', shares: num(x.shares) })), preMoney: num(pre), investment: num(inv), poolPct: num(pool), existingPoolShares: num(existingPool), poolInPreMoney: shuffle }), [rows, pre, inv, pool, existingPool, shuffle]);
  const update = (id: number, field: 'name' | 'shares', value: string) => setRows((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <p className="text-xs font-semibold">Cap table before the round (fully diluted, including any existing pool)</p>
        {rows.map((row, i) => (
          <div key={row.id} className="flex items-center gap-2">
            <Input aria-label={`Holder ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, 'name', e.target.value)} className="text-sm flex-1" placeholder="Founder, investor, pool…" />
            <Input aria-label={`Holder ${i + 1} shares`} type="number" min="0" step="10000" value={row.shares} onChange={(e) => update(row.id, 'shares', e.target.value)} className="text-sm w-36" />
            <Button type="button" variant="ghost" size="icon" aria-label="Remove holder" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" disabled={rows.length >= 12} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', shares: '' }])}><Plus className="h-4 w-4 mr-1" /> Add holder</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="rd-pre" label="Pre-money valuation" value={pre} onChange={setPre} prefix="$" step="100000" />
        <Field id="rd-inv" label="New investment" value={inv} onChange={setInv} prefix="$" step="50000" />
        <Field id="rd-pool" label="Option pool after the round" value={pool} onChange={setPool} suffix="% post" step="1" help="0 = no pool change" />
        <Field id="rd-expool" label="Unallocated pool shares already in the table" value={existingPool} onChange={setExistingPool} step="10000" help="Counts toward the target" />
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-muted/30 border border-border/30 px-3 py-2">
        <Switch id="rd-shuffle" checked={shuffle} onCheckedChange={setShuffle} />
        <Label htmlFor="rd-shuffle" className="text-xs">Pool created pre-money (the usual term sheet: existing holders pay for it, the new investor does not)</Label>
      </div>
      <Actions onExample={() => { setRows(d.holders.map((h, i) => ({ id: i + 1, name: h.name, shares: String(h.shares) }))); setPre('10000000'); setInv('2500000'); setPool('15'); setExistingPool('1000000'); setShuffle(true); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), pre, inv, pool, existingPool, shuffle: String(shuffle) }, `${formatCurrency(num(inv))} on ${formatCurrency(num(pre))} pre → investor ${pct(r.investorPct, 1)}, price ${price(r.pricePerShare)}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter shares, a pre-money valuation, and a pool small enough to leave the existing holders something.</p>}
      {r && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Post-money valuation</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(r.postMoney)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">new investor <strong className="text-foreground">{pct(r.investorPct, 1)}</strong> · price per share <strong className="text-foreground">{price(r.pricePerShare)}</strong>{r.pricePerShareNoShuffle !== null && <> (would be {price(r.pricePerShareNoShuffle)} without the pre-money pool)</>} · <strong className="text-foreground">{int(r.totalSharesAfter)}</strong> shares fully diluted</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="New investor shares" value={int(r.newInvestorShares)} />
            <Kpi label="New pool shares" value={int(r.newPoolShares)} sub={`pool ${pct(r.poolPctAfter, 1)} after`} color="text-amber-600" />
            <Kpi label="Existing holders after" value={pct(r.existingPctAfter, 1)} sub="founders + earlier investors" />
            <Kpi label="Effective pre-money for them" value={formatCurrency(r.effectivePreMoney)} sub={r.pricePerShareNoShuffle !== null ? 'after paying for the pool' : undefined} color="text-blue-600" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Holder</Th><Th right>Shares</Th><Th right>Before</Th><Th right>After</Th><Th right>Dilution</Th><Th right>Value at round</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.table.map((h, i) => <tr key={i}><td className="px-3 py-2 font-medium">{h.name}</td><td className="text-right px-3 py-2">{int(h.shares)}</td><td className="text-right px-3 py-2 text-muted-foreground">{pct(h.beforePct, 1)}</td><td className="text-right px-3 py-2 font-semibold">{pct(h.afterPct, 1)}</td><td className="text-right px-3 py-2 text-red-500">−{pct(h.dilutionPct, 1)}</td><td className="text-right px-3 py-2">{formatCurrency(h.value)}</td></tr>)}
                {r.newPoolShares > 0 && <tr><td className="px-3 py-2 font-medium text-amber-700">New option pool shares</td><td className="text-right px-3 py-2">{int(r.newPoolShares)}</td><td className="text-right px-3 py-2 text-muted-foreground">—</td><td className="text-right px-3 py-2">{pct((r.newPoolShares / r.totalSharesAfter) * 100, 1)}</td><td className="text-right px-3 py-2" /><td className="text-right px-3 py-2">{formatCurrency(r.newPoolShares * r.pricePerShare)}</td></tr>}
                <tr className="bg-emerald-500/5"><td className="px-3 py-2 font-medium text-emerald-700">New investor</td><td className="text-right px-3 py-2">{int(r.newInvestorShares)}</td><td className="text-right px-3 py-2 text-muted-foreground">—</td><td className="text-right px-3 py-2 font-semibold">{pct((r.newInvestorShares / r.totalSharesAfter) * 100, 1)}</td><td className="text-right px-3 py-2" /><td className="text-right px-3 py-2">{formatCurrency(num(inv))}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Post-money = pre-money + investment; investor % = investment ÷ post-money. With the pool created pre-money, the price per share is post-money ÷ fully diluted shares including the new pool, so the pool comes out of the existing holders&apos; share — the &quot;option pool shuffle&quot;. Negotiate the pool size against the hiring plan (see the Option pool tab), not the investor&apos;s default.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as HolderRow[]; if (Array.isArray(p)) setRows(p); } catch {} setPre(i.pre ?? ''); setInv(i.inv ?? ''); setPool(i.pool ?? '0'); setExistingPool(i.existingPool ?? '0'); setShuffle(i.shuffle !== 'false'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── SAFE conversion

type SafeRow = { id: number; name: string; amount: string; cap: string; discount: string };

function SafeMode() {
  const d = SAFE_DEFAULTS;
  const [rows, setRows] = useState<SafeRow[]>(d.safes.map((s, i) => ({ id: i + 1, name: s.name, amount: String(s.amount), cap: String(s.cap), discount: String(s.discountPct) })));
  const [shares, setShares] = useState(String(d.existingShares));
  const [pre, setPre] = useState(String(d.roundPreMoney));
  const [inv, setInv] = useState(String(d.roundInvestment));
  const [pool, setPool] = useState(String(d.poolPct));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('safe-note-calculator');
  const r = useMemo(() => computeSafes({ safes: rows.map((x) => ({ name: x.name || 'SAFE', amount: num(x.amount), cap: num(x.cap), discountPct: num(x.discount) })), existingShares: num(shares), roundPreMoney: num(pre), roundInvestment: num(inv), poolPct: num(pool) }), [rows, shares, pre, inv, pool]);
  const update = (id: number, field: keyof SafeRow, value: string) => setRows((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  const methodLabel = { cap: 'valuation cap', discount: 'discount', round: 'round price' };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground"><th className="text-left py-1 pr-2 font-medium">SAFE</th><th className="text-left py-1 px-2 font-medium">Amount</th><th className="text-left py-1 px-2 font-medium">Post-money cap (0 = none)</th><th className="text-left py-1 px-2 font-medium">Discount</th><th /></tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td className="py-1 pr-2"><Input aria-label={`SAFE ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, 'name', e.target.value)} className="text-sm min-w-[8rem]" /></td>
                  <td className="py-1 px-2"><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`SAFE ${i + 1} amount`} type="number" min="0" step="10000" value={row.amount} onChange={(e) => update(row.id, 'amount', e.target.value)} className="text-sm w-32 pl-6" /></div></td>
                  <td className="py-1 px-2"><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`SAFE ${i + 1} cap`} type="number" min="0" step="500000" value={row.cap} onChange={(e) => update(row.id, 'cap', e.target.value)} className="text-sm w-36 pl-6" /></div></td>
                  <td className="py-1 px-2"><div className="relative"><Input aria-label={`SAFE ${i + 1} discount`} type="number" min="0" max="90" step="5" value={row.discount} onChange={(e) => update(row.id, 'discount', e.target.value)} className="text-sm w-24 pr-7" /><span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span></div></td>
                  <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove SAFE" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={rows.length >= 8} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', amount: '', cap: '', discount: '0' }])}><Plus className="h-4 w-4 mr-1" /> Add SAFE</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="sf-shares" label="Fully diluted shares today" value={shares} onChange={setShares} step="100000" help="Founders, earlier holders and any pool" />
        <Field id="sf-pre" label="Priced round pre-money" value={pre} onChange={setPre} prefix="$" step="500000" />
        <Field id="sf-inv" label="Priced round investment" value={inv} onChange={setInv} prefix="$" step="100000" />
        <Field id="sf-pool" label="Option pool in the round" value={pool} onChange={setPool} suffix="% post" step="1" help="Created pre-money" />
      </div>
      <Actions onExample={() => { setRows(d.safes.map((s, i) => ({ id: i + 1, name: s.name, amount: String(s.amount), cap: String(s.cap), discount: String(s.discountPct) }))); setShares('10000000'); setPre('12000000'); setInv('3000000'); setPool('10'); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), shares, pre, inv, pool }, `SAFEs convert to ${pct(r.totalSafePctPostRound, 1)} · founders ${pct(r.existingPctPostRound, 1)} after the round`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter shares and a round pre-money; the SAFEs plus pool must leave the existing holders something.</p>}
      {r && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Existing holders after the SAFEs convert and the round closes</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{pct(r.existingPctPostRound, 1)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">SAFEs <strong className="text-foreground">{pct(r.totalSafePctPostRound, 1)}</strong> · new investor <strong className="text-foreground">{pct(r.investorPct, 1)}</strong> · pool <strong className="text-foreground">{pct(r.poolPct, 1)}</strong> · round price <strong className="text-foreground">{price(r.roundPricePerShare)}</strong> on a {formatCurrency(r.roundPostMoney)} post-money</p>
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>SAFE</Th><Th right>Amount</Th><Th>Converts on</Th><Th right>Effective valuation</Th><Th right>Price</Th><Th right>Shares</Th><Th right>Ownership after round</Th><Th right>Value / multiple</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.safes.map((s, i) => <tr key={i}><td className="px-3 py-2 font-medium">{s.name}</td><td className="text-right px-3 py-2">{formatCurrency(s.amount)}</td><td className="px-3 py-2 text-muted-foreground">{methodLabel[s.method]}</td><td className="text-right px-3 py-2">{formatCurrency(s.effectiveValuation)}</td><td className="text-right px-3 py-2">{price(s.conversionPrice)} <span className="text-xs text-muted-foreground">(−{pct(s.realizedDiscountPct, 0)})</span></td><td className="text-right px-3 py-2">{int(s.shares)}</td><td className="text-right px-3 py-2 font-semibold">{pct(s.postRoundPct, 2)}</td><td className="text-right px-3 py-2">{formatCurrency(s.valueAtRound)} <span className="text-xs text-muted-foreground">({s.multipleOnMoney}×)</span></td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="SAFEs before the round" value={pct(r.totalSafePctPreRound, 2)} sub="post-conversion, pre-round" />
            <Kpi label="SAFEs after the round" value={pct(r.totalSafePctPostRound, 2)} color="text-amber-600" />
            <Kpi label="Existing holders after" value={pct(r.existingPctPostRound, 2)} color="text-emerald-600" />
            <Kpi label="Fully diluted shares after" value={int(r.totalSharesAfter)} />
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Post-money SAFE mechanics (YC 2018 form): a capped SAFE owns amount ÷ cap of the company immediately before the priced round; a discount SAFE converts at the round&apos;s pre-money × (1 − discount); each SAFE uses whichever gives it more. The priced round and the pre-money pool then dilute SAFEs and founders alike. Pro-rata rights, MFN clauses and multiple-cap side letters are not modeled.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as SafeRow[]; if (Array.isArray(p)) setRows(p); } catch {} setShares(i.shares ?? ''); setPre(i.pre ?? ''); setInv(i.inv ?? ''); setPool(i.pool ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── option pool

type HireRow = { id: number; role: string; count: string; grant: string };

function PoolMode() {
  const d = POOL_DEFAULTS;
  const [rows, setRows] = useState<HireRow[]>(d.hires.map((h, i) => ({ id: i + 1, role: h.role, count: String(h.count), grant: String(h.grantPct) })));
  const [fd, setFd] = useState(String(d.fullyDilutedShares));
  const [poolPct, setPoolPct] = useState(String(d.currentPoolPct));
  const [granted, setGranted] = useState(String(d.grantedPct));
  const [buffer, setBuffer] = useState(String(d.bufferPct));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('option-pool-calculator');
  const r = useMemo(() => computePool({ fullyDilutedShares: num(fd), currentPoolPct: num(poolPct), grantedPct: num(granted), hires: rows.map((x) => ({ role: x.role || 'Hire', count: num(x.count), grantPct: num(x.grant) })), bufferPct: num(buffer) }), [rows, fd, poolPct, granted, buffer]);
  const update = (id: number, field: keyof HireRow, value: string) => setRows((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="op-fd" label="Fully diluted shares" value={fd} onChange={setFd} step="100000" />
        <Field id="op-pool" label="Current pool" value={poolPct} onChange={setPoolPct} suffix="% FD" step="0.5" />
        <Field id="op-granted" label="Already granted" value={granted} onChange={setGranted} suffix="% FD" step="0.25" />
        <Field id="op-buffer" label="Buffer to keep unallocated" value={buffer} onChange={setBuffer} suffix="% FD" step="0.5" help="Refreshes, promotions, surprises" />
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <p className="text-xs font-semibold">Hiring plan until the next round</p>
        {rows.map((row, i) => (
          <div key={row.id} className="grid grid-cols-[1fr_5rem_6rem_2.5rem] items-center gap-2">
            <Input aria-label={`Role ${i + 1}`} value={row.role} onChange={(e) => update(row.id, 'role', e.target.value)} className="text-sm" placeholder="Role" />
            <Input aria-label={`Role ${i + 1} count`} type="number" min="0" step="1" value={row.count} onChange={(e) => update(row.id, 'count', e.target.value)} className="text-sm" />
            <div className="relative"><Input aria-label={`Role ${i + 1} grant`} type="number" min="0" step="0.05" value={row.grant} onChange={(e) => update(row.id, 'grant', e.target.value)} className="text-sm pr-12" /><span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">% each</span></div>
            <Button type="button" variant="ghost" size="icon" aria-label="Remove role" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" disabled={rows.length >= 12} onClick={() => setRows((p) => [...p, { id: nextId++, role: '', count: '1', grant: '' }])}><Plus className="h-4 w-4 mr-1" /> Add role</Button>
      </div>
      <Actions onExample={() => { setRows(d.hires.map((h, i) => ({ id: i + 1, role: h.role, count: String(h.count), grant: String(h.grantPct) }))); setFd('12500000'); setPoolPct('10'); setGranted('3.5'); setBuffer('2'); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), fd, poolPct, granted, buffer }, `Plan ${pct(r.planPct)} of ${pct(r.availablePct)} available · pool needed ${pct(r.requiredPoolPct, 1)}`)} disabled={!r} />
      {r && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Pool size the plan needs</p>
            <p className={`text-4xl sm:text-5xl font-extrabold ${r.topUpPct > 0 ? 'text-amber-600' : 'text-emerald-600'}`} data-result-primary>{pct(r.requiredPoolPct, 1)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{r.topUpPct > 0 ? <>current pool {pct(num(poolPct), 1)} is short by <strong className="text-foreground">{pct(r.topUpPct, 2)}</strong> ({int(r.topUpShares)} shares) — ask for that, not a round number</> : <>current pool {pct(num(poolPct), 1)} covers it with <strong className="text-foreground">{pct(r.remainingAfterPlanPct - num(buffer), 2)}</strong> to spare beyond the buffer</>}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Pool shares" value={int(r.poolShares)} sub={`${pct(num(poolPct), 1)} of ${int(num(fd))}`} />
            <Kpi label="Already granted" value={int(r.grantedShares)} sub={pct(num(granted), 2)} />
            <Kpi label="Available now" value={int(r.availableShares)} sub={pct(r.availablePct, 2)} color="text-blue-600" />
            <Kpi label="Plan consumes" value={int(r.planShares)} sub={pct(r.planPct, 2)} color="text-amber-600" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Role</Th><Th right>Hires</Th><Th right>Grant each</Th><Th right>Shares each</Th><Th right>Total</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.plan.map((h, i) => <tr key={i}><td className="px-3 py-2 font-medium">{h.role}</td><td className="text-right px-3 py-2">{h.count}</td><td className="text-right px-3 py-2">{pct(h.grantPct, 2)}</td><td className="text-right px-3 py-2">{int(h.sharesEach)}</td><td className="text-right px-3 py-2 font-semibold">{pct(h.totalPct, 2)}</td></tr>)}
                <tr className="font-bold bg-muted/20"><td className="px-3 py-2">Plan total</td><td className="text-right px-3 py-2">{r.plan.reduce((s, h) => s + h.count, 0)}</td><td /><td className="text-right px-3 py-2">{int(r.planShares)}</td><td className="text-right px-3 py-2">{pct(r.planPct, 2)}</td></tr>
              </tbody>
            </table>
          </div>
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">Typical grant ranges by role (early-stage US)</summary>
            <table className="w-full mt-2 text-xs"><tbody className="divide-y divide-border/30">{GRANT_RANGES.map((g) => <tr key={g.role}><td className="py-1 pr-2">{g.role}</td><td className="py-1 px-2 font-medium whitespace-nowrap">{g.range}</td><td className="py-1 pl-2">{g.note}</td></tr>)}</tbody></table>
          </details>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as HireRow[]; if (Array.isArray(p)) setRows(p); } catch {} setFd(i.fd ?? ''); setPoolPct(i.poolPct ?? ''); setGranted(i.granted ?? '0'); setBuffer(i.buffer ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── founder split & vesting

type FounderRow = { id: number; name: string; scores: Record<string, string> };

function FoundersMode() {
  const d = FOUNDER_DEFAULTS;
  const toRows = () => d.founders.map((f, i) => ({ id: i + 1, name: f.name, scores: Object.fromEntries(Object.entries(f.scores).map(([k, v]) => [k, String(v)])) }));
  const [rows, setRows] = useState<FounderRow[]>(toRows);
  const [weights, setWeights] = useState<Record<string, string>>(Object.fromEntries(SPLIT_FACTORS.map((f) => [f.key, String(f.weight)])));
  const [total, setTotal] = useState(String(d.totalShares));
  const [elapsed, setElapsed] = useState(String(d.monthsElapsed));
  const [vest, setVest] = useState(String(d.vestingMonths));
  const [cliff, setCliff] = useState(String(d.cliffMonths));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('founder-equity-split-calculator');
  const r = useMemo(() => computeFounderSplit({ founders: rows.map((x) => ({ name: x.name, scores: Object.fromEntries(Object.entries(x.scores).map(([k, v]) => [k, num(v)])) })), weights: Object.fromEntries(Object.entries(weights).map(([k, v]) => [k, num(v)])), totalShares: num(total), monthsElapsed: num(elapsed), vestingMonths: num(vest) || 48, cliffMonths: num(cliff) }), [rows, weights, total, elapsed, vest, cliff]);
  const setScore = (id: number, key: string, value: string) => setRows((p) => p.map((x) => (x.id === id ? { ...x, scores: { ...x.scores, [key]: value } } : x)));
  const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="text-left py-1 pr-2 font-medium">Founder</th>
              {SPLIT_FACTORS.map((f) => (
                <th key={f.key} className="text-left py-1 px-1 font-medium">
                  <div>{f.label}</div>
                  <div className="relative mt-1 w-20"><Input aria-label={`${f.label} weight`} type="number" min="0" step="5" value={weights[f.key]} onChange={(e) => setWeights((p) => ({ ...p, [f.key]: e.target.value }))} className="h-7 text-xs pr-7" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px]">wt</span></div>
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <td className="py-1 pr-2"><Input aria-label={`Founder ${i + 1} name`} value={row.name} onChange={(e) => setRows((p) => p.map((x) => (x.id === row.id ? { ...x, name: e.target.value } : x)))} className="text-sm min-w-[8rem]" placeholder="Name" /></td>
                {SPLIT_FACTORS.map((f) => <td key={f.key} className="py-1 px-1"><Input aria-label={`${row.name || `Founder ${i + 1}`} ${f.label} score`} type="number" min="0" max="10" step="1" value={row.scores[f.key] ?? ''} onChange={(e) => setScore(row.id, f.key, e.target.value)} className="text-sm w-16" placeholder="0–10" /></td>)}
                <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove founder" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button type="button" variant="outline" size="sm" disabled={rows.length >= 6} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', scores: {} }])}><Plus className="h-4 w-4 mr-1" /> Add founder</Button>
          <span className="text-xs text-muted-foreground">Score each founder 0–10 per factor; the weight row sets how much each factor matters.</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="fs-total" label="Founder shares to split (optional)" value={total} onChange={setTotal} step="100000" />
        <Field id="fs-elapsed" label="Months since vesting started" value={elapsed} onChange={setElapsed} suffix="months" step="1" />
        <Field id="fs-vest" label="Vesting period" value={vest} onChange={setVest} suffix="months" step="12" />
        <Field id="fs-cliff" label="Cliff" value={cliff} onChange={setCliff} suffix="months" step="1" />
      </div>
      <Actions onExample={() => { setRows(toRows()); setWeights(Object.fromEntries(SPLIT_FACTORS.map((f) => [f.key, String(f.weight)]))); setTotal('8000000'); setElapsed('18'); setVest('48'); setCliff('12'); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), weights: JSON.stringify(weights), total, elapsed, vest, cliff }, r.founders.map((f) => `${f.name} ${pct(f.pct, 1)}`).join(' · '))} disabled={!r} />
      {r && (
        <Result>
          <div className="h-4 w-full rounded-full overflow-hidden flex bg-muted">{r.founders.map((f, i) => <div key={i} style={{ width: `${f.pct}%` }} className={`${colors[i % colors.length]} h-full`} title={`${f.name} ${pct(f.pct, 1)}`} />)}</div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Founder</Th><Th right>Weighted score</Th><Th right>Split</Th>{num(total) > 0 && <><Th right>Shares</Th><Th right>Vested now</Th><Th right>Unvested</Th></>}</tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.founders.map((f, i) => <tr key={i}><td className="px-3 py-2 font-medium flex items-center gap-2"><span className={`size-2.5 rounded-sm ${colors[i % colors.length]}`} />{f.name}</td><td className="text-right px-3 py-2 text-muted-foreground">{f.weightedScore} / {r.totalWeight}</td><td className="text-right px-3 py-2 font-bold text-emerald-600">{pct(f.pct, 1)}</td>{num(total) > 0 && <><td className="text-right px-3 py-2">{int(f.shares ?? 0)}</td><td className="text-right px-3 py-2">{int(f.vestedShares ?? 0)} <span className="text-xs text-muted-foreground">({pct(f.vestedPct, 0)})</span></td><td className="text-right px-3 py-2 text-muted-foreground">{int(f.unvestedShares ?? 0)}</td></>}</tr>)}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <div className="px-3 py-2 border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">How each factor was divided</div>
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border/50 text-muted-foreground"><Th>Factor</Th><Th right>Weight</Th>{r.founders.map((f, i) => <Th key={i} right>{f.name}</Th>)}</tr></thead>
              <tbody className="divide-y divide-border/30">{r.byFactor.map((f) => <tr key={f.key}><td className="px-3 py-1.5">{f.label}</td><td className="text-right px-3 py-1.5 text-muted-foreground">{f.weight}</td>{f.shares.map((s, i) => <td key={i} className="text-right px-3 py-1.5">{s.contribution.toFixed(1)}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Each factor&apos;s weight is divided among the founders in proportion to their scores, then summed. The split is a structured conversation starter, not an answer: agree the weights first, score separately, then compare. Whatever the split, vest it — {vest || 48} months with a {cliff || 0}-month cliff is the standard; after {elapsed || 0} months {pct(r.vestedFraction * 100, 0)} is vested and {pct(r.unvestedFraction * 100, 0)} would return to the company if a founder left today.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as FounderRow[]; if (Array.isArray(p)) setRows(p); const w = JSON.parse(i.weights) as Record<string, string>; if (w && typeof w === 'object') setWeights(w); } catch {} setTotal(i.total ?? ''); setElapsed(i.elapsed ?? '0'); setVest(i.vest ?? '48'); setCliff(i.cliff ?? '12'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── suite

const MODE_ICON: Record<EquityMode, typeof PieChart> = { round: PieChart, safe: FileText, pool: Users, founders: Handshake };

export default function StartupEquitySuite() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<EquityMode | null>(null);
  const mode: EquityMode = override ?? (isEquityMode(urlMode) ? urlMode : 'round');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Equity mode">
          {EQUITY_MODES.map((m) => {
            const Icon = MODE_ICON[m.value];
            return (
              <button key={m.value} type="button" role="tab" aria-selected={mode === m.value} onClick={() => setMode(m.value)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === m.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-4 w-4" /><span className="hidden sm:inline">{m.label}</span><span className="sm:hidden">{m.short}</span>
              </button>
            );
          })}
        </div>
        {mode === 'round' && <RoundMode />}
        {mode === 'safe' && <SafeMode />}
        {mode === 'pool' && <PoolMode />}
        {mode === 'founders' && <FoundersMode />}
      </div>
    </div>
  );
}

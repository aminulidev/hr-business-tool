'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus, Info, Package, RefreshCw, Warehouse, Gauge } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { formatCurrency } from '@/lib/utils';
import {
  computeEoq,
  computeHolding,
  computeReorder,
  computeTurnover,
  EOQ_DEFAULTS,
  HOLDING_DEFAULTS,
  isPlanningMode,
  PLANNING_MODES,
  REORDER_DEFAULTS,
  SERVICE_LEVELS,
  TURNOVER_DEFAULTS,
  type PlanningMode,
} from '@/lib/pricing/inventory-planning';

// Phase 17: eoq, safety-stock, reorder-point, inventory-holding-cost,
// inventory-turnover and cash-conversion-cycle pages 301 here with ?mode=…

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const units = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

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
function Kpi({ label, value, color = 'text-foreground' }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-base sm:text-lg font-bold ${color}`}>{value}</p>
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

// ───────────────────────── EOQ

function EoqMode() {
  const d = EOQ_DEFAULTS;
  const [demand, setDemand] = useState(String(d.annualDemand));
  const [orderCost, setOrderCost] = useState(String(d.orderCost));
  const [hMode, setHMode] = useState<'rate' | 'direct'>('rate');
  const [unitCost, setUnitCost] = useState(String(d.unitCost));
  const [rate, setRate] = useState(String(d.carryingRatePct));
  const [hDirect, setHDirect] = useState('3');
  const [days, setDays] = useState(String(d.workingDays));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('eoq-calculator');
  const r = useMemo(() => computeEoq({ annualDemand: num(demand), orderCost: num(orderCost), holdingCostPerUnit: hMode === 'direct' ? num(hDirect) : null, unitCost: num(unitCost), carryingRatePct: num(rate), workingDays: num(days) || 250 }), [demand, orderCost, hMode, hDirect, unitCost, rate, days]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="eoq-d" label="Annual demand" value={demand} onChange={setDemand} suffix="units" step="100" />
        <Field id="eoq-s" label="Cost per order" value={orderCost} onChange={setOrderCost} prefix="$" step="5" help="Admin, freight, receiving — per order, not per unit" />
        <Field id="eoq-days" label="Working days per year" value={days} onChange={setDays} step="1" />
        <div className="space-y-1.5 col-span-2 sm:col-span-3">
          <Label className="text-xs text-muted-foreground">Holding cost per unit per year</Label>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex rounded-lg bg-background border border-border/50 p-1">
              {(['rate', 'direct'] as const).map((m) => <button key={m} type="button" onClick={() => setHMode(m)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${hMode === m ? 'bg-emerald-600 text-white' : 'text-muted-foreground'}`}>{m === 'rate' ? 'Unit cost × carrying rate' : 'Enter $ directly'}</button>)}
            </div>
            {hMode === 'rate' ? (
              <>
                <div className="w-36"><Field id="eoq-uc" label="Unit cost" value={unitCost} onChange={setUnitCost} prefix="$" step="0.5" /></div>
                <div className="w-36"><Field id="eoq-rate" label="Carrying rate" value={rate} onChange={setRate} suffix="% / yr" step="1" /></div>
                {r && <span className="text-xs text-muted-foreground pb-2">= {formatCurrency(r.holdingPerUnit)} per unit per year</span>}
              </>
            ) : (
              <div className="w-40"><Field id="eoq-h" label="Holding cost" value={hDirect} onChange={setHDirect} prefix="$" step="0.25" help="per unit per year" /></div>
            )}
          </div>
        </div>
      </div>
      <Actions onExample={() => { setDemand('12000'); setOrderCost('50'); setHMode('rate'); setUnitCost('15'); setRate('20'); setDays('250'); }} onSave={() => r && saveEntry({ demand, orderCost, hMode, unitCost, rate, hDirect, days }, `EOQ ${units(r.eoq)} units · ${r.ordersPerYear} orders/yr · ${formatCurrency(r.totalAnnualCost)} total`)} disabled={!r} />
      {r && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Economic order quantity</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{units(r.eoq)} <span className="text-xl">units</span></p>
            <p className="text-xs sm:text-sm text-muted-foreground"><strong className="text-foreground">{r.ordersPerYear}</strong> orders a year · one every <strong className="text-foreground">{r.daysBetweenOrders}</strong> working days · total ordering + holding cost <strong className="text-foreground">{formatCurrency(r.totalAnnualCost)}</strong></p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Annual ordering cost" value={formatCurrency(r.annualOrderingCost)} color="text-amber-600" />
            <Kpi label="Annual holding cost" value={formatCurrency(r.annualHoldingCost)} color="text-blue-600" />
            <Kpi label="Average cycle stock" value={`${units(r.eoq / 2)} units`} />
            <Kpi label="Holding cost per unit" value={`${formatCurrency(r.holdingPerUnit)}/yr`} />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <div className="px-4 py-2 border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What other order sizes would cost</div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Order quantity</th><th className="text-right px-4 py-2 font-medium">Ordering</th><th className="text-right px-4 py-2 font-medium">Holding</th><th className="text-right px-4 py-2 font-medium">Total</th><th className="text-right px-4 py-2 font-medium">vs EOQ</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.sensitivity.map((s) => (
                  <tr key={s.quantity} className={s.quantity === Math.round(r.eoq) ? 'bg-emerald-500/5 font-semibold' : ''}><td className="px-4 py-2">{units(s.quantity)}</td><td className="text-right px-4 py-2">{formatCurrency(s.ordering)}</td><td className="text-right px-4 py-2">{formatCurrency(s.holding)}</td><td className="text-right px-4 py-2">{formatCurrency(s.total)}</td><td className={`text-right px-4 py-2 ${s.vsEoq > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>{s.vsEoq > 0 ? `+${formatCurrency(s.vsEoq)}` : '—'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> EOQ = √(2 × demand × order cost ÷ holding cost per unit). The curve is flat near the optimum, so rounding to a case or pallet quantity costs little; being far off on either side costs more. It assumes steady demand and no quantity discounts.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setDemand(i.demand ?? ''); setOrderCost(i.orderCost ?? ''); setHMode(i.hMode === 'direct' ? 'direct' : 'rate'); setUnitCost(i.unitCost ?? ''); setRate(i.rate ?? ''); setHDirect(i.hDirect ?? ''); setDays(i.days ?? '250'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── reorder point & safety stock

function ReorderMode() {
  const d = REORDER_DEFAULTS;
  const [demand, setDemand] = useState(String(d.avgDailyDemand));
  const [sd, setSd] = useState(String(d.demandStdDev));
  const [lt, setLt] = useState(String(d.avgLeadTimeDays));
  const [slt, setSlt] = useState(String(d.leadTimeStdDev));
  const [level, setLevel] = useState(String(d.serviceLevel));
  const [q, setQ] = useState(String(d.orderQuantity));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('reorder-point-calculator');
  const r = useMemo(() => computeReorder({ avgDailyDemand: num(demand), demandStdDev: num(sd), avgLeadTimeDays: num(lt), leadTimeStdDev: num(slt), serviceLevel: num(level), orderQuantity: num(q) > 0 ? num(q) : null }), [demand, sd, lt, slt, level, q]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="rp-d" label="Average daily demand" value={demand} onChange={setDemand} suffix="units" step="1" />
        <Field id="rp-sd" label="Std. deviation of daily demand" value={sd} onChange={setSd} suffix="units" step="1" help="0 if demand is steady" />
        <Field id="rp-lt" label="Average lead time" value={lt} onChange={setLt} suffix="days" step="1" />
        <Field id="rp-slt" label="Std. deviation of lead time" value={slt} onChange={setSlt} suffix="days" step="0.5" help="0 if the supplier is always on time" />
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Cycle service level</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger aria-label="Service level"><SelectValue /></SelectTrigger>
            <SelectContent>{SERVICE_LEVELS.map((s) => <SelectItem key={s.level} value={String(s.level)}>{s.level}% (z = {s.z})</SelectItem>)}</SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Chance of not running out before the order arrives</p>
        </div>
        <Field id="rp-q" label="Order quantity (optional)" value={q} onChange={setQ} suffix="units" step="10" help="For average and maximum stock" />
      </div>
      <Actions onExample={() => { setDemand('100'); setSd('20'); setLt('7'); setSlt('1'); setLevel('95'); setQ('1400'); }} onSave={() => r && saveEntry({ demand, sd, lt, slt, level, q }, `Reorder at ${units(r.reorderPoint)} units (safety stock ${units(r.safetyStock)}, ${level}% service)`)} disabled={!r} />
      {r && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Reorder point</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{units(r.reorderPoint)} <span className="text-xl">units</span></p>
            <p className="text-xs sm:text-sm text-muted-foreground">= <strong className="text-foreground">{units(r.leadTimeDemand)}</strong> units of lead-time demand + <strong className="text-foreground">{units(r.safetyStock)}</strong> units of safety stock ({r.safetyDays} days of cover) at a {level}% service level (z = {r.z})</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Lead-time demand" value={`${units(r.leadTimeDemand)} units`} />
            <Kpi label="Safety stock" value={`${units(r.safetyStock)} units`} color="text-amber-600" />
            <Kpi label="Average inventory" value={r.averageInventory === null ? 'add an order qty' : `${units(r.averageInventory)} units`} />
            <Kpi label="Maximum inventory" value={r.maximumInventory === null ? '—' : `${units(r.maximumInventory)} units`} />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <div className="px-4 py-2 border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service level trade-off</div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Service level</th><th className="text-right px-4 py-2 font-medium">z</th><th className="text-right px-4 py-2 font-medium">Safety stock</th><th className="text-right px-4 py-2 font-medium">Reorder point</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.ladder.map((l) => <tr key={l.level} className={l.level === num(level) ? 'bg-emerald-500/5 font-semibold' : ''}><td className="px-4 py-2">{l.level}%</td><td className="text-right px-4 py-2 text-muted-foreground">{l.z}</td><td className="text-right px-4 py-2">{units(l.safetyStock)}</td><td className="text-right px-4 py-2">{units(l.reorderPoint)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Safety stock = z × √(lead time × σ²demand + demand² × σ²lead time). Demand variability contributes {units(r.demandVariance)} and lead-time variability {units(r.leadTimeVariance)} to the variance here. Because safety stock scales with z, 99% service always needs about 41% more buffer than 95%, and 99.9% needs 88% more — for 4 and 4.9 extra points of availability.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setDemand(i.demand ?? ''); setSd(i.sd ?? '0'); setLt(i.lt ?? ''); setSlt(i.slt ?? '0'); setLevel(i.level ?? '95'); setQ(i.q ?? ''); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── carrying cost

function HoldingMode() {
  const d = HOLDING_DEFAULTS;
  const [inv, setInv] = useState(String(d.averageInventoryValue));
  const [cap, setCap] = useState(String(d.capitalPct));
  const [stg, setStg] = useState(String(d.storagePct));
  const [svc, setSvc] = useState(String(d.servicePct));
  const [risk, setRisk] = useState(String(d.riskPct));
  const [unitsOnHand, setUnitsOnHand] = useState(String(d.averageUnits));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('inventory-holding-cost-calculator');
  const r = useMemo(() => computeHolding({ averageInventoryValue: num(inv), capitalPct: num(cap), storagePct: num(stg), servicePct: num(svc), riskPct: num(risk), averageUnits: num(unitsOnHand) > 0 ? num(unitsOnHand) : null }), [inv, cap, stg, svc, risk, unitsOnHand]);
  const valid = num(inv) > 0;
  const colors = ['bg-blue-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="hc-inv" label="Average inventory value" value={inv} onChange={setInv} prefix="$" step="5000" help="(Beginning + ending) ÷ 2, at cost" />
        <Field id="hc-units" label="Average units on hand (optional)" value={unitsOnHand} onChange={setUnitsOnHand} suffix="units" step="100" />
        <Field id="hc-cap" label="Cost of capital" value={cap} onChange={setCap} suffix="% / yr" step="0.5" help="Loan rate or the return the cash could earn" />
        <Field id="hc-stg" label="Storage & handling" value={stg} onChange={setStg} suffix="% / yr" step="0.5" help="Warehouse, labor, equipment" />
        <Field id="hc-svc" label="Insurance, taxes & systems" value={svc} onChange={setSvc} suffix="% / yr" step="0.5" />
        <Field id="hc-risk" label="Shrinkage, damage & obsolescence" value={risk} onChange={setRisk} suffix="% / yr" step="0.5" />
      </div>
      <Actions onExample={() => { setInv('200000'); setCap('10'); setStg('6'); setSvc('3'); setRisk('6'); setUnitsOnHand('13333'); }} onSave={() => valid && saveEntry({ inv, cap, stg, svc, risk, unitsOnHand }, `Carrying ${r.totalRatePct}% = ${formatCurrency(r.annualCost)}/yr on ${formatCurrency(num(inv))}`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Annual carrying cost</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(r.annualCost)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground"><strong className="text-foreground">{r.totalRatePct}%</strong> of inventory value a year · <strong className="text-foreground">{formatCurrency(r.monthlyCost)}</strong> a month · every extra 30 days of stock costs <strong className="text-foreground">{formatCurrency(r.costPer30Days)}</strong>{r.perUnitPerYear !== null && <> · <strong className="text-foreground">{formatCurrency(r.perUnitPerYear)}</strong> per unit per year (use this as H in the EOQ tab)</>}</p>
          </div>
          <div className="rounded-xl bg-background border border-border/50 p-4 space-y-3">
            <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-muted">{r.components.map((c, i) => c.pct > 0 && <div key={c.key} style={{ width: `${(c.pct / r.totalRatePct) * 100}%` }} className={`${colors[i]} h-full`} title={c.label} />)}</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border/30">
                {r.components.map((c, i) => <tr key={c.key}><td className="py-1.5 flex items-center gap-2"><span className={`size-2.5 rounded-sm ${colors[i]}`} />{c.label}</td><td className="py-1.5 text-right text-muted-foreground">{c.pct}%</td><td className="py-1.5 text-right font-medium">{formatCurrency(c.amount)}</td></tr>)}
                <tr className="font-bold"><td className="py-1.5">Total carrying cost</td><td className="py-1.5 text-right">{r.totalRatePct}%</td><td className="py-1.5 text-right text-emerald-600">{formatCurrency(r.annualCost)}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5" /> Carrying rates of 20–30% of inventory value a year are the usual planning range; capital and obsolescence are the components businesses most often leave out. The per-unit figure is the holding cost the EOQ formula needs.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setInv(i.inv ?? ''); setCap(i.cap ?? ''); setStg(i.stg ?? ''); setSvc(i.svc ?? ''); setRisk(i.risk ?? ''); setUnitsOnHand(i.unitsOnHand ?? ''); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── turnover & cash conversion cycle

function TurnoverMode() {
  const d = TURNOVER_DEFAULTS;
  const [v, setV] = useState({ cogs: String(d.cogs), bi: String(d.beginningInventory), ei: String(d.endingInventory), rev: String(d.revenue), ar: String(d.receivables), ap: String(d.payables), days: String(d.periodDays) });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('inventory-turnover-calculator');
  const r = useMemo(() => computeTurnover({ cogs: num(v.cogs), beginningInventory: num(v.bi), endingInventory: num(v.ei), revenue: num(v.rev), receivables: num(v.ar), payables: num(v.ap), periodDays: num(v.days) || 365 }), [v]);
  const valid = r.turnover !== null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="to-cogs" label="Cost of goods sold (period)" value={v.cogs} onChange={set('cogs')} prefix="$" step="10000" />
        <Field id="to-bi" label="Beginning inventory" value={v.bi} onChange={set('bi')} prefix="$" step="5000" />
        <Field id="to-ei" label="Ending inventory" value={v.ei} onChange={set('ei')} prefix="$" step="5000" />
        <Field id="to-days" label="Days in period" value={v.days} onChange={set('days')} step="1" help="365 for a year, 90 for a quarter" />
        <Field id="to-rev" label="Revenue (optional)" value={v.rev} onChange={set('rev')} prefix="$" step="10000" help="For DSO and the cash cycle" />
        <Field id="to-ar" label="Accounts receivable" value={v.ar} onChange={set('ar')} prefix="$" step="5000" />
        <Field id="to-ap" label="Accounts payable" value={v.ap} onChange={set('ap')} prefix="$" step="5000" />
      </div>
      <Actions onExample={() => setV({ cogs: '600000', bi: '100000', ei: '120000', rev: '1000000', ar: '120000', ap: '50000', days: '365' })} onSave={() => valid && saveEntry(v, `Turnover ${r.turnover}× · ${Math.round(r.daysInventory ?? 0)} days${r.cashConversionCycle !== null ? ` · CCC ${Math.round(r.cashConversionCycle)} days` : ''}`)} disabled={!valid} />
      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Inventory turnover</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{r.turnover}×</p>
            <p className="text-xs sm:text-sm text-muted-foreground">stock turns every <strong className="text-foreground">{Math.round(r.daysInventory ?? 0)}</strong> days · <strong className="text-foreground">{r.monthsOfSupply}</strong> months of supply on hand · average inventory <strong className="text-foreground">{formatCurrency(r.averageInventory)}</strong></p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Days inventory (DIO)" value={`${Math.round(r.daysInventory ?? 0)} days`} />
            <Kpi label="Days sales outstanding (DSO)" value={r.dso === null ? 'add revenue' : `${Math.round(r.dso)} days`} />
            <Kpi label="Days payables (DPO)" value={r.dpo === null ? '—' : `${Math.round(r.dpo)} days`} />
            <Kpi label="Cash conversion cycle" value={r.cashConversionCycle === null ? '—' : `${Math.round(r.cashConversionCycle)} days`} color={r.cashConversionCycle !== null && r.cashConversionCycle < 0 ? 'text-emerald-600' : 'text-amber-600'} />
          </div>
          {r.cashConversionCycle !== null && (
            <div className="rounded-xl bg-background border border-border/50 p-4 text-sm space-y-1">
              <p className="font-mono text-xs sm:text-sm">CCC = DIO {Math.round(r.daysInventory ?? 0)} + DSO {Math.round(r.dso ?? 0)} − DPO {Math.round(r.dpo ?? 0)} = <strong>{Math.round(r.cashConversionCycle)} days</strong></p>
              <p className="text-xs text-muted-foreground">At {formatCurrency(r.dailyCogs)} of cost a day, that is about <strong className="text-foreground">{formatCurrency(r.cashTiedUp ?? 0)}</strong> of working capital funding the cycle. Each day shaved off releases roughly {formatCurrency(r.dailyCogs)}.</p>
            </div>
          )}
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <div className="px-4 py-2 border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cash released by turning faster</div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Target turnover</th><th className="text-right px-4 py-2 font-medium">Days of inventory</th><th className="text-right px-4 py-2 font-medium">Average inventory</th><th className="text-right px-4 py-2 font-medium">Cash released</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.releaseAtTurnover.map((t) => <tr key={t.turnover}><td className="px-4 py-2">{t.turnover}×</td><td className="text-right px-4 py-2">{Math.round((num(v.days) || 365) / t.turnover)}</td><td className="text-right px-4 py-2">{formatCurrency(t.inventory)}</td><td className="text-right px-4 py-2 text-emerald-600 font-medium">{formatCurrency(t.released)}</td></tr>)}
              </tbody>
            </table>
          </div>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── suite

const MODE_ICON: Record<PlanningMode, typeof Package> = { eoq: Package, reorder: RefreshCw, holding: Warehouse, turnover: Gauge };

export default function InventoryPlanningSuite() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<PlanningMode | null>(null);
  const mode: PlanningMode = override ?? (isPlanningMode(urlMode) ? urlMode : 'eoq');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Inventory planning mode">
          {PLANNING_MODES.map((m) => {
            const Icon = MODE_ICON[m.value];
            return (
              <button key={m.value} type="button" role="tab" aria-selected={mode === m.value} onClick={() => setMode(m.value)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === m.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-4 w-4" /><span className="hidden sm:inline">{m.label}</span><span className="sm:hidden">{m.short}</span>
              </button>
            );
          })}
        </div>
        {mode === 'eoq' && <EoqMode />}
        {mode === 'reorder' && <ReorderMode />}
        {mode === 'holding' && <HoldingMode />}
        {mode === 'turnover' && <TurnoverMode />}
      </div>
    </div>
  );
}

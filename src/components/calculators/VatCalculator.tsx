'use client';

import { useMemo, useState } from 'react';
import { Calculator, FileSpreadsheet, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Actions, Field, Headline, Kpi, ModeTabs, Note, num, pct, Result, Th } from './suite-ui';
import {
  componentsFor,
  computeReturn,
  computeTax,
  findCountry,
  formatMoney,
  isVatMode,
  presetRates,
  RETURN_DEFAULTS,
  TAX_COUNTRIES,
  TAX_GROUPS,
  totalRate,
  VAT_DEFAULTS,
  VAT_MODES,
  type Direction,
  type TaxCountry,
  type VatMode,
} from '@/lib/pricing/vat';

/**
 * VAT / GST calculator with country presets (Phase 17). Replaces the separate
 * VAT and GST drafts: /calculators/gst-calculator 301s here with ?country=au.
 * Rates live in lib/pricing/vat.ts and every rate can be overridden.
 */

const selectCls = 'h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
const rateLabel = (r: number) => `${Number(r.toFixed(3))}%`;

function CountrySelect({ id, value, onChange }: { id: string; value: string; onChange: (code: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">Country</Label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {TAX_GROUPS.map((g) => (
          <optgroup key={g} label={g}>
            {TAX_COUNTRIES.filter((c) => c.group === g).map((c) => <option key={c.code} value={c.code}>{c.name} — {c.taxName} {rateLabel(c.standard)}</option>)}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} className={`rounded-full px-3 py-1 text-xs font-medium border transition ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'border-border text-muted-foreground hover:text-foreground'}`}>{children}</button>
);

// ───────────────────────── add or remove tax

function CalcMode({ urlCountry }: { urlCountry: TaxCountry | undefined }) {
  const [codeOverride, setCode] = useState<string | null>(null);
  const country = findCountry(codeOverride) ?? urlCountry ?? findCountry(VAT_DEFAULTS.country)!;
  const [regionOverride, setRegion] = useState<string | null>(null);
  const region = country.regions?.find((r) => r.code === regionOverride) ?? country.regions?.[0] ?? null;
  /** null = the country's standard rate (or the region's combined rate) */
  const [rateOverride, setRate] = useState<string | null>(null);
  const [amount, setAmount] = useState(String(VAT_DEFAULTS.amount));
  const [direction, setDirection] = useState<Direction>(VAT_DEFAULTS.direction);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('vat-calculator');

  const components = useMemo(() => componentsFor(country, region?.code, rateOverride === null ? undefined : num(rateOverride)), [country, region, rateOverride]);
  const r = useMemo(() => computeTax({ amount: num(amount), components, direction }), [amount, components, direction]);
  const m = (n: number) => formatMoney(n, country.currency);
  const rate = totalRate(components);
  const ladder = useMemo(() => {
    const rows = country.regions
      ? country.regions.map((x) => ({ label: x.name, components: x.components }))
      : presetRates(country).map((x) => ({ label: `${rateLabel(x)}${x === country.standard ? ' standard' : x === 0 ? ' zero rate' : ''}`, components: [{ label: country.taxName, rate: x }] }));
    return rows.map((x) => ({ ...x, r: computeTax({ amount: num(amount), components: x.components, direction }) }));
  }, [country, amount, direction]);
  const pickCountry = (code: string) => { setCode(code); setRegion(null); setRate(null); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CountrySelect id="vat-country" value={country.code} onChange={pickCountry} />
        {country.regions && (
          <div className="space-y-1.5">
            <Label htmlFor="vat-region" className="text-xs text-muted-foreground">Province or territory</Label>
            <select id="vat-region" value={region?.code ?? ''} onChange={(e) => { setRegion(e.target.value); setRate(null); }} className={selectCls}>
              {country.regions.map((x) => <option key={x.code} value={x.code}>{x.name} — {rateLabel(totalRate(x.components))}</option>)}
            </select>
          </div>
        )}
        <Field id="vat-amount" label={direction === 'add' ? `Amount before ${country.taxName}` : `Amount including ${country.taxName}`} value={amount} onChange={setAmount} step="1" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground mr-1">Rate:</span>
        <Chip active={rateOverride === null} onClick={() => setRate(null)}>{region ? `${region.name} ${rateLabel(totalRate(region.components))}` : `Standard ${rateLabel(country.standard)}`}</Chip>
        {presetRates(country).filter((x) => region || x !== country.standard).map((x) => <Chip key={x} active={rateOverride !== null && num(rateOverride) === x} onClick={() => setRate(String(x))}>{x === 0 ? 'Zero 0%' : rateLabel(x)}</Chip>)}
        <div className="relative w-28">
          <input aria-label="Custom rate" type="number" min="0" step="any" placeholder="Custom" value={rateOverride ?? ''} onChange={(e) => setRate(e.target.value === '' ? null : e.target.value)} className={`${selectCls} pr-6`} />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
        </div>
      </div>
      <div className="inline-flex rounded-xl bg-muted/50 p-1 border border-border/50" role="group" aria-label="Direction">
        {(['add', 'remove'] as Direction[]).map((d) => <button key={d} type="button" aria-pressed={direction === d} onClick={() => setDirection(d)} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${direction === d ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{d === 'add' ? `Add ${country.taxName}` : `Remove ${country.taxName}`}</button>)}
      </div>
      <Actions onExample={() => { pickCountry('GB'); setAmount('120'); setDirection('remove'); }} onSave={() => r && saveEntry({ code: country.code, region: region?.code ?? '', rate: rateOverride ?? '', amount, direction }, `${country.name} ${rateLabel(rate)}: ${m(r.net)} + ${m(r.tax)} = ${m(r.gross)}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter an amount.</p>}
      {r && (
        <Result>
          <Headline label={direction === 'add' ? `Price including ${country.taxName}` : `Price before ${country.taxName}`} value={m(direction === 'add' ? r.gross : r.net)}>
            {m(r.net)} net + <strong className="text-foreground">{m(r.tax)}</strong> {country.taxName} at <strong className="text-foreground">{rateLabel(r.ratePct)}</strong> = {m(r.gross)}
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Net (before tax)" value={m(r.net)} />
            <Kpi label={`${country.taxName} amount`} value={m(r.tax)} color="text-amber-600" />
            <Kpi label="Gross (including tax)" value={m(r.gross)} color="text-emerald-600" />
            <Kpi label="Tax share of the gross price" value={pct(r.taxShareOfGrossPct, 2)} sub={r.fraction !== '0' && r.fraction.length <= 9 ? `the ${r.fraction} fraction` : undefined} color="text-blue-600" />
          </div>
          {r.components.length > 1 && (
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm"><tbody className="divide-y divide-border/30">
                {r.components.map((c) => <tr key={c.label}><td className="px-3 py-2">{c.label} at {rateLabel(c.rate)}</td><td className="text-right px-3 py-2 font-semibold">{m(c.amount)}</td></tr>)}
              </tbody></table>
            </div>
          )}
          <div className="rounded-xl bg-background border border-border/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>{country.regions ? 'Province or territory' : `${country.name} rates`}</Th><Th right>Rate</Th><Th right>Net</Th><Th right>Tax</Th><Th right>Gross</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {ladder.map((x) => x.r && <tr key={x.label} className={totalRate(x.components) === rate && (!country.regions || x.label === region?.name) ? 'bg-emerald-500/5 font-semibold' : ''}><td className="px-3 py-1.5">{x.label}</td><td className="text-right px-3 py-1.5">{rateLabel(totalRate(x.components))}</td><td className="text-right px-3 py-1.5">{m(x.r.net)}</td><td className="text-right px-3 py-1.5">{m(x.r.tax)}</td><td className="text-right px-3 py-1.5">{m(x.r.gross)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />To add tax, multiply the net price by (1 + rate). To remove it, divide the gross price by (1 + rate); taking the rate off the gross price removes too much. {country.note ? `${country.note} ` : ''}Rates are the published {country.name} rates for 2026; which rate applies to a particular product is set by the tax authority.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setCode(i.code ?? null); setRegion(i.region || null); setRate(i.rate ? i.rate : null); setAmount(i.amount ?? ''); setDirection(i.direction === 'remove' ? 'remove' : 'add'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── VAT / GST return

function ReturnMode({ urlCountry }: { urlCountry: TaxCountry | undefined }) {
  const d = RETURN_DEFAULTS;
  const [codeOverride, setCode] = useState<string | null>(null);
  const country = findCountry(codeOverride) ?? urlCountry ?? findCountry(VAT_DEFAULTS.country)!;
  const [sales, setSales] = useState(String(d.sales));
  const [salesIncl, setSalesIncl] = useState(d.salesIncludeTax);
  const [salesRate, setSalesRate] = useState<string | null>(null);
  const [purchases, setPurchases] = useState(String(d.purchases));
  const [purchIncl, setPurchIncl] = useState(d.purchasesIncludeTax);
  const [purchRate, setPurchRate] = useState<string | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('gst-calculator');
  const standard = country.regions ? totalRate(country.regions[0].components) : country.standard;
  const sRate = salesRate === null ? standard : num(salesRate);
  const pRate = purchRate === null ? standard : num(purchRate);
  const r = useMemo(() => computeReturn({ sales: num(sales), salesIncludeTax: salesIncl, salesRatePct: sRate, purchases: num(purchases), purchasesIncludeTax: purchIncl, purchasesRatePct: pRate }), [sales, salesIncl, sRate, purchases, purchIncl, pRate]);
  const m = (n: number) => formatMoney(n, country.currency);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CountrySelect id="ret-country" value={country.code} onChange={(c) => { setCode(c); setSalesRate(null); setPurchRate(null); }} />
        <Field id="ret-sales" label="Sales in the period" value={sales} onChange={setSales} step="100" />
        <Field id="ret-srate" label={`${country.taxName} rate on sales`} value={salesRate ?? String(standard)} onChange={setSalesRate} suffix="%" step="0.5" />
        <div className="flex items-center gap-3 sm:col-start-2"><Switch id="ret-sincl" checked={salesIncl} onCheckedChange={setSalesIncl} /><Label htmlFor="ret-sincl" className="text-xs">Sales figure includes {country.taxName}</Label></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hidden sm:block" />
        <Field id="ret-purch" label="Purchases and expenses with tax" value={purchases} onChange={setPurchases} step="100" help="Only those you can reclaim tax on" />
        <Field id="ret-prate" label={`${country.taxName} rate on purchases`} value={purchRate ?? String(standard)} onChange={setPurchRate} suffix="%" step="0.5" />
        <div className="flex items-center gap-3 sm:col-start-2"><Switch id="ret-pincl" checked={purchIncl} onCheckedChange={setPurchIncl} /><Label htmlFor="ret-pincl" className="text-xs">Purchases figure includes {country.taxName}</Label></div>
      </div>
      <Actions onExample={() => { setCode('GB'); setSales('48000'); setSalesIncl(true); setSalesRate(null); setPurchases('18000'); setPurchIncl(true); setPurchRate(null); }} onSave={() => r && saveEntry({ code: country.code, sales, salesIncl: String(salesIncl), salesRate: salesRate ?? '', purchases, purchIncl: String(purchIncl), purchRate: purchRate ?? '' }, `${country.name}: output ${m(r.outputTax)} − input ${m(r.inputTax)} = ${m(r.payable)}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter sales or purchases.</p>}
      {r && (
        <Result>
          <Headline label={r.payable >= 0 ? `${country.taxName} to pay` : `${country.taxName} refund due`} value={m(Math.abs(r.payable))}>
            <strong className="text-foreground">{m(r.outputTax)}</strong> charged on sales − <strong className="text-foreground">{m(r.inputTax)}</strong> paid on purchases
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th> </Th><Th right>Net of tax</Th><Th right>Rate</Th><Th right>{country.taxName}</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                <tr><td className="px-3 py-2">Sales (output tax)</td><td className="text-right px-3 py-2">{m(r.netSales)}</td><td className="text-right px-3 py-2">{rateLabel(sRate)}</td><td className="text-right px-3 py-2 font-semibold">{m(r.outputTax)}</td></tr>
                <tr><td className="px-3 py-2">Purchases (input tax)</td><td className="text-right px-3 py-2">{m(r.netPurchases)}</td><td className="text-right px-3 py-2">{rateLabel(pRate)}</td><td className="text-right px-3 py-2 font-semibold text-red-500">−{m(r.inputTax)}</td></tr>
                <tr className="font-bold bg-muted/20"><td className="px-3 py-2">{r.payable >= 0 ? 'Net tax to pay' : 'Net refund'}</td><td className="text-right px-3 py-2">{m(r.valueAdded)}</td><td className="text-right px-3 py-2">{pct(r.effectiveRatePct)}</td><td className={`text-right px-3 py-2 ${r.payable >= 0 ? 'text-emerald-600' : 'text-blue-600'}`}>{m(r.payable)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Kpi label="Value added" value={m(r.valueAdded)} sub="net sales − net purchases" />
            <Kpi label="Tax as a share of net sales" value={pct(r.effectiveRatePct)} sub="what the tax really costs the business in cash flow" color="text-blue-600" />
            <Kpi label="Kept from customers' payments" value={m(r.netSales)} sub={`of ${m(r.netSales + r.outputTax)} collected`} color="text-emerald-600" />
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />A registered business charges tax on its sales (output tax), reclaims the tax on its business purchases (input tax) and pays over the difference, so the tax falls on the value it adds. This is an estimate for planning: flat-rate and cash-accounting schemes, partial exemption, imports and cross-border sales follow their own rules.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setCode(i.code ?? null); setSales(i.sales ?? ''); setSalesIncl(i.salesIncl !== 'false'); setSalesRate(i.salesRate ? i.salesRate : null); setPurchases(i.purchases ?? ''); setPurchIncl(i.purchIncl !== 'false'); setPurchRate(i.purchRate ? i.purchRate : null); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

export default function VatCalculator() {
  const urlMode = useSearchParam('mode');
  const urlCountry = findCountry(useSearchParam('country'));
  const [override, setMode] = useState<VatMode | null>(null);
  const mode: VatMode = override ?? (isVatMode(urlMode) ? urlMode : 'calc');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <ModeTabs modes={VAT_MODES} mode={mode} onChange={setMode} label="VAT calculator mode" icons={{ calc: Calculator, return: FileSpreadsheet }} />
        {mode === 'calc' && <CalcMode urlCountry={urlCountry} />}
        {mode === 'return' && <ReturnMode urlCountry={urlCountry} />}
      </div>
    </div>
  );
}

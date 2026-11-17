'use client';

import { useMemo, useState } from 'react';
import { motion } from '@/components/motion';
import { Boxes, Plus, Trash2, BookmarkPlus, Info } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { formatCurrency } from '@/lib/utils';
import {
  computeInventoryValuation,
  INVENTORY_DEFAULTS,
  isValuationMethod,
  METHODS,
  type MethodResult,
  type ValuationMethod,
} from '@/lib/pricing/inventory-valuation';

// Phase 17: the FIFO, LIFO and weighted-average pages fold into this one.
// ?method=fifo|lifo|average (from their redirects) puts that method first.

type LayerRow = { id: number; label: string; units: string; cost: string };
let nextId = 10;
const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const toRows = () => INVENTORY_DEFAULTS.layers.map((l, i) => ({ id: i + 1, label: l.label, units: String(l.units), cost: String(l.unitCost) }));

export default function InventoryValuationCalculator() {
  const urlMethod = useSearchParam('method');
  const [focusOverride, setFocus] = useState<ValuationMethod | null>(null);
  const focus: ValuationMethod = focusOverride ?? (isValuationMethod(urlMethod) ? urlMethod : 'fifo');

  const [rows, setRows] = useState<LayerRow[]>(toRows);
  const [unitsSold, setUnitsSold] = useState(String(INVENTORY_DEFAULTS.unitsSold));
  const [price, setPrice] = useState(String(INVENTORY_DEFAULTS.sellingPrice));
  const [taxRate, setTaxRate] = useState(String(INVENTORY_DEFAULTS.taxRatePct));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('inventory-valuation-calculator');

  const result = useMemo(
    () =>
      computeInventoryValuation({
        layers: rows.map((r) => ({ label: r.label || 'Layer', units: num(r.units), unitCost: num(r.cost) })),
        unitsSold: num(unitsSold),
        sellingPrice: num(price) > 0 ? num(price) : undefined,
        taxRatePct: num(taxRate) > 0 ? num(taxRate) : undefined,
      }),
    [rows, unitsSold, price, taxRate],
  );
  const valid = result.totalUnits > 0 && result.unitsSold > 0;
  const update = (id: number, field: keyof LayerRow, value: string) => setRows((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  const ordered: MethodResult[] = [result[focus], ...METHODS.filter((m) => m.value !== focus).map((m) => result[m.value])];
  const methodLabel = (m: ValuationMethod) => METHODS.find((x) => x.value === m)!;

  const tryExample = () => { setRows(toRows()); setUnitsSold('260'); setPrice('24'); setTaxRate('21'); };
  const save = () => valid && saveEntry({ rows: JSON.stringify(rows), unitsSold, price, taxRate }, `${result.unitsSold} of ${result.totalUnits} units → COGS FIFO ${formatCurrency(result.fifo.cogs)} · LIFO ${formatCurrency(result.lifo.cogs)} · Avg ${formatCurrency(result.average.cogs)}`);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Boxes className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
          <p>Enter beginning inventory and each purchase in date order, then the units sold in the period. The calculator values cost of goods sold and ending inventory under FIFO, LIFO and weighted average cost (periodic) side by side, and shows which layers each method consumes.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-muted-foreground"><th className="text-left py-1 pr-2 font-medium">Layer (oldest first)</th><th className="text-left py-1 px-2 font-medium">Units</th><th className="text-left py-1 px-2 font-medium">Unit cost</th><th className="text-right py-1 pl-2 font-medium">Layer cost</th><th /></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td className="py-1 pr-2"><Input aria-label={`Layer ${i + 1} label`} value={r.label} onChange={(e) => update(r.id, 'label', e.target.value)} className="text-sm min-w-[10rem]" placeholder={i === 0 ? 'Beginning inventory' : `Purchase ${i}`} /></td>
                    <td className="py-1 px-2"><Input aria-label={`Layer ${i + 1} units`} type="number" min="0" step="1" value={r.units} onChange={(e) => update(r.id, 'units', e.target.value)} className="text-sm w-24" /></td>
                    <td className="py-1 px-2"><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Layer ${i + 1} unit cost`} type="number" min="0" step="0.01" value={r.cost} onChange={(e) => update(r.id, 'cost', e.target.value)} className="text-sm w-28 pl-6" /></div></td>
                    <td className="py-1 pl-2 text-right whitespace-nowrap">{formatCurrency(num(r.units) * num(r.cost))}</td>
                    <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove layer" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== r.id) : p))}><Trash2 className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button type="button" variant="outline" size="sm" disabled={rows.length >= 8} onClick={() => setRows((p) => [...p, { id: nextId++, label: `Purchase ${p.length}`, units: '', cost: '' }])}><Plus className="h-4 w-4 mr-1" /> Add purchase</Button>
            <span className="text-xs text-muted-foreground">{result.totalUnits.toLocaleString('en-US')} units available · {formatCurrency(result.totalCost)} cost of goods available · weighted average {formatCurrency(result.weightedAverageCost)}/unit</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="iv-sold" className="text-xs text-muted-foreground">Units sold in the period</Label>
            <Input id="iv-sold" type="number" min="0" step="1" value={unitsSold} onChange={(e) => setUnitsSold(e.target.value)} className="text-sm" />
            {result.shortfall > 0 && <p className="text-xs text-amber-600">Only {result.totalUnits} units were available; {result.shortfall} of the sale cannot be costed. Add the missing purchase.</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="iv-price" className="text-xs text-muted-foreground">Selling price per unit (optional)</Label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><Input id="iv-price" type="number" min="0" step="0.5" value={price} onChange={(e) => setPrice(e.target.value)} className="text-sm pl-7" /></div>
            <p className="text-xs text-muted-foreground">Adds gross profit and margin by method</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="iv-tax" className="text-xs text-muted-foreground">Income tax rate (optional)</Label>
            <div className="relative"><Input id="iv-tax" type="number" min="0" max="60" step="0.5" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="text-sm pr-8" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span></div>
            <p className="text-xs text-muted-foreground">Shows the cash-tax difference between methods</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={tryExample} />
          <Button onClick={save} disabled={!valid} className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25" size="lg">
            <BookmarkPlus className="h-4 w-4 mr-2" /> Save Calculation to History
          </Button>
        </div>
      </div>

      {valid && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="result-display px-4 sm:px-6" aria-live="polite">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-5">
            <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Method to show first">
              {METHODS.map((m) => (
                <button key={m.value} type="button" role="tab" aria-selected={focus === m.value} onClick={() => setFocus(m.value)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${focus === m.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
                  <span className="hidden sm:inline">{m.label}</span><span className="sm:hidden">{m.short}</span>
                </button>
              ))}
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Cost of goods sold — {methodLabel(focus).label}</p>
              <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(result[focus].cogs)}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                ending inventory <strong className="text-foreground">{formatCurrency(result[focus].endingInventory)}</strong> ({result.unitsRemaining.toLocaleString('en-US')} units) · <strong className="text-foreground">{formatCurrency(result[focus].costPerUnitSold)}</strong> per unit sold
                {result[focus].grossProfit !== null && <> · gross profit <strong className="text-foreground">{formatCurrency(result[focus].grossProfit!)}</strong> ({pct(result[focus].grossMargin!)})</>}
              </p>
            </div>

            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Method</th><th className="text-right px-4 py-2 font-medium">COGS</th><th className="text-right px-4 py-2 font-medium">Ending inventory</th><th className="text-right px-4 py-2 font-medium">Cost / unit sold</th>{result.fifo.grossProfit !== null && <th className="text-right px-4 py-2 font-medium">Gross profit</th>}{result.fifo.incomeTax !== null && <th className="text-right px-4 py-2 font-medium">Income tax</th>}</tr></thead>
                <tbody className="divide-y divide-border/30">
                  {ordered.map((m) => (
                    <tr key={m.method} className={m.method === focus ? 'bg-emerald-500/5 font-medium' : ''}>
                      <td className="px-4 py-2">{methodLabel(m.method).label}</td>
                      <td className="text-right px-4 py-2">{formatCurrency(m.cogs)}</td>
                      <td className="text-right px-4 py-2">{formatCurrency(m.endingInventory)}</td>
                      <td className="text-right px-4 py-2 text-muted-foreground">{formatCurrency(m.costPerUnitSold)}</td>
                      {m.grossProfit !== null && <td className="text-right px-4 py-2 text-emerald-600">{formatCurrency(m.grossProfit)} <span className="text-xs text-muted-foreground">({pct(m.grossMargin!)})</span></td>}
                      {m.incomeTax !== null && <td className="text-right px-4 py-2 text-amber-600">{formatCurrency(m.incomeTax)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-background border border-border/50 p-3 text-center"><p className="text-xs text-muted-foreground mb-1">FIFO − LIFO COGS</p><p className="text-base font-bold">{formatCurrency(result.fifo.cogs - result.lifo.cogs)}</p></div>
              <div className="rounded-xl bg-background border border-border/50 p-3 text-center"><p className="text-xs text-muted-foreground mb-1">LIFO reserve (FIFO − LIFO ending)</p><p className="text-base font-bold">{formatCurrency(result.lifoReserve)}</p></div>
              <div className="rounded-xl bg-background border border-border/50 p-3 text-center"><p className="text-xs text-muted-foreground mb-1">Unit costs are</p><p className="text-base font-bold capitalize">{result.costTrend}</p></div>
              <div className="rounded-xl bg-background border border-border/50 p-3 text-center"><p className="text-xs text-muted-foreground mb-1">LIFO cash-tax saving vs FIFO</p><p className="text-base font-bold text-emerald-600">{result.lifoTaxSaving === null ? '— add a tax rate' : formatCurrency(result.lifoTaxSaving)}</p></div>
            </div>

            <details className="rounded-xl bg-background border border-border/50 p-4 text-sm" open>
              <summary className="cursor-pointer font-semibold text-xs uppercase tracking-wider text-muted-foreground">Layer by layer — {methodLabel(focus).label}</summary>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border/50 text-xs text-muted-foreground"><th className="text-left py-1.5 pr-2 font-medium">Layer</th><th className="text-right py-1.5 px-2 font-medium">Units</th><th className="text-right py-1.5 px-2 font-medium">Unit cost</th><th className="text-right py-1.5 px-2 font-medium">Sold</th><th className="text-right py-1.5 px-2 font-medium">→ COGS</th><th className="text-right py-1.5 px-2 font-medium">Left</th><th className="text-right py-1.5 pl-2 font-medium">→ Ending</th></tr></thead>
                  <tbody className="divide-y divide-border/30">
                    {result[focus].layers.map((l, i) => (
                      <tr key={i} className={l.sold > 0 ? '' : 'text-muted-foreground'}>
                        <td className="py-1.5 pr-2">{l.label}</td><td className="text-right py-1.5 px-2">{l.units}</td><td className="text-right py-1.5 px-2">{formatCurrency(focus === 'average' ? result.weightedAverageCost : l.unitCost)}</td>
                        <td className="text-right py-1.5 px-2">{Number.isInteger(l.sold) ? l.sold : l.sold.toFixed(2)}</td><td className="text-right py-1.5 px-2 text-red-500">{formatCurrency(l.cogs)}</td>
                        <td className="text-right py-1.5 px-2">{Number.isInteger(l.remaining) ? l.remaining : l.remaining.toFixed(2)}</td><td className="text-right py-1.5 pl-2 text-emerald-600">{formatCurrency(l.ending)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {focus === 'average' && <p className="text-xs text-muted-foreground mt-2">Weighted average (periodic) costs every unit at {formatCurrency(result.weightedAverageCost)}, so each layer is drawn down in proportion; a perpetual moving average would recompute after every purchase.</p>}
            </details>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>With {result.costTrend} costs, {result.costTrend === 'rising' ? 'LIFO reports the highest COGS and lowest profit, FIFO the lowest COGS and the highest ending inventory' : result.costTrend === 'falling' ? 'FIFO reports the highest COGS and LIFO the highest ending inventory' : 'all three methods agree'}. LIFO is allowed for US tax (IRS Form 970 election, conformity rule) but not under IFRS. Specific identification, retail method and lower-of-cost-or-market write-downs are not modeled.</p>
            </div>
          </div>
        </motion.div>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as LayerRow[]; if (Array.isArray(p)) setRows(p); } catch {} setUnitsSold(i.unitsSold ?? ''); setPrice(i.price ?? ''); setTaxRate(i.taxRate ?? ''); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

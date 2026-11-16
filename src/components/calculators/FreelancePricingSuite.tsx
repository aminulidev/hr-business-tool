'use client';

import { useMemo, useState } from 'react';
import { Building2, CalendarRange, Clock, FileText, Info, Plus, Trash2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Actions, Field, Headline, int, Kpi, ModeTabs, Note, num, pct, Result, Th, usd } from './suite-ui';
import {
  AGENCY_DEFAULTS,
  CLIENTS_DEFAULTS,
  computeAgency,
  computeClients,
  computeProject,
  computeRate,
  computeRetainer,
  FREELANCE_MODES,
  isFreelanceMode,
  PROJECT_DEFAULTS,
  RATE_DEFAULTS,
  RETAINER_DEFAULTS,
  type FreelanceMode,
} from '@/lib/pricing/freelance-pricing';

// Phase 17: project-pricing, proposal-price, quote, estimate, consultant-fee,
// time-value, retainer, profit-per-client, client-profit, monthly-revenue and
// agency-margin pages 301 here with ?mode=project|rate|retainer|clients|agency.

let nextId = 100;
const s = (n: number) => String(n);
const Row = ({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: string }) => (
  <tr className={strong ? 'font-bold bg-muted/20' : ''}><td className="px-3 py-2">{label}</td><td className={`text-right px-3 py-2 ${tone ?? ''}`}>{value}</td></tr>
);

// ───────────────────────── project quote

type LineState = { id: number; name: string; hours: string; rate: string };
const toLines = () => PROJECT_DEFAULTS.lines.map((l, i) => ({ id: i + 1, name: l.name, hours: s(l.hours), rate: s(l.rate) }));

function ProjectMode() {
  const d = PROJECT_DEFAULTS;
  const [rows, setRows] = useState<LineState[]>(toLines);
  const [expenses, setExpenses] = useState(s(d.expenses));
  const [markup, setMarkup] = useState(s(d.expenseMarkupPct));
  const [contingency, setContingency] = useState(s(d.contingencyPct));
  const [discount, setDiscount] = useState(s(d.discountPct));
  const [tax, setTax] = useState(s(d.taxPct));
  const [deposit, setDeposit] = useState(s(d.depositPct));
  const [overrun, setOverrun] = useState(s(d.overrunPct));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('project-pricing-calculator');
  const r = useMemo(() => computeProject({ lines: rows.map((x) => ({ name: x.name || 'Task', hours: num(x.hours), rate: num(x.rate) })), expenses: num(expenses), expenseMarkupPct: num(markup), contingencyPct: num(contingency), discountPct: num(discount), taxPct: num(tax), depositPct: num(deposit), overrunPct: num(overrun) }), [rows, expenses, markup, contingency, discount, tax, deposit, overrun]);
  const update = (id: number, patch: Partial<LineState>) => setRows((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <p className="text-xs font-semibold">Scope: tasks, hours and rate</p>
        {rows.map((row, i) => (
          <div key={row.id} className="grid grid-cols-[1fr_5.5rem_6.5rem_2.5rem] items-center gap-2">
            <Input aria-label={`Task ${i + 1}`} value={row.name} onChange={(e) => update(row.id, { name: e.target.value })} className="text-sm" placeholder="Task or phase" />
            <div className="relative"><Input aria-label={`Task ${i + 1} hours`} type="number" min="0" step="1" value={row.hours} onChange={(e) => update(row.id, { hours: e.target.value })} className="text-sm pr-6" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">h</span></div>
            <div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Task ${i + 1} rate`} type="number" min="0" step="5" value={row.rate} onChange={(e) => update(row.id, { rate: e.target.value })} className="text-sm pl-6 pr-8" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">/h</span></div>
            <Button type="button" variant="ghost" size="icon" aria-label="Remove task" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" disabled={rows.length >= 15} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', hours: '', rate: rows[rows.length - 1]?.rate ?? '' }])}><Plus className="h-4 w-4 mr-1" /> Add task</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="pj-exp" label="Pass-through expenses" value={expenses} onChange={setExpenses} prefix="$" step="100" help="Stock, licenses, subcontractors" />
        <Field id="pj-mk" label="Markup on expenses" value={markup} onChange={setMarkup} suffix="%" step="5" />
        <Field id="pj-cont" label="Contingency on labor" value={contingency} onChange={setContingency} suffix="%" step="5" help="For scope you cannot see yet" />
        <Field id="pj-disc" label="Discount" value={discount} onChange={setDiscount} suffix="%" step="1" />
        <Field id="pj-tax" label="Sales tax (if taxable)" value={tax} onChange={setTax} suffix="%" step="0.25" />
        <Field id="pj-dep" label="Deposit up front" value={deposit} onChange={setDeposit} suffix="%" step="5" />
        <Field id="pj-over" label="What if hours overrun by" value={overrun} onChange={setOverrun} suffix="%" step="5" />
      </div>
      <Actions onExample={() => { setRows(toLines()); setExpenses('1800'); setMarkup('10'); setContingency('15'); setDiscount('5'); setTax('0'); setDeposit('40'); setOverrun('20'); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), expenses, markup, contingency, discount, tax, deposit, overrun }, `Quote ${usd(r.total)} · ${int(r.hours)} h · ${usd(r.effectiveRate, 2)}/h effective`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Add at least one task with hours and a rate.</p>}
      {r && (
        <Result>
          <Headline label={num(tax) > 0 ? 'Quote total including tax' : 'Quote total'} value={usd(r.total)}>
            <strong className="text-foreground">{int(r.hours)}</strong> hours · deposit <strong className="text-foreground">{usd(r.deposit)}</strong>, balance {usd(r.balance)} · effective rate <strong className="text-foreground">{usd(r.effectiveRate, 2)}</strong> an hour against a blended {usd(r.blendedRate, 2)}
          </Headline>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Task</Th><Th right>Hours</Th><Th right>Amount</Th></tr></thead>
                <tbody className="divide-y divide-border/30">
                  {r.lines.map((l, i) => <tr key={i}><td className="px-3 py-2">{l.name}</td><td className="text-right px-3 py-2 text-muted-foreground">{l.hours} × {usd(l.rate)}</td><td className="text-right px-3 py-2 font-semibold">{usd(l.amount)}</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm"><tbody className="divide-y divide-border/30">
                <Row label="Labor" value={usd(r.labor)} />
                {r.contingency > 0 && <Row label={`Contingency (${num(contingency)}%)`} value={`+${usd(r.contingency)}`} />}
                {r.expensesBilled > 0 && <Row label={`Expenses${num(markup) > 0 ? ` (+${num(markup)}% markup)` : ''}`} value={`+${usd(r.expensesBilled)}`} />}
                {r.discount > 0 && <Row label={`Discount (${num(discount)}%)`} value={`−${usd(r.discount)}`} tone="text-red-500" />}
                <Row label="Price" value={usd(r.price)} strong />
                {r.tax > 0 && <Row label={`Sales tax (${num(tax)}%)`} value={`+${usd(r.tax)}`} />}
                {r.tax > 0 && <Row label="Total" value={usd(r.total)} strong tone="text-emerald-600" />}
              </tbody></table>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Effective hourly rate" value={usd(r.effectiveRate, 2)} sub="price less expense cost ÷ hours" color="text-emerald-600" />
            <Kpi label={`If hours run ${num(overrun)}% over`} value={usd(r.effectiveRateAtOverrun, 2)} sub={`${r.overrunHours} h on a fixed price`} color={r.effectiveRateAtOverrun < r.blendedRate ? 'text-red-500' : 'text-amber-600'} />
            <Kpi label="Overrun cushion" value={r.overrunCushionPct === null ? 'none' : pct(r.overrunCushionPct)} sub="before you earn less than your rate card" color="text-blue-600" />
            <Kpi label="Deposit" value={usd(r.deposit)} sub={`${num(deposit)}% before work starts`} />
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Price = labor + contingency + expenses with markup − discount. On a fixed price the contingency is the only thing standing between an estimate that runs over and a pay cut: the cushion shows how far hours can overrun before your effective rate drops below the rate card. Most services are not subject to sales tax, but some states tax specific services; check before adding it.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as LineState[]; if (Array.isArray(p)) setRows(p); } catch {} setExpenses(i.expenses ?? '0'); setMarkup(i.markup ?? '0'); setContingency(i.contingency ?? '0'); setDiscount(i.discount ?? '0'); setTax(i.tax ?? '0'); setDeposit(i.deposit ?? '0'); setOverrun(i.overrun ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── day rate card

function RateMode() {
  const d = RATE_DEFAULTS;
  const [income, setIncome] = useState(s(d.targetIncome));
  const [expenses, setExpenses] = useState(s(d.businessExpenses));
  const [margin, setMargin] = useState(s(d.profitMarginPct));
  const [weeksOff, setWeeksOff] = useState(s(d.weeksOff));
  const [days, setDays] = useState(s(d.billableDaysPerWeek));
  const [hours, setHours] = useState(s(d.billableHoursPerDay));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('consultant-fee-calculator');
  const r = useMemo(() => computeRate({ targetIncome: num(income), businessExpenses: num(expenses), profitMarginPct: num(margin), weeksOff: num(weeksOff), billableDaysPerWeek: num(days), billableHoursPerDay: num(hours) }), [income, expenses, margin, weeksOff, days, hours]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="rt-inc" label="Income you want to pay yourself" value={income} onChange={setIncome} prefix="$" step="5000" help="Before income tax" />
        <Field id="rt-exp" label="Annual business expenses" value={expenses} onChange={setExpenses} prefix="$" step="1000" help="Software, insurance, health cover, self-employment tax" />
        <Field id="rt-mar" label="Profit margin to keep in the business" value={margin} onChange={setMargin} suffix="%" step="1" />
        <Field id="rt-off" label="Weeks off a year" value={weeksOff} onChange={setWeeksOff} suffix="weeks" step="1" help="Holidays, vacation, sick time" />
        <Field id="rt-days" label="Billable days a week" value={days} onChange={setDays} suffix="days" step="0.5" help="The rest is sales and admin" />
        <Field id="rt-hrs" label="Billable hours on those days" value={hours} onChange={setHours} suffix="h" step="0.5" />
      </div>
      <Actions onExample={() => { setIncome('120000'); setExpenses('18000'); setMargin('15'); setWeeksOff('6'); setDays('4'); setHours('6.5'); }} onSave={() => r && saveEntry({ income, expenses, margin, weeksOff, days, hours }, `${usd(r.dayRate)} a day · ${usd(r.hourly, 2)} an hour · ${int(r.billableDays)} billable days`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter a target income and some billable time.</p>}
      {r && (
        <Result>
          <Headline label="Day rate" value={usd(r.dayRate)}>
            <strong className="text-foreground">{usd(r.hourly, 2)}</strong> an hour · <strong className="text-foreground">{usd(r.revenueNeeded)}</strong> of revenue needed from <strong className="text-foreground">{int(r.billableDays)}</strong> billable days ({int(r.billableHours)} hours, {pct(r.utilizationPct, 0)} of a 2,080-hour year)
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Kpi label="Hourly" value={usd(r.hourly, 2)} color="text-emerald-600" />
            <Kpi label="Half day" value={usd(r.halfDay)} />
            <Kpi label="Day" value={usd(r.dayRate)} color="text-emerald-600" />
            <Kpi label="Week" value={usd(r.weekly)} sub={`${num(days)} billable days`} />
            <Kpi label="Average month" value={usd(r.monthlyAverage)} sub="revenue ÷ 12" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Kpi label="Same income as an employee" value={`${usd(r.employeeHourly, 2)}/h`} sub={`${usd(num(income))} ÷ 2,080 hours`} />
            <Kpi label="Your rate vs. that wage" value={`${r.multipleOfWage}×`} sub="covers expenses, margin and unbilled time" color="text-blue-600" />
            <Kpi label="A minute of your time" value={usd(r.perMinute, 2)} sub={r.hourlyWithExtraDay !== null ? `${usd(r.hourlyWithExtraDay, 2)}/h if you billed one more day a week` : 'at the hourly rate'} color="text-amber-600" />
          </div>
          <Note><Clock className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Revenue needed = (income + expenses) ÷ (1 − margin); rate = revenue ÷ billable hours. The rate is a multiple of the equivalent wage because a self-employed consultant sells only part of the year and pays their own overheads, including both halves of Social Security and Medicare. For a rate that works back from take-home pay after tax, use the Freelance Hourly Rate calculator.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setIncome(i.income ?? ''); setExpenses(i.expenses ?? '0'); setMargin(i.margin ?? '0'); setWeeksOff(i.weeksOff ?? '0'); setDays(i.days ?? '5'); setHours(i.hours ?? '8'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── retainer

function RetainerMode() {
  const d = RETAINER_DEFAULTS;
  const [rate, setRate] = useState(s(d.hourlyRate));
  const [included, setIncluded] = useState(s(d.includedHours));
  const [discount, setDiscount] = useState(s(d.discountPct));
  const [expected, setExpected] = useState(s(d.expectedHours));
  const [overage, setOverage] = useState(s(d.overageRate));
  const [term, setTerm] = useState(s(d.termMonths));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('retainer-calculator');
  const r = useMemo(() => computeRetainer({ hourlyRate: num(rate), includedHours: num(included), discountPct: num(discount), expectedHours: num(expected), overageRate: num(overage), termMonths: num(term) }), [rate, included, discount, expected, overage, term]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="re-rate" label="Standard hourly rate" value={rate} onChange={setRate} prefix="$" step="5" />
        <Field id="re-inc" label="Hours included per month" value={included} onChange={setIncluded} suffix="h" step="1" />
        <Field id="re-disc" label="Retainer discount" value={discount} onChange={setDiscount} suffix="%" step="1" help="For the commitment; 0–15% is usual" />
        <Field id="re-exp" label="Hours you expect them to use" value={expected} onChange={setExpected} suffix="h" step="1" />
        <Field id="re-over" label="Rate for hours beyond the allowance" value={overage} onChange={setOverage} prefix="$" step="5" help="0 = standard rate" />
        <Field id="re-term" label="Term" value={term} onChange={setTerm} suffix="months" step="1" />
      </div>
      <Actions onExample={() => { setRate('125'); setIncluded('30'); setDiscount('10'); setExpected('34'); setOverage('125'); setTerm('12'); }} onSave={() => r && saveEntry({ rate, included, discount, expected, overage, term }, `Retainer ${usd(r.monthlyFee)}/mo · ${usd(r.effectiveRate, 2)}/h at ${num(expected) || num(included)} h`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter an hourly rate and included hours.</p>}
      {r && (
        <Result>
          <Headline label="Monthly retainer fee" value={usd(r.monthlyFee)}>
            <strong className="text-foreground">{num(included)}</strong> hours at <strong className="text-foreground">{usd(r.includedRate, 2)}</strong> ({usd(r.discountAmount)} off {usd(r.standardValue)}) · worth <strong className="text-foreground">{usd(r.termValue)}</strong> over {num(term)} months
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Billed at expected usage" value={usd(r.monthlyBilled)} sub={r.overageHours > 0 ? `incl. ${r.overageHours} h overage = ${usd(r.overageBilling)}` : r.unusedHours > 0 ? `${r.unusedHours} h unused` : 'allowance fully used'} />
            <Kpi label="Effective rate you earn" value={usd(r.effectiveRate, 2)} sub="billed ÷ hours worked" color={r.effectiveRate >= num(rate) ? 'text-emerald-600' : 'text-amber-600'} />
            <Kpi label="Break-even usage" value={`${r.breakEvenHours} h`} sub="below this you earn more than hourly billing" color="text-blue-600" />
            <Kpi label="Annual value" value={usd(r.annualValue)} sub="fee × 12, before overage" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Usage</Th><Th right>Hours worked</Th><Th right>Billed</Th><Th right>Effective rate</Th><Th right>vs. standard</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.scenarios.map((x) => <tr key={x.usagePct}><td className="px-3 py-2">{x.usagePct}% of allowance</td><td className="text-right px-3 py-2">{x.hours}</td><td className="text-right px-3 py-2">{usd(x.billed)}</td><td className="text-right px-3 py-2 font-semibold">{usd(x.effectiveRate, 2)}</td><td className={`text-right px-3 py-2 ${x.effectiveRate >= num(rate) ? 'text-emerald-600' : 'text-red-500'}`}>{x.effectiveRate >= num(rate) ? '+' : '−'}{pct(Math.abs((x.effectiveRate / num(rate) - 1) * 100), 0)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <Note><CalendarRange className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Fee = hours × rate × (1 − discount). Unused hours raise your effective rate; overage is billed on top. A use-it-or-lose-it allowance with overage at the standard rate protects the discount; rollover of unused hours hands it back to the client, so cap it if you offer it.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setRate(i.rate ?? ''); setIncluded(i.included ?? ''); setDiscount(i.discount ?? '0'); setExpected(i.expected ?? ''); setOverage(i.overage ?? '0'); setTerm(i.term ?? '12'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── client profitability

type ClientState = { id: number; name: string; revenue: string; recurring: boolean; hours: string; direct: string };
const toClients = () => CLIENTS_DEFAULTS.clients.map((c, i) => ({ id: i + 1, name: c.name, revenue: s(c.monthlyRevenue), recurring: c.recurring, hours: s(c.hours), direct: s(c.directCosts) }));

function ClientsMode() {
  const [rows, setRows] = useState<ClientState[]>(toClients);
  const [cost, setCost] = useState(s(CLIENTS_DEFAULTS.costPerHour));
  const [overhead, setOverhead] = useState(s(CLIENTS_DEFAULTS.overheadMonthly));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('profit-per-client-calculator');
  const r = useMemo(() => computeClients({ clients: rows.map((x) => ({ name: x.name || 'Client', monthlyRevenue: num(x.revenue), recurring: x.recurring, hours: num(x.hours), directCosts: num(x.direct) })), costPerHour: num(cost), overheadMonthly: num(overhead) }), [rows, cost, overhead]);
  const update = (id: number, patch: Partial<ClientState>) => setRows((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <p className="text-xs font-semibold">This month, by client</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground"><th className="text-left py-1 pr-2 font-medium">Client</th><th className="text-left py-1 px-2 font-medium">Revenue</th><th className="text-left py-1 px-2 font-medium">Hours</th><th className="text-left py-1 px-2 font-medium">Direct costs</th><th className="text-left py-1 px-2 font-medium">Recurring</th><th /></tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td className="py-1 pr-2"><Input aria-label={`Client ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, { name: e.target.value })} className="text-sm min-w-[9rem]" placeholder="Client" /></td>
                  <td className="py-1 px-2"><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Client ${i + 1} revenue`} type="number" min="0" step="100" value={row.revenue} onChange={(e) => update(row.id, { revenue: e.target.value })} className="text-sm w-28 pl-6" /></div></td>
                  <td className="py-1 px-2"><Input aria-label={`Client ${i + 1} hours`} type="number" min="0" step="1" value={row.hours} onChange={(e) => update(row.id, { hours: e.target.value })} className="text-sm w-20" /></td>
                  <td className="py-1 px-2"><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Client ${i + 1} direct costs`} type="number" min="0" step="50" value={row.direct} onChange={(e) => update(row.id, { direct: e.target.value })} className="text-sm w-24 pl-6" /></div></td>
                  <td className="py-1 px-2"><input aria-label={`Client ${i + 1} recurring`} type="checkbox" checked={row.recurring} onChange={(e) => update(row.id, { recurring: e.target.checked })} className="h-4 w-4 accent-emerald-600" /></td>
                  <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove client" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={rows.length >= 15} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', revenue: '', recurring: false, hours: '', direct: '0' }])}><Plus className="h-4 w-4 mr-1" /> Add client</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field id="cl-cost" label="Cost of an hour of delivery" value={cost} onChange={setCost} prefix="$" step="5" help="Your own target pay per hour, or blended staff cost" />
        <Field id="cl-oh" label="Monthly overhead" value={overhead} onChange={setOverhead} prefix="$" step="100" help="Software, insurance, admin time, rent" />
      </div>
      <Actions onExample={() => { setRows(toClients()); setCost('60'); setOverhead('1500'); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), cost, overhead }, `${usd(r.revenue)}/mo · net ${usd(r.netProfit)} (${pct(r.netMarginPct, 0)}) · ${pct(r.recurringPct, 0)} recurring`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Add at least one client with revenue.</p>}
      {r && (
        <Result>
          <Headline label="Monthly revenue" value={usd(r.revenue)}>
            <strong className="text-foreground">{usd(r.annualRevenue)}</strong> a year at this pace · <strong className="text-foreground">{pct(r.recurringPct, 0)}</strong> recurring ({usd(r.recurringRevenue)}) · net profit <strong className="text-foreground">{usd(r.netProfit)}</strong> ({pct(r.netMarginPct, 0)}) after {usd(r.overhead)} overhead
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Client</Th><Th right>Revenue</Th><Th right>Hours</Th><Th right>Effective rate</Th><Th right>Profit</Th><Th right>Margin</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.clients.map((c, i) => <tr key={i} className={c.name === r.best ? 'bg-emerald-500/5' : r.belowCost.includes(c.name) ? 'bg-red-500/5' : ''}><td className="px-3 py-2 font-medium">{c.name}{c.name === r.best && <span className="ml-2 text-[10px] uppercase text-emerald-600">best rate</span>}{c.name === r.worst && <span className="ml-2 text-[10px] uppercase text-amber-600">lowest rate</span>}</td><td className="text-right px-3 py-2">{usd(c.monthlyRevenue)} <span className="text-xs text-muted-foreground">({pct(c.revenueSharePct, 0)})</span></td><td className="text-right px-3 py-2">{c.hours} <span className="text-xs text-muted-foreground">({pct(c.hoursSharePct, 0)})</span></td><td className={`text-right px-3 py-2 font-semibold ${r.belowCost.includes(c.name) ? 'text-red-500' : ''}`}>{usd(c.effectiveRate, 2)}</td><td className={`text-right px-3 py-2 ${c.profit < 0 ? 'text-red-500' : ''}`}>{c.profit < 0 ? '−' : ''}{usd(Math.abs(c.profit))}</td><td className="text-right px-3 py-2">{pct(c.marginPct, 0)}</td></tr>)}
                <tr className="font-bold bg-muted/20"><td className="px-3 py-2">All clients</td><td className="text-right px-3 py-2">{usd(r.revenue)}</td><td className="text-right px-3 py-2">{r.hours}</td><td className="text-right px-3 py-2">{usd(r.blendedRate, 2)}</td><td className="text-right px-3 py-2">{usd(r.contribution)}</td><td className="text-right px-3 py-2">{pct((r.contribution / r.revenue) * 100, 0)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Largest client" value={pct(r.largestSharePct, 0)} sub={`${r.largestClient}${r.largestSharePct > 40 ? ' — high concentration' : ''}`} color={r.largestSharePct > 40 ? 'text-amber-600' : 'text-foreground'} />
            <Kpi label="Recurring revenue" value={usd(r.recurringRevenue)} sub={`${usd(r.recurringRevenue * 12)} a year you can plan on`} color="text-emerald-600" />
            <Kpi label="Blended effective rate" value={usd(r.blendedRate, 2)} sub={`cost of an hour ${usd(num(cost))}`} color="text-blue-600" />
            <Kpi label="Below cost" value={r.belowCost.length === 0 ? 'none' : `${r.belowCost.length}`} sub={r.belowCost.length ? r.belowCost.join(', ') : 'every client covers its hours'} color={r.belowCost.length ? 'text-red-500' : 'text-emerald-600'} />
          </div>
          <Note><Users className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Profit per client = revenue − hours × cost of an hour − direct costs. Effective rate = (revenue − direct costs) ÷ hours, which is the fair way to compare a retainer, a fixed-price project and hourly work. A client above roughly 40% of revenue is a concentration risk however profitable it is.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as ClientState[]; if (Array.isArray(p)) setRows(p); } catch {} setCost(i.cost ?? '0'); setOverhead(i.overhead ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── agency margin

function AgencyMode() {
  const d = AGENCY_DEFAULTS;
  const [bill, setBill] = useState(s(d.billRate));
  const [cost, setCost] = useState(s(d.costRate));
  const [hours, setHours] = useState(s(d.billableHours));
  const [util, setUtil] = useState(s(d.utilizationPct));
  const [overhead, setOverhead] = useState(s(d.overheadPct));
  const [target, setTarget] = useState(s(d.targetMarginPct));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('agency-margin-calculator');
  const r = useMemo(() => computeAgency({ billRate: num(bill), costRate: num(cost), billableHours: num(hours), utilizationPct: num(util) || 100, overheadPct: num(overhead), targetMarginPct: num(target) }), [bill, cost, hours, util, overhead, target]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="ag-bill" label="Rate billed to the client" value={bill} onChange={setBill} prefix="$" suffix="/h" step="5" />
        <Field id="ag-cost" label="What you pay per hour" value={cost} onChange={setCost} prefix="$" suffix="/h" step="5" help="Contractor rate or loaded employee cost" />
        <Field id="ag-hours" label="Hours billed in the month" value={hours} onChange={setHours} suffix="h" step="10" />
        <Field id="ag-util" label="Utilization" value={util} onChange={setUtil} suffix="%" step="5" help="Paid hours that are billed; 100 for contractors paid per billed hour" />
        <Field id="ag-oh" label="Overhead" value={overhead} onChange={setOverhead} suffix="% rev" step="1" help="Account management, sales, tools, rent" />
        <Field id="ag-target" label="Target gross margin" value={target} onChange={setTarget} suffix="%" step="5" />
      </div>
      <Actions onExample={() => { setBill('150'); setCost('70'); setHours('320'); setUtil('80'); setOverhead('20'); setTarget('50'); }} onSave={() => r && saveEntry({ bill, cost, hours, util, overhead, target }, `Gross margin ${pct(r.grossMarginPct)} · net ${pct(r.netMarginPct)} · ${r.multiplier}× multiplier`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter the bill rate and what you pay per hour.</p>}
      {r && (
        <Result>
          <Headline label="Gross margin on delivery" value={pct(r.grossMarginPct)}>
            <strong className="text-foreground">{usd(r.marginPerHour, 2)}</strong> an hour on a billed hour that really costs <strong className="text-foreground">{usd(r.costPerBilledHour, 2)}</strong> · markup <strong className="text-foreground">{pct(r.markupPct, 0)}</strong> · bill rate is <strong className="text-foreground">{r.multiplier}×</strong> pay rate
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm"><tbody className="divide-y divide-border/30">
              <Row label={`Revenue (${int(num(hours))} h × ${usd(num(bill))})`} value={usd(r.revenue)} />
              <Row label={`Delivery cost (${usd(r.costPerBilledHour, 2)} per billed hour)`} value={`−${usd(r.deliveryCost)}`} tone="text-red-500" />
              <Row label={`Gross profit (${pct(r.grossMarginPct)})`} value={usd(r.grossProfit)} strong />
              <Row label={`Overhead (${num(overhead)}% of revenue)`} value={`−${usd(r.overhead)}`} tone="text-red-500" />
              <Row label={`Net profit (${pct(r.netMarginPct)})`} value={`${r.netProfit < 0 ? '−' : ''}${usd(Math.abs(r.netProfit))}`} strong tone={r.netProfit < 0 ? 'text-red-500' : 'text-emerald-600'} />
            </tbody></table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Kpi label={`Bill rate for a ${num(target)}% margin`} value={r.requiredBillRate === null ? '—' : usd(r.requiredBillRate, 2)} sub={r.requiredBillRate !== null ? `${r.requiredBillRate > num(bill) ? '+' : '−'}${usd(Math.abs(r.requiredBillRate - num(bill)), 2)} vs today` : undefined} color="text-blue-600" />
            <Kpi label="Or utilization of" value={r.requiredUtilizationPct === null ? 'out of reach' : pct(r.requiredUtilizationPct)} sub="at the current bill rate" color={r.requiredUtilizationPct === null ? 'text-red-500' : 'text-emerald-600'} />
            <Kpi label="Net margin after overhead" value={pct(r.netMarginPct)} sub={`${usd(r.netProfit)} a month`} color={r.netMarginPct >= 15 ? 'text-emerald-600' : 'text-amber-600'} />
          </div>
          <Note><Building2 className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Gross margin = (bill rate − cost of a billed hour) ÷ bill rate, where the cost of a billed hour is pay ÷ utilization: an employee paid for 40 hours and billed for 32 costs 25% more per billed hour than their pay rate. Margin and markup are different numbers on the same spread: a 100% markup is a 50% margin.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setBill(i.bill ?? ''); setCost(i.cost ?? ''); setHours(i.hours ?? '0'); setUtil(i.util ?? '100'); setOverhead(i.overhead ?? '0'); setTarget(i.target ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── page

const ICONS = { project: FileText, rate: Clock, retainer: CalendarRange, clients: Users, agency: Building2 };

export default function FreelancePricingSuite() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<FreelanceMode | null>(null);
  const mode: FreelanceMode = override ?? (isFreelanceMode(urlMode) ? urlMode : 'project');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <ModeTabs modes={FREELANCE_MODES} mode={mode} onChange={setMode} label="Freelance pricing mode" icons={ICONS} />
        {mode === 'project' && <ProjectMode />}
        {mode === 'rate' && <RateMode />}
        {mode === 'retainer' && <RetainerMode />}
        {mode === 'clients' && <ClientsMode />}
        {mode === 'agency' && <AgencyMode />}
      </div>
    </div>
  );
}

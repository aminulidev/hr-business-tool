'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Percent, Wallet, Plus, Trash2, Info, BookmarkPlus } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { formatCurrency } from '@/lib/utils';
import { TAX_YEAR, type PaycheckState, type StateCode } from '@/lib/payroll/withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';
import { STATE_EMPLOYER_TAXES } from '@/lib/payroll/employer-cost-2026';
import {
  computeHrBudget,
  computeLaborShare,
  computeLoadedCost,
  computeTeamCost,
  HR_BUDGET_DEFAULTS,
  INDUSTRY_LABOR_BENCHMARKS,
  isLaborMode,
  LABOR_MODES,
  LABOR_SHARE_DEFAULTS,
  LOADED_COST_DEFAULTS,
  TEAM_DEFAULTS,
  type LaborMode,
  type LoadedCostGroup,
  type TeamMember,
} from '@/lib/payroll/labor-cost';

const STATES_SORTED: StateCode[] = [...STATE_CODES].sort((a, b) => STATE_PAYCHECK_PAGES[a].name.localeCompare(STATE_PAYCHECK_PAGES[b].name));
const num = (v: string, fallback = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};
const pct1 = (n: number) => `${(n * 100).toFixed(1)}%`;
const GROUP_LABEL: Record<LoadedCostGroup, string> = { wages: 'Wages', taxes: 'Employer payroll taxes', benefits: 'Benefits', insurance: 'Insurance', overhead: 'Equipment & overhead' };
const GROUP_COLOR: Record<LoadedCostGroup, string> = { wages: 'bg-emerald-500', taxes: 'bg-amber-500', benefits: 'bg-blue-500', insurance: 'bg-rose-500', overhead: 'bg-violet-500' };

function Field({ id, label, value, onChange, prefix, suffix, step = 'any', help, min = '0' }: { id: string; label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; step?: string; help?: string; min?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input id={id} type="number" inputMode="decimal" min={min} step={step} value={value} onChange={(e) => onChange(e.target.value)} className={`text-sm ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`} />
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
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="result-display mt-2" aria-live="polite">
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-5">{children}</div>
  </motion.div>
);

// ───────────────────────── mode 1: cost per employee

function EmployeeMode() {
  const d = LOADED_COST_DEFAULTS;
  const [state, setState] = useState<PaycheckState>(d.state);
  const [payType, setPayType] = useState<'hourly' | 'salary'>(d.payType);
  const [salary, setSalary] = useState(String(d.annualSalary));
  const [rate, setRate] = useState('25');
  const [hours, setHours] = useState('40');
  const [health, setHealth] = useState(String(d.healthMonthly));
  const [match, setMatch] = useState(String(d.retirementMatchPct));
  const [otherBen, setOtherBen] = useState(String(d.otherBenefitsAnnual));
  const [pto, setPto] = useState(String(d.paidDaysOff));
  const [wc, setWc] = useState(String(d.workersCompPer100));
  const [equip, setEquip] = useState(String(d.equipmentAnnual));
  const [overhead, setOverhead] = useState(String(d.overheadAnnual));
  const [sui, setSui] = useState('');
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('employee-cost-calculator');

  const profile = state === 'none' || state === 'other' ? null : STATE_EMPLOYER_TAXES[state];
  const suiRate = sui.trim() === '' ? undefined : Math.max(0, num(sui)) / 100;
  const result = useMemo(
    () =>
      computeLoadedCost({
        state,
        payType,
        hourlyRate: num(rate),
        hoursPerWeek: num(hours),
        annualSalary: num(salary),
        healthMonthly: num(health),
        retirementMatchPct: num(match),
        otherBenefitsAnnual: num(otherBen),
        paidDaysOff: num(pto),
        workersCompPer100: num(wc),
        equipmentAnnual: num(equip),
        overheadAnnual: num(overhead),
        suiRate,
      }),
    [state, payType, rate, hours, salary, health, match, otherBen, pto, wc, equip, overhead, suiRate],
  );
  const valid = result.wages > 0;

  const tryExample = () => {
    setState('TX'); setPayType('salary'); setSalary('75000'); setHealth('650'); setMatch('4'); setOtherBen('1200'); setPto('25'); setWc('0.5'); setEquip('3500'); setOverhead('5000'); setSui('');
  };
  const save = () => {
    if (!valid) return;
    saveEntry(
      { state, payType, salary, rate, hours, health, match, otherBen, pto, wc, equip, overhead, sui },
      `${payType === 'salary' ? formatCurrency(num(salary)) + '/yr' : formatCurrency(num(rate)) + '/hr'} in ${state} → ${formatCurrency(result.total)} loaded (${result.multiplier.toFixed(2)}×)`,
    );
  };
  const restore = (i: Record<string, string>) => {
    setState((i.state as PaycheckState) || 'TX'); setPayType(i.payType === 'hourly' ? 'hourly' : 'salary'); setSalary(i.salary ?? ''); setRate(i.rate ?? ''); setHours(i.hours ?? '40');
    setHealth(i.health ?? ''); setMatch(i.match ?? ''); setOtherBen(i.otherBen ?? ''); setPto(i.pto ?? ''); setWc(i.wc ?? ''); setEquip(i.equip ?? ''); setOverhead(i.overhead ?? ''); setSui(i.sui ?? '');
  };

  const groups = (['wages', 'taxes', 'benefits', 'insurance', 'overhead'] as LoadedCostGroup[]).map((g) => ({ g, total: result.lines.filter((l) => l.group === g).reduce((s, l) => s + l.annual, 0) }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Work state (sets payroll taxes)</Label>
            <Select value={state} onValueChange={(v) => { setState(v as PaycheckState); setSui(''); }}>
              <SelectTrigger aria-label="State"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATES_SORTED.map((c) => <SelectItem key={c} value={c}>{STATE_PAYCHECK_PAGES[c].name}</SelectItem>)}
                <SelectItem value="none">Other state (federal taxes only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Pay type</Label>
            <div className="flex rounded-lg bg-background border border-border/50 p-1">
              {(['salary', 'hourly'] as const).map((t) => (
                <button key={t} type="button" onClick={() => setPayType(t)} className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${payType === t ? 'bg-emerald-600 text-white' : 'text-muted-foreground'}`}>
                  {t === 'salary' ? 'Annual salary' : 'Hourly'}
                </button>
              ))}
            </div>
          </div>
          {payType === 'salary' ? (
            <Field id="lc-salary" label="Annual salary" value={salary} onChange={setSalary} prefix="$" step="1000" />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field id="lc-rate" label="Hourly rate" value={rate} onChange={setRate} prefix="$" step="0.25" />
              <Field id="lc-hours" label="Hours / week" value={hours} onChange={setHours} step="1" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field id="lc-health" label="Health, dental, vision (employer share)" value={health} onChange={setHealth} prefix="$" step="25" help="Per month" />
          <Field id="lc-match" label="401(k) match" value={match} onChange={setMatch} suffix="%" step="0.5" help="% of wages" />
          <Field id="lc-otherben" label="Other benefits & perks" value={otherBen} onChange={setOtherBen} prefix="$" step="100" help="Per year: life, disability, stipends" />
          <Field id="lc-pto" label="Paid days off" value={pto} onChange={setPto} step="1" help="Vacation + sick + holidays per year" />
          <Field id="lc-wc" label="Workers' comp rate" value={wc} onChange={setWc} prefix="$" step="0.05" help="Per $100 of payroll (clerical ~0.1–0.5, trades 3–10)" />
          <Field id="lc-equip" label="Equipment & software" value={equip} onChange={setEquip} prefix="$" step="100" help="Per year" />
          <Field id="lc-overhead" label="Facilities & admin overhead" value={overhead} onChange={setOverhead} prefix="$" step="250" help="Per year, allocated" />
          <Field id="lc-sui" label={`SUI rate${profile?.sui.rate !== null && profile?.sui.rate !== undefined ? ` (default ${profile.sui.rateText})` : ''}`} value={sui} onChange={setSui} suffix="%" step="0.01" help={profile ? (profile.sui.rate === null ? 'Industry-rated state: enter your assigned rate' : 'Leave blank for the new-employer rate') : 'Not applied without a state'} />
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={tryExample} />
          <Button onClick={save} disabled={!valid} className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25">
            <BookmarkPlus className="h-4 w-4 mr-2" /> Save to history
          </Button>
        </div>
      </div>

      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Fully loaded cost per year</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(result.total)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">{result.multiplier.toFixed(2)}×</strong> wages · burden <strong className="text-foreground">{pct1(result.burdenRate)}</strong> ·{' '}
              <strong className="text-foreground">{formatCurrency(result.costPerPaidHour)}</strong>/paid hour · <strong className="text-foreground">{formatCurrency(result.costPerWorkedHour)}</strong>/hour worked
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Wages" value={formatCurrency(result.wages)} />
            <Kpi label={`Employer taxes (${TAX_YEAR})`} value={formatCurrency(result.taxesTotal)} color="text-amber-600" />
            <Kpi label="Benefits" value={formatCurrency(result.benefitsTotal)} color="text-blue-600" />
            <Kpi label="Insurance, equipment, overhead" value={formatCurrency(result.workersComp + result.equipment + result.overhead)} color="text-violet-600" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 p-4 space-y-2">
            <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-muted">
              {groups.map(({ g, total }) => total > 0 && <div key={g} style={{ width: `${(total / result.total) * 100}%` }} className={`${GROUP_COLOR[g]} h-full`} title={GROUP_LABEL[g]} />)}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {groups.map(({ g, total }) => total > 0 && (
                <span key={g} className="inline-flex items-center gap-1.5"><span className={`size-2.5 rounded-sm ${GROUP_COLOR[g]}`} />{GROUP_LABEL[g]} ({((total / result.total) * 100).toFixed(1)}%)</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Cost line</th><th className="text-right px-4 py-2 font-medium">Per year</th><th className="text-right px-4 py-2 font-medium">Per month</th><th className="text-right px-4 py-2 font-medium">% of wages</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {result.lines.map((l) => (
                  <tr key={l.key} className={l.group === 'wages' ? 'font-medium' : ''}>
                    <td className="px-4 py-2">{l.label}</td>
                    <td className="text-right px-4 py-2">{formatCurrency(l.annual)}</td>
                    <td className="text-right px-4 py-2 text-muted-foreground">{formatCurrency(l.annual / 12)}</td>
                    <td className="text-right px-4 py-2 text-muted-foreground">{result.wages > 0 ? ((l.annual / result.wages) * 100).toFixed(2) : '0.00'}%</td>
                  </tr>
                ))}
                <tr className="font-bold bg-emerald-500/5"><td className="px-4 py-2">Total cost to employ</td><td className="text-right px-4 py-2 text-emerald-600">{formatCurrency(result.total)}</td><td className="text-right px-4 py-2 text-emerald-600">{formatCurrency(result.total / 12)}</td><td className="text-right px-4 py-2 text-emerald-600">{(result.multiplier * 100).toFixed(1)}%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Payroll taxes use the {TAX_YEAR} employer rates: 6.2% Social Security match, 1.45% Medicare match, FUTA on the first $7,000{profile ? `, ${STATE_PAYCHECK_PAGES[state as StateCode].name} unemployment insurance${profile.sui.rate !== null ? ` at the ${profile.sui.rateText} new-employer rate` : ''} on the first $${profile.sui.wageBase.toLocaleString('en-US')}` : ''}{profile?.extras.length ? ` and ${profile.extras.map((e) => e.label.replace(/ \(.*\)$/, '')).join(', ')}` : ''}.
              The hourly figures divide by {result.paidHoursPerYear.toLocaleString('en-US')} paid hours and {result.workedHoursPerYear.toLocaleString('en-US')} hours actually worked after {pto || 0} paid days off.
            </p>
          </div>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={restore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── mode 2: team / project cost

type MemberRow = { id: number; name: string; hours: string; rate: string; burden: string };
let nextId = 10;
const toRows = (members: TeamMember[]): MemberRow[] => members.map((m, i) => ({ id: i + 1, name: m.name, hours: String(m.hours), rate: String(m.rate), burden: String(m.burdenPct) }));

function TeamMode() {
  const [rows, setRows] = useState<MemberRow[]>(() => toRows(TEAM_DEFAULTS));
  const [overhead, setOverhead] = useState('20');
  const [margin, setMargin] = useState('40');
  const [useMargin, setUseMargin] = useState(true);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('team-cost-calculator');

  const members: TeamMember[] = rows.map((r) => ({ name: r.name, hours: num(r.hours), rate: num(r.rate), burdenPct: num(r.burden) }));
  const result = useMemo(() => computeTeamCost(members, num(overhead), useMargin ? num(margin) : null), [members, overhead, margin, useMargin]);
  const valid = result.totalHours > 0;
  const update = (id: number, field: keyof MemberRow, value: string) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground"><th className="text-left py-1 pr-2 font-medium">Role / person</th><th className="text-left py-1 px-2 font-medium">Hours</th><th className="text-left py-1 px-2 font-medium">Rate $/hr</th><th className="text-left py-1 px-2 font-medium">Burden %</th><th className="text-right py-1 pl-2 font-medium">Cost</th><th /></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id}>
                  <td className="py-1 pr-2"><Input aria-label={`Member ${i + 1} name`} value={r.name} onChange={(e) => update(r.id, 'name', e.target.value)} className="text-sm min-w-[8rem]" placeholder="Role" /></td>
                  <td className="py-1 px-2"><Input aria-label={`Member ${i + 1} hours`} type="number" min="0" step="1" value={r.hours} onChange={(e) => update(r.id, 'hours', e.target.value)} className="text-sm w-24" /></td>
                  <td className="py-1 px-2"><Input aria-label={`Member ${i + 1} rate`} type="number" min="0" step="1" value={r.rate} onChange={(e) => update(r.id, 'rate', e.target.value)} className="text-sm w-24" /></td>
                  <td className="py-1 px-2"><Input aria-label={`Member ${i + 1} burden`} type="number" min="0" step="1" value={r.burden} onChange={(e) => update(r.id, 'burden', e.target.value)} className="text-sm w-20" /></td>
                  <td className="py-1 pl-2 text-right whitespace-nowrap">{formatCurrency(result.members.find((m) => m.name === r.name && m.hours === num(r.hours) && m.rate === num(r.rate))?.cost ?? 0)}</td>
                  <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove row" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== r.id) : p))}><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <Button type="button" variant="outline" size="sm" disabled={rows.length >= 12} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', hours: '', rate: '', burden: '30' }])}><Plus className="h-4 w-4 mr-1" /> Add member</Button>
          <div className="w-36"><Field id="tc-oh" label="Overhead on labor" value={overhead} onChange={setOverhead} suffix="%" step="1" /></div>
          <div className="flex items-end gap-3">
            <div className="w-36"><Field id="tc-margin" label="Target margin" value={margin} onChange={setMargin} suffix="%" step="1" /></div>
            <div className="flex items-center gap-2 pb-2"><Switch id="tc-usemargin" checked={useMargin} onCheckedChange={setUseMargin} /><Label htmlFor="tc-usemargin" className="text-xs">Price it</Label></div>
          </div>
          <TryExample onClick={() => { setRows(toRows(TEAM_DEFAULTS)); setOverhead('20'); setMargin('40'); setUseMargin(true); }} />
          <Button onClick={() => valid && saveEntry({ rows: JSON.stringify(rows), overhead, margin }, `${rows.length} roles, ${result.totalHours}h → ${formatCurrency(result.total)}`)} disabled={!valid} className="bg-emerald-600 hover:bg-emerald-700 text-white"><BookmarkPlus className="h-4 w-4 mr-2" /> Save</Button>
        </div>
        <p className="text-xs text-muted-foreground">Burden is what an employee costs on top of the hourly rate (payroll taxes + benefits), typically 25–40% for W-2 staff and 0% for contractors who invoice you. Overhead covers rent, tools, admin and management time; agencies commonly add 15–30% on labor.</p>
      </div>

      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Total cost of this team / project</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(result.total)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">{result.totalHours.toLocaleString('en-US')}</strong> hours · <strong className="text-foreground">{formatCurrency(result.avgLoadedRate)}</strong>/hr average loaded rate
              {result.priceForMargin !== null && <> · price for a {margin}% margin: <strong className="text-foreground">{formatCurrency(result.priceForMargin)}</strong></>}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Base labor (hours × rate)" value={formatCurrency(result.baseCost)} />
            <Kpi label="Burden (taxes + benefits)" value={formatCurrency(result.burdenCost)} color="text-amber-600" />
            <Kpi label={`Overhead (${overhead || 0}%)`} value={formatCurrency(result.overhead)} color="text-violet-600" />
            <Kpi label="Total cost" value={formatCurrency(result.total)} color="text-emerald-600" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Role</th><th className="text-right px-4 py-2 font-medium">Hours</th><th className="text-right px-4 py-2 font-medium">Base</th><th className="text-right px-4 py-2 font-medium">Loaded</th><th className="text-right px-4 py-2 font-medium">Share</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {result.members.map((m, i) => (
                  <tr key={i}><td className="px-4 py-2">{m.name || `Member ${i + 1}`}</td><td className="text-right px-4 py-2">{m.hours}</td><td className="text-right px-4 py-2">{formatCurrency(m.base)}</td><td className="text-right px-4 py-2 font-medium">{formatCurrency(m.cost)}</td><td className="text-right px-4 py-2 text-muted-foreground">{pct1(m.share)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const parsed = JSON.parse(i.rows) as MemberRow[]; if (Array.isArray(parsed)) setRows(parsed); } catch {} setOverhead(i.overhead ?? '20'); setMargin(i.margin ?? '40'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── mode 3: labor % of revenue

function RevenueMode() {
  const d = LABOR_SHARE_DEFAULTS;
  const [wages, setWages] = useState(String(d.wages));
  const [benefits, setBenefits] = useState(String(d.benefitsPct));
  const [taxes, setTaxes] = useState(String(d.payrollTaxPct));
  const [wc, setWc] = useState(String(d.workersCompAnnual));
  const [contractors, setContractors] = useState('0');
  const [revenue, setRevenue] = useState(String(d.revenue));
  const [industry, setIndustry] = useState(d.industry);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('labor-cost-calculator');

  const result = useMemo(() => computeLaborShare({ wages: num(wages), benefitsPct: num(benefits), payrollTaxPct: num(taxes), workersCompAnnual: num(wc), contractorsAnnual: num(contractors), revenue: num(revenue), industry }), [wages, benefits, taxes, wc, contractors, revenue, industry]);
  const valid = num(wages) > 0;
  const b = result.benchmark;
  const tone = result.position === 'above' ? 'text-red-600' : result.position === 'below' ? 'text-blue-600' : 'text-emerald-600';

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field id="ls-wages" label="Total annual wages (W-2 gross payroll)" value={wages} onChange={setWages} prefix="$" step="10000" />
          <Field id="ls-ben" label="Benefits" value={benefits} onChange={setBenefits} suffix="%" step="1" help="% of wages; BLS private-industry average ≈ 30% of compensation" />
          <Field id="ls-tax" label="Employer payroll taxes" value={taxes} onChange={setTaxes} suffix="%" step="0.5" help="FICA 7.65% + FUTA + SUI ≈ 8–11%" />
          <Field id="ls-wc" label="Workers' comp premiums" value={wc} onChange={setWc} prefix="$" step="1000" help="Per year" />
          <Field id="ls-contr" label="Contractors & agencies (optional)" value={contractors} onChange={setContractors} prefix="$" step="10000" help="Counted in workforce cost, not labor cost" />
          <Field id="ls-rev" label="Annual revenue" value={revenue} onChange={setRevenue} prefix="$" step="100000" />
          <div className="space-y-1.5 col-span-2 sm:col-span-3">
            <Label className="text-xs text-muted-foreground">Industry benchmark</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger aria-label="Industry"><SelectValue /></SelectTrigger>
              <SelectContent>{INDUSTRY_LABOR_BENCHMARKS.map((x) => <SelectItem key={x.key} value={x.key}>{x.label} ({x.low}–{x.high}%)</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={() => { setWages('2500000'); setBenefits('28'); setTaxes('9'); setWc('25000'); setContractors('0'); setRevenue('8000000'); setIndustry('services'); }} />
          <Button onClick={() => valid && saveEntry({ wages, benefits, taxes, wc, contractors, revenue, industry }, `Labor ${result.laborPct.toFixed(1)}% of revenue (${formatCurrency(result.laborCost)})`)} disabled={!valid} className="bg-emerald-600 hover:bg-emerald-700 text-white"><BookmarkPlus className="h-4 w-4 mr-2" /> Save</Button>
        </div>
      </div>

      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Labor cost as a share of revenue</p>
            <p className={`text-4xl sm:text-5xl font-extrabold ${num(revenue) > 0 ? tone : 'text-emerald-600'}`} data-result-primary>{num(revenue) > 0 ? `${result.laborPct.toFixed(1)}%` : formatCurrency(result.laborCost)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total labor cost <strong className="text-foreground">{formatCurrency(result.laborCost)}</strong> · <strong className="text-foreground">{result.multiplier.toFixed(2)}×</strong> wages
              {b && num(revenue) > 0 && <> · {b.label} range <strong className="text-foreground">{b.low}–{b.high}%</strong> — you are <strong className={tone}>{result.position}</strong> it</>}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Wages" value={formatCurrency(num(wages))} />
            <Kpi label="Benefits" value={formatCurrency(result.benefits)} color="text-blue-600" />
            <Kpi label="Payroll taxes + workers' comp" value={formatCurrency(result.payrollTaxes + num(wc))} color="text-amber-600" />
            <Kpi label="Workforce incl. contractors" value={`${formatCurrency(result.workforceCost)}${num(revenue) > 0 ? ` (${result.workforcePct.toFixed(1)}%)` : ''}`} color="text-violet-600" />
          </div>
          {b && num(revenue) > 0 && (
            <div className="rounded-xl bg-background border border-border/50 p-4 space-y-2 text-sm">
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <div className="absolute inset-y-0 bg-emerald-500/30" style={{ left: `${Math.min(100, b.low)}%`, width: `${Math.min(100 - b.low, b.high - b.low)}%` }} />
                <div className={`absolute inset-y-0 w-1 ${result.position === 'above' ? 'bg-red-500' : result.position === 'below' ? 'bg-blue-500' : 'bg-emerald-600'}`} style={{ left: `${Math.min(99, result.laborPct)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{b.note}</p>
              {result.position === 'above' && result.revenueForRange !== null && (
                <p className="text-xs"><strong>To get back to {b.high}%:</strong> revenue would need to reach {formatCurrency(result.revenueForRange)} at today&apos;s payroll, or labor cost would need to fall by {formatCurrency(result.laborCutForRange ?? 0)}.</p>
              )}
              {result.position === 'below' && <p className="text-xs">Below the range can mean a lean, productive team, or understaffing that shows up later as turnover and overtime. Check the hours and the turnover rate before celebrating.</p>}
            </div>
          )}
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setWages(i.wages ?? ''); setBenefits(i.benefits ?? '28'); setTaxes(i.taxes ?? '9'); setWc(i.wc ?? '0'); setContractors(i.contractors ?? '0'); setRevenue(i.revenue ?? ''); setIndustry(i.industry ?? 'services'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── mode 4: HR budget

function BudgetMode() {
  const d = HR_BUDGET_DEFAULTS;
  const [v, setV] = useState<Record<string, string>>({ recruiting: String(d.recruiting), training: String(d.training), benefitsAdmin: String(d.benefitsAdmin), hrStaff: String(d.hrStaff), technology: String(d.technology), other: String(d.other), headcount: String(d.headcount), hrHeadcount: String(d.hrHeadcount), revenue: String(d.revenue) });
  const set = (k: string) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('hr-budget-calculator');
  const result = useMemo(() => computeHrBudget({ recruiting: num(v.recruiting), training: num(v.training), benefitsAdmin: num(v.benefitsAdmin), hrStaff: num(v.hrStaff), technology: num(v.technology), other: num(v.other), headcount: num(v.headcount), hrHeadcount: num(v.hrHeadcount), revenue: num(v.revenue) }), [v]);
  const valid = result.total > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field id="hb-recruiting" label="Recruiting & hiring" value={v.recruiting} onChange={set('recruiting')} prefix="$" step="5000" help="Job ads, agencies, ATS, background checks" />
          <Field id="hb-training" label="Training & development" value={v.training} onChange={set('training')} prefix="$" step="5000" />
          <Field id="hb-benadmin" label="Benefits administration" value={v.benefitsAdmin} onChange={set('benefitsAdmin')} prefix="$" step="5000" help="Broker fees, admin platforms — not the benefits themselves" />
          <Field id="hb-staff" label="HR team salaries & benefits" value={v.hrStaff} onChange={set('hrStaff')} prefix="$" step="10000" />
          <Field id="hb-tech" label="HR technology" value={v.technology} onChange={set('technology')} prefix="$" step="5000" help="HRIS, payroll, ATS, LMS, engagement tools" />
          <Field id="hb-other" label="Other HR spend" value={v.other} onChange={set('other')} prefix="$" step="5000" help="Compliance, surveys, events, recognition" />
          <Field id="hb-headcount" label="Company headcount" value={v.headcount} onChange={set('headcount')} step="1" />
          <Field id="hb-hrhc" label="HR team size (FTE)" value={v.hrHeadcount} onChange={set('hrHeadcount')} step="0.5" />
          <Field id="hb-rev" label="Annual revenue" value={v.revenue} onChange={set('revenue')} prefix="$" step="100000" />
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={() => setV({ recruiting: '120000', training: '90000', benefitsAdmin: '40000', hrStaff: '420000', technology: '60000', other: '30000', headcount: '300', hrHeadcount: '4', revenue: '45000000' })} />
          <Button onClick={() => valid && saveEntry(v, `HR budget ${formatCurrency(result.total)} · ${formatCurrency(result.perEmployee)}/employee`)} disabled={!valid} className="bg-emerald-600 hover:bg-emerald-700 text-white"><BookmarkPlus className="h-4 w-4 mr-2" /> Save</Button>
        </div>
      </div>

      {valid && (
        <Result>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Total HR budget</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{formatCurrency(result.total)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">{formatCurrency(result.perEmployee)}</strong> per employee per year
              {num(v.revenue) > 0 && <> · <strong className="text-foreground">{result.pctRevenue.toFixed(2)}%</strong> of revenue</>}
              {result.employeesPerHr !== null && <> · <strong className="text-foreground">{result.employeesPerHr}</strong> employees per HR team member</>}
            </p>
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><th className="text-left px-4 py-2 font-medium">Category</th><th className="text-right px-4 py-2 font-medium">Budget</th><th className="text-right px-4 py-2 font-medium">Share</th><th className="text-right px-4 py-2 font-medium">Per employee</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {result.shares.map((s) => (
                  <tr key={s.key}><td className="px-4 py-2">{s.label}</td><td className="text-right px-4 py-2">{formatCurrency(s.amount)}</td><td className="text-right px-4 py-2 text-muted-foreground">{pct1(s.share)}</td><td className="text-right px-4 py-2 text-muted-foreground">{num(v.headcount) > 0 ? formatCurrency(s.amount / num(v.headcount)) : '—'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">Rules of thumb used in HR budgeting: HR spend of roughly 1–3% of revenue, one HR team member per 50–100 employees (fewer at small companies), and the HR team&apos;s own pay taking half or more of the department budget. Benefits premiums belong in the per-employee cost mode, not here.</p>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => setV((p) => ({ ...p, ...i }))} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── suite

const MODE_ICON: Record<LaborMode, typeof Briefcase> = { employee: Briefcase, team: Users, revenue: Percent, budget: Wallet };

export default function LaborCostSuite() {
  // Merged pages 301 here with ?mode=employee|team|budget
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<LaborMode | null>(null);
  const mode: LaborMode = override ?? (isLaborMode(urlMode) ? urlMode : 'employee');

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Labor cost mode">
          {LABOR_MODES.map((m) => {
            const Icon = MODE_ICON[m.value];
            return (
              <button key={m.value} type="button" role="tab" aria-selected={mode === m.value} onClick={() => setMode(m.value)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === m.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{m.label}</span>
                <span className="sm:hidden">{m.short}</span>
              </button>
            );
          })}
        </div>
        {mode === 'employee' && <EmployeeMode />}
        {mode === 'team' && <TeamMode />}
        {mode === 'revenue' && <RevenueMode />}
        {mode === 'budget' && <BudgetMode />}
      </div>
    </div>
  );
}

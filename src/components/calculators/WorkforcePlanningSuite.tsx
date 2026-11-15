'use client';

import { useMemo, useState } from 'react';
import { CalendarCheck, CalendarRange, Gauge, Info, Network } from 'lucide-react';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Actions, Field, Headline, int, Kpi, ModeTabs, Note, num, pct, Result, Th, usd } from './suite-ui';
import {
  ABSENCE_DEFAULTS,
  computeAbsence,
  computeEfficiency,
  computePlan,
  computeSpan,
  EFFICIENCY_DEFAULTS,
  isWorkforceMode,
  PLAN_DEFAULTS,
  SPAN_DEFAULTS,
  WORKFORCE_MODES,
  type TargetMethod,
  type WorkforceMode,
} from '@/lib/payroll/workforce-planning';

// Phase 17: headcount, workforce-capacity, absenteeism, span-of-control and
// labor-efficiency pages 301 here with ?mode=plan|absence|span|efficiency.

const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} className={`rounded-full px-3 py-1 text-xs font-medium border transition ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'border-border text-muted-foreground hover:text-foreground'}`}>{children}</button>
);

// ───────────────────────── headcount plan

function PlanMode() {
  const d = PLAN_DEFAULTS;
  const [method, setMethod] = useState<TargetMethod>(d.targetMethod);
  const [current, setCurrent] = useState(String(d.currentHeadcount));
  const [years, setYears] = useState(String(d.years));
  const [targetHc, setTargetHc] = useState(String(d.targetHeadcount));
  const [curRev, setCurRev] = useState(String(d.currentRevenue));
  const [tgtRev, setTgtRev] = useState(String(d.targetRevenue));
  const [gain, setGain] = useState(String(d.productivityGainPct));
  const [attrition, setAttrition] = useState(String(d.attritionPct));
  const [hours, setHours] = useState(String(d.avgWeeklyHours));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('headcount-calculator');
  const r = useMemo(() => computePlan({ currentHeadcount: num(current), years: num(years) || 1, targetMethod: method, targetHeadcount: num(targetHc), currentRevenue: num(curRev), targetRevenue: num(tgtRev), productivityGainPct: num(gain), attritionPct: num(attrition), avgWeeklyHours: num(hours) || 40 }), [method, current, years, targetHc, curRev, tgtRev, gain, attrition, hours]);
  const inputs = { method, current, years, targetHc, curRev, tgtRev, gain, attrition, hours };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pill active={method === 'revenue'} onClick={() => setMethod('revenue')}>Size from a revenue target</Pill>
        <Pill active={method === 'headcount'} onClick={() => setMethod('headcount')}>I know the target headcount</Pill>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="pl-current" label="Current headcount" value={current} onChange={setCurrent} step="1" />
        <Field id="pl-years" label="Planning horizon" value={years} onChange={setYears} suffix="years" step="1" min="1" />
        <Field id="pl-attr" label="Annual attrition" value={attrition} onChange={setAttrition} suffix="%" step="0.5" help="Leavers ÷ average headcount per year" />
        <Field id="pl-hours" label="Average weekly hours" value={hours} onChange={setHours} suffix="h" step="1" help="To show the end state in FTE" />
      </div>
      {method === 'revenue' ? (
        <div className="grid grid-cols-3 gap-4 rounded-xl border border-border/50 bg-muted/20 p-3">
          <Field id="pl-crev" label="Current annual revenue" value={curRev} onChange={setCurRev} prefix="$" step="100000" />
          <Field id="pl-trev" label={`Revenue target in ${num(years) || 1} year${(num(years) || 1) === 1 ? '' : 's'}`} value={tgtRev} onChange={setTgtRev} prefix="$" step="100000" />
          <Field id="pl-gain" label="Revenue per employee improves" value={gain} onChange={setGain} suffix="%/yr" step="0.5" help="0 = headcount scales with revenue" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 rounded-xl border border-border/50 bg-muted/20 p-3">
          <Field id="pl-thc" label={`Target headcount in ${num(years) || 1} year${(num(years) || 1) === 1 ? '' : 's'}`} value={targetHc} onChange={setTargetHc} step="1" />
        </div>
      )}
      <Actions onExample={() => { setMethod('revenue'); setCurrent('120'); setYears('3'); setTargetHc('200'); setCurRev('24000000'); setTgtRev('45000000'); setGain('3'); setAttrition('15'); setHours('40'); }} onSave={() => r && saveEntry(inputs, `${int(num(current))} → ${int(r.targetHeadcount)} in ${num(years) || 1}y · ${int(r.totalHires)} hires (${pct(r.backfillSharePct, 0)} backfill)`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter the current headcount{method === 'revenue' ? ', current revenue and the revenue target' : ' and a target'}.</p>}
      {r && (
        <Result>
          <Headline label={`Hires needed over ${num(years) || 1} year${(num(years) || 1) === 1 ? '' : 's'}`} value={int(r.totalHires)}>
            headcount <strong className="text-foreground">{int(num(current))} → {int(r.targetHeadcount)}</strong> ({r.totalGrowth >= 0 ? '+' : ''}{int(r.totalGrowth)}) · <strong className="text-foreground">{int(r.totalDepartures)}</strong> expected leavers to replace · about <strong className="text-foreground">{r.avgHiresPerMonth}</strong> hires a month · {r.endFte} FTE at {num(hours) || 40} h/week
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Year</Th><Th right>Start</Th><Th right>Growth</Th><Th right>Departures</Th><Th right>Hires</Th><Th right>Per month</Th><Th right>End</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.years.map((y) => <tr key={y.year}><td className="px-3 py-2 font-medium">Year {y.year}</td><td className="text-right px-3 py-2">{int(y.start)}</td><td className={`text-right px-3 py-2 ${y.growth < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{y.growth >= 0 ? '+' : ''}{int(y.growth)}</td><td className="text-right px-3 py-2 text-red-500">−{int(y.departures)}</td><td className="text-right px-3 py-2 font-semibold">{int(y.hires)}</td><td className="text-right px-3 py-2 text-muted-foreground">{y.hiresPerMonth}</td><td className="text-right px-3 py-2 font-semibold">{int(y.end)}</td></tr>)}
                <tr className="font-bold bg-muted/20"><td className="px-3 py-2">Total</td><td className="text-right px-3 py-2">{int(num(current))}</td><td className="text-right px-3 py-2">{r.totalGrowth >= 0 ? '+' : ''}{int(r.totalGrowth)}</td><td className="text-right px-3 py-2 text-red-500">−{int(r.totalDepartures)}</td><td className="text-right px-3 py-2 text-emerald-600">{int(r.totalHires)}</td><td className="text-right px-3 py-2">{r.avgHiresPerMonth}</td><td className="text-right px-3 py-2">{int(r.targetHeadcount)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Backfill share of hiring" value={pct(r.backfillSharePct, 0)} sub={`${int(r.totalDepartures)} of ${int(r.totalHires)} hires only replace leavers`} color="text-amber-600" />
            <Kpi label="Hires with zero attrition" value={int(r.hiresIfNoAttrition)} sub="growth alone" />
            {r.revenuePerEmployeeNow !== null && <Kpi label="Revenue per employee" value={usd(r.revenuePerEmployeeNow)} sub={`→ ${usd(r.revenuePerEmployeeTarget)} at the target`} color="text-blue-600" />}
            {r.targetIfFlatProductivity !== null ? <Kpi label="Target with flat productivity" value={int(r.targetIfFlatProductivity)} sub={`${int(r.targetIfFlatProductivity - r.targetHeadcount)} more people than with the gain`} /> : <Kpi label="End state" value={`${r.endFte} FTE`} sub={`${int(r.targetHeadcount)} people at ${num(hours) || 40} h/week`} />}
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Each year: departures = attrition × average of start and end headcount; hires = growth + departures. Headcount counts people on payroll (full-time, part-time, temporary); contractors are excluded. Revenue-based sizing divides the revenue target by revenue per employee after the productivity gain compounds for the horizon.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setMethod(i.method === 'headcount' ? 'headcount' : 'revenue'); setCurrent(i.current ?? ''); setYears(i.years ?? '3'); setTargetHc(i.targetHc ?? ''); setCurRev(i.curRev ?? ''); setTgtRev(i.tgtRev ?? ''); setGain(i.gain ?? '0'); setAttrition(i.attrition ?? '15'); setHours(i.hours ?? '40'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── absenteeism

const bradfordColor = { low: 'text-emerald-600', monitor: 'text-blue-600', concern: 'text-amber-600', formal: 'text-red-500' };

function AbsenceMode() {
  const d = ABSENCE_DEFAULTS;
  const [emps, setEmps] = useState(String(d.employees));
  const [sched, setSched] = useState(String(d.scheduledDaysPerEmployee));
  const [absent, setAbsent] = useState(String(d.absenceDays));
  const [pay, setPay] = useState(String(d.dailyPay));
  const [mult, setMult] = useState(String(d.indirectMultiplier));
  const [spells, setSpells] = useState(String(d.bradfordSpells));
  const [bDays, setBDays] = useState(String(d.bradfordDays));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('absenteeism-calculator');
  const r = useMemo(() => computeAbsence({ employees: num(emps), scheduledDaysPerEmployee: num(sched), absenceDays: num(absent), dailyPay: num(pay), indirectMultiplier: num(mult) || 1, bradfordSpells: num(spells), bradfordDays: num(bDays) }), [emps, sched, absent, pay, mult, spells, bDays]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field id="ab-emps" label="Employees" value={emps} onChange={setEmps} step="1" />
        <Field id="ab-sched" label="Scheduled days per employee" value={sched} onChange={setSched} step="1" help="≈ 250 a year before PTO, 220–230 after" />
        <Field id="ab-absent" label="Unplanned absence days (all staff)" value={absent} onChange={setAbsent} step="10" help="Sickness, no-shows; not approved PTO" />
        <Field id="ab-pay" label="Average daily pay" value={pay} onChange={setPay} prefix="$" step="10" />
        <Field id="ab-mult" label="Indirect cost multiplier" value={mult} onChange={setMult} suffix="×" step="0.1" min="1" help="Cover, overtime, lost output; 1 = pay only" />
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
        <p className="text-xs font-semibold mb-2">Bradford factor for one employee (rolling 12 months)</p>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Field id="ab-spells" label="Separate absence spells" value={spells} onChange={setSpells} step="1" />
          <Field id="ab-bdays" label="Total days absent" value={bDays} onChange={setBDays} step="1" />
        </div>
      </div>
      <Actions onExample={() => { setEmps('150'); setSched('228'); setAbsent('1100'); setPay('260'); setMult('1.5'); setSpells('6'); setBDays('9'); }} onSave={() => r && saveEntry({ emps, sched, absent, pay, mult, spells, bDays }, `Absence ${pct(r.absenceRatePct, 2)} · ${usd(r.totalCost)} · Bradford ${r.bradfordScore}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter employees and scheduled days.</p>}
      {r && (
        <Result>
          <Headline label="Absence rate" value={pct(r.absenceRatePct, 2)}>
            <strong className="text-foreground">{int(num(absent))}</strong> of {int(r.scheduledDays)} scheduled days lost · <strong className="text-foreground">{r.daysPerEmployee}</strong> days per employee · the equivalent of <strong className="text-foreground">{r.lostFte} FTE</strong> absent every day
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Pay for absent days" value={usd(r.directCost)} sub={`${int(num(absent))} × ${usd(num(pay))}`} />
            <Kpi label="Total cost incl. indirect" value={usd(r.totalCost)} sub={`× ${num(mult) || 1} for cover and lost output`} color="text-red-500" />
            <Kpi label="Per employee" value={usd(r.costPerEmployee)} sub="per period" />
            <Kpi label="Each point of absence rate" value={usd(r.costPerRatePoint)} sub="what a 1-point reduction saves" color="text-emerald-600" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-center sm:text-left sm:w-48">
              <p className="text-xs text-muted-foreground">Bradford factor</p>
              <p className={`text-3xl font-extrabold ${bradfordColor[r.bradfordBand.level]}`}>{int(r.bradfordScore)}</p>
              <p className="text-[11px] text-muted-foreground">{spells}² × {bDays} days</p>
            </div>
            <p className={`text-sm ${bradfordColor[r.bradfordBand.level]}`}>{r.bradfordBand.label}</p>
          </div>
          <Note><CalendarCheck className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Absence rate = unplanned absence days ÷ scheduled days. Approved vacation is not absenteeism. The Bradford factor (spells² × days) weights frequency: six one-day absences score far higher than one six-day absence, which is why it is used to spot patterns, not to judge genuine long-term illness. Trigger points of 50, 125 and 400 are common in attendance policies but are conventions, not law.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setEmps(i.emps ?? ''); setSched(i.sched ?? '228'); setAbsent(i.absent ?? '0'); setPay(i.pay ?? '0'); setMult(i.mult ?? '1'); setSpells(i.spells ?? '0'); setBDays(i.bDays ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── span of control

function SpanMode() {
  const d = SPAN_DEFAULTS;
  const [total, setTotal] = useState(String(d.totalEmployees));
  const [mgrs, setMgrs] = useState(String(d.managers));
  const [mCost, setMCost] = useState(String(d.managerCost));
  const [icCost, setIcCost] = useState(String(d.icCost));
  const [target, setTarget] = useState(String(d.targetSpan));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('span-of-control-calculator');
  const r = useMemo(() => computeSpan({ totalEmployees: num(total), managers: num(mgrs), managerCost: num(mCost), icCost: num(icCost), targetSpan: num(target) }), [total, mgrs, mCost, icCost, target]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field id="sp-total" label="Total employees" value={total} onChange={setTotal} step="1" />
        <Field id="sp-mgrs" label="People managers" value={mgrs} onChange={setMgrs} step="1" help="Anyone with direct reports" />
        <Field id="sp-mcost" label="Loaded cost per manager" value={mCost} onChange={setMCost} prefix="$" step="5000" />
        <Field id="sp-iccost" label="Loaded cost per contributor" value={icCost} onChange={setIcCost} prefix="$" step="5000" />
        <Field id="sp-target" label="Test a target span" value={target} onChange={setTarget} suffix="reports" step="1" help="0 = skip" />
      </div>
      <Actions onExample={() => { setTotal('240'); setMgrs('40'); setMCost('165000'); setIcCost('110000'); setTarget('8'); }} onSave={() => r && saveEntry({ total, mgrs, mCost, icCost, target }, `Span ${r.span} · ${pct(r.managementRatioPct)} managers${r.target ? ` · ${r.target.managerDelta} at span ${r.target.span}` : ''}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter total employees and at least one manager.</p>}
      {r && (
        <Result>
          <Headline label="Average span of control" value={`${r.span}`}>
            <strong className="text-foreground">{int(r.individualContributors)}</strong> contributors across <strong className="text-foreground">{int(num(mgrs))}</strong> managers · managers are <strong className="text-foreground">{pct(r.managementRatioPct)}</strong> of headcount · about <strong className="text-foreground">{r.layers}</strong> layers top to front line
          </Headline>
          <p className="text-sm text-center text-muted-foreground">{r.band.label}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Management layer cost" value={usd(r.managementCost)} sub={`${int(num(mgrs))} × ${usd(num(mCost))} a year`} />
            {r.target && <Kpi label={`Managers at span ${r.target.span}`} value={int(r.target.managersNeeded)} sub={`${r.target.managerDelta > 0 ? '+' : ''}${int(r.target.managerDelta)} vs today · ${r.target.layers} layers`} color={r.target.managerDelta < 0 ? 'text-emerald-600' : r.target.managerDelta > 0 ? 'text-amber-600' : 'text-foreground'} />}
            {r.target && <Kpi label={r.target.costDelta >= 0 ? 'Annual saving' : 'Annual extra cost'} value={usd(Math.abs(r.target.costDelta))} sub={r.target.managerDelta < 0 ? 'if surplus managers return to IC roles' : r.target.managerDelta > 0 ? 'promoting contributors into management' : 'no change'} color={r.target.costDelta >= 0 ? 'text-emerald-600' : 'text-red-500'} />}
            <Kpi label="Reports per manager" value={`1 : ${r.span}`} sub={`management ratio 1 in ${(100 / r.managementRatioPct).toFixed(1)}`} color="text-blue-600" />
          </div>
          <Note><Network className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Span = people without reports ÷ people with reports. Narrow spans (under 5) suit complex or novel work and new teams; 5–8 is typical of knowledge work; 9–15 suits experienced teams on well-defined work; beyond that managers mostly schedule and escalate. Layers are approximate: log(headcount) ÷ log(span). The cost figure assumes surplus managers become contributors at contributor cost, not that they leave.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setTotal(i.total ?? ''); setMgrs(i.mgrs ?? ''); setMCost(i.mCost ?? '0'); setIcCost(i.icCost ?? '0'); setTarget(i.target ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── labor efficiency

function EfficiencyMode() {
  const d = EFFICIENCY_DEFAULTS;
  const [std, setStd] = useState(String(d.standardHours));
  const [actual, setActual] = useState(String(d.actualHours));
  const [rate, setRate] = useState(String(d.hourlyCost));
  const [units, setUnits] = useState(String(d.units));
  const [revenue, setRevenue] = useState(String(d.revenue));
  const [emps, setEmps] = useState(String(d.employees));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('labor-efficiency-calculator');
  const r = useMemo(() => computeEfficiency({ standardHours: num(std), actualHours: num(actual), hourlyCost: num(rate), units: num(units), revenue: num(revenue), employees: num(emps) }), [std, actual, rate, units, revenue, emps]);
  const statusColor = { above: 'text-emerald-600', at: 'text-blue-600', below: 'text-red-500' };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="ef-std" label="Standard hours for the output produced" value={std} onChange={setStd} suffix="h" step="10" help="Budgeted or engineered time" />
        <Field id="ef-actual" label="Actual hours worked" value={actual} onChange={setActual} suffix="h" step="10" />
        <Field id="ef-rate" label="Loaded hourly labor cost" value={rate} onChange={setRate} prefix="$" step="1" />
        <Field id="ef-units" label="Units produced (optional)" value={units} onChange={setUnits} step="100" />
        <Field id="ef-rev" label="Revenue in the period (optional)" value={revenue} onChange={setRevenue} prefix="$" step="10000" />
        <Field id="ef-emps" label="Employees (optional)" value={emps} onChange={setEmps} step="1" />
      </div>
      <Actions onExample={() => { setStd('6400'); setActual('7100'); setRate('32'); setUnits('16000'); setRevenue('480000'); setEmps('42'); }} onSave={() => r && saveEntry({ std, actual, rate, units, revenue, emps }, `Efficiency ${pct(r.efficiencyPct)} · variance ${usd(r.varianceCost)}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter standard and actual hours.</p>}
      {r && (
        <Result>
          <Headline label="Labor efficiency" value={pct(r.efficiencyPct)}>
            <strong className="text-foreground">{int(num(std))}</strong> standard hours of work took <strong className="text-foreground">{int(num(actual))}</strong> actual hours · <span className={statusColor[r.status]}>{r.status === 'above' ? 'above standard' : r.status === 'at' ? 'within 10% of standard' : 'below standard'}</span> · variance <strong className={r.varianceHours < 0 ? 'text-red-500' : 'text-emerald-600'}>{r.varianceHours > 0 ? '+' : ''}{int(r.varianceHours)} h</strong> worth <strong className={r.varianceCost < 0 ? 'text-red-500' : 'text-emerald-600'}>{r.varianceCost < 0 ? '−' : '+'}{usd(Math.abs(r.varianceCost))}</strong>
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Actual labor cost" value={usd(r.actualLaborCost)} sub={`standard ${usd(r.standardLaborCost)}`} />
            <Kpi label="Labor cost per unit" value={usd(r.costPerUnit, 2)} sub={r.standardCostPerUnit === null ? 'enter units' : `standard ${usd(r.standardCostPerUnit, 2)}`} color="text-amber-600" />
            <Kpi label="Units per labor hour" value={r.unitsPerHour === null ? '—' : `${r.unitsPerHour}`} sub={r.revenuePerHour === null ? 'enter revenue for $/hour' : `${usd(r.revenuePerHour, 2)} revenue per hour`} color="text-blue-600" />
            <Kpi label="Labor cost % of revenue" value={pct(r.laborCostPctOfRevenue)} sub={r.revenuePerEmployee === null ? 'enter revenue and employees' : `${usd(r.revenuePerEmployee)} revenue per employee`} />
          </div>
          <Note><Gauge className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Efficiency = standard hours ÷ actual hours. Below 100% the gap is the efficiency variance: {int(r.recoverableHours)} hours (worth {usd(Math.abs(Math.min(0, r.varianceCost)))}) that a team working to standard would not have used. Standards drift, so investigate large favourable variances too. Units per hour and revenue per hour are productivity, which can rise while efficiency falls if the mix shifts to harder work.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setStd(i.std ?? ''); setActual(i.actual ?? ''); setRate(i.rate ?? '0'); setUnits(i.units ?? '0'); setRevenue(i.revenue ?? '0'); setEmps(i.emps ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── page

const ICONS = { plan: CalendarRange, absence: CalendarCheck, span: Network, efficiency: Gauge };

export default function WorkforcePlanningSuite() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<WorkforceMode | null>(null);
  const mode: WorkforceMode = override ?? (isWorkforceMode(urlMode) ? urlMode : 'plan');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <ModeTabs modes={WORKFORCE_MODES} mode={mode} onChange={setMode} label="Workforce planning mode" icons={ICONS} />
        {mode === 'plan' && <PlanMode />}
        {mode === 'absence' && <AbsenceMode />}
        {mode === 'span' && <SpanMode />}
        {mode === 'efficiency' && <EfficiencyMode />}
      </div>
    </div>
  );
}

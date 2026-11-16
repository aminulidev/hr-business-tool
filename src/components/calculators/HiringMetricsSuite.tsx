'use client';

import { useMemo, useState } from 'react';
import { GraduationCap, Info, Plus, Target, Timer, Trash2, UserMinus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Actions, Field, Headline, int, Kpi, ModeTabs, Note, num, pct, Result, Th, usd } from './suite-ui';
import {
  computeSources,
  computeTime,
  computeTraining,
  computeTurnover,
  HIRING_MODES,
  isHiringMode,
  SOURCES_DEFAULTS,
  TIME_DEFAULTS,
  TRAINING_DEFAULTS,
  TURNOVER_DEFAULTS,
  type HiringMode,
} from '@/lib/payroll/hiring-metrics';

// Phase 17: time-to-hire, time-to-fill, recruiting-roi, cost-of-turnover,
// replacement-cost and training-cost pages 301 here with
// ?mode=time|sources|turnover|training.

let nextId = 100;
const s = (n: number) => String(n);

function Breakdown({ rows }: { rows: { name: string; amount: number; sharePct: number }[] }) {
  return (
    <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-border/30">
          {rows.map((c) => (
            <tr key={c.name}>
              <td className="px-3 py-2 w-1/3">{c.name}</td>
              <td className="px-3 py-2"><div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, c.sharePct)}%` }} /></div></td>
              <td className="text-right px-3 py-2 font-semibold w-28">{usd(c.amount)}</td>
              <td className="text-right px-3 py-2 text-xs text-muted-foreground w-16">{pct(c.sharePct, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────── time to fill & funnel

function TimeMode() {
  const d = TIME_DEFAULTS;
  const [post, setPost] = useState(s(d.daysToPost));
  const [sourcing, setSourcing] = useState(s(d.daysSourcing));
  const [screening, setScreening] = useState(s(d.daysScreening));
  const [interviewing, setInterviewing] = useState(s(d.daysInterviewing));
  const [offer, setOffer] = useState(s(d.daysOffer));
  const [notice, setNotice] = useState(s(d.daysNotice));
  const [roles, setRoles] = useState(s(d.openRoles));
  const [salary, setSalary] = useState(s(d.annualSalary));
  const [mult, setMult] = useState(s(d.vacancyCostMultiplier));
  const [applicants, setApplicants] = useState(s(d.applicants));
  const [screened, setScreened] = useState(s(d.screened));
  const [interviewed, setInterviewed] = useState(s(d.interviewed));
  const [offers, setOffers] = useState(s(d.offers));
  const [accepted, setAccepted] = useState(s(d.accepted));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('time-to-fill-calculator');
  const r = useMemo(() => computeTime({ daysToPost: num(post), daysSourcing: num(sourcing), daysScreening: num(screening), daysInterviewing: num(interviewing), daysOffer: num(offer), daysNotice: num(notice), openRoles: num(roles), annualSalary: num(salary), vacancyCostMultiplier: num(mult), applicants: num(applicants), screened: num(screened), interviewed: num(interviewed), offers: num(offers), accepted: num(accepted) }), [post, sourcing, screening, interviewing, offer, notice, roles, salary, mult, applicants, screened, interviewed, offers, accepted]);
  const inputs = { post, sourcing, screening, interviewing, offer, notice, roles, salary, mult, applicants, screened, interviewed, offers, accepted };
  const restore = (i: Record<string, string>) => { setPost(i.post ?? '0'); setSourcing(i.sourcing ?? '0'); setScreening(i.screening ?? '0'); setInterviewing(i.interviewing ?? '0'); setOffer(i.offer ?? '0'); setNotice(i.notice ?? '0'); setRoles(i.roles ?? '1'); setSalary(i.salary ?? '0'); setMult(i.mult ?? '1'); setApplicants(i.applicants ?? '0'); setScreened(i.screened ?? '0'); setInterviewed(i.interviewed ?? '0'); setOffers(i.offers ?? '0'); setAccepted(i.accepted ?? '0'); };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-3">
        <p className="text-xs font-semibold">Average days in each stage (calendar days, per filled role)</p>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <Field id="tm-post" label="Approval → posted" value={post} onChange={setPost} suffix="d" step="1" />
          <Field id="tm-src" label="Posted → hire applies" value={sourcing} onChange={setSourcing} suffix="d" step="1" />
          <Field id="tm-scr" label="Screening" value={screening} onChange={setScreening} suffix="d" step="1" />
          <Field id="tm-int" label="Interviews" value={interviewing} onChange={setInterviewing} suffix="d" step="1" />
          <Field id="tm-off" label="Offer → accepted" value={offer} onChange={setOffer} suffix="d" step="1" />
          <Field id="tm-not" label="Notice period" value={notice} onChange={setNotice} suffix="d" step="1" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field id="tm-roles" label="Open roles" value={roles} onChange={setRoles} step="1" />
        <Field id="tm-salary" label="Annual salary of the role" value={salary} onChange={setSalary} prefix="$" step="1000" />
        <Field id="tm-mult" label="Daily vacancy cost" value={mult} onChange={setMult} suffix="× pay" step="0.1" help="Lost output and cover as a multiple of daily pay" />
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-3">
        <p className="text-xs font-semibold">Recruiting funnel for the same period (optional)</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Field id="tm-app" label="Applicants" value={applicants} onChange={setApplicants} step="10" />
          <Field id="tm-scrd" label="Passed screening" value={screened} onChange={setScreened} step="1" />
          <Field id="tm-intd" label="Interviewed" value={interviewed} onChange={setInterviewed} step="1" />
          <Field id="tm-offs" label="Offers made" value={offers} onChange={setOffers} step="1" />
          <Field id="tm-acc" label="Offers accepted" value={accepted} onChange={setAccepted} step="1" />
        </div>
      </div>
      <Actions onExample={() => restore({ post: '5', sourcing: '12', screening: '7', interviewing: '14', offer: '6', notice: '14', roles: '4', salary: '85000', mult: '1.5', applicants: '240', screened: '48', interviewed: '16', offers: '5', accepted: '4' })} onSave={() => r && saveEntry(inputs, `Time to fill ${r.timeToFill}d · time to hire ${r.timeToHire}d · vacancy ${usd(r.vacancyCostTotal)}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter the days spent in at least one stage.</p>}
      {r && (
        <Result>
          <Headline label="Time to fill (requisition approved → offer accepted)" value={`${int(r.timeToFill)} days`}>
            time to hire <strong className="text-foreground">{int(r.timeToHire)} days</strong> (candidate applies → accepts) · seat filled after <strong className="text-foreground">{int(r.timeToStart)} days</strong> including notice · slowest stage: <strong className="text-foreground">{r.bottleneck}</strong>
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 p-3 space-y-2">
            <div className="flex h-5 w-full overflow-hidden rounded-full bg-muted">
              {r.stages.filter((x) => x.days > 0).map((x, i) => <div key={x.name} title={`${x.name}: ${x.days} days`} style={{ width: `${x.sharePct}%` }} className={`${x.inTimeToHire ? ['bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700'][i % 3] : x.name === 'Notice period' ? 'bg-slate-400' : ['bg-blue-400', 'bg-blue-500'][i % 2]} h-full border-r border-background last:border-r-0`} />)}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {r.stages.filter((x) => x.days > 0).map((x) => <span key={x.name}><strong className={x.name === r.bottleneck ? 'text-amber-600' : 'text-foreground'}>{x.days}d</strong> {x.name.toLowerCase()} ({pct(x.sharePct, 0)})</span>)}
            </div>
            <p className="text-[11px] text-muted-foreground">Blue = before the hire entered the pipeline, green = counted in time to hire, gray = notice.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Vacancy cost per day" value={usd(r.dailyVacancyCost)} sub={`${usd(num(salary))} ÷ 365 × ${num(mult)}`} />
            <Kpi label="Vacancy cost per role" value={usd(r.vacancyCostPerRole)} sub={`${int(r.timeToStart)} days empty`} color="text-amber-600" />
            <Kpi label={`All ${int(num(roles))} open roles`} value={usd(r.vacancyCostTotal)} color="text-red-500" />
            <Kpi label="Each day cut from the process" value={usd(r.savingPerDay)} sub="across the open roles" color="text-emerald-600" />
          </div>
          {r.funnel && (
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Funnel step</Th><Th right>Candidates</Th><Th right>Pass-through from previous step</Th></tr></thead>
                <tbody className="divide-y divide-border/30">
                  {r.funnel.steps.map((x) => <tr key={x.name}><td className="px-3 py-2">{x.name}</td><td className="text-right px-3 py-2 font-semibold">{int(x.count)}</td><td className="text-right px-3 py-2 text-muted-foreground">{pct(x.passPct)}</td></tr>)}
                </tbody>
              </table>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 border-t border-border/50">
                <Kpi label="Offer acceptance rate" value={pct(r.funnel.offerAcceptancePct)} color="text-emerald-600" />
                <Kpi label="Applicants per hire" value={r.funnel.applicantsPerHire === null ? '—' : `${r.funnel.applicantsPerHire}`} />
                <Kpi label="Interviews per hire" value={r.funnel.interviewsPerHire === null ? '—' : `${r.funnel.interviewsPerHire}`} />
                <Kpi label="Selection rate" value={pct(r.funnel.selectionRatePct, 2)} sub="hires ÷ applicants" />
              </div>
            </div>
          )}
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Time to fill runs from requisition approval to offer acceptance and measures the whole process, including how long the job waited to be posted. Time to hire starts when the eventual hire entered the pipeline and measures how fast you move once you have the right person. The seat stays empty until the start date, so vacancy cost uses time to fill plus notice.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={restore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── source ROI

type SourceRowState = { id: number; name: string; spend: string; hires: string; retained: string };
const toSourceRows = () => SOURCES_DEFAULTS.sources.map((x, i) => ({ id: i + 1, name: x.name, spend: s(x.spend), hires: s(x.hires), retained: s(x.retainedPct) }));

function SourcesMode() {
  const [rows, setRows] = useState<SourceRowState[]>(toSourceRows);
  const [internal, setInternal] = useState(s(SOURCES_DEFAULTS.internalCost));
  const [value, setValue] = useState(s(SOURCES_DEFAULTS.valuePerRetainedHire));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('recruiting-roi-calculator');
  const r = useMemo(() => computeSources({ sources: rows.map((x) => ({ name: x.name || 'Source', spend: num(x.spend), hires: num(x.hires), retainedPct: num(x.retained) })), internalCost: num(internal), valuePerRetainedHire: num(value) }), [rows, internal, value]);
  const update = (id: number, patch: Partial<SourceRowState>) => setRows((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
        <p className="text-xs font-semibold">Hires by source over the same period</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground"><th className="text-left py-1 pr-2 font-medium">Source</th><th className="text-left py-1 px-2 font-medium">External spend</th><th className="text-left py-1 px-2 font-medium">Hires</th><th className="text-left py-1 px-2 font-medium">Still here after 1 year</th><th /></tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td className="py-1 pr-2"><Input aria-label={`Source ${i + 1} name`} value={row.name} onChange={(e) => update(row.id, { name: e.target.value })} className="text-sm min-w-[9rem]" placeholder="Source" /></td>
                  <td className="py-1 px-2"><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span><Input aria-label={`Source ${i + 1} spend`} type="number" min="0" step="500" value={row.spend} onChange={(e) => update(row.id, { spend: e.target.value })} className="text-sm w-32 pl-6" /></div></td>
                  <td className="py-1 px-2"><Input aria-label={`Source ${i + 1} hires`} type="number" min="0" step="1" value={row.hires} onChange={(e) => update(row.id, { hires: e.target.value })} className="text-sm w-20" /></td>
                  <td className="py-1 px-2"><div className="relative"><Input aria-label={`Source ${i + 1} retention`} type="number" min="0" max="100" step="5" value={row.retained} onChange={(e) => update(row.id, { retained: e.target.value })} className="text-sm w-24 pr-7" /><span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span></div></td>
                  <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove source" onClick={() => setRows((p) => (p.length > 1 ? p.filter((x) => x.id !== row.id) : p))}><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={rows.length >= 8} onClick={() => setRows((p) => [...p, { id: nextId++, name: '', spend: '', hires: '', retained: '80' }])}><Plus className="h-4 w-4 mr-1" /> Add source</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field id="sr-internal" label="Internal recruiting cost for the period" value={internal} onChange={setInternal} prefix="$" step="5000" help="Recruiter pay, ATS and tools; spread across hires" />
        <Field id="sr-value" label="First-year value of a hire who stays" value={value} onChange={setValue} prefix="$" step="5000" help="Their contribution net of their own pay" />
      </div>
      <Actions onExample={() => { setRows(toSourceRows()); setInternal('90000'); setValue('60000'); }} onSave={() => r && saveEntry({ rows: JSON.stringify(rows), internal, value }, `ROI ${pct(r.roiPct, 0)} · ${usd(r.costPerHire)} per hire · ${usd(r.costPerRetainedHire)} per retained hire`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter at least one source with a hire.</p>}
      {r && (
        <Result>
          <Headline label="Recruiting ROI (first-year value of retained hires vs. total cost)" value={pct(r.roiPct, 0)}>
            <strong className="text-foreground">{usd(r.totalCost)}</strong> spent for <strong className="text-foreground">{int(r.hires)}</strong> hires · <strong className="text-foreground">{usd(r.costPerHire)}</strong> per hire · <strong className="text-foreground">{usd(r.costPerRetainedHire)}</strong> per hire still here after a year ({pct(r.retentionPct, 0)} retained) · pays back in <strong className="text-foreground">{r.paybackMonths ?? '—'}</strong> months
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Source</Th><Th right>Total cost</Th><Th right>Hires</Th><Th right>Cost per hire</Th><Th right>Retained</Th><Th right>Cost per retained hire</Th><Th right>ROI</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {r.sources.map((x, i) => <tr key={i} className={x.name === r.best ? 'bg-emerald-500/5' : x.name === r.worst ? 'bg-red-500/5' : ''}><td className="px-3 py-2 font-medium">{x.name}{x.name === r.best && <span className="ml-2 text-[10px] uppercase text-emerald-600">best</span>}{x.name === r.worst && <span className="ml-2 text-[10px] uppercase text-red-500">dearest</span>}</td><td className="text-right px-3 py-2">{usd(x.totalCost)} <span className="text-xs text-muted-foreground">({pct(x.spendSharePct, 0)} of spend)</span></td><td className="text-right px-3 py-2">{int(x.hires)} <span className="text-xs text-muted-foreground">({pct(x.hireSharePct, 0)})</span></td><td className="text-right px-3 py-2">{usd(x.costPerHire)}</td><td className="text-right px-3 py-2">{x.retainedHires}</td><td className="text-right px-3 py-2 font-semibold">{usd(x.costPerRetainedHire)}</td><td className="text-right px-3 py-2">{pct(x.roiPct, 0)}</td></tr>)}
                <tr className="font-bold bg-muted/20"><td className="px-3 py-2">All sources</td><td className="text-right px-3 py-2">{usd(r.totalCost)}</td><td className="text-right px-3 py-2">{int(r.hires)}</td><td className="text-right px-3 py-2">{usd(r.costPerHire)}</td><td className="text-right px-3 py-2">{r.retainedHires}</td><td className="text-right px-3 py-2">{usd(r.costPerRetainedHire)}</td><td className="text-right px-3 py-2 text-emerald-600">{pct(r.roiPct, 0)}</td></tr>
              </tbody>
            </table>
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Total cost per source = its external spend + a share of internal recruiting cost in proportion to hires. Cost per retained hire divides by the hires still employed after a year, which is the figure that separates a cheap source from a good one. ROI = (retained hires × first-year value − cost) ÷ cost; the value per hire is your estimate, so compare sources with each other rather than reading the percentage as precise.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { try { const p = JSON.parse(i.rows) as SourceRowState[]; if (Array.isArray(p)) setRows(p); } catch {} setInternal(i.internal ?? '0'); setValue(i.value ?? '0'); }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── cost of turnover

function TurnoverMode() {
  const d = TURNOVER_DEFAULTS;
  const [headcount, setHeadcount] = useState(s(d.headcount));
  const [rate, setRate] = useState(s(d.annualTurnoverPct));
  const [salary, setSalary] = useState(s(d.avgSalary));
  const [separation, setSeparation] = useState(s(d.separationCost));
  const [vacDays, setVacDays] = useState(s(d.vacancyDays));
  const [vacPct, setVacPct] = useState(s(d.vacancyCostPct));
  const [recruiting, setRecruiting] = useState(s(d.recruitingCost));
  const [onboarding, setOnboarding] = useState(s(d.onboardingCost));
  const [rampMonths, setRampMonths] = useState(s(d.rampMonths));
  const [rampProd, setRampProd] = useState(s(d.rampProductivityPct));
  const [reduction, setReduction] = useState(s(d.reductionPts));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('cost-of-turnover-calculator');
  const r = useMemo(() => computeTurnover({ headcount: num(headcount), annualTurnoverPct: num(rate), avgSalary: num(salary), separationCost: num(separation), vacancyDays: num(vacDays), vacancyCostPct: num(vacPct), recruitingCost: num(recruiting), onboardingCost: num(onboarding), rampMonths: num(rampMonths), rampProductivityPct: num(rampProd), reductionPts: num(reduction) }), [headcount, rate, salary, separation, vacDays, vacPct, recruiting, onboarding, rampMonths, rampProd, reduction]);
  const inputs = { headcount, rate, salary, separation, vacDays, vacPct, recruiting, onboarding, rampMonths, rampProd, reduction };
  const restore = (i: Record<string, string>) => { setHeadcount(i.headcount ?? ''); setRate(i.rate ?? '0'); setSalary(i.salary ?? ''); setSeparation(i.separation ?? '0'); setVacDays(i.vacDays ?? '0'); setVacPct(i.vacPct ?? '0'); setRecruiting(i.recruiting ?? '0'); setOnboarding(i.onboarding ?? '0'); setRampMonths(i.rampMonths ?? '0'); setRampProd(i.rampProd ?? '100'); setReduction(i.reduction ?? '0'); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="to-hc" label="Headcount" value={headcount} onChange={setHeadcount} step="1" />
        <Field id="to-rate" label="Annual turnover" value={rate} onChange={setRate} suffix="%" step="0.5" />
        <Field id="to-salary" label="Average salary of leavers" value={salary} onChange={setSalary} prefix="$" step="1000" />
        <Field id="to-red" label="What if turnover fell by" value={reduction} onChange={setReduction} suffix="pts" step="0.5" />
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-3">
        <p className="text-xs font-semibold">Cost of replacing one leaver</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Field id="to-sep" label="Separation cost" value={separation} onChange={setSeparation} prefix="$" step="250" help="Exit admin, leave payout" />
          <Field id="to-vd" label="Days the seat is empty" value={vacDays} onChange={setVacDays} suffix="d" step="1" />
          <Field id="to-vp" label="Net cost of an empty day" value={vacPct} onChange={setVacPct} suffix="% pay" step="5" help="Lost output and cover, less pay saved" />
          <Field id="to-rec" label="Recruiting cost per hire" value={recruiting} onChange={setRecruiting} prefix="$" step="100" />
          <Field id="to-onb" label="Onboarding & training" value={onboarding} onChange={setOnboarding} prefix="$" step="250" />
          <Field id="to-rm" label="Months to full productivity" value={rampMonths} onChange={setRampMonths} suffix="mo" step="1" />
          <Field id="to-rp" label="Average productivity while ramping" value={rampProd} onChange={setRampProd} suffix="%" step="5" />
        </div>
      </div>
      <Actions onExample={() => restore({ headcount: '200', rate: '18', salary: '65000', separation: '2500', vacDays: '45', vacPct: '50', recruiting: '4700', onboarding: '3500', rampMonths: '5', rampProd: '50', reduction: '3' })} onSave={() => r && saveEntry(inputs, `${usd(r.costPerDeparture)} per leaver (${pct(r.pctOfSalary, 0)} of salary) · ${usd(r.annualCost)} a year`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter headcount and an average salary.</p>}
      {r && (
        <Result>
          <Headline label="Annual cost of turnover" value={usd(r.annualCost)}>
            <strong className="text-foreground">{r.departures}</strong> leavers a year × <strong className="text-foreground">{usd(r.costPerDeparture)}</strong> each (<strong className="text-foreground">{pct(r.pctOfSalary, 0)}</strong> of salary) · {usd(r.costPerEmployee)} per employee on the payroll
          </Headline>
          <Breakdown rows={r.components} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Cost per leaver" value={usd(r.costPerDeparture)} sub={`${pct(r.pctOfSalary, 0)} of ${usd(num(salary))}`} color="text-amber-600" />
            <Kpi label="Largest component" value={r.largest} sub="where to look first" />
            <Kpi label={`At ${pct(r.reducedTurnoverPct, 1)} turnover`} value={`${r.departuresAvoided} fewer`} sub="leavers a year" color="text-blue-600" />
            <Kpi label="Annual saving" value={usd(r.saving)} sub={`from −${num(reduction)} points`} color="text-emerald-600" />
          </div>
          <Note><UserMinus className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Cost per leaver = separation + vacancy (daily pay × empty days × net cost share) + recruiting + onboarding + ramp-up (monthly pay × ramp months × productivity shortfall). Ramp-up is usually the largest and least visible line. Estimates of total replacement cost commonly range from half to twice annual salary depending on seniority; build yours from your own figures and treat the result as an order of magnitude.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={restore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── training cost

function TrainingMode() {
  const d = TRAINING_DEFAULTS;
  const [participants, setParticipants] = useState(s(d.participants));
  const [hours, setHours] = useState(s(d.hoursPerParticipant));
  const [wage, setWage] = useState(s(d.hourlyWage));
  const [dev, setDev] = useState(s(d.developmentCost));
  const [delivery, setDelivery] = useState(s(d.deliveryCost));
  const [facility, setFacility] = useState(s(d.facilityCost));
  const [materials, setMaterials] = useState(s(d.materialsPerParticipant));
  const [travel, setTravel] = useState(s(d.travelPerParticipant));
  const [benefit, setBenefit] = useState(s(d.annualBenefit));
  const [payroll, setPayroll] = useState(s(d.annualPayroll));
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('training-cost-calculator');
  const r = useMemo(() => computeTraining({ participants: num(participants), hoursPerParticipant: num(hours), hourlyWage: num(wage), developmentCost: num(dev), deliveryCost: num(delivery), facilityCost: num(facility), materialsPerParticipant: num(materials), travelPerParticipant: num(travel), annualBenefit: num(benefit), annualPayroll: num(payroll) }), [participants, hours, wage, dev, delivery, facility, materials, travel, benefit, payroll]);
  const inputs = { participants, hours, wage, dev, delivery, facility, materials, travel, benefit, payroll };
  const restore = (i: Record<string, string>) => { setParticipants(i.participants ?? ''); setHours(i.hours ?? '0'); setWage(i.wage ?? '0'); setDev(i.dev ?? '0'); setDelivery(i.delivery ?? '0'); setFacility(i.facility ?? '0'); setMaterials(i.materials ?? '0'); setTravel(i.travel ?? '0'); setBenefit(i.benefit ?? '0'); setPayroll(i.payroll ?? '0'); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field id="tr-n" label="Participants" value={participants} onChange={setParticipants} step="1" />
        <Field id="tr-h" label="Hours per participant" value={hours} onChange={setHours} suffix="h" step="1" />
        <Field id="tr-w" label="Loaded hourly cost of their time" value={wage} onChange={setWage} prefix="$" step="1" help="Pay plus taxes and benefits" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field id="tr-dev" label="Development or license" value={dev} onChange={setDev} prefix="$" step="500" />
        <Field id="tr-del" label="Trainer / vendor fees" value={delivery} onChange={setDelivery} prefix="$" step="500" />
        <Field id="tr-fac" label="Facility" value={facility} onChange={setFacility} prefix="$" step="100" />
        <Field id="tr-mat" label="Materials per person" value={materials} onChange={setMaterials} prefix="$" step="5" />
        <Field id="tr-trv" label="Travel per person" value={travel} onChange={setTravel} prefix="$" step="25" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field id="tr-ben" label="Annual benefit you attribute to it (optional)" value={benefit} onChange={setBenefit} prefix="$" step="5000" help="Fewer errors, faster work, lower turnover" />
        <Field id="tr-pay" label="Annual payroll (optional)" value={payroll} onChange={setPayroll} prefix="$" step="50000" />
      </div>
      <Actions onExample={() => restore({ participants: '50', hours: '8', wage: '38', dev: '15000', delivery: '8000', facility: '1500', materials: '60', travel: '0', benefit: '90000', payroll: '3900000' })} onSave={() => r && saveEntry(inputs, `${usd(r.totalCost)} total · ${usd(r.costPerParticipant)} per person${r.roiPct !== null ? ` · ROI ${pct(r.roiPct, 0)}` : ''}`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter participants and at least one cost.</p>}
      {r && (
        <Result>
          <Headline label="Total training cost" value={usd(r.totalCost)}>
            <strong className="text-foreground">{usd(r.costPerParticipant)}</strong> per participant · <strong className="text-foreground">{usd(r.costPerHour, 2)}</strong> per training hour · participant time is <strong className="text-foreground">{pct(r.wagesSharePct, 0)}</strong> of the cost ({usd(r.wagesCost)} for {int(r.participantHours)} hours)
          </Headline>
          <Breakdown rows={r.components} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Out-of-pocket cost" value={usd(r.directCost)} sub={`${usd(r.directCostPerParticipant)} per participant`} />
            <Kpi label="Share of payroll" value={pct(r.pctOfPayroll, 2)} sub={r.pctOfPayroll === null ? 'enter annual payroll' : 'this program alone'} />
            <Kpi label="ROI in the first year" value={pct(r.roiPct, 0)} sub={r.roiPct === null ? 'enter a benefit' : `benefit ${usd(num(benefit))}`} color={r.roiPct !== null && r.roiPct < 0 ? 'text-red-500' : 'text-emerald-600'} />
            <Kpi label="Payback" value={r.paybackMonths === null ? '—' : `${r.paybackMonths} mo`} sub={`break-even ${usd(r.breakEvenBenefitPerParticipant)} benefit per person`} color="text-blue-600" />
          </div>
          <Note><GraduationCap className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Training cost = participant time + development + delivery + facility + materials + travel. The time people spend off their work is a real cost and is often the largest line, though it never appears on an invoice. ROI = (annual benefit − total cost) ÷ total cost; the benefit is your estimate, so state what it is made of (errors avoided, hours saved, leavers retained).</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={restore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── page

const ICONS = { time: Timer, sources: Target, turnover: UserMinus, training: GraduationCap };

export default function HiringMetricsSuite() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<HiringMode | null>(null);
  const mode: HiringMode = override ?? (isHiringMode(urlMode) ? urlMode : 'time');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <ModeTabs modes={HIRING_MODES} mode={mode} onChange={setMode} label="Hiring metrics mode" icons={ICONS} />
        {mode === 'time' && <TimeMode />}
        {mode === 'sources' && <SourcesMode />}
        {mode === 'turnover' && <TurnoverMode />}
        {mode === 'training' && <TrainingMode />}
      </div>
    </div>
  );
}

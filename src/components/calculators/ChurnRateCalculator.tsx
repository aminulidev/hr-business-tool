'use client';

import { useMemo, useState } from 'react';
import { Info, ShieldCheck, TrendingDown } from 'lucide-react';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Actions, Field, Headline, int, Kpi, ModeTabs, Note, num, pct, Result, usd } from './suite-ui';
import { CHURN_DEFAULTS, CHURN_MODES, computeChurn, isChurnMode, type ChurnMode } from '@/lib/pricing/saas-metrics';

// Phase 17: the gross-revenue-retention page 301s here with ?mode=retention.

const d = CHURN_DEFAULTS;

function useChurnState() {
  const [period, setPeriod] = useState(String(d.periodMonths));
  const [startC, setStartC] = useState(String(d.startCustomers));
  const [lostC, setLostC] = useState(String(d.lostCustomers));
  const [newC, setNewC] = useState(String(d.newCustomers));
  const [startMrr, setStartMrr] = useState(String(d.startMrr));
  const [churned, setChurned] = useState(String(d.churnedMrr));
  const [contraction, setContraction] = useState(String(d.contractionMrr));
  const [expansion, setExpansion] = useState(String(d.expansionMrr));
  const r = useMemo(() => computeChurn({ periodMonths: num(period) || 1, startCustomers: num(startC), lostCustomers: num(lostC), newCustomers: num(newC), startMrr: num(startMrr), churnedMrr: num(churned), contractionMrr: num(contraction), expansionMrr: num(expansion) }), [period, startC, lostC, newC, startMrr, churned, contraction, expansion]);
  const inputs = { period, startC, lostC, newC, startMrr, churned, contraction, expansion };
  const restore = (i: Record<string, string>) => { setPeriod(i.period ?? '1'); setStartC(i.startC ?? ''); setLostC(i.lostC ?? '0'); setNewC(i.newC ?? '0'); setStartMrr(i.startMrr ?? '0'); setChurned(i.churned ?? '0'); setContraction(i.contraction ?? '0'); setExpansion(i.expansion ?? '0'); };
  const example = () => restore({ period: '1', startC: '500', lostC: '20', newC: '35', startMrr: '100000', churned: '3000', contraction: '1200', expansion: '4500' });
  return { r, inputs, restore, example, period, setPeriod, startC, setStartC, lostC, setLostC, newC, setNewC, startMrr, setStartMrr, churned, setChurned, contraction, setContraction, expansion, setExpansion };
}

const PeriodField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => <Field id="ch-period" label="Period length" value={value} onChange={onChange} suffix="months" step="1" min="1" help="1 = monthly figures, 3 = quarterly, 12 = annual" />;

function ChurnModeView() {
  const s = useChurnState();
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('churn-rate-calculator');
  const r = s.r;
  const m = num(s.period) || 1;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <PeriodField value={s.period} onChange={s.setPeriod} />
        <Field id="ch-start" label="Customers at start" value={s.startC} onChange={s.setStartC} step="1" />
        <Field id="ch-lost" label="Customers lost" value={s.lostC} onChange={s.setLostC} step="1" help="Canceled or failed to renew" />
        <Field id="ch-new" label="New customers added" value={s.newC} onChange={s.setNewC} step="1" help="Not in the churn denominator" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="ch-mrr" label="MRR at start" value={s.startMrr} onChange={s.setStartMrr} prefix="$" step="1000" />
        <Field id="ch-churned" label="MRR lost to cancellations" value={s.churned} onChange={s.setChurned} prefix="$" step="100" />
        <Field id="ch-contr" label="MRR lost to downgrades" value={s.contraction} onChange={s.setContraction} prefix="$" step="100" />
        <Field id="ch-exp" label="Expansion MRR (optional)" value={s.expansion} onChange={s.setExpansion} prefix="$" step="100" help="For net churn" />
      </div>
      <Actions onExample={s.example} onSave={() => r && saveEntry(s.inputs, `Logo churn ${pct(r.logoChurnPct)} · revenue churn ${pct(r.grossRevenueChurnPct)} · ${pct(r.annualLogoChurnPct)} a year`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter the number of customers at the start of the period.</p>}
      {r && (
        <Result>
          <Headline label={`Customer (logo) churn${m !== 1 ? ` over ${m} months` : ' this month'}`} value={pct(r.logoChurnPct)}>
            <strong className="text-foreground">{int(num(s.lostC))}</strong> of {int(num(s.startC))} customers left · retention <strong className="text-foreground">{pct(r.logoRetentionPct)}</strong> · {m !== 1 ? <>≈ <strong className="text-foreground">{pct(r.monthlyLogoChurnPct, 2)}</strong> a month, </> : null}<strong className="text-foreground">{pct(r.annualLogoChurnPct)}</strong> a year compounded · ended with <strong className="text-foreground">{int(r.endCustomers)}</strong> customers ({r.netLogoGrowthPct >= 0 ? '+' : ''}{pct(r.netLogoGrowthPct)})
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="Gross revenue churn" value={pct(r.grossRevenueChurnPct)} sub="cancellations + downgrades ÷ starting MRR" color="text-red-500" />
            <Kpi label="Net revenue churn" value={pct(r.netRevenueChurnPct)} sub={r.netRevenueChurnPct < 0 ? 'negative: expansion beat churn' : 'after expansion'} color={r.netRevenueChurnPct <= 0 ? 'text-emerald-600' : 'text-amber-600'} />
            <Kpi label="Average customer lifetime" value={r.avgLifetimeMonths === null ? '—' : `${r.avgLifetimeMonths} mo`} sub="1 ÷ monthly churn" color="text-blue-600" />
            <Kpi label="Of today's cohort in 12 months" value={int(r.cohortAfter12Months)} sub={`of ${int(num(s.startC))} at this churn`} />
          </div>
          {r.churnerSizeRatio !== null && (
            <div className="rounded-xl bg-background border border-border/50 p-3 text-sm flex items-start gap-2">
              <TrendingDown className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <p>Lost customers were paying <strong>{usd(r.avgMrrPerLostCustomer, 2)}</strong> a month on average against <strong>{usd(r.avgMrrPerCustomer, 2)}</strong> for the base: {r.churnerSizeRatio < 0.9 ? 'churn is concentrated in smaller accounts, so revenue churn is milder than logo churn.' : r.churnerSizeRatio > 1.1 ? 'larger-than-average accounts are leaving — revenue churn is the number to worry about.' : 'churn is spread evenly across account sizes.'}</p>
            </div>
          )}
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Logo churn = customers lost ÷ customers at the start; new customers never enter the denominator. Annual churn compounds: 1 − (1 − monthly churn)^12, so {pct(r.monthlyLogoChurnPct, 1)} a month is {pct(r.annualLogoChurnPct)} a year, not {pct(r.monthlyLogoChurnPct * 12, 0)}. You need {int(r.replacementCustomers)} new customers per period just to stand still.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={s.restore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

function RetentionModeView() {
  const s = useChurnState();
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('gross-revenue-retention-calculator');
  const r = s.r;
  const m = num(s.period) || 1;
  const start = num(s.startMrr);
  const rows = [
    { label: 'Starting MRR', amount: start, cls: 'font-semibold bg-muted/20' },
    { label: 'Churned (cancellations)', amount: -num(s.churned), cls: 'text-red-500' },
    { label: 'Contraction (downgrades)', amount: -num(s.contraction), cls: 'text-red-500' },
    { label: 'Gross retained MRR', amount: start - num(s.churned) - num(s.contraction), cls: 'font-semibold', tag: r ? `GRR ${pct(r.grrPct)}` : '' },
    { label: 'Expansion (upsell, seats, cross-sell)', amount: num(s.expansion), cls: 'text-emerald-600' },
    { label: 'Net retained MRR', amount: start - num(s.churned) - num(s.contraction) + num(s.expansion), cls: 'font-bold bg-emerald-500/5', tag: r ? `NRR ${pct(r.nrrPct)}` : '' },
  ];
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Same cohort, before and after: only customers who were paying at the start count. New-customer MRR is excluded from both GRR and NRR.</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <PeriodField value={s.period} onChange={s.setPeriod} />
        <Field id="rt-mrr" label="Starting MRR" value={s.startMrr} onChange={s.setStartMrr} prefix="$" step="1000" />
        <Field id="rt-churned" label="Churned MRR" value={s.churned} onChange={s.setChurned} prefix="$" step="100" />
        <Field id="rt-contr" label="Contraction MRR" value={s.contraction} onChange={s.setContraction} prefix="$" step="100" />
        <Field id="rt-exp" label="Expansion MRR" value={s.expansion} onChange={s.setExpansion} prefix="$" step="100" />
      </div>
      <Actions onExample={s.example} onSave={() => r && saveEntry(s.inputs, `GRR ${pct(r.grrPct)} · NRR ${pct(r.nrrPct)}${m !== 1 ? ` (${m}-month)` : ''}`)} disabled={!r || start <= 0} />
      {(!r || start <= 0) && <p className="text-xs text-amber-600">Enter the starting MRR (and, on the churn tab, the customer count).</p>}
      {r && start > 0 && (
        <Result>
          <Headline label={`Gross revenue retention${m !== 1 ? ` (${m}-month)` : ''}`} value={pct(r.grrPct)}>
            Net revenue retention <strong className="text-foreground">{pct(r.nrrPct)}</strong> · annualized GRR <strong className="text-foreground">{pct(r.annualGrrPct)}</strong> · annualized NRR <strong className="text-foreground">{pct(r.annualNrrPct)}</strong>
          </Headline>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm"><tbody className="divide-y divide-border/30">
              {rows.map((x) => <tr key={x.label} className={x.cls.includes('bg-') ? x.cls : ''}><td className="px-3 py-2">{x.label}</td><td className={`text-right px-3 py-2 ${x.cls}`}>{x.amount < 0 ? '−' : ''}{usd(Math.abs(x.amount))}</td><td className="text-right px-3 py-2 text-xs text-muted-foreground w-28">{x.tag ?? (x.amount !== start ? pct((x.amount / start) * 100) : '')}</td></tr>)}
            </tbody></table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Kpi label="GRR" value={pct(r.grrPct)} sub="can never exceed 100%" color={r.grrPct >= 90 ? 'text-emerald-600' : r.grrPct >= 80 ? 'text-amber-600' : 'text-red-500'} />
            <Kpi label="NRR" value={pct(r.nrrPct)} sub={r.nrrPct > 100 ? 'above 100%: the base grows on its own' : 'below 100%: growth must come from new logos'} color={r.nrrPct >= 100 ? 'text-emerald-600' : 'text-amber-600'} />
            <Kpi label="Expansion needed for 100% NRR" value={usd(Math.max(0, num(s.churned) + num(s.contraction)))} sub={`you have ${usd(num(s.expansion))}`} color="text-blue-600" />
          </div>
          <Note><ShieldCheck className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />GRR = (starting MRR − churned − contraction) ÷ starting MRR; NRR adds expansion back. GRR shows how leaky the bucket is; NRR shows whether expansion fills it faster than it leaks. Public SaaS companies typically report NRR of 100–120% and GRR in the high 80s to mid 90s; compare like for like on period length, which is why the figures are annualized here.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={s.restore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

const ICONS = { churn: TrendingDown, retention: ShieldCheck };

export default function ChurnRateCalculator() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<ChurnMode | null>(null);
  const mode: ChurnMode = override ?? (isChurnMode(urlMode) ? urlMode : 'churn');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <ModeTabs modes={CHURN_MODES} mode={mode} onChange={setMode} label="Churn calculator mode" icons={ICONS} />
        {mode === 'churn' && <ChurnModeView />}
        {mode === 'retention' && <RetentionModeView />}
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { GitCompareArrows, Info, ShoppingBag, Wallet } from 'lucide-react';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Actions, Field, Headline, Kpi, ModeTabs, Note, num, pct, Result, Th, usd } from './suite-ui';
import {
  COMPARE_DEFAULTS,
  computeCompare,
  computeFiverrBuyer,
  computeFiverrSeller,
  FIVERR_BUYER_DEFAULTS,
  FIVERR_FEES,
  FIVERR_MODES,
  FIVERR_SELLER_DEFAULTS,
  isFiverrMode,
  type FiverrFees,
  type FiverrMode,
  type PlatformResult,
} from '@/lib/pricing/platform-fees';

// Fiverr fee calculator (Phase 17). Every fee is an editable setting because
// Fiverr and Upwork both change them; defaults live in platform-fees.ts.

const s = (n: number) => String(n);
type FeeState = { seller: string; buyer: string; small: string; threshold: string };
const DEFAULT_FEES: FeeState = { seller: s(FIVERR_FEES.sellerFeePct), buyer: s(FIVERR_FEES.buyerFeePct), small: s(FIVERR_FEES.smallOrderFee), threshold: s(FIVERR_FEES.smallOrderThreshold) };
const toFees = (f: FeeState): FiverrFees => ({ sellerFeePct: num(f.seller), buyerFeePct: num(f.buyer), smallOrderFee: num(f.small), smallOrderThreshold: num(f.threshold) });

function FeeSettings({ fees, onChange }: { fees: FeeState; onChange: (f: FeeState) => void }) {
  const changed = JSON.stringify(fees) !== JSON.stringify(DEFAULT_FEES);
  return (
    <details className="rounded-xl border border-border/50 bg-muted/20 p-3 text-sm">
      <summary className="cursor-pointer text-xs font-semibold">
        Fiverr fee settings: seller {fees.seller}% · buyer {fees.buyer}% + ${fees.small} under ${fees.threshold}{changed ? ' (edited)' : ''}
      </summary>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        <Field id="fee-seller" label="Seller fee" value={fees.seller} onChange={(x) => onChange({ ...fees, seller: x })} suffix="%" step="1" />
        <Field id="fee-buyer" label="Buyer service fee" value={fees.buyer} onChange={(x) => onChange({ ...fees, buyer: x })} suffix="%" step="0.5" />
        <Field id="fee-small" label="Small-order fee" value={fees.small} onChange={(x) => onChange({ ...fees, small: x })} prefix="$" step="0.5" />
        <Field id="fee-threshold" label="Applies to purchases under" value={fees.threshold} onChange={(x) => onChange({ ...fees, threshold: x })} prefix="$" step="5" />
      </div>
      <p className="text-xs text-muted-foreground mt-2">Defaults are the fees Fiverr publishes in 2026. The small-order fee has been raised twice in recent years, so if your checkout shows a different amount, enter it here.{changed && <> <button type="button" className="underline underline-offset-2" onClick={() => onChange(DEFAULT_FEES)}>Reset to defaults</button></>}</p>
    </details>
  );
}

// ───────────────────────── seller

function SellerMode() {
  const d = FIVERR_SELLER_DEFAULTS;
  const [price, setPrice] = useState(s(d.price));
  const [extras, setExtras] = useState(s(d.extras));
  const [tip, setTip] = useState(s(d.tip));
  const [orders, setOrders] = useState(s(d.ordersPerMonth));
  const [hours, setHours] = useState(s(d.hoursPerOrder));
  const [wFee, setWFee] = useState(s(d.withdrawalFee));
  const [wCount, setWCount] = useState(s(d.withdrawalsPerMonth));
  const [target, setTarget] = useState(s(d.targetNet));
  const [fees, setFees] = useState<FeeState>(DEFAULT_FEES);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('fiverr-fee-calculator');
  const r = useMemo(() => computeFiverrSeller({ price: num(price), extras: num(extras), tip: num(tip), ordersPerMonth: num(orders), hoursPerOrder: num(hours), withdrawalFee: num(wFee), withdrawalsPerMonth: num(wCount), targetNet: num(target), fees: toFees(fees) }), [price, extras, tip, orders, hours, wFee, wCount, target, fees]);
  const inputs = { price, extras, tip, orders, hours, wFee, wCount, target, fees: JSON.stringify(fees) };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="sl-price" label="Gig price" value={price} onChange={setPrice} prefix="$" step="5" />
        <Field id="sl-extras" label="Gig extras on the order" value={extras} onChange={setExtras} prefix="$" step="5" />
        <Field id="sl-tip" label="Tip from the buyer" value={tip} onChange={setTip} prefix="$" step="1" help="Fiverr takes its fee from tips too" />
        <Field id="sl-target" label="I want to keep (per order)" value={target} onChange={setTarget} prefix="$" step="5" help="For the price you need to list" />
        <Field id="sl-orders" label="Orders like this per month" value={orders} onChange={setOrders} step="1" />
        <Field id="sl-hours" label="Hours of work per order" value={hours} onChange={setHours} suffix="h" step="0.5" />
        <Field id="sl-wfee" label="Fee per withdrawal" value={wFee} onChange={setWFee} prefix="$" step="1" help="Depends on payout method and country" />
        <Field id="sl-wcount" label="Withdrawals per month" value={wCount} onChange={setWCount} step="1" />
      </div>
      <FeeSettings fees={fees} onChange={setFees} />
      <Actions onExample={() => { setPrice('150'); setExtras('40'); setTip('10'); setOrders('12'); setHours('4'); setWFee('0'); setWCount('2'); setTarget('200'); setFees(DEFAULT_FEES); }} onSave={() => r && saveEntry(inputs, `Order ${usd(r.orderValue, 2)} → you keep ${usd(r.netPerOrder, 2)} · ${usd(r.monthlyNet)} a month`)} disabled={!r} />
      {!r && <p className="text-xs text-amber-600">Enter a gig price.</p>}
      {r && (
        <Result>
          <Headline label="You keep from this order" value={usd(r.netPerOrder, 2)}>
            <strong className="text-foreground">{usd(r.orderValue, 2)}</strong> order − <strong className="text-foreground">{usd(r.fiverrFee, 2)}</strong> Fiverr fee ({num(fees.seller)}%{r.tipFee > 0 ? <>, including {usd(r.tipFee, 2)} from the tip</> : null}) · the buyer pays <strong className="text-foreground">{usd(r.buyerPays, 2)}</strong>, so Fiverr keeps <strong className="text-foreground">{pct(r.fiverrTakePct)}</strong> of what changes hands
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label={`Price to keep ${usd(num(target))}`} value={usd(r.priceForTarget, 2)} sub={r.shortfallIfAddingFee !== null ? `adding ${num(fees.seller)}% instead leaves you ${usd(r.shortfallIfAddingFee, 2)} short` : 'enter a target'} color="text-blue-600" />
            <Kpi label="Net per month" value={usd(r.monthlyNet)} sub={`${num(orders)} orders · ${usd(r.monthlyFees)} in fees${r.monthlyWithdrawalFees > 0 ? ` + ${usd(r.monthlyWithdrawalFees)} withdrawals` : ''}`} color="text-emerald-600" />
            <Kpi label="Net per year" value={usd(r.annualNet)} sub={`of ${usd(r.monthlyGross * 12)} billed`} />
            <Kpi label="Effective hourly rate" value={r.effectiveHourly === null ? '—' : usd(r.effectiveHourly, 2)} sub={r.grossHourly === null ? 'enter hours per order' : `${usd(r.grossHourly, 2)} before the fee`} color="text-amber-600" />
          </div>
          <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Fiverr takes its seller fee from the whole order value: the gig price, any extras and the tip. To keep a target amount, divide it by (1 − fee): {usd(num(target))} ÷ {(1 - num(fees.seller) / 100).toFixed(2)} = {usd(r.priceForTarget, 2)}. Earnings clear 14 days after an order is completed (7 days for Top Rated sellers) before they can be withdrawn. Fees are a business expense for tax purposes.</Note>
        </Result>
      )}
      <CalcHistoryPanel history={history} onRestore={(i) => { setPrice(i.price ?? ''); setExtras(i.extras ?? '0'); setTip(i.tip ?? '0'); setOrders(i.orders ?? '0'); setHours(i.hours ?? '0'); setWFee(i.wFee ?? '0'); setWCount(i.wCount ?? '0'); setTarget(i.target ?? '0'); try { const f = JSON.parse(i.fees) as FeeState; if (f && typeof f === 'object') setFees({ ...DEFAULT_FEES, ...f }); } catch {} }} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ───────────────────────── buyer

function BuyerMode() {
  const d = FIVERR_BUYER_DEFAULTS;
  const [order, setOrder] = useState(s(d.orderAmount));
  const [tip, setTip] = useState(s(d.tip));
  const [fees, setFees] = useState<FeeState>(DEFAULT_FEES);
  const r = useMemo(() => computeFiverrBuyer({ orderAmount: num(order), tip: num(tip), fees: toFees(fees) }), [order, tip, fees]);
  const ladder = useMemo(() => [5, 25, 50, 99, 100, 250, 500, 1000].map((amount) => ({ amount, r: computeFiverrBuyer({ orderAmount: amount, tip: 0, fees: toFees(fees) })! })), [fees]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field id="by-order" label="Order amount (gig price + extras)" value={order} onChange={setOrder} prefix="$" step="5" />
        <Field id="by-tip" label="Tip you plan to add" value={tip} onChange={setTip} prefix="$" step="1" />
      </div>
      <FeeSettings fees={fees} onChange={setFees} />
      {!r && <p className="text-xs text-amber-600">Enter an order amount.</p>}
      {r && (
        <Result>
          <Headline label="Total you pay" value={usd(r.total, 2)}>
            order {usd(num(order), 2)}{num(tip) > 0 ? <> + tip {usd(num(tip), 2)}</> : null} + <strong className="text-foreground">{usd(r.feeTotal, 2)}</strong> in Fiverr fees (<strong className="text-foreground">{pct(r.effectiveFeePct)}</strong> on top) · the seller receives <strong className="text-foreground">{usd(r.sellerReceives, 2)}</strong>
          </Headline>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label={`Service fee (${num(fees.buyer)}%)`} value={usd(r.percentageFee, 2)} />
            <Kpi label="Small-order fee" value={usd(r.smallOrderFee, 2)} sub={r.smallOrderFee > 0 ? `order is under ${usd(num(fees.threshold))}` : `none at ${usd(num(fees.threshold))} or more`} color={r.smallOrderFee > 0 ? 'text-amber-600' : 'text-emerald-600'} />
            <Kpi label="Fee on the tip" value={usd(r.tipFee, 2)} sub="a tip is a separate payment" />
            <Kpi label="Fiverr keeps in total" value={usd(r.fiverrKeeps, 2)} sub={`${pct(r.fiverrTakePct)} of what you pay`} color="text-red-500" />
          </div>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/20 text-xs text-muted-foreground"><Th>Order</Th><Th right>Fees</Th><Th right>You pay</Th><Th right>Fee on top</Th><Th right>Seller receives</Th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {ladder.map(({ amount, r: x }) => <tr key={amount}><td className="px-3 py-2">{usd(amount)}</td><td className="text-right px-3 py-2">{usd(x.feeTotal, 2)}</td><td className="text-right px-3 py-2 font-semibold">{usd(x.total, 2)}</td><td className={`text-right px-3 py-2 ${x.effectiveFeePct > 10 ? 'text-amber-600' : ''}`}>{pct(x.effectiveFeePct)}</td><td className="text-right px-3 py-2 text-muted-foreground">{usd(x.sellerReceives, 2)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <Note><ShoppingBag className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Buyers pay the order amount plus a service fee of {num(fees.buyer)}%, and a flat {usd(num(fees.small), 2)} on purchases under {usd(num(fees.threshold))}, which is why very small orders carry a large fee in percentage terms. The fee applies to each payment, including extras added later and tips. The checkout always shows the exact figure, with any tax, before you pay.</Note>
        </Result>
      )}
    </div>
  );
}

// ───────────────────────── Fiverr vs Upwork

function PlatformCard({ p, best }: { p: PlatformResult; best: boolean }) {
  return (
    <div className={`rounded-xl border p-4 space-y-2 bg-background ${best ? 'border-emerald-500/40' : 'border-border/50'}`}>
      <div className="flex items-center justify-between"><p className="font-semibold">{p.platform}</p>{best && <span className="text-[10px] uppercase text-emerald-600 font-semibold">freelancer keeps more</span>}</div>
      <table className="w-full text-sm"><tbody className="divide-y divide-border/30">
        <tr><td className="py-1.5">Client pays</td><td className="text-right py-1.5 font-semibold">{usd(p.clientPays, 2)}</td></tr>
        <tr><td className="py-1.5 text-muted-foreground">of which client-side fee</td><td className="text-right py-1.5 text-muted-foreground">{usd(p.clientFee, 2)}</td></tr>
        <tr><td className="py-1.5 text-muted-foreground">Freelancer-side fee</td><td className="text-right py-1.5 text-red-500">−{usd(p.freelancerFee, 2)}</td></tr>
        <tr><td className="py-1.5">Freelancer keeps</td><td className="text-right py-1.5 font-bold text-emerald-600">{usd(p.freelancerNets, 2)}</td></tr>
        <tr><td className="py-1.5">Platform keeps</td><td className="text-right py-1.5">{usd(p.platformKeeps, 2)} <span className="text-xs text-muted-foreground">({pct(p.takePct)})</span></td></tr>
        {p.priceForTarget !== null && <tr><td className="py-1.5">Quote to keep the target</td><td className="text-right py-1.5 text-blue-600 font-semibold">{usd(p.priceForTarget, 2)} <span className="text-xs text-muted-foreground font-normal">(client pays {usd(p.clientPaysForTarget, 2)})</span></td></tr>}
      </tbody></table>
    </div>
  );
}

function CompareMode() {
  const d = COMPARE_DEFAULTS;
  const [price, setPrice] = useState(s(d.projectPrice));
  const [target, setTarget] = useState(s(d.targetNet));
  const [uFee, setUFee] = useState(s(d.upworkFreelancerFeePct));
  const [uClient, setUClient] = useState(s(d.upworkClientFeePct));
  const [fees, setFees] = useState<FeeState>(DEFAULT_FEES);
  const r = useMemo(() => computeCompare({ projectPrice: num(price), targetNet: num(target), fiverr: toFees(fees), upworkFreelancerFeePct: num(uFee), upworkClientFeePct: num(uClient) }), [price, target, uFee, uClient, fees]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field id="cp-price" label="Job price quoted to the client" value={price} onChange={setPrice} prefix="$" step="25" />
        <Field id="cp-target" label="Freelancer wants to keep" value={target} onChange={setTarget} prefix="$" step="25" />
        <Field id="cp-ufee" label="Upwork freelancer fee on this contract" value={uFee} onChange={setUFee} suffix="%" step="1" help="0–15%, shown on the proposal; about 10% is typical" />
        <Field id="cp-uclient" label="Upwork client marketplace fee" value={uClient} onChange={setUClient} suffix="%" step="0.5" help="3–5% on the Basic plan" />
      </div>
      <FeeSettings fees={fees} onChange={setFees} />
      {!r && <p className="text-xs text-amber-600">Enter a job price.</p>}
      {r && (
        <Result>
          <Headline label={`On a ${usd(num(price))} job the freelancer keeps`} value={`${usd(r.fiverr.freelancerNets)} vs ${usd(r.upwork.freelancerNets)}`}>
            Fiverr vs Upwork · {r.freelancerDifference === 0 ? 'the same on both' : <><strong className="text-foreground">{usd(Math.abs(r.freelancerDifference), 2)}</strong> more on {r.freelancerDifference > 0 ? 'Upwork' : 'Fiverr'}</>} · the client pays <strong className="text-foreground">{usd(Math.abs(r.clientDifference), 2)}</strong> {r.clientDifference >= 0 ? 'more on Fiverr' : 'more on Upwork'}
          </Headline>
          <div className="grid sm:grid-cols-2 gap-3">
            <PlatformCard p={r.fiverr} best={r.freelancerDifference < 0} />
            <PlatformCard p={r.upwork} best={r.freelancerDifference > 0} />
          </div>
          <Note><GitCompareArrows className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Fiverr charges the seller a fixed {num(fees.seller)}% on every order; Upwork sets a freelancer fee between 0% and 15% for each contract and shows it before you send the proposal. Upwork would have to charge {pct(r.breakEvenUpworkFeePct, 0)} for the two to pay the freelancer the same. Fees are only part of the choice: Fiverr sells packaged gigs that buyers find, Upwork charges for the Connects used to bid on posted jobs. For Upwork take-home in detail, use the <a href="/calculators/upwork-fee-calculator" className="underline underline-offset-2 hover:text-foreground">Upwork Fee Calculator</a>.</Note>
        </Result>
      )}
    </div>
  );
}

// ───────────────────────── page

const ICONS = { seller: Wallet, buyer: ShoppingBag, compare: GitCompareArrows };

export default function FiverrFeeCalculator() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<FiverrMode | null>(null);
  const mode: FiverrMode = override ?? (isFiverrMode(urlMode) ? urlMode : 'seller');
  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        <ModeTabs modes={FIVERR_MODES} mode={mode} onChange={setMode} label="Fiverr fee calculator mode" icons={ICONS} />
        {mode === 'seller' && <SellerMode />}
        {mode === 'buyer' && <BuyerMode />}
        {mode === 'compare' && <CompareMode />}
      </div>
    </div>
  );
}

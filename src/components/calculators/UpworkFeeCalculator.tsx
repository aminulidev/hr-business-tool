'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowRightLeft } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface Snapshot {
  invoice: number;
  feeRate: number;
  serviceFee: number;
  takeHome: number;
  requiredBidForTarget: number;
  label: string;
}

export default function UpworkFeeCalculator() {
  const [invoiceAmount, setInvoiceAmount] = useState('1000');
  const [feeRatePct, setFeeRatePct] = useState('10');
  const [withdrawalFee, setWithdrawalFee] = useState('0');
  const [calculated, setCalculated] = useState(true);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    invoiceAmount: string;
    feeRatePct: string;
    withdrawalFee: string;
  }>('upwork-fee-calculator');

  const invoice = parseFloat(invoiceAmount) || 0;
  const feeRate = Math.min(Math.max(parseFloat(feeRatePct) || 0, 0), 99);
  const payoutFee = parseFloat(withdrawalFee) || 0;

  const serviceFee = invoice * (feeRate / 100);
  const takeHome = Math.max(0, invoice - serviceFee - payoutFee);
  // Reverse calculation: what to bid if you want `invoice` as your net take-home
  const requiredBidForTarget =
    feeRate < 100 ? (invoice + payoutFee) / (1 - feeRate / 100) : invoice;

  const handleTryExample = () => {
    setInvoiceAmount('1500');
    setFeeRatePct('10');
    setWithdrawalFee('0');
    setCalculated(true);
  };

  const handleCalculate = () => {
    if (invoice > 0) {
      setCalculated(true);
      saveEntry(
        { invoiceAmount, feeRatePct, withdrawalFee },
        `Take-home: ${formatCurrency(takeHome)} on ${formatCurrency(invoice)} (${feeRate}% fee)`
      );
    }
  };

  const handleReset = () => {
    setInvoiceAmount('');
    setFeeRatePct('10');
    setWithdrawalFee('0');
    setCalculated(false);
  };

  const handleRestore = (i: {
    invoiceAmount: string;
    feeRatePct: string;
    withdrawalFee: string;
  }) => {
    setInvoiceAmount(i.invoiceAmount);
    setFeeRatePct(i.feeRatePct);
    setWithdrawalFee(i.withdrawalFee || '0');
    setCalculated(true);
  };

  const snap = (): Snapshot => ({
    invoice,
    feeRate,
    serviceFee,
    takeHome,
    requiredBidForTarget,
    label: `Take-home: ${formatCurrency(takeHome)}`,
  });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          Calculate your exact Upwork take-home pay AND the reverse client bid needed to net your target income after Upwork’s 10% flat freelancer service fee (or 0% Direct-to-Talent / 5%–15% variable contract rates).
        </div>

        {/* Fee Tier Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">Contract Fee Preset:</span>
          {[
            { label: '10% Standard Marketplace', rate: '10' },
            { label: '5% Enterprise / Legacy $10k+', rate: '5' },
            { label: '15% Variable High-Tier', rate: '15' },
            { label: '0% Direct Contracts / BYO Client', rate: '0' },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setFeeRatePct(preset.rate);
                setCalculated(true);
              }}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                feeRatePct === preset.rate
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border/60'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceAmount">Invoice / Contract Amount ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="invoiceAmount"
                type="number"
                step="any"
                min="0"
                placeholder="1000"
                className="pl-7"
                value={invoiceAmount}
                onChange={(e) => {
                  setInvoiceAmount(e.target.value);
                  setCalculated(true);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feeRatePct">Upwork Service Fee (%)</Label>
            <Input
              id="feeRatePct"
              type="number"
              step="0.5"
              min="0"
              max="99"
              placeholder="10"
              value={feeRatePct}
              onChange={(e) => {
                setFeeRatePct(e.target.value);
                setCalculated(true);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="withdrawalFee">Withdrawal Fee ($ optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="withdrawalFee"
                type="number"
                step="0.5"
                min="0"
                placeholder="0.00"
                className="pl-7"
                value={withdrawalFee}
                onChange={(e) => {
                  setWithdrawalFee(e.target.value);
                  setCalculated(true);
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">ACH: $0 · Instant Pay: $2 · Wire: $30</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={invoice <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none"
            >
              Calculate Upwork Fees
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">
              Reset
            </Button>
          </div>
        </div>

        {calculated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="result-display mt-2"
            aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Freelancer Net Take-Home</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(takeHome)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-600">
                    Upwork Fee ({feeRate}%): −{formatCurrency(serviceFee)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">
                    <ArrowRightLeft className="h-3 w-3 mr-1 inline" />
                    Bid {formatCurrency(requiredBidForTarget)} to net {formatCurrency(invoice)}
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">
                    {compareA ? '↺ Set A' : '+ Save A'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">
                    {compareB ? '↺ Set B' : '+ Save B'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Client Invoice</p>
                  <p className="text-lg font-bold">{formatCurrency(invoice)}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Upwork Service Fee</p>
                  <p className="text-lg font-bold text-red-500">−{formatCurrency(serviceFee)}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Net Take-Home</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(takeHome)}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Bid Needed to Net {formatCurrency(invoice)}</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(requiredBidForTarget)}</p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                <strong>Reverse Bid Formula:</strong> To walk away with exactly {formatCurrency(invoice)} after a {feeRate}% Upwork fee, divide {formatCurrency(invoice)} by (1 − {(feeRate / 100).toFixed(2)}) = <strong>{formatCurrency(requiredBidForTarget)}</strong>. Note: Clients also pay a separate 5%–7.99% Upwork Marketplace Fee + $4.95–$14.95 contract initiation fee on their side.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Invoice', valueA: formatCurrency(compareA.invoice), valueB: formatCurrency(compareB.invoice), numA: compareA.invoice, numB: compareB.invoice },
          { label: 'Service Fee', valueA: formatCurrency(compareA.serviceFee), valueB: formatCurrency(compareB.serviceFee), numA: compareA.serviceFee, numB: compareB.serviceFee, higherIsBetter: false },
          { label: 'Take-Home', valueA: formatCurrency(compareA.takeHome), valueB: formatCurrency(compareB.takeHome), numA: compareA.takeHome, numB: compareB.takeHome },
          { label: 'Bid to Net Target', valueA: formatCurrency(compareA.requiredBidForTarget), valueB: formatCurrency(compareB.requiredBidForTarget), numA: compareA.requiredBidForTarget, numB: compareB.requiredBidForTarget, higherIsBetter: false },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel
              rows={rows}
              labelA={compareA.label}
              labelB={compareB.label}
              onClear={() => {
                setCompareA(null);
                setCompareB(null);
              }}
              onSwap={() => {
                const t = compareA;
                setCompareA(compareB);
                setCompareB(t);
              }}
            />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

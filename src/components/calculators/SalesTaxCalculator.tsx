'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, ArrowRightLeft } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

type TaxMode = 'forward' | 'reverse';

interface Snapshot {
  preTaxPrice: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
  label: string;
}

const STATE_TAX_PRESETS = [
  { label: 'CA (7.25%)', rate: '7.25' },
  { label: 'TX (6.25%)', rate: '6.25' },
  { label: 'NY (4.00%)', rate: '4.00' },
  { label: 'NYC (8.875%)', rate: '8.875' },
  { label: 'FL (6.00%)', rate: '6.00' },
  { label: 'IL (6.25%)', rate: '6.25' },
  { label: 'WA (6.50%)', rate: '6.50' },
  { label: 'PA (6.00%)', rate: '6.00' },
  { label: 'OR/NH/DE/MT (0%)', rate: '0' },
];

export default function SalesTaxCalculator() {
  const [mode, setMode] = useState<TaxMode>('forward');
  const [price, setPrice] = useState('100');
  const [taxRate, setTaxRate] = useState('7.25');
  const [quantity, setQuantity] = useState('1');
  const [calculated, setCalculated] = useState(true);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    price: string;
    taxRate: string;
  }>('sales-tax-calculator');

  const inputAmount = parseFloat(price) || 0;
  const r = Math.max(0, parseFloat(taxRate) || 0);
  const qty = Math.max(1, parseFloat(quantity) || 1);

  const subtotalInput = inputAmount * qty;
  const preTaxPrice =
    mode === 'forward' ? subtotalInput : subtotalInput / (1 + r / 100);
  const taxAmount =
    mode === 'forward'
      ? subtotalInput * (r / 100)
      : subtotalInput - preTaxPrice;
  const totalPrice = mode === 'forward' ? preTaxPrice + taxAmount : subtotalInput;

  const handleTryExample = () => {
    setPrice('250');
    setTaxRate('8.25');
    setQuantity('1');
    setCalculated(true);
  };

  const handleCalculate = () => {
    if (inputAmount > 0) {
      setCalculated(true);
      saveEntry(
        { price, taxRate },
        `Pre-tax ${formatCurrency(preTaxPrice)} + ${formatCurrency(taxAmount)} (${r}%) = ${formatCurrency(totalPrice)}`
      );
    }
  };

  const handleReset = () => {
    setPrice('');
    setTaxRate('7.25');
    setQuantity('1');
    setCalculated(false);
  };

  const handleRestore = (i: { price: string; taxRate: string }) => {
    setPrice(i.price);
    setTaxRate(i.taxRate);
    setCalculated(true);
  };

  const snap = (): Snapshot => ({
    preTaxPrice,
    taxRate: r,
    taxAmount,
    totalPrice,
    label: `${formatCurrency(totalPrice)} (@${r}%)`,
  });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Forward vs Reverse Sales Tax Mode */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-1 border border-border/50">
          <button
            type="button"
            onClick={() => setMode('forward')}
            className={`rounded-lg py-2 px-3 text-xs sm:text-sm font-medium transition-all ${
              mode === 'forward'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Add Sales Tax (Pre-Tax → Total)
          </button>
          <button
            type="button"
            onClick={() => setMode('reverse')}
            className={`rounded-lg py-2 px-3 text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              mode === 'reverse'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Reverse Sales Tax (Total → Pre-Tax)
          </button>
        </div>

        {/* Quick State Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground mr-1">State Rate Preset:</span>
          {STATE_TAX_PRESETS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setTaxRate(s.rate);
                setCalculated(true);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                taxRate === s.rate
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">
              {mode === 'forward' ? 'Pre-Tax Item Price ($)' : 'Tax-Inclusive Receipt Total ($)'}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="price"
                type="number"
                step="any"
                min="0"
                placeholder="100"
                className="pl-7"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setCalculated(true);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxRate">Sales Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="any"
              min="0"
              placeholder="7.25"
              value={taxRate}
              onChange={(e) => {
                setTaxRate(e.target.value);
                setCalculated(true);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (Units)</Label>
            <Input
              id="quantity"
              type="number"
              step="1"
              min="1"
              placeholder="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setCalculated(true);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={inputAmount <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none"
            >
              <Percent className="h-4 w-4 mr-1.5" />
              Calculate Sales Tax
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
                <p className="text-sm text-muted-foreground font-medium">
                  {mode === 'forward' ? 'Total Price Including Sales Tax' : 'Extracted Pre-Tax Subtotal'}
                </p>
                <p className="text-4xl font-bold text-emerald-600">
                  {formatCurrency(mode === 'forward' ? totalPrice : preTaxPrice)}
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
                    Pre-Tax: {formatCurrency(preTaxPrice)}
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">
                    Sales Tax ({r}%): {formatCurrency(taxAmount)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">
                    Total Receipt: {formatCurrency(totalPrice)}
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
                  <p className="text-xs text-muted-foreground mb-1">Pre-Tax Price</p>
                  <p className="text-lg font-bold">{formatCurrency(preTaxPrice)}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Tax Rate</p>
                  <p className="text-lg font-bold">{r}%</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Sales Tax</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(taxAmount)}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Gross Total</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalPrice)}</p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {mode === 'forward'
                  ? `Forward Formula: ${formatCurrency(preTaxPrice)} × (1 + ${(r / 100).toFixed(4)}) = ${formatCurrency(totalPrice)}.`
                  : `Reverse Sales Tax Formula: Never subtract ${r}% directly from the receipt total! Divide ${formatCurrency(totalPrice)} by (1 + ${(r / 100).toFixed(4)}) = ${formatCurrency(preTaxPrice)} pre-tax subtotal, leaving ${formatCurrency(taxAmount)} in collected sales tax.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Pre-Tax Price', valueA: formatCurrency(compareA.preTaxPrice), valueB: formatCurrency(compareB.preTaxPrice), numA: compareA.preTaxPrice, numB: compareB.preTaxPrice, higherIsBetter: false },
          { label: 'Sales Tax', valueA: formatCurrency(compareA.taxAmount), valueB: formatCurrency(compareB.taxAmount), numA: compareA.taxAmount, numB: compareB.taxAmount, higherIsBetter: false },
          { label: 'Total Price', valueA: formatCurrency(compareA.totalPrice), valueB: formatCurrency(compareB.totalPrice), numA: compareA.totalPrice, numB: compareB.totalPrice, higherIsBetter: false },
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

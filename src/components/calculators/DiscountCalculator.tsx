'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, DollarSign, Percent, Info } from 'lucide-react';
import TryExample from './TryExample';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DiscountType = 'percentage' | 'fixed';

interface DiscountStep {
  label: string;
  originalPrice: number;
  discountAmount: number;
  discountedPrice: number;
  rate: number;
}

interface DiscountResult {
  originalPrice: number;
  totalSaved: number;
  finalPrice: number;
  savingsPercent: number;
  steps: DiscountStep[];
  isChained: boolean;
}

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [enableSecondDiscount, setEnableSecondDiscount] = useState(false);
  const [secondDiscountValue, setSecondDiscountValue] = useState('');
  const [result, setResult] = useState<DiscountResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ originalPrice: string; discountType: string; discountValue: string; enableSecondDiscount: boolean; secondDiscountValue: string }>('discount-calculator');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ result: DiscountResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: DiscountResult; label: string } | null>(null);

    const handleTryExample = () => {
    setOriginalPrice('150');
    setDiscountValue('20');
    setResult(null);
  };

  const handleCalculate = () => {
    setResult(null);
    setError(null);

    const price = parseFloat(originalPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid original price greater than zero.');
      return;
    }

    const disc = parseFloat(discountValue);
    if (isNaN(disc) || disc < 0) {
      setError('Please enter a valid discount value (zero or greater).');
      return;
    }

    if (discountType === 'percentage' && disc > 100) {
      setError('Percentage discount cannot exceed 100%.');
      return;
    }

    if (discountType === 'fixed' && disc > price) {
      setError('Fixed discount cannot exceed the original price.');
      return;
    }

    const steps: DiscountStep[] = [];

    // Step 1: Apply first discount
    let firstDiscountAmount: number;
    let priceAfterFirst: number;

    if (discountType === 'percentage') {
      firstDiscountAmount = price * (disc / 100);
      priceAfterFirst = price - firstDiscountAmount;
    } else {
      firstDiscountAmount = disc;
      priceAfterFirst = price - disc;
    }

    steps.push({
      label: discountType === 'percentage' ? `${disc}% off` : `${formatCurrency(disc)} off`,
      originalPrice: price,
      discountAmount: firstDiscountAmount,
      discountedPrice: priceAfterFirst,
      rate: price > 0 ? (firstDiscountAmount / price) * 100 : 0,
    });

    // Step 2: Apply second (chained) discount if enabled
    if (enableSecondDiscount) {
      const secondDisc = parseFloat(secondDiscountValue);
      if (isNaN(secondDisc) || secondDisc < 0) {
        setError('Please enter a valid second discount value.');
        return;
      }
      if (secondDisc > 100) {
        setError('Second discount percentage cannot exceed 100%.');
        return;
      }

      const secondDiscountAmount = priceAfterFirst * (secondDisc / 100);
      const priceAfterSecond = priceAfterFirst - secondDiscountAmount;

      steps.push({
        label: `Extra ${secondDisc}% off`,
        originalPrice: priceAfterFirst,
        discountAmount: secondDiscountAmount,
        discountedPrice: priceAfterSecond,
        rate: priceAfterFirst > 0 ? (secondDiscountAmount / priceAfterFirst) * 100 : 0,
      });

      const totalSaved = price - priceAfterSecond;
      const savingsPercent = price > 0 ? (totalSaved / price) * 100 : 0;

      setResult({
        originalPrice: price,
        totalSaved,
        finalPrice: priceAfterSecond,
        savingsPercent,
        steps,
        isChained: true,
      });
    } else {
      const totalSaved = firstDiscountAmount;
      const savingsPercent = discountType === 'percentage' ? disc : (price > 0 ? (totalSaved / price) * 100 : 0);

      setResult({
        originalPrice: price,
        totalSaved,
        finalPrice: priceAfterFirst,
        savingsPercent,
        steps,
        isChained: false,
      });
    }
    saveEntry(
      { originalPrice, discountType, discountValue, enableSecondDiscount, secondDiscountValue },
      `${formatCurrency(parseFloat(originalPrice))} → ${formatCurrency(result?.finalPrice ?? 0)} (saved ${formatCurrency(result?.totalSaved ?? 0)})`
    );
  };

  const handleRestore = (inputs: { originalPrice: string; discountType: string; discountValue: string; enableSecondDiscount: boolean; secondDiscountValue: string }) => {
    setOriginalPrice(inputs.originalPrice);
    setDiscountType(inputs.discountType as DiscountType);
    setDiscountValue(inputs.discountValue);
    setEnableSecondDiscount(inputs.enableSecondDiscount);
    setSecondDiscountValue(inputs.secondDiscountValue);
    setResult(null);
  };

  const handleReset = () => {
    setOriginalPrice('');
    setDiscountType('percentage');
    setDiscountValue('');
    setEnableSecondDiscount(false);
    setSecondDiscountValue('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Original Price */}
        <div className="space-y-2">
          <Label htmlFor="originalPrice" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Original Price ($)
          </Label>
          <Input
            id="originalPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 120.00"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>

        {/* Discount Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Discount Type
          </Label>
          <Select
            value={discountType}
            onValueChange={(val) => {
              setDiscountType(val as DiscountType);
              setResult(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">
                <span className="flex items-center gap-2">
                  <Percent className="h-3.5 w-3.5" />
                  Percentage (%)
                </span>
              </SelectItem>
              <SelectItem value="fixed">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5" />
                  Fixed Amount ($)
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Discount Value */}
        <div className="space-y-2">
          <Label htmlFor="discountValue" className="text-sm font-medium">
            {discountType === 'percentage' ? (
              <>
                <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Discount Percentage (%)
              </>
            ) : (
              <>
                <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Discount Amount ($)
              </>
            )}
          </Label>
          <Input
            id="discountValue"
            type="number"
            min="0"
            max={discountType === 'percentage' ? '100' : undefined}
            step={discountType === 'percentage' ? '1' : '0.01'}
            placeholder={discountType === 'percentage' ? 'e.g., 25' : 'e.g., 15.00'}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
        </div>

        {/* Chained Discount Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4">
          <div className="space-y-0.5">
            <Label htmlFor="chainedToggle" className="text-sm font-medium cursor-pointer">
              Enable second (chained) discount
            </Label>
            <p className="text-xs text-muted-foreground">
              Apply an extra discount on the already-reduced price
            </p>
          </div>
          <button
            id="chainedToggle"
            type="button"
            role="switch"
            aria-checked={enableSecondDiscount}
            onClick={() => {
              setEnableSecondDiscount(!enableSecondDiscount);
              setResult(null);
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              enableSecondDiscount
                ? 'bg-emerald-500'
                : 'bg-input border border-border'
            }`}
          >
            <span
              className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                enableSecondDiscount ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Second Discount Value */}
        {enableSecondDiscount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="secondDiscount" className="text-sm font-medium">
              <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Second Discount (%)
            </Label>
            <Input
              id="secondDiscount"
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="e.g., 15"
              value={secondDiscountValue}
              onChange={(e) => setSecondDiscountValue(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Applied after the first discount, on the reduced price
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6">
            <TryExample onClick={handleTryExample} />
            <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            Calculate Discount
          </Button>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="shrink-0"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8" aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result — Final Price */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Final Sale Price
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.finalPrice)}
              </p>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-sm font-medium"
              >
                {result.savingsPercent.toFixed(1)}% total savings
              </Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-background border border-border/50 p-4 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">Original Price</p>
                <p className="text-xl font-bold">
                  {formatCurrency(result.originalPrice)}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-background border border-border/50 p-4 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">You Save</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(result.totalSaved)}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl bg-background border border-border/50 p-4 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">Final Price</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(result.finalPrice)}
                </p>
              </motion.div>
            </div>

            {/* Side-by-Side Comparison Bar */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Price Comparison</p>
              <div className="space-y-2">
                {/* Original price bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0 text-right">
                    Original
                  </span>
                  <div className="flex-1 h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-lg bg-gradient-to-r from-red-400/40 to-red-500/40 flex items-center justify-end pr-3"
                    >
                      <span className="text-xs font-semibold text-red-700">
                        {formatCurrency(result.originalPrice)}
                      </span>
                    </motion.div>
                  </div>
                </div>
                {/* Sale price bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0 text-right">
                    Sale
                  </span>
                  <div className="flex-1 h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{
                        width: `${Math.max((result.finalPrice / result.originalPrice) * 100, 2)}%`,
                      }}
                      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                      className="h-full rounded-lg bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 flex items-center justify-end pr-3"
                    >
                      <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap">
                        {formatCurrency(result.finalPrice)}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discount Steps Breakdown */}
            {result.isChained && result.steps.length > 1 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Discount Steps</p>
                <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                          Step
                        </th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                          Starting Price
                        </th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                          Discount
                        </th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                          After Discount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {result.steps.map((step, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                                {idx + 1}
                              </span>
                              {step.label}
                            </div>
                          </td>
                          <td className="text-right px-4 py-3 text-muted-foreground">
                            {formatCurrency(step.originalPrice)}
                          </td>
                          <td className="text-right px-4 py-3 text-emerald-600 font-medium">
                            −{formatCurrency(step.discountAmount)}
                          </td>
                          <td className="text-right px-4 py-3 font-semibold">
                            {formatCurrency(step.discountedPrice)}
                          </td>
                        </tr>
                      ))}
                      {/* Total row */}
                      <tr className="bg-emerald-500/5">
                        <td className="px-4 py-3 font-bold text-emerald-600" colSpan={2}>
                          Total Savings
                        </td>
                        <td className="text-right px-4 py-3 text-emerald-600 font-bold">
                          −{formatCurrency(result.totalSaved)}
                        </td>
                        <td className="text-right px-4 py-3 font-bold text-emerald-600">
                          {result.savingsPercent.toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                {result.isChained ? (
                  <p>
                    <strong>Chained discounts</strong> are applied sequentially. The combined effective discount of{' '}
                    {result.savingsPercent.toFixed(1)}% is less than the simple sum of{' '}
                    {result.steps.reduce((sum, s) => sum + s.rate, 0).toFixed(1)}% because each subsequent
                    discount applies to a smaller base.
                  </p>
                ) : (
                  <p>
                    <strong>Formula:</strong> {formatCurrency(result.originalPrice)} × (1 − {(result.savingsPercent / 100).toFixed(4)}) = {formatCurrency(result.finalPrice)}.
                    {' '}You save {formatCurrency(result.totalSaved)} ({result.savingsPercent.toFixed(1)}% off the original price).
                  </p>
                )}
              </div>
            </div>

            {/* Savings Pie Chart */}
            <div className="print:hidden">
              <p className="text-sm font-medium text-muted-foreground mb-3">Price Breakdown</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'You Save', value: result.totalSaved },
                      { name: 'Final Price', value: result.finalPrice },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#3b82f6" />
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---- Comparison save buttons ---- */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ result, label: `${formatCurrency(result.originalPrice)} · ${result.savingsPercent.toFixed(1)}% off` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ result, label: `${formatCurrency(result.originalPrice)} · ${result.savingsPercent.toFixed(1)}% off` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Original Price', valueA: formatCurrency(compareA.result.originalPrice), valueB: formatCurrency(compareB.result.originalPrice), numA: compareA.result.originalPrice, numB: compareB.result.originalPrice, higherIsBetter: false },
          { label: 'Final Price',    valueA: formatCurrency(compareA.result.finalPrice),    valueB: formatCurrency(compareB.result.finalPrice),    numA: compareA.result.finalPrice,    numB: compareB.result.finalPrice,    higherIsBetter: false },
          { label: 'Total Saved',    valueA: formatCurrency(compareA.result.totalSaved),    valueB: formatCurrency(compareB.result.totalSaved),    numA: compareA.result.totalSaved,    numB: compareB.result.totalSaved },
          { label: 'Savings %',      valueA: `${compareA.result.savingsPercent.toFixed(1)}%`, valueB: `${compareB.result.savingsPercent.toFixed(1)}%`, numA: compareA.result.savingsPercent, numB: compareB.result.savingsPercent },
        ];
        return (
          <ComparePanel
            rows={rows}
            labelA={compareA.label}
            labelB={compareB.label}
            onClear={() => { setCompareA(null); setCompareB(null); }}
            onSwap={() => { const tmp = compareA; setCompareA(compareB); setCompareB(tmp); }}
          />
        );
      })()}

      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}

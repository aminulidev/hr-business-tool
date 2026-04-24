'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, DollarSign, Percent, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
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
  const { history, saveEntry, clearHistory } = useCalcHistory<{ originalPrice: string; discountType: string; discountValue: string; enableSecondDiscount: boolean; secondDiscountValue: string }>('discount');

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

  const howToSteps = [
    'Enter the original price of the item or service before any discounts. This is the listed retail price or sticker price.',
    'Choose whether your discount is a percentage (e.g., 25% off) or a fixed dollar amount (e.g., $15 off).',
    'Enter the discount value — either the percentage rate or the dollar amount to subtract from the original price.',
    'Optionally, enable a second chained discount to model situations like "30% off, plus an extra 15% off the already-reduced price." Chained discounts are applied sequentially, not additively.',
    'Click "Calculate Discount" to see your total savings, final sale price, effective savings percentage, and a step-by-step breakdown of each discount applied.',
  ];

  const formula = 'Sale Price = Original Price × (1 − Discount%/100)';
  const formulaDescription =
    'For a percentage discount, multiply the original price by one minus the discount rate expressed as a decimal. For a fixed-amount discount, simply subtract the discount amount from the original price. When discounts are chained, each discount is applied to the price after the previous discount has been deducted, so the effective total discount is always less than the sum of the individual percentages.';

  const workedExamples = [
    {
      title: '25% Off a $120 Item',
      description:
        'A jacket originally priced at $120.00 is on sale for 25% off. The discount amount is $120.00 × 0.25 = $30.00. The final sale price is $120.00 − $30.00 = $90.00. You save $30.00, which is 25% of the original price.',
    },
    {
      title: '$15 Fixed Discount on an $89.99 Item',
      description:
        'A pair of shoes costs $89.99 with a coupon for $15.00 off. The discount amount is simply $15.00, so the final sale price is $89.99 − $15.00 = $74.99. Your effective savings percentage is ($15.00 / $89.99) × 100 = 16.67%.',
    },
    {
      title: 'Chained Discounts: 30% Off Then Extra 15% Off on $200',
      description:
        'A TV originally priced at $200.00 is offered at 30% off, with an additional 15% off the sale price. First discount: $200.00 × 0.30 = $60.00 off, bringing the price to $140.00. Second discount: $140.00 × 0.15 = $21.00 off, bringing the final price to $119.00. Total savings: $81.00 (40.5% effective). Note the combined effective discount (40.5%) is less than simply adding the percentages (45%), because the second discount applies to a smaller base.',
    },
  ];

  const faqs = [
    {
      question: 'What is the difference between a percentage discount and a fixed discount?',
      answer:
        'A percentage discount subtracts a percentage of the original price (e.g., 20% off $100 saves $20, final price $80). A fixed discount subtracts a specific dollar amount regardless of the price (e.g., $15 off $100 saves $15, final price $85). Percentage discounts scale with the item price, while fixed discounts provide the same dollar savings no matter the cost. Retailers often use percentage discounts on higher-priced items and fixed discounts as coupons or promotions.',
    },
    {
      question: 'How do chained (stacked) discounts work?',
      answer:
        'Chained discounts are applied one after another, each on the already-reduced price. For example, 30% off followed by 15% off on a $100 item: first, $100 × 0.30 = $30 off, price drops to $70. Then $70 × 0.15 = $10.50 off, final price $59.50. The total savings is $40.50 (40.5%), not 45%. This happens because the second discount applies to a smaller number. Retailers sometimes advertise "an extra 20% off" to make the deal sound bigger than the effective discount actually is.',
    },
    {
      question: 'How do retailers calculate sale prices?',
      answer:
        'Retailers typically start with a markup-based original price and then apply discounts to create perceived value. Common strategies include tiered pricing (buy 2 get 1 free), seasonal markdowns (end-of-season clearance), doorbuster deals (limited-time deep discounts), and loyalty member pricing. The advertised percentage off is always calculated from the original list price, not from any previously discounted price, unless explicitly stated as "additional" or "extra" off the sale price.',
    },
    {
      question: 'Is sales tax calculated before or after a discount?',
      answer:
        'In most U.S. states and many countries, sales tax is calculated on the discounted (final sale) price, not the original price. This means the discount also reduces the amount of tax you pay. For example, an item originally $100 with 20% off becomes $80. With an 8% sales tax rate, you pay $80 + $6.40 = $86.40, not $100 − $20 + $8.00 = $88.00. However, tax laws vary by jurisdiction, so always check your local regulations.',
    },
    {
      question: 'How do I find the original price from a sale price and discount?',
      answer:
        'To reverse-calculate the original price from a sale price and a known percentage discount, divide the sale price by (1 − discount rate). For example, if an item is $75 after 25% off: Original Price = $75 / (1 − 0.25) = $75 / 0.75 = $100. For fixed discounts, simply add the discount amount back: Original Price = Sale Price + Discount Amount. This is useful when you see a "was/now" price and want to verify the claimed discount percentage.',
    },
    {
      question: 'How much do Black Friday and Cyber Monday discounts actually save?',
      answer:
        'Black Friday discounts typically range from 20% to 50% on electronics, 30% to 60% on clothing, and 40% to 70% on home goods. Cyber Monday often features similar or slightly deeper discounts on tech and online-exclusive items. However, research shows that many "sale" prices are similar to prices available at other times of the year. The most significant savings tend to be on doorbuster deals (limited quantity, early access) and on big-ticket items like TVs, laptops, and appliances. Using this calculator to compare claimed savings can help you determine whether a deal is truly worth it.',
    },
  ];

  const relatedTools = [
    { slug: 'profit-margin', title: 'Profit Margin Calculator', description: 'Calculate profit margin and markup from cost and selling price', icon: 'Percent' },
    { slug: 'markup', title: 'Markup Calculator', description: 'Determine the right selling price from your cost basis', icon: 'TrendingUp' },
    { slug: 'roi', title: 'ROI Calculator', description: 'Evaluate the return on investment for business decisions', icon: 'BarChart3' },
    { slug: 'payroll', title: 'Payroll Calculator', description: 'Calculate employee payroll, taxes, and deductions', icon: 'CreditCard' },
    { slug: 'sales-commission', title: 'Sales Commission Calculator', description: 'Calculate commission earnings from sales revenue', icon: 'DollarSign' },
  ];

  return (
    <CalculatorLayout
      title="Discount Calculator"
      description="Calculate sale prices, savings amounts, and effective discount percentages — including chained and stacked discounts."
      icon={<Tag className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Discount Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={howToSteps}
      formula={formula}
      formulaDescription={formulaDescription}
      workedExamples={workedExamples}
      faqs={faqs}
      relatedTools={relatedTools}
    >
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
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            Calculate Discount
          </Button>
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
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} />
    </CalculatorLayout>
  );
}

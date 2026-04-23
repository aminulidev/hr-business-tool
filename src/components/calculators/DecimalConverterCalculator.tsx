'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Info, ArrowRight } from 'lucide-react';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ConversionMode = 'decimal-to-fraction' | 'fraction-to-decimal' | 'decimal-to-percent';

interface DecimalToFractionResult {
  original: number;
  wholeNumber: number;
  numerator: number;
  denominator: number;
  fractionStr: string;
  mixedStr: string;
  simplifiedFractionStr: string;
  simplifiedMixedStr: string;
}

interface FractionToDecimalResult {
  numerator: number;
  denominator: number;
  originalStr: string;
  decimal: number;
  decimalStr: string;
  isRepeating: boolean;
  repeatingDigits: string;
  decimalNotation: string;
}

interface DecimalToPercentResult {
  original: number;
  percentage: number;
  percentStr: string;
  fraction: string;
  simplifiedFraction: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function decimalToFraction(decimal: number): { whole: number; num: number; den: number } {
  let str = decimal.toString();
  let isNegative = false;
  if (str.startsWith('-')) {
    isNegative = true;
    str = str.slice(1);
  }

  const dotIndex = str.indexOf('.');
  const sign = isNegative ? -1 : 1;

  if (dotIndex === -1) {
    return { whole: sign * parseInt(str), num: 0, den: 1 };
  }

  const wholePart = parseInt(str.slice(0, dotIndex)) || 0;
  let decimalPart = str.slice(dotIndex + 1);

  // Trim trailing zeros
  decimalPart = decimalPart.replace(/0+$/, '');
  if (decimalPart === '') {
    return { whole: sign * wholePart, num: 0, den: 1 };
  }

  const denom = Math.pow(10, decimalPart.length);
  let numer = parseInt(decimalPart);

  const g = gcd(numer, denom);
  numer = numer / g;
  const simplifiedDen = denom / g;

  return { whole: sign * wholePart, num: numer, den: simplifiedDen };
}

function detectRepeatingDecimal(numerator: number, denominator: number): { decimal: string; isRepeating: boolean; repeatingDigits: string } {
  const sign = numerator * denominator < 0 ? -1 : 1;
  numerator = Math.abs(numerator);
  denominator = Math.abs(denominator);

  let integerPart = Math.floor(numerator / denominator);
  let remainder = numerator % denominator;

  if (remainder === 0) {
    return {
      decimal: sign === -1 ? `-${integerPart}` : `${integerPart}`,
      isRepeating: false,
      repeatingDigits: '',
    };
  }

  const decimalDigits: string[] = [];
  const seen: Map<number, number> = new Map();
  let repeatingStart = -1;
  let maxDigits = 20; // limit

  while (remainder !== 0 && decimalDigits.length < maxDigits) {
    if (seen.has(remainder)) {
      repeatingStart = seen.get(remainder)!;
      break;
    }
    seen.set(remainder, decimalDigits.length);
    remainder *= 10;
    const digit = Math.floor(remainder / denominator);
    decimalDigits.push(digit.toString());
    remainder = remainder % denominator;
  }

  let decimalStr: string;
  let isRepeating = false;
  let repeatingDigits = '';

  if (repeatingStart !== -1) {
    isRepeating = true;
    const nonRepeating = decimalDigits.slice(0, repeatingStart).join('');
    repeatingDigits = decimalDigits.slice(repeatingStart).join('');
    decimalStr = `${integerPart}.${nonRepeating}(${repeatingDigits.substring(0, 6)})`;
  } else {
    // Truncate to 6 decimal places
    const truncated = decimalDigits.slice(0, 6).join('');
    decimalStr = `${integerPart}.${truncated}`;
  }

  if (sign === -1) {
    decimalStr = `-${decimalStr}`;
  }

  return { decimal: decimalStr, isRepeating, repeatingDigits };
}

const commonConversions = [
  { decimal: '0.125', fraction: '1/8', percent: '12.5%' },
  { decimal: '0.25', fraction: '1/4', percent: '25%' },
  { decimal: '0.333', fraction: '1/3', percent: '33.33%' },
  { decimal: '0.375', fraction: '3/8', percent: '37.5%' },
  { decimal: '0.5', fraction: '1/2', percent: '50%' },
  { decimal: '0.625', fraction: '5/8', percent: '62.5%' },
  { decimal: '0.667', fraction: '2/3', percent: '66.67%' },
  { decimal: '0.75', fraction: '3/4', percent: '75%' },
  { decimal: '0.875', fraction: '7/8', percent: '87.5%' },
  { decimal: '1.0', fraction: '1', percent: '100%' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DecimalConverterCalculator() {
  const [mode, setMode] = useState<ConversionMode>('decimal-to-fraction');

  // Decimal to Fraction state
  const [decimalInput, setDecimalInput] = useState('');

  // Fraction to Decimal state
  const [numeratorInput, setNumeratorInput] = useState('');
  const [denominatorInput, setDenominatorInput] = useState('');

  // Decimal to Percent state
  const [percentInput, setPercentInput] = useState('');

  const [decFracResult, setDecFracResult] = useState<DecimalToFractionResult | null>(null);
  const [fracDecResult, setFracDecResult] = useState<FractionToDecimalResult | null>(null);
  const [decPctResult, setDecPctResult] = useState<DecimalToPercentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecimalToFraction = () => {
    setDecFracResult(null);
    setError(null);

    const val = parseFloat(decimalInput);
    if (isNaN(val)) {
      setError('Please enter a valid decimal number.');
      return;
    }

    const { whole, num, den } = decimalToFraction(val);
    const isNeg = val < 0;

    const fractionStr = num === 0 ? `${whole}` : `${whole * den + num}/${den}`;
    const mixedStr = num === 0 ? `${whole}` : whole !== 0 ? `${whole} ${num}/${den}` : `${num}/${den}`;

    // Simplified versions
    let simpNum = num;
    let simpDen = den;
    if (num !== 0) {
      const g = gcd(Math.abs(num), den);
      simpNum = num / g;
      simpDen = den / g;
    }

    const simplifiedFractionStr = simpNum === 0 ? `${whole}` : `${whole * simpDen + simpNum}/${simpDen}`;
    const simplifiedMixedStr = simpNum === 0 ? `${whole}` : whole !== 0 ? `${whole} ${simpNum}/${simpDen}` : `${simpNum}/${simpDen}`;

    setDecFracResult({
      original: val,
      wholeNumber: whole,
      numerator: num,
      denominator: den,
      fractionStr,
      mixedStr,
      simplifiedFractionStr,
      simplifiedMixedStr,
    });
  };

  const handleFractionToDecimal = () => {
    setFracDecResult(null);
    setError(null);

    const num = parseInt(numeratorInput);
    const den = parseInt(denominatorInput);

    if (isNaN(num)) {
      setError('Please enter a valid numerator.');
      return;
    }
    if (isNaN(den) || den === 0) {
      setError('Denominator cannot be zero.');
      return;
    }

    const { decimal: decimalStr, isRepeating, repeatingDigits } = detectRepeatingDecimal(num, den);
    const decimalValue = num / den;

    let notation = `${num}/${den} = ${decimalStr}`;
    if (isRepeating) {
      notation += ` (repeating)`;
    }

    setFracDecResult({
      numerator: num,
      denominator: den,
      originalStr: `${num}/${den}`,
      decimal: decimalValue,
      decimalStr: decimalStr,
      isRepeating,
      repeatingDigits,
      decimalNotation: notation,
    });
  };

  const handleDecimalToPercent = () => {
    setDecPctResult(null);
    setError(null);

    const val = parseFloat(percentInput);
    if (isNaN(val)) {
      setError('Please enter a valid decimal number.');
      return;
    }

    const percentage = val * 100;
    const { whole, num, den } = decimalToFraction(percentage);

    setDecPctResult({
      original: val,
      percentage,
      percentStr: `${percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(4)}%`,
      fraction: num === 0 ? `${whole}` : `${whole} ${num}/${den}`,
      simplifiedFraction: num === 0 ? `${whole}` : `${whole} ${num}/${den}`,
    });
  };

  const handleReset = () => {
    setDecimalInput('');
    setNumeratorInput('');
    setDenominatorInput('');
    setPercentInput('');
    setDecFracResult(null);
    setFracDecResult(null);
    setDecPctResult(null);
    setError(null);
  };

  const handleCalculate = () => {
    setError(null);
    if (mode === 'decimal-to-fraction') handleDecimalToFraction();
    else if (mode === 'fraction-to-decimal') handleFractionToDecimal();
    else handleDecimalToPercent();
  };

  // ------ SEO content ------

  const howToSteps = [
    'Select the conversion mode: "Decimal to Fraction" to convert decimals like 0.75 to fractions like 3/4, "Fraction to Decimal" to convert 5/8 to 0.625, or "Decimal to Percent" to convert 0.375 to 37.5%.',
    'Enter your value in the input field provided. For fraction-to-decimal mode, enter the numerator and denominator separately.',
    'Click "Convert" to see the result instantly. For decimals, the calculator finds the simplest fraction equivalent. For fractions, it detects repeating decimals up to 6 decimal places.',
    'Review the visual bar representation showing the proportion visually. The green portion represents the value relative to 1 (or 100% for percent mode).',
    'Use the quick reference table at the bottom for common conversions including 1/8, 1/4, 3/8, 1/2, 5/8, 3/4, and 7/8.',
  ];

  const formula = 'Decimal = Numerator / Denominator\nPercent = Decimal × 100';
  const formulaDescription =
    'To convert a fraction to a decimal, divide the numerator by the denominator. For example, 3/4 = 3 ÷ 4 = 0.75. To convert a decimal to a percent, multiply by 100: 0.75 × 100 = 75%. To convert a decimal to a fraction, determine the place value (tenths, hundredths, thousandths, etc.) and simplify using the greatest common divisor (GCD). For example, 0.375 has three decimal places, so it equals 375/1000, which simplifies to 3/8 by dividing numerator and denominator by their GCD of 125. Some fractions produce repeating decimals (like 1/3 = 0.333...), which are denoted with a bar or parentheses over the repeating digits.';

  const workedExamples = [
    {
      title: 'Decimal 0.75 to Fraction 3/4',
      description:
        'Convert 0.75 to a fraction. The decimal has two places, so it equals 75/100. Find the GCD of 75 and 100, which is 25. Divide both by 25: 75 ÷ 25 = 3, and 100 ÷ 25 = 4. So 0.75 = 3/4 in simplest form. Since 3/4 is a proper fraction (numerator < denominator), there is no whole number part.',
    },
    {
      title: 'Fraction 5/8 to Decimal 0.625',
      description:
        'Convert 5/8 to a decimal by dividing 5 by 8: 5 ÷ 8 = 0.625. This is a terminating decimal because 8 (the denominator) has only prime factors of 2. As a percentage: 0.625 × 100 = 62.5%. In mixed number terms, 5/8 is already a proper fraction, so it equals 0 5/8 as a mixed number.',
    },
    {
      title: 'Decimal 0.375 to Percent 37.5%',
      description:
        'Convert 0.375 to a percentage: 0.375 × 100 = 37.5%. To find the fraction: 0.375 has three decimal places, so it equals 375/1000. GCD of 375 and 1000 is 125. Simplified: 375 ÷ 125 = 3, and 1000 ÷ 125 = 8. So 0.375 = 3/8 = 37.5%. This is particularly useful in payroll calculations, where 3/8 of an hour equals 0.375 hours or 22.5 minutes.',
    },
  ];

  const faqs = [
    {
      question: 'How do I convert a decimal to a fraction?',
      answer:
        'To convert a decimal to a fraction: (1) Write the decimal as a fraction with a denominator that is a power of 10. The denominator is 10 for one decimal place, 100 for two places, 1000 for three places, etc. (2) Simplify the fraction by dividing both numerator and denominator by their greatest common divisor (GCD). For example, 0.625 = 625/1000. The GCD of 625 and 1000 is 125. So 625 ÷ 125 = 5, and 1000 ÷ 125 = 8. Therefore, 0.625 = 5/8. For mixed numbers like 2.75: the whole number is 2, and 0.75 = 3/4, so the mixed number is 2 3/4 (or 11/4 as an improper fraction).',
    },
    {
      question: 'What is a repeating decimal?',
      answer:
        'A repeating decimal is a decimal number where one or more digits repeat infinitely after the decimal point. For example, 1/3 = 0.333..., 2/3 = 0.666..., and 1/7 = 0.142857142857.... Repeating decimals occur when the denominator of the fraction (in simplest form) has prime factors other than 2 or 5. They are typically written with a bar over the repeating digits: 0.3̄ for 1/3, or with parentheses: 0.(3). Some decimals have a non-repeating part followed by a repeating part, like 1/6 = 0.1(6) where the 6 repeats. This calculator detects repeating patterns up to 6 decimal places.',
    },
    {
      question: 'How do I simplify fractions?',
      answer:
        'To simplify a fraction, divide both the numerator and denominator by their greatest common divisor (GCD). The GCD is the largest number that divides both evenly. For example, to simplify 12/18: the factors of 12 are 1, 2, 3, 4, 6, 12. The factors of 18 are 1, 2, 3, 6, 9, 18. The GCD is 6. Divide both by 6: 12 ÷ 6 = 2, 18 ÷ 6 = 3. So 12/18 simplifies to 2/3. A fraction is fully simplified when the GCD of the numerator and denominator is 1 (they are coprime). You can use the Euclidean algorithm to find the GCD: repeatedly divide the larger number by the smaller, then the divisor by the remainder, until the remainder is 0.',
    },
    {
      question: 'What is a mixed number?',
      answer:
        'A mixed number combines a whole number and a proper fraction. It represents a quantity greater than 1 but not a whole number. For example, 2 3/4 means 2 wholes plus 3/4 of another. To convert an improper fraction (where the numerator is greater than or equal to the denominator) to a mixed number, divide the numerator by the denominator. The quotient is the whole number, and the remainder becomes the new numerator over the original denominator. For example, 11/4: 11 ÷ 4 = 2 remainder 3, so 11/4 = 2 3/4. To convert a mixed number back to an improper fraction: (whole × denominator) + numerator / denominator = (2 × 4) + 3 / 4 = 11/4.',
    },
    {
      question: 'Why are decimal conversions important in payroll?',
      answer:
        'Decimal conversions are essential in payroll because time is often tracked in hours and minutes, but payroll systems require decimal hours. For example, 30 minutes = 0.5 hours, 15 minutes = 0.25 hours, 45 minutes = 0.75 hours, and 22.5 minutes = 0.375 hours. Common payroll time conversions include: 1/4 hour = 0.25 (15 min), 1/2 hour = 0.5 (30 min), 3/4 hour = 0.75 (45 min), 1/8 hour = 0.125 (7.5 min), 1/10 hour = 0.1 (6 min). Understanding these conversions ensures accurate calculation of hourly wages, overtime, and total pay. The military and many organizations also use decimal time for scheduling and timekeeping.',
    },
    {
      question: 'What are common fraction-decimal equivalents I should know?',
      answer:
        'Here are the most commonly used fraction-decimal-percent equivalents: 1/8 = 0.125 = 12.5%, 1/4 = 0.25 = 25%, 1/3 ≈ 0.333 = 33.33%, 3/8 = 0.375 = 37.5%, 1/2 = 0.5 = 50%, 5/8 = 0.625 = 62.5%, 2/3 ≈ 0.667 = 66.67%, 3/4 = 0.75 = 75%, 7/8 = 0.875 = 87.5%. These fractions correspond to common measurements in construction, cooking, time tracking, and finance. Memorizing the eighths (1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8) is particularly useful because they appear frequently in real-world measurements and calculations.',
    },
  ];

  const relatedTools = [
    { slug: 'time-card', title: 'Time Card Calculator', description: 'Convert clock-in/out times to decimal hours for payroll', icon: 'Clock' },
    { slug: 'discount', title: 'Discount Calculator', description: 'Calculate sale prices and percentage discounts', icon: 'Tag' },
    { slug: 'profit-margin', title: 'Profit Margin Calculator', description: 'Calculate profit margin percentage from cost and revenue', icon: 'Percent' },
    { slug: 'payroll', title: 'Payroll Calculator', description: 'Estimate your take-home pay after taxes and deductions', icon: 'CreditCard' },
    { slug: 'salary-converter', title: 'Salary Converter', description: 'Convert between hourly, weekly, and annual pay rates', icon: 'ArrowLeftRight' },
  ];

  return (
    <CalculatorLayout
      title="Decimal & Fraction Converter"
      description="Convert between decimals, fractions, and percentages instantly. Essential for payroll processing, grade calculations, and everyday math."
      icon={<Hash className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Decimal & Fraction Converter' }]}
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
        {/* Mode Toggle */}
        <div className="flex flex-wrap rounded-xl bg-muted/50 p-1 border border-border/50 gap-1">
          {([
            { value: 'decimal-to-fraction' as ConversionMode, label: 'Decimal → Fraction' },
            { value: 'fraction-to-decimal' as ConversionMode, label: 'Fraction → Decimal' },
            { value: 'decimal-to-percent' as ConversionMode, label: 'Decimal → Percent' },
          ]).map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => { setMode(m.value); setError(null); setDecFracResult(null); setFracDecResult(null); setDecPctResult(null); }}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                mode === m.value
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Mode: Decimal to Fraction */}
        {mode === 'decimal-to-fraction' && (
          <motion.div
            key="dec-frac"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="decimalInput" className="text-sm font-medium">
                <Hash className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Enter Decimal
              </Label>
              <Input
                id="decimalInput"
                type="number"
                step="0.001"
                placeholder="e.g., 0.75 or 2.375"
                value={decimalInput}
                onChange={(e) => setDecimalInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter any decimal number (positive or negative)
              </p>
            </div>
          </motion.div>
        )}

        {/* Mode: Fraction to Decimal */}
        {mode === 'fraction-to-decimal' && (
          <motion.div
            key="frac-dec"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="numeratorInput" className="text-sm font-medium">
                  <Hash className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Numerator
                </Label>
                <Input
                  id="numeratorInput"
                  type="number"
                  step="1"
                  placeholder="e.g., 5"
                  value={numeratorInput}
                  onChange={(e) => setNumeratorInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="denominatorInput" className="text-sm font-medium">
                  <Hash className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Denominator
                </Label>
                <Input
                  id="denominatorInput"
                  type="number"
                  step="1"
                  placeholder="e.g., 8"
                  value={denominatorInput}
                  onChange={(e) => setDenominatorInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">
                {numeratorInput || '?'} / {denominatorInput || '?'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Mode: Decimal to Percent */}
        {mode === 'decimal-to-percent' && (
          <motion.div
            key="dec-pct"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="percentInput" className="text-sm font-medium">
                <Hash className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Enter Decimal
              </Label>
              <Input
                id="percentInput"
                type="number"
                step="0.01"
                placeholder="e.g., 0.375"
                value={percentInput}
                onChange={(e) => setPercentInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The decimal will be multiplied by 100 to get the percentage
              </p>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Convert
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

        {/* ================================================================= */}
        {/* Results: Decimal to Fraction                                       */}
        {/* ================================================================= */}
        {mode === 'decimal-to-fraction' && decFracResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="result-display mt-6" aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              {/* Main Result */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {decFracResult.original} as a Fraction
                </p>
                <p className="text-4xl font-bold text-emerald-600">
                  {decFracResult.simplifiedMixedStr}
                </p>
                {decFracResult.numerator > 0 && decFracResult.denominator > 1 && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-sm font-medium"
                  >
                    Improper: {decFracResult.simplifiedFractionStr}
                  </Badge>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Whole Number</p>
                  <p className="text-xl font-bold">{decFracResult.wholeNumber}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Numerator</p>
                  <p className="text-xl font-bold text-emerald-600">{decFracResult.numerator}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Denominator</p>
                  <p className="text-xl font-bold text-emerald-600">{decFracResult.denominator}</p>
                </motion.div>
              </div>

              {/* Visual Bar */}
              {(() => {
                const frac = decFracResult.original % 1;
                const barPct = Math.min(Math.max(Math.abs(frac !== 0 ? frac : decFracResult.original) * 100, 2), 100);
                return (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Visual Representation</p>
                    <div className="h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: barPct + '%' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-lg bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 flex items-center justify-end pr-3"
                      >
                        <span className="text-xs font-semibold text-emerald-700">
                          {(Math.abs(frac !== 0 ? frac : decFracResult.original) * 100).toFixed(1)}%
                        </span>
                      </motion.div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Fractional part of 1 whole unit
                    </p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* Results: Fraction to Decimal                                       */}
        {/* ================================================================= */}
        {mode === 'fraction-to-decimal' && fracDecResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="result-display mt-6" aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              {/* Main Result */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {fracDecResult.originalStr} as a Decimal
                </p>
                <p className="text-4xl font-bold text-emerald-600">
                  {fracDecResult.decimalStr}
                </p>
                {fracDecResult.isRepeating && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 border-amber-500/30 text-amber-600 px-3 py-1 text-sm font-medium"
                  >
                    Repeating Decimal
                  </Badge>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Fraction</p>
                  <p className="text-lg font-bold">{fracDecResult.originalStr}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Decimal</p>
                  <p className="text-lg font-bold text-emerald-600">{fracDecResult.decimalStr}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Percentage</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {(Math.abs(fracDecResult.decimal) * 100).toFixed(4)}%
                  </p>
                </motion.div>
              </div>

              {/* Visual Bar */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Visual Representation</p>
                <div className="h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${Math.min(Math.max(Math.abs(fracDecResult.decimal) * 100, 2), 100)}%`,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-lg bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 flex items-center justify-end pr-3"
                  >
                    <span className="text-xs font-semibold text-emerald-700">
                      {(Math.abs(fracDecResult.decimal) * 100).toFixed(1)}%
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Repeating Info */}
              {fracDecResult.isRepeating && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                  <p>
                    <strong>Repeating decimal:</strong> {fracDecResult.originalStr} produces a repeating decimal.
                    The digits <strong>{fracDecResult.repeatingDigits.substring(0, 6)}</strong> repeat infinitely.
                    This occurs because the denominator (after simplification) has prime factors other than 2 and 5.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* Results: Decimal to Percent                                        */}
        {/* ================================================================= */}
        {mode === 'decimal-to-percent' && decPctResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="result-display mt-6" aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              {/* Main Result */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {decPctResult.original} as a Percentage
                </p>
                <p className="text-4xl font-bold text-emerald-600">
                  {decPctResult.percentStr}
                </p>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-sm font-medium"
                >
                  Fraction: {decPctResult.simplifiedFraction}
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
                  <p className="text-xs text-muted-foreground mb-1">Decimal</p>
                  <p className="text-lg font-bold">{decPctResult.original}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Percentage</p>
                  <p className="text-lg font-bold text-emerald-600">{decPctResult.percentStr}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Fraction</p>
                  <p className="text-lg font-bold text-emerald-600">{decPctResult.simplifiedFraction}</p>
                </motion.div>
              </div>

              {/* Visual Bar */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Visual Representation</p>
                <div className="h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${Math.min(Math.max(Math.abs(decPctResult.percentage), 2), 100)}%`,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-lg bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 flex items-center justify-end pr-3"
                  >
                    <span className="text-xs font-semibold text-emerald-700">
                      {decPctResult.percentStr}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* Quick Reference Table                                              */}
        {/* ================================================================= */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Common Conversions Reference</p>
          <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30 sticky top-0">
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Decimal</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Fraction</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Percent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {commonConversions.map((row) => (
                    <tr key={row.decimal}>
                      <td className="text-center px-4 py-3 font-mono">{row.decimal}</td>
                      <td className="text-center px-4 py-3 font-medium">{row.fraction}</td>
                      <td className="text-center px-4 py-3 text-emerald-600 font-medium">{row.percent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}

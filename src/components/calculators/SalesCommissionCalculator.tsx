'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Percent,
  Layers,
  Target,
  Info,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
} from 'lucide-react';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatPercent = (value: number): string =>
  `${value.toFixed(2)}%`;

const parseNum = (val: string): number => {
  const n = parseFloat(val);
  return isNaN(n) || n < 0 ? 0 : n;
};

// ─── Types ─────────────────────────────────────────────────────────────────

interface Tier {
  id: string;
  from: string;
  to: string;
  rate: string;
}

interface TierResult {
  tierLabel: string;
  from: number;
  to: number;
  rate: number;
  salesInRange: number;
  commission: number;
}

interface Deductions {
  enabled: boolean;
  brokerFees: string;
  processingFees: string;
  otherDeductions: string;
}

type CalcMode = 'simple' | 'tiered' | 'quota';

// ─── Defaults ──────────────────────────────────────────────────────────────

const defaultTiers = (): Tier[] => [
  { id: '1', from: '0', to: '50000', rate: '5' },
  { id: '2', from: '50000', to: '150000', rate: '8' },
  { id: '3', from: '150000', to: '', rate: '12' },
];

let nextId = 4;
const makeId = () => String(nextId++);

const TIER_COLORS = ['#34d399', '#10b981', '#059669', '#047857', '#065f46'];

// ─── Tooltip Label ─────────────────────────────────────────────────────────

function TipLabel({ children, tip }: { children: React.ReactNode; tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help">
          {children}
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-xs text-xs">
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Currency Input ────────────────────────────────────────────────────────

function CurrencyInput({
  id,
  label,
  tip,
  placeholder,
  value,
  onChange,
  className = '',
}: {
  id: string;
  label: string;
  tip: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        <TipLabel tip={tip}>{label}</TipLabel>
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">
          $
        </span>
        <Input
          id={id}
          type="number"
          min="0"
          step="0.01"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-7"
        />
      </div>
    </div>
  );
}

// ─── Percent Input ─────────────────────────────────────────────────────────

function PercentInput({
  id,
  label,
  tip,
  placeholder,
  value,
  onChange,
  className = '',
}: {
  id: string;
  label: string;
  tip: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        <TipLabel tip={tip}>{label}</TipLabel>
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          min="0"
          step="0.01"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-7"
        />
        <span className="absolute right-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">
          %
        </span>
      </div>
    </div>
  );
}

// ─── Quota Progress Bar ────────────────────────────────────────────────────

function QuotaProgressBar({ attainment }: { attainment: number }) {
  const clamped = Math.min(Math.max(attainment, 0), 200);
  const barPercent = Math.min(clamped, 100);

  const getColor = () => {
    if (attainment >= 100) return 'bg-emerald-500';
    if (attainment >= 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
        <span>150%+</span>
      </div>
      <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-[25%] bg-red-500/15" />
          <div className="w-[25%] bg-amber-500/15" />
          <div className="w-[25%] bg-emerald-500/15" />
          <div className="w-[25%] bg-emerald-500/15" />
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 rounded-full ${getColor()} shadow-lg`}
        />
        {attainment > 100 && (
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-emerald-400/30 rounded-r-full flex items-center justify-center">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {attainment < 100 ? 'Below quota' : attainment === 100 ? 'At quota' : 'Above quota — accelerator active!'}
        </span>
        {attainment > 100 && (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            {formatPercent(attainment)}
          </Badge>
        )}
      </div>
    </div>
  );
}

// ─── Insight Box ───────────────────────────────────────────────────────────

function InsightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 p-3.5 text-sm">
      <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
      <div className="text-amber-800 dark:text-amber-200 leading-relaxed">{children}</div>
    </div>
  );
}

// ─── Deductions Section ────────────────────────────────────────────────────

function DeductionsSection({ deductions, setDeductions }: { deductions: Deductions; setDeductions: React.Dispatch<React.SetStateAction<Deductions>> }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="include-deductions" className="text-sm font-medium flex items-center gap-2">
          <TipLabel tip="Enable this to subtract broker fees, processing fees, and other deductions from your gross commission to see your net take-home amount.">
            Include Deductions
          </TipLabel>
        </Label>
        <Switch
          id="include-deductions"
          checked={deductions.enabled}
          onCheckedChange={(checked) =>
            setDeductions((d) => ({ ...d, enabled: checked }))
          }
        />
      </div>

      <AnimatePresence>
        {deductions.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <CurrencyInput
                id="broker-fees"
                label="Broker / Agent Fees"
                tip="Fees paid to a broker, agency, or referral partner. Common in real estate and insurance industries."
                placeholder="0.00"
                value={deductions.brokerFees}
                onChange={(v) => setDeductions((d) => ({ ...d, brokerFees: v }))}
              />
              <CurrencyInput
                id="processing-fees"
                label="Processing / Platform Fees"
                tip="Fees charged by payment processors, platforms, or marketplaces. Common in e-commerce and freelance work."
                placeholder="0.00"
                value={deductions.processingFees}
                onChange={(v) => setDeductions((d) => ({ ...d, processingFees: v }))}
              />
              <CurrencyInput
                id="other-deductions"
                label="Other Deductions"
                tip="Any additional deductions such as chargebacks, clawbacks, administrative fees, or misc costs."
                placeholder="0.00"
                value={deductions.otherDeductions}
                onChange={(v) => setDeductions((d) => ({ ...d, otherDeductions: v }))}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────

function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-background p-2.5 shadow-lg text-xs">
      <p className="font-medium mb-1">{label}</p>
      <p className="text-emerald-600 font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function SalesCommissionCalculator() {
  // ─── Tab ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<CalcMode>('simple');

  // ─── Simple Mode ────────────────────────────────────────────────────────
  const [salesAmount, setSalesAmount] = useState('');
  const [simpleRate, setSimpleRate] = useState('');
  const [simpleBaseSalary, setSimpleBaseSalary] = useState('');

  // ─── Tiered Mode ────────────────────────────────────────────────────────
  const [tiers, setTiers] = useState<Tier[]>(defaultTiers());
  const [tieredSalesAmount, setTieredSalesAmount] = useState('');
  const [tieredBaseSalary, setTieredBaseSalary] = useState('');

  // ─── Quota Mode ─────────────────────────────────────────────────────────
  const [quotaBase, setQuotaBase] = useState('');
  const [quotaRate, setQuotaRate] = useState('');
  const [salesQuota, setSalesQuota] = useState('');
  const [actualSales, setActualSales] = useState('');
  const [accelerator, setAccelerator] = useState('');

  // ─── Deductions ─────────────────────────────────────────────────────────
  const [deductions, setDeductions] = useState<Deductions>({
    enabled: false,
    brokerFees: '',
    processingFees: '',
    otherDeductions: '',
  });

  // ─── Deduction total ────────────────────────────────────────────────────
  const totalDeductions = useMemo(() => {
    if (!deductions.enabled) return 0;
    return parseNum(deductions.brokerFees) + parseNum(deductions.processingFees) + parseNum(deductions.otherDeductions);
  }, [deductions]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Calculations
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Simple Results ──────────────────────────────────────────────────────
  const simpleResults = useMemo(() => {
    const sales = parseNum(salesAmount);
    const rate = parseNum(simpleRate);
    const base = parseNum(simpleBaseSalary);
    const commission = sales * (rate / 100);
    const gross = commission;
    const net = Math.max(0, gross - totalDeductions);
    const totalComp = base + net;
    const effectiveRate = totalComp > 0 ? (net / totalComp) * 100 : 0;
    const hasInput = sales > 0 || rate > 0;
    return { commission, gross, net, totalComp, effectiveRate, base, hasInput };
  }, [salesAmount, simpleRate, simpleBaseSalary, totalDeductions]);

  // ─── Tiered Results ─────────────────────────────────────────────────────
  const tieredResults = useMemo(() => {
    const sales = parseNum(tieredSalesAmount);
    const base = parseNum(tieredBaseSalary);
    const tierBreakdown: TierResult[] = [];
    let totalCommission = 0;

    // Sort tiers by 'from' ascending
    const sorted = [...tiers].sort(
      (a, b) => parseNum(a.from) - parseNum(b.from)
    );

    for (let i = 0; i < sorted.length; i++) {
      const tier = sorted[i];
      const fromVal = parseNum(tier.from);
      const toVal = tier.to.trim() === '' ? Infinity : parseNum(tier.to);
      const rate = parseNum(tier.rate);

      if (sales <= fromVal) {
        tierBreakdown.push({
          tierLabel: `Tier ${i + 1}`,
          from: fromVal,
          to: toVal,
          rate,
          salesInRange: 0,
          commission: 0,
        });
        continue;
      }

      const upperBound = Math.min(sales, toVal);
      const salesInRange = Math.max(0, upperBound - fromVal);
      const commission = salesInRange * (rate / 100);
      totalCommission += commission;

      tierBreakdown.push({
        tierLabel: `Tier ${i + 1}`,
        from: fromVal,
        to: toVal,
        rate,
        salesInRange,
        commission,
      });
    }

    const gross = totalCommission;
    const net = Math.max(0, gross - totalDeductions);
    const totalComp = base + net;
    const effectiveRate = sales > 0 ? (totalCommission / sales) * 100 : 0;
    const hasInput = sales > 0;

    // Check for gaps
    let hasGaps = false;
    for (let i = 1; i < sorted.length; i++) {
      const prevTo = sorted[i - 1].to.trim() === '' ? Infinity : parseNum(sorted[i - 1].to);
      const curFrom = parseNum(sorted[i].from);
      if (curFrom > prevTo + 0.01) {
        hasGaps = true;
        break;
      }
    }

    return { tierBreakdown, totalCommission, gross, net, totalComp, effectiveRate, base, hasInput, hasGaps };
  }, [tiers, tieredSalesAmount, tieredBaseSalary, totalDeductions]);

  // ─── Quota Results ──────────────────────────────────────────────────────
  const quotaResults = useMemo(() => {
    const base = parseNum(quotaBase);
    const rate = parseNum(quotaRate);
    const quota = parseNum(salesQuota);
    const actual = parseNum(actualSales);
    const accel = parseNum(accelerator);

    const attainment = quota > 0 ? (actual / quota) * 100 : 0;
    const accelRate = rate * (accel / 100);
    const aboveQuotaSales = Math.max(0, actual - quota);
    const regularSales = Math.min(actual, quota);
    const regularCommission = regularSales * (rate / 100);
    const acceleratedCommission = aboveQuotaSales * (accelRate / 100);
    const totalCommission = regularCommission + acceleratedCommission;

    const gross = totalCommission;
    const net = Math.max(0, gross - totalDeductions);
    const totalComp = base + net;
    const gapToQuota = quota > actual ? quota - actual : 0;

    // Projected annual earnings: if at current pace, annualized
    // (We don't know the period — just show as if this is the current period's earnings × (12 / months))
    // Simple approach: assume current period is annual already, show totalComp as-is
    const projectedAnnual = totalComp; // Since quota/sales are typically annual

    const hasInput = actual > 0 || quota > 0;

    return {
      attainment,
      accelRate,
      aboveQuotaSales,
      regularSales,
      regularCommission,
      acceleratedCommission,
      totalCommission,
      gross,
      net,
      totalComp,
      gapToQuota,
      projectedAnnual,
      base,
      hasInput,
    };
  }, [quotaBase, quotaRate, salesQuota, actualSales, accelerator, totalDeductions]);

  // ─── History ────────────────────────────────────────────────────
  const { history, saveEntry, clearHistory } = useCalcHistory<{ activeTab: string; salesAmount: string; simpleRate: string; tieredSalesAmount: string; quotaBase: string; salesQuota: string; actualSales: string }>('sales-commission');

  const handleSaveHistory = useCallback(() => {
    const r = activeTab === 'simple' ? simpleResults : activeTab === 'tiered' ? tieredResults : quotaResults;
    if (!r.hasInput) return;
    saveEntry(
      { activeTab, salesAmount, simpleRate, tieredSalesAmount, quotaBase, salesQuota, actualSales },
      `${activeTab} mode — Net: ${formatCurrency(r.net)} | Total Comp: ${formatCurrency(r.totalComp)}`
    );
  }, [activeTab, simpleResults, tieredResults, quotaResults, salesAmount, simpleRate, tieredSalesAmount, quotaBase, salesQuota, actualSales, saveEntry]);

  const handleRestore = (inputs: { activeTab: string; salesAmount: string; simpleRate: string; tieredSalesAmount: string; quotaBase: string; salesQuota: string; actualSales: string }) => {
    setActiveTab(inputs.activeTab as CalcMode);
    setSalesAmount(inputs.salesAmount);
    setSimpleRate(inputs.simpleRate);
    setTieredSalesAmount(inputs.tieredSalesAmount);
    setQuotaBase(inputs.quotaBase);
    setSalesQuota(inputs.salesQuota);
    setActualSales(inputs.actualSales);
  };

  const addTier = useCallback(() => {
    if (tiers.length >= 5) return;
    const lastTier = tiers[tiers.length - 1];
    const newFrom = lastTier.to.trim() === '' ? '0' : lastTier.to;
    setTiers((prev) => [
      ...prev.map((t, i) =>
        i === prev.length - 1 ? { ...t, to: t.to === '' ? '' : t.to } : t
      ),
      { id: makeId(), from: newFrom, to: '', rate: '15' },
    ]);
  }, [tiers]);

  const removeTier = useCallback(
    (id: string) => {
      if (tiers.length <= 1) return;
      setTiers((prev) => prev.filter((t) => t.id !== id));
    },
    [tiers]
  );

  const updateTier = useCallback(
    (id: string, field: keyof Tier, value: string) => {
      setTiers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
      );
    },
    []
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // Reset
  // ═══════════════════════════════════════════════════════════════════════════

  const handleReset = useCallback(() => {
    if (activeTab === 'simple') {
      setSalesAmount('');
      setSimpleRate('');
      setSimpleBaseSalary('');
    } else if (activeTab === 'tiered') {
      setTiers(defaultTiers());
      setTieredSalesAmount('');
      setTieredBaseSalary('');
    } else {
      setQuotaBase('');
      setQuotaRate('');
      setSalesQuota('');
      setActualSales('');
      setAccelerator('');
    }
    setDeductions({ enabled: false, brokerFees: '', processingFees: '', otherDeductions: '' });
  }, [activeTab]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CSV Export
  // ═══════════════════════════════════════════════════════════════════════════

  const downloadCSV = useCallback(() => {
    const rows: string[][] = [];

    if (activeTab === 'simple') {
      rows.push(['Sales Commission Calculator — Simple Mode']);
      rows.push([]);
      rows.push(['Field', 'Value']);
      rows.push(['Sales Amount', salesAmount]);
      rows.push(['Commission Rate', `${simpleRate}%`]);
      rows.push(['Base Salary', simpleBaseSalary || '0']);
      rows.push([]);
      rows.push(['Result', 'Amount']);
      rows.push(['Gross Commission', simpleResults.gross.toFixed(2)]);
      rows.push(['Deductions', totalDeductions.toFixed(2)]);
      rows.push(['Net Commission', simpleResults.net.toFixed(2)]);
      rows.push(['Base Salary', simpleResults.base.toFixed(2)]);
      rows.push(['Total Compensation', simpleResults.totalComp.toFixed(2)]);
      rows.push(['Effective Commission Rate', `${simpleResults.effectiveRate.toFixed(2)}%`]);
    } else if (activeTab === 'tiered') {
      rows.push(['Sales Commission Calculator — Tiered Mode']);
      rows.push([]);
      rows.push(['Tier', 'From ($)', 'To ($)', 'Rate (%)', 'Sales in Range ($)', 'Commission ($)']);
      tieredResults.tierBreakdown.forEach((t) => {
        rows.push([
          t.tierLabel,
          t.from.toFixed(2),
          t.to === Infinity ? 'No limit' : t.to.toFixed(2),
          t.rate.toFixed(2),
          t.salesInRange.toFixed(2),
          t.commission.toFixed(2),
        ]);
      });
      rows.push([]);
      rows.push(['Total Gross Commission', tieredResults.gross.toFixed(2)]);
      rows.push(['Deductions', totalDeductions.toFixed(2)]);
      rows.push(['Total Net Commission', tieredResults.net.toFixed(2)]);
      rows.push(['Base Salary', tieredResults.base.toFixed(2)]);
      rows.push(['Total Compensation', tieredResults.totalComp.toFixed(2)]);
      rows.push(['Effective Rate', `${tieredResults.effectiveRate.toFixed(2)}%`]);
    } else {
      rows.push(['Sales Commission Calculator — Quota Attainment Mode']);
      rows.push([]);
      rows.push(['Field', 'Value']);
      rows.push(['Base Salary', quotaBase || '0']);
      rows.push(['Commission Rate', `${quotaRate}%`]);
      rows.push(['Sales Quota', salesQuota || '0']);
      rows.push(['Actual Sales', actualSales || '0']);
      rows.push(['Accelerator', `${accelerator}%`]);
      rows.push([]);
      rows.push(['Result', 'Amount']);
      rows.push(['Quota Attainment', `${quotaResults.attainment.toFixed(2)}%`]);
      rows.push(['Regular Commission', quotaResults.regularCommission.toFixed(2)]);
      rows.push(['Accelerated Commission', quotaResults.acceleratedCommission.toFixed(2)]);
      rows.push(['Total Gross Commission', quotaResults.gross.toFixed(2)]);
      rows.push(['Deductions', totalDeductions.toFixed(2)]);
      rows.push(['Net Commission', quotaResults.net.toFixed(2)]);
      rows.push(['Total Compensation', quotaResults.totalComp.toFixed(2)]);
      rows.push(['Gap to Quota', quotaResults.gapToQuota.toFixed(2)]);
      rows.push(['Projected Annual Earnings', quotaResults.projectedAnnual.toFixed(2)]);
    }

    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'commission-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [
    activeTab,
    salesAmount,
    simpleRate,
    simpleBaseSalary,
    simpleResults,
    tieredResults,
    quotaBase,
    quotaRate,
    salesQuota,
    actualSales,
    accelerator,
    quotaResults,
    totalDeductions,
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Current results shorthand
  // ═══════════════════════════════════════════════════════════════════════════

  const currentResults = activeTab === 'simple'
    ? simpleResults
    : activeTab === 'tiered'
      ? tieredResults
      : quotaResults;

  const hasAnyResult = 'hasInput' in currentResults && currentResults.hasInput;

  // ═══════════════════════════════════════════════════════════════════════════
  // Chart data for tiered mode
  // ═══════════════════════════════════════════════════════════════════════════

  const tierChartData = useMemo(() => {
    return tieredResults.tierBreakdown.map((t, i) => ({
      name: t.tierLabel,
      commission: t.commission,
      color: TIER_COLORS[i % TIER_COLORS.length],
    }));
  }, [tieredResults.tierBreakdown]);

  const deductionPieData = useMemo(() => {
    if (!deductions.enabled || totalDeductions <= 0) return null;
    const gross = activeTab === 'simple' ? simpleResults.gross : activeTab === 'tiered' ? tieredResults.gross : quotaResults.gross;
    return [
      { name: 'Net Commission', value: Math.max(0, gross - totalDeductions), fill: '#10b981' },
      { name: 'Deductions', value: totalDeductions, fill: '#ef4444' },
    ];
  }, [deductions.enabled, totalDeductions, activeTab, simpleResults, tieredResults, quotaResults]);



  // ═══════════════════════════════════════════════════════════════════════════
  // SEO Content
  // ═══════════════════════════════════════════════════════════════════════════

  const howToSteps = [
    'Determine your commission structure — flat rate, tiered, or base + commission',
    'Gather your sales data — total sales amount or individual transaction values',
    'Identify your commission rate(s) — check your employment agreement or comp plan',
    'Apply the commission formula — multiply sales by rate(s) according to your structure',
    'Account for any deductions — subtract broker fees, processing fees, or clawbacks',
    'Add base salary if applicable — combine fixed and variable pay for total compensation',
  ];

  const formula = `Simple: Commission = Sales Amount × (Commission Rate / 100)
Tiered: Commission = Σ(Tier Sales × Tier Rate)
With Base: Total Compensation = Base Salary + Commission
Net Commission = Gross Commission − Deductions
Quota Attainment = (Actual Sales / Quota) × 100%`;

  const formulaDescription =
    'The commission formula depends on your compensation structure. A simple flat rate multiplies your total sales by a single percentage. Tiered structures apply different rates to different portions of your sales, rewarding higher volumes. Quota-based plans add accelerators that increase your rate when you exceed targets. Always subtract any deductions to arrive at your net commission.';

  const workedExamples = [
    {
      title: 'Real Estate Agent — Flat Commission',
      description:
        'A real estate agent sells a house for $500,000 at a 3% commission rate. Commission = $500,000 × 3% = $15,000. If the agent has a base salary of $0 (straight commission), their total compensation is $15,000.',
    },
    {
      title: 'SaaS Sales Rep — Tiered Commission',
      description:
        'A SaaS sales rep closes $200,000 in annual recurring revenue with 3 tiers: 5% on the first $50,000 = $2,500, 8% on the next $100,000 = $8,000, and 12% on everything above $150,000 = $6,000. Total commission = $2,500 + $8,000 + $6,000 = $16,500. With a $65,000 base salary, total comp = $81,500.',
    },
    {
      title: 'B2B Account Executive — Quota with Accelerator',
      description:
        'An AE has an $80,000 annual quota, a 10% commission rate, and a 1.5x accelerator above quota. They close $100,000 in sales. Regular commission on $80,000 at 10% = $8,000. Accelerated commission on $20,000 above quota at 15% (10% × 1.5) = $3,000. Total commission = $11,000. With a $55,000 base, total comp = $66,000.',
    },
  ];

  const commissionStructures = [
    {
      type: 'Straight Commission',
      description: '100% variable, no base salary.',
      formula: 'Commission = Sales × Rate',
      example: 'Real estate agents often work on 100% commission.',
    },
    {
      type: 'Base Salary + Commission',
      description: 'Fixed base + variable.',
      formula: 'Total = Base + (Sales × Rate)',
      example: 'Sales rep with $60K base + 5% commission.',
    },
    {
      type: 'Tiered/Graduated Commission',
      description: 'Rate increases at thresholds.',
      formula: 'Sum of (tier_sales × tier_rate)',
      example: 'First $50K at 5%, next $50K at 8%, above $100K at 12%.',
    },
  ];

  const faqs = [
    {
      question: 'What is a sales commission?',
      answer:
        'A sales commission is a performance-based payment that compensates salespeople based on the volume or value of sales they generate. It serves as a powerful incentive to drive higher revenue and rewards top performers with additional earnings beyond any base salary. Commission structures are widely used across real estate, retail, B2B sales, SaaS, financial services, and insurance industries. The more you sell, the more you earn — making it a key motivator for sales-focused roles.',
    },
    {
      question: 'What is a typical commission rate by industry?',
      answer:
        'Commission rates vary significantly by industry: Real estate agents typically earn 2–6% of the sale price. SaaS and software sales reps often see 5–15% on annual recurring revenue. Retail sales associates usually earn 1–5% of sales. Insurance agents can earn 10–25% on new premiums. B2B sales professionals generally earn 5–10% of deal value. The exact rate depends on deal size, product complexity, sales cycle length, and the balance between base salary and variable compensation.',
    },
    {
      question: 'How do tiered commission structures work?',
      answer:
        'Tiered commission structures apply progressively higher rates as your sales volume increases through predefined thresholds. Each tier only applies to the sales within its specific range — this is called marginal calculation. For example, the first $50,000 might earn 5%, the next $50,000 earns 8%, and everything above $100,000 earns 12%. This approach rewards higher performance with proportionally greater earnings and motivates salespeople to push beyond minimum targets for maximum earning potential.',
    },
    {
      question: 'What is a commission accelerator?',
      answer:
        'A commission accelerator increases your commission rate when you exceed your sales quota. For example, if your base rate is 10% and your accelerator is 1.5x, any sales above your quota earn 15% instead of 10%. Accelerators are especially common in SaaS and B2B sales where exceeding targets significantly impacts company growth. They create a strong financial incentive to push past 100% quota attainment, often resulting in exponential earnings growth for top performers.',
    },
    {
      question: 'How is commission taxed?',
      answer:
        'Commission income is generally taxed as ordinary income at the federal level, just like regular salary. However, employers often withhold taxes at a higher supplemental rate — typically 22% federal flat rate — on commission payments, which means larger deductions from each commission paycheck. This does not mean you pay more in total taxes; the difference is usually reconciled when you file your annual return. Self-employed individuals must also pay self-employment tax (15.3%) and make quarterly estimated payments. State and local taxes vary by jurisdiction.',
    },
    {
      question: 'What is the difference between gross and net commission?',
      answer:
        'Gross commission is the total commission earned before any deductions are subtracted. Net commission is what you actually take home after broker fees, agency splits, processing fees, clawbacks, and other deductions have been applied. This distinction is especially important in real estate, where agents may split their commission with their brokerage (e.g., a 70/30 split), and in insurance, where premium financing and processing costs can reduce actual earnings significantly.',
    },
    {
      question: 'Can my employer claw back my commission?',
      answer:
        'Yes, many employers include clawback provisions in their commission agreements. Common triggers include customer cancellations, product returns, failed payments, or early contract terminations that occur within a specified period after the sale. Some companies also claw back commissions if you leave the company before a certain vesting period. It is critical to review your employment agreement or compensation plan carefully to understand the specific clawback terms, timelines, and conditions that apply to your commission.',
    },
    {
      question: 'How do I calculate commission on a returned sale?',
      answer:
        'When a sale is returned or cancelled, the commission previously earned on that sale is typically clawed back in full. For example, if you earned $500 commission on a $10,000 sale that is later returned, your employer will deduct $500 from future commissions. For partial returns, the clawback is pro-rata — a 50% return means a 50% clawback of the original commission. In tiered structures, a return can be particularly complex because it may shift your total sales into a lower tier, retroactively reducing the rate applied to your remaining sales. Always check your comp plan for the specific return policy.',
    },
  ];

  const relatedTools = [
    { slug: 'salary-increase' as const, title: 'Salary Increase Calculator', description: 'See what a raise looks like in your paycheck', icon: 'TrendingUp' },
    { slug: 'payroll' as const, title: 'Payroll Calculator', description: 'Calculate your take-home pay after taxes', icon: 'CreditCard' },
    { slug: 'pro-rata-salary' as const, title: 'Pro Rata Salary Calculator', description: 'Calculate prorated salary for partial periods', icon: 'CalendarClock' },
    { slug: 'profit-margin' as const, title: 'Profit Margin Calculator', description: 'Calculate profit margins and markup percentages', icon: 'Percent' },
    { slug: 'post-tax-bonus' as const, title: 'Bonus Tax Calculator', description: 'Calculate net bonus after tax withholding', icon: 'Gift' },
    { slug: 'roi' as const, title: 'ROI Calculator', description: 'Calculate return on investment for business decisions', icon: 'BarChart3' },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <CalculatorLayout
      title="Sales Commission Calculator"
      description="Calculate your sales commission with support for flat rate, tiered, and quota-based structures. Visualize earnings, account for deductions, and export detailed reports."
      icon={<DollarSign className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Sales Commission Calculator' },
      ]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Commission Formula' },
        { id: 'commission-structures', label: 'Commission Structures' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={howToSteps}
      formula={formula}
      formulaDescription={formulaDescription}
      workedExamples={workedExamples}
      commissionStructures={commissionStructures}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <TooltipProvider>
        <div className="p-4 sm:p-6 space-y-6">
          {/* ─── Mode Tabs ───────────────────────────────────────────────── */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as CalcMode)}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="simple" className="text-xs sm:text-sm">
                <DollarSign className="h-3.5 w-3.5 mr-1.5 hidden sm:inline-block" />
                Simple
              </TabsTrigger>
              <TabsTrigger value="tiered" className="text-xs sm:text-sm">
                <Layers className="h-3.5 w-3.5 mr-1.5 hidden sm:inline-block" />
                Tiered
              </TabsTrigger>
              <TabsTrigger value="quota" className="text-xs sm:text-sm">
                <Target className="h-3.5 w-3.5 mr-1.5 hidden sm:inline-block" />
                Quota Attainment
              </TabsTrigger>
            </TabsList>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* Simple Mode                                                     */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TabsContent value="simple" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CurrencyInput
                  id="simple-sales"
                  label="Sales Amount"
                  tip="The total value of sales you generated during the commission period. This is the base amount used to calculate your commission."
                  placeholder="e.g., 150,000"
                  value={salesAmount}
                  onChange={setSalesAmount}
                />
                <PercentInput
                  id="simple-rate"
                  label="Commission Rate"
                  tip="The percentage of each sale you earn as commission. Common rates range from 2–15% depending on your industry and role."
                  placeholder="e.g., 5.00"
                  value={simpleRate}
                  onChange={setSimpleRate}
                />
                <CurrencyInput
                  id="simple-base"
                  label="Base Salary (optional)"
                  tip="Your fixed annual salary before commissions. Leave at 0 if you work on straight commission with no base pay."
                  placeholder="e.g., 65,000"
                  value={simpleBaseSalary}
                  onChange={setSimpleBaseSalary}
                  className="sm:col-span-2"
                />
              </div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* Tiered Mode                                                     */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TabsContent value="tiered" className="mt-6 space-y-6">
              {/* Tiers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    <TipLabel tip="Define up to 5 commission tiers with different rates. Each tier applies only to the sales within its range (marginal calculation). The last tier typically has no upper limit.">
                      Commission Tiers
                    </TipLabel>
                  </Label>
                  {tiers.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTier}
                      className="text-xs h-8"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Tier
                    </Button>
                  )}
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {tiers.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border border-border/50 bg-muted/20 p-3 sm:p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          Tier {index + 1}
                        </Badge>
                        {tiers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTier(tier.id)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">From ($)</Label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-[18px] -translate-y-1/2 text-muted-foreground text-xs">$</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0"
                              value={tier.from}
                              onChange={(e) => updateTier(tier.id, 'from', e.target.value)}
                              className="pl-6 h-9 text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            To ($){index === tiers.length - 1 && <span className="text-emerald-500 ml-1">— No limit</span>}
                          </Label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-[18px] -translate-y-1/2 text-muted-foreground text-xs">$</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder={index === tiers.length - 1 ? 'No limit' : 'e.g., 100,000'}
                              value={tier.to}
                              onChange={(e) => updateTier(tier.id, 'to', e.target.value)}
                              className="pl-6 h-9 text-sm"
                              disabled={index === tiers.length - 1}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Rate (%)</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="e.g., 8.00"
                              value={tier.rate}
                              onChange={(e) => updateTier(tier.id, 'rate', e.target.value)}
                              className="pr-6 h-9 text-sm"
                            />
                            <span className="absolute right-2.5 top-[18px] -translate-y-1/2 text-muted-foreground text-xs">%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {tieredResults.hasGaps && tieredResults.hasInput && (
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 p-3 text-xs text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    There may be gaps between your tier ranges. Sales in gap regions won't earn commission.
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CurrencyInput
                  id="tiered-sales"
                  label="Total Sales Amount"
                  tip="Your total sales revenue to be distributed across all tiers for commission calculation."
                  placeholder="e.g., 200,000"
                  value={tieredSalesAmount}
                  onChange={setTieredSalesAmount}
                />
                <CurrencyInput
                  id="tiered-base"
                  label="Base Salary (optional)"
                  tip="Your fixed annual salary. This is added to your commission for total compensation."
                  placeholder="e.g., 65,000"
                  value={tieredBaseSalary}
                  onChange={setTieredBaseSalary}
                />
              </div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* Quota Mode                                                      */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TabsContent value="quota" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CurrencyInput
                  id="quota-base"
                  label="Base Salary"
                  tip="Your guaranteed fixed annual salary before any commissions or bonuses."
                  placeholder="e.g., 55,000"
                  value={quotaBase}
                  onChange={setQuotaBase}
                />
                <PercentInput
                  id="quota-rate"
                  label="Commission Rate"
                  tip="The commission rate applied to sales up to your quota amount."
                  placeholder="e.g., 10.00"
                  value={quotaRate}
                  onChange={setQuotaRate}
                />
                <CurrencyInput
                  id="sales-quota"
                  label="Sales Quota (annual)"
                  tip="Your annual sales target. Sales up to this amount earn the regular commission rate."
                  placeholder="e.g., 80,000"
                  value={salesQuota}
                  onChange={setSalesQuota}
                />
                <CurrencyInput
                  id="actual-sales"
                  label="Actual Sales"
                  tip="The total sales you actually achieved during the period."
                  placeholder="e.g., 100,000"
                  value={actualSales}
                  onChange={setActualSales}
                />
                <PercentInput
                  id="accelerator"
                  label="Commission Accelerator"
                  tip="The rate multiplier applied to commission on sales above quota. For example, 150 means your rate increases by 50% above quota. Enter as a percentage (e.g., 150 for 1.5x)."
                  placeholder="e.g., 150.00"
                  value={accelerator}
                  onChange={setAccelerator}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* ─── Deductions ──────────────────────────────────────────────── */}
          <DeductionsSection deductions={deductions} setDeductions={setDeductions} />

          {/* ─── Action Buttons ──────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="shrink-0"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={downloadCSV}
              disabled={!hasAnyResult}
              variant="outline"
              className="shrink-0 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white border-0 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:shadow-none"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* Results                                                         */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {hasAnyResult && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="result-display" aria-live="polite"
              >
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-6">
                  {/* ─── Main Result ────────────────────────────────────── */}
                  <div className="text-center space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">
                      {activeTab === 'quota' ? 'Total Annual Compensation' : 'Net Commission'}
                    </p>
                    <p className="text-4xl sm:text-5xl font-bold text-emerald-600 tracking-tight">
                      {activeTab === 'quota'
                        ? formatCurrency(quotaResults.totalComp)
                        : activeTab === 'tiered'
                          ? formatCurrency(tieredResults.net)
                          : formatCurrency(simpleResults.net)}
                    </p>
                    {deductions.enabled && totalDeductions > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Gross: <span className="line-through">{formatCurrency(
                          activeTab === 'simple'
                            ? simpleResults.gross
                            : activeTab === 'tiered'
                              ? tieredResults.gross
                              : quotaResults.gross
                        )}</span>{' '}
                        → Net after {formatCurrency(totalDeductions)} deductions
                      </p>
                    )}
                  </div>

                  {/* ─── Metric Cards ───────────────────────────────────── */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Commission */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 }}
                      className="rounded-xl bg-background border border-border/50 p-3 text-center"
                    >
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                        {deductions.enabled && totalDeductions > 0 ? 'Net Commission' : 'Commission'}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-emerald-600">
                        {activeTab === 'quota'
                          ? formatCurrency(quotaResults.net)
                          : activeTab === 'tiered'
                            ? formatCurrency(tieredResults.net)
                            : formatCurrency(simpleResults.net)}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        Variable
                      </Badge>
                    </motion.div>

                    {/* Base Salary */}
                    {activeTab !== 'quota' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl bg-background border border-border/50 p-3 text-center"
                      >
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                          Base Salary
                        </p>
                        <p className="text-base sm:text-lg font-bold">
                          {activeTab === 'tiered'
                            ? formatCurrency(tieredResults.base)
                            : formatCurrency(simpleResults.base)}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-[10px]">
                          Fixed
                        </Badge>
                      </motion.div>
                    )}

                    {activeTab === 'quota' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl bg-background border border-border/50 p-3 text-center"
                      >
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                          Quota Attainment
                        </p>
                        <p className={`text-base sm:text-lg font-bold ${quotaResults.attainment >= 100 ? 'text-emerald-600' : quotaResults.attainment >= 75 ? 'text-amber-600' : 'text-red-500'}`}>
                          {quotaResults.attainment.toFixed(1)}%
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-[10px] ${quotaResults.attainment >= 100 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}`}
                        >
                          {quotaResults.attainment >= 100 ? (
                            <><CheckCircle2 className="h-3 w-3 mr-0.5" />Met</>
                          ) : (
                            <><AlertTriangle className="h-3 w-3 mr-0.5" />Below</>
                          )}
                        </Badge>
                      </motion.div>
                    )}

                    {/* Total Comp */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 }}
                      className="rounded-xl bg-background border border-border/50 p-3 text-center"
                    >
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                        Total Comp
                      </p>
                      <p className="text-base sm:text-lg font-bold">
                        {activeTab === 'quota'
                          ? formatCurrency(quotaResults.totalComp)
                          : activeTab === 'tiered'
                            ? formatCurrency(tieredResults.totalComp)
                            : formatCurrency(simpleResults.totalComp)}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        All-in
                      </Badge>
                    </motion.div>

                    {/* Effective Rate */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-xl bg-background border border-border/50 p-3 text-center"
                    >
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                        Effective Rate
                      </p>
                      <p className="text-base sm:text-lg font-bold">
                        {activeTab === 'quota'
                          ? quotaResults.attainment > 0
                            ? formatPercent((quotaResults.totalCommission / parseNum(actualSales)) * 100)
                            : '0.00%'
                          : activeTab === 'tiered'
                            ? formatPercent(tieredResults.effectiveRate)
                            : formatPercent(simpleResults.effectiveRate)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">of total comp</p>
                    </motion.div>
                  </div>

                  {/* ═══════════════════════════════════════════════════════ */}
                  {/* Mode-specific results                                    */}
                  {/* ═══════════════════════════════════════════════════════ */}

                  {/* ─── Tiered: Per-tier table + chart ──────────────────── */}
                  {activeTab === 'tiered' && tieredResults.hasInput && (
                    <>
                      <Separator className="opacity-50" />

                      {/* Tier Breakdown Table */}
                      <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
                          <p className="text-sm font-semibold">Tier Breakdown</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs sm:text-sm">
                            <thead>
                              <tr className="border-b border-border/30">
                                <th className="text-left px-3 sm:px-4 py-2.5 font-medium text-muted-foreground">Tier</th>
                                <th className="text-right px-3 sm:px-4 py-2.5 font-medium text-muted-foreground">Range</th>
                                <th className="text-right px-3 sm:px-4 py-2.5 font-medium text-muted-foreground">Rate</th>
                                <th className="text-right px-3 sm:px-4 py-2.5 font-medium text-muted-foreground">Sales</th>
                                <th className="text-right px-3 sm:px-4 py-2.5 font-medium text-muted-foreground">Commission</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                              {tieredResults.tierBreakdown.map((t, i) => (
                                <tr key={i} className={t.commission > 0 ? 'text-emerald-600' : 'text-muted-foreground'}>
                                  <td className="px-3 sm:px-4 py-2.5 font-medium">{t.tierLabel}</td>
                                  <td className="text-right px-3 sm:px-4 py-2.5">
                                    {formatCurrency(t.from)} – {t.to === Infinity ? '∞' : formatCurrency(t.to)}
                                  </td>
                                  <td className="text-right px-3 sm:px-4 py-2.5">{t.rate.toFixed(1)}%</td>
                                  <td className="text-right px-3 sm:px-4 py-2.5">{formatCurrency(t.salesInRange)}</td>
                                  <td className="text-right px-3 sm:px-4 py-2.5 font-semibold">{formatCurrency(t.commission)}</td>
                                </tr>
                              ))}
                              <tr className="font-bold bg-muted/20">
                                <td className="px-3 sm:px-4 py-2.5" colSpan={4}>Total</td>
                                <td className="text-right px-3 sm:px-4 py-2.5 text-emerald-600">{formatCurrency(tieredResults.totalCommission)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Bar Chart */}
                      {tieredResults.totalCommission > 0 && (
                        <div className="rounded-xl bg-background border border-border/50 p-4">
                          <p className="text-sm font-semibold mb-4">Commission by Tier</p>
                          <div className="h-48 sm:h-56">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={tierChartData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                                <YAxis dataKey="name" type="category" width={50} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                                <RechartsTooltip content={<CustomBarTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                                <Bar dataKey="commission" radius={[0, 6, 6, 0]} barSize={28}>
                                  {tierChartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ─── Quota: Attainment bar + breakdown ──────────────── */}
                  {activeTab === 'quota' && quotaResults.hasInput && (
                    <>
                      <Separator className="opacity-50" />

                      {/* Quota Attainment Progress */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold">Quota Attainment</p>
                            <Badge
                              variant="outline"
                              className={`text-xs font-semibold px-2.5 py-0.5 ${quotaResults.attainment >= 100 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : quotaResults.attainment >= 75 ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}
                            >
                              {quotaResults.attainment.toFixed(1)}%
                            </Badge>
                          </div>
                          <QuotaProgressBar attainment={quotaResults.attainment} />
                        </div>

                        {/* Quota Breakdown Table */}
                        <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                          <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
                            <p className="text-sm font-semibold">Commission Breakdown</p>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm">
                              <thead>
                                <tr className="border-b border-border/30">
                                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Component</th>
                                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20">
                                <tr>
                                  <td className="px-4 py-2.5 font-medium">Base Salary</td>
                                  <td className="text-right px-4 py-2.5">{formatCurrency(quotaResults.base)}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2.5">
                                    <span className="font-medium">Regular Commission</span>
                                    <span className="text-muted-foreground ml-1.5">({formatPercent(parseNum(quotaRate))} on {formatCurrency(quotaResults.regularSales)})</span>
                                  </td>
                                  <td className="text-right px-4 py-2.5 text-emerald-600 font-medium">{formatCurrency(quotaResults.regularCommission)}</td>
                                </tr>
                                {quotaResults.acceleratedCommission > 0 && (
                                  <tr>
                                    <td className="px-4 py-2.5">
                                      <span className="font-medium">Accelerated Commission</span>
                                      <span className="text-muted-foreground ml-1.5">({formatPercent(quotaResults.accelRate)} on {formatCurrency(quotaResults.aboveQuotaSales)})</span>
                                    </td>
                                    <td className="text-right px-4 py-2.5 text-emerald-600 font-medium">{formatCurrency(quotaResults.acceleratedCommission)}</td>
                                  </tr>
                                )}
                                {deductions.enabled && totalDeductions > 0 && (
                                  <tr className="text-red-500">
                                    <td className="px-4 py-2.5 font-medium">Deductions</td>
                                    <td className="text-right px-4 py-2.5 font-medium">−{formatCurrency(totalDeductions)}</td>
                                  </tr>
                                )}
                                <tr className="font-bold bg-muted/20">
                                  <td className="px-4 py-2.5">Total Compensation</td>
                                  <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(quotaResults.totalComp)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Gap to Quota */}
                        {quotaResults.gapToQuota > 0 && (
                          <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 p-3.5 text-sm">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                            <div className="text-red-700 dark:text-red-300">
                              <p className="font-medium">Gap to Quota</p>
                              <p className="text-xs mt-0.5">
                                You need <strong>{formatCurrency(quotaResults.gapToQuota)}</strong> more in sales to reach your {formatCurrency(parseNum(salesQuota))} quota.
                              </p>
                            </div>
                          </div>
                        )}

                        {quotaResults.attainment >= 100 && (
                          <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 p-3.5 text-sm">
                            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                            <div className="text-emerald-700 dark:text-emerald-300">
                              <p className="font-medium">Quota Exceeded!</p>
                              <p className="text-xs mt-0.5">
                                You surpassed your quota by <strong>{formatCurrency(quotaResults.aboveQuotaSales)}</strong>, earning an additional{' '}
                                <strong>{formatCurrency(quotaResults.acceleratedCommission)}</strong> in accelerated commission at the higher rate of {formatPercent(quotaResults.accelRate)}.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ─── Deduction Pie Chart ─────────────────────────────── */}
                  {deductionPieData && (
                    <div className="rounded-xl bg-background border border-border/50 p-4">
                      <p className="text-sm font-semibold mb-3">Gross vs Net Commission</p>
                      <div className="h-48 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={deductionPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                            >
                              {deductionPieData.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* ─── Insight Callout ─────────────────────────────────── */}
                  {activeTab === 'simple' && simpleResults.hasInput && (
                    <InsightBox>
                      {simpleResults.net > 0 && simpleResults.totalComp > 0
                        ? `Your net commission of ${formatCurrency(simpleResults.net)} represents ${formatPercent(simpleResults.effectiveRate)} of total compensation. ${simpleResults.effectiveRate > 50 ? 'A significant portion of your income is performance-based — strong sales directly boost earnings.' : simpleResults.base > 0 ? 'Your base salary provides a solid foundation, with commission as variable upside.' : 'Consider negotiating a base salary for more income stability alongside your commission.'}`
                        : 'Enter your sales amount and commission rate to see your earnings breakdown and insights.'}
                    </InsightBox>
                  )}

                  {activeTab === 'tiered' && tieredResults.hasInput && tieredResults.totalCommission > 0 && (
                    <InsightBox>
                      With a tiered structure, your effective commission rate is {formatPercent(tieredResults.effectiveRate)} across {formatCurrency(parseNum(tieredSalesAmount))} in total sales. {tieredResults.effectiveRate > parseNum(tiers[tiers.length - 1]?.rate || '0') ? 'Your effective rate exceeds the highest tier rate — this means most of your sales fall in higher tiers.' : 'As you sell more and enter higher tiers, your effective rate will increase.'}
                    </InsightBox>
                  )}

                  {activeTab === 'quota' && quotaResults.hasInput && (
                    <InsightBox>
                      {quotaResults.attainment >= 100
                        ? `At ${quotaResults.attainment.toFixed(1)}% attainment, you're earning above-quota commissions. Your total comp of ${formatCurrency(quotaResults.totalComp)} includes ${formatCurrency(quotaResults.acceleratedCommission)} in accelerated earnings.`
                        : quotaResults.attainment >= 75
                          ? `You're at ${quotaResults.attainment.toFixed(1)}% of quota — just ${formatCurrency(quotaResults.gapToQuota)} away from unlocking your accelerator. Pushing to 100% could significantly boost your total comp.`
                          : `At ${quotaResults.attainment.toFixed(1)}% quota attainment, focus on closing deals to reach your ${formatCurrency(parseNum(salesQuota))} target and unlock your commission accelerator for earnings above quota.`}
                    </InsightBox>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TooltipProvider>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} />
    </CalculatorLayout>
  );
}

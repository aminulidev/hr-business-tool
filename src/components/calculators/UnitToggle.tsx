'use client';

/**
 * UnitToggle — converts a single monetary value into all 6 standard
 * pay-period equivalents: hourly, weekly, bi-weekly, semi-monthly, monthly, annual.
 */

import { useMemo, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

export type PayUnit = 'hourly' | 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly' | 'annual';

export const PAY_UNIT_LABELS: Record<PayUnit, string> = {
  'hourly': 'Hourly',
  'weekly': 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  'semi-monthly': 'Semi-Monthly',
  'monthly': 'Monthly',
  'annual': 'Annual',
};

export const PAY_UNIT_SHORT: Record<PayUnit, string> = {
  'hourly': '/hr',
  'weekly': '/wk',
  'bi-weekly': '/2wk',
  'semi-monthly': '/semimo',
  'monthly': '/mo',
  'annual': '/yr',
};

interface UnitToggleProps {
  hourlyRate?: number;
  annualSalary?: number;
  hoursPerWeek?: number;
  weeksPerYear?: number;
  defaultUnit?: PayUnit;
  compact?: boolean;
  className?: string;
}

export function convertPayUnit(
  value: number,
  fromUnit: PayUnit,
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52,
): Record<PayUnit, number> {
  let annual: number;
  switch (fromUnit) {
    case 'hourly':
      annual = value * hoursPerWeek * weeksPerYear;
      break;
    case 'weekly':
      annual = value * weeksPerYear;
      break;
    case 'bi-weekly':
      annual = value * (weeksPerYear / 2);
      break;
    case 'semi-monthly':
      annual = value * 24;
      break;
    case 'monthly':
      annual = value * 12;
      break;
    case 'annual':
      annual = value;
      break;
  }

  return {
    'hourly': annual / (hoursPerWeek * weeksPerYear),
    'weekly': annual / weeksPerYear,
    'bi-weekly': annual / (weeksPerYear / 2),
    'semi-monthly': annual / 24,
    'monthly': annual / 12,
    'annual': annual,
  };
}

function formatCurrency(value: number, maximumFractionDigits: number = 2): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export default function UnitToggle({
  hourlyRate,
  annualSalary,
  hoursPerWeek = 40,
  weeksPerYear = 52,
  defaultUnit,
  compact = false,
  className = '',
}: UnitToggleProps) {
  const hasHourly = hourlyRate !== undefined && hourlyRate !== null && !isNaN(hourlyRate);
  const hasAnnual = annualSalary !== undefined && annualSalary !== null && !isNaN(annualSalary);

  const inputUnit: PayUnit = hasAnnual ? 'annual' : 'hourly';
  const inputValue = hasAnnual ? (annualSalary as number) : (hasHourly ? (hourlyRate as number) : 0);

  const initialUnit: PayUnit = defaultUnit ?? (hasAnnual ? 'annual' : 'hourly');
  const [activeUnit, setActiveUnit] = useState<PayUnit>(initialUnit);

  const conversions = useMemo(() => {
    if (!inputValue) return null;
    return convertPayUnit(inputValue, inputUnit, hoursPerWeek, weeksPerYear);
  }, [inputValue, inputUnit, hoursPerWeek, weeksPerYear]);

  const pillOrder: PayUnit[] = ['hourly', 'weekly', 'bi-weekly', 'semi-monthly', 'monthly', 'annual'];

  if (!conversions) {
    return null;
  }

  const activeValue = conversions[activeUnit];

  return (
    <div
      className={`unit-toggle flex flex-col gap-2 ${compact ? 'text-xs' : 'text-sm'} ${className}`}
      role="region"
      aria-label="Pay period conversion"
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ArrowLeftRight className="h-3.5 w-3.5" />
        <span>View as:</span>
      </div>
      <div className="flex flex-wrap gap-1" role="tablist" aria-label="Pay unit selector">
        {pillOrder.map((unit) => {
          const isActive = unit === activeUnit;
          return (
            <button
              key={unit}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveUnit(unit)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {PAY_UNIT_LABELS[unit]}
            </button>
          );
        })}
      </div>
      <div
        className="result-display rounded-lg border border-border/60 bg-muted/30 px-3 py-2 mt-1 flex items-baseline gap-1.5"
        aria-live="polite"
      >
        <span className={`font-bold tabular-nums text-foreground ${compact ? 'text-lg' : 'text-xl'}`}>
          {formatCurrency(activeValue, activeUnit === 'hourly' ? 2 : 0)}
        </span>
        <span className="text-xs text-muted-foreground">
          {PAY_UNIT_SHORT[activeUnit]}
        </span>
      </div>
      <div className="text-[10px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
        {pillOrder.map((unit) => (
          <span key={unit} className={unit === activeUnit ? 'font-bold text-foreground' : ''}>
            {formatCurrency(conversions[unit], unit === 'hourly' ? 2 : 0)}
            <span className="ml-0.5">{PAY_UNIT_SHORT[unit]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

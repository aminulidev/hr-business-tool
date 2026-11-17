'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TAX_YEAR } from '@/lib/payroll/withholding';
import { isStateTaxChoice, STATE_TAX_CODES, STATE_TAX_STATES, type StateTaxChoice } from '@/lib/payroll/state-tax';

const INCOME_TAX_STATES = STATE_TAX_CODES.filter((c) => !STATE_TAX_STATES[c].noIncomeTax);
const NO_INCOME_TAX_STATES = STATE_TAX_CODES.filter((c) => STATE_TAX_STATES[c].noIncomeTax);

/**
 * State choice for the calculators that take state income tax from the paycheck
 * engine (state tax, W-2, 1099): the states the engine models, by name, and
 * "Another state" for a rate the visitor enters. No rate is shown in the list,
 * because the list holds none.
 */
export function StateTaxSelect({ id, value, onChange }: { id: string; value: StateTaxChoice; onChange: (v: StateTaxChoice) => void }) {
  return (
    <Select value={value} onValueChange={(v) => isStateTaxChoice(v) && onChange(v)}>
      <SelectTrigger id={id} className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent className="max-h-80">
        <SelectGroup>
          <SelectLabel>States with an income tax ({TAX_YEAR} figures)</SelectLabel>
          {INCOME_TAX_STATES.map((code) => (
            <SelectItem key={code} value={code}>{STATE_TAX_STATES[code].name}</SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>No income tax on wages</SelectLabel>
          {NO_INCOME_TAX_STATES.map((code) => (
            <SelectItem key={code} value={code}>{STATE_TAX_STATES[code].name}</SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Not listed above</SelectLabel>
          <SelectItem value="other">Another state (enter a flat rate)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** The flat rate for "Another state" */
export function StateRateInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-medium">Flat state income tax rate (%)</Label>
      <div className="relative max-w-[10rem]">
        <Input id={id} type="number" step="0.05" min="0" max="15" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs pr-7" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
      </div>
    </div>
  );
}

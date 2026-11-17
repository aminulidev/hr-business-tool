'use client';

import type { ReactNode } from 'react';
import { motion } from '@/components/motion';
import { BookmarkPlus, type LucideIcon } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

// Small shared pieces for the Phase 17 multi-mode calculators. Keep the
// `result-display` / `calculator-form` classes: MobileResultSheet and
// ResultActions read them.

export const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
export const int = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
export const pct = (n: number | null | undefined, d = 1) => (n === null || n === undefined ? '—' : `${n.toFixed(d)}%`);
export const usd = (n: number | null | undefined, d = 0) => (n === null || n === undefined ? '—' : n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d }));

export function Field({ id, label, value, onChange, prefix, suffix, step = 'any', help, min = '0' }: { id: string; label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; step?: string; help?: string; min?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input id={id} type="number" inputMode="decimal" min={min} step={step} value={value} onChange={(e) => onChange(e.target.value)} className={`text-sm ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

export function Kpi({ label, value, sub, color = 'text-foreground' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-base sm:text-lg font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Result({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="result-display mt-2" aria-live="polite">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-5">{children}</div>
    </motion.div>
  );
}

export function Headline({ label, value, children }: { label: string; value: string; children?: ReactNode }) {
  return (
    <div className="text-center space-y-1">
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>{value}</p>
      {children && <p className="text-xs sm:text-sm text-muted-foreground">{children}</p>}
    </div>
  );
}

export function Actions({ onExample, onSave, disabled }: { onExample: () => void; onSave: () => void; disabled: boolean }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <TryExample onClick={onExample} />
      <Button onClick={onSave} disabled={disabled} className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25" size="lg">
        <BookmarkPlus className="h-4 w-4 mr-2" /> Save Calculation to History
      </Button>
    </div>
  );
}

export function Th({ children, right }: { children?: ReactNode; right?: boolean }) {
  return <th className={`${right ? 'text-right' : 'text-left'} px-3 py-2 font-medium`}>{children}</th>;
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

export function ModeTabs<T extends string>({ modes, mode, onChange, label, icons }: { modes: { value: T; label: string; short: string }[]; mode: T; onChange: (m: T) => void; label: string; icons: Record<T, LucideIcon> }) {
  const cols = modes.length <= 2 ? 'grid-cols-2' : modes.length === 3 ? 'grid-cols-3' : modes.length === 5 ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4';
  return (
    <div className={`grid ${cols} gap-1 rounded-xl bg-muted/50 p-1 border border-border/50`} role="tablist" aria-label={label}>
      {modes.map((m) => {
        const Icon: LucideIcon = icons[m.value];
        return (
          <button key={m.value} type="button" role="tab" aria-selected={mode === m.value} onClick={() => { if (m.value !== mode) track('mode_change', { mode: m.value }); onChange(m.value); }} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === m.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{m.label}</span>
            <span className="sm:hidden">{m.short}</span>
          </button>
        );
      })}
    </div>
  );
}

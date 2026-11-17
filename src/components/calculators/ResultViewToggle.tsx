'use client';

import { Briefcase, User } from 'lucide-react';

export type ResultView = 'employee' | 'employer';

/**
 * Segmented control shown above the live result: who is this number for?
 * It lives in its own file so the paycheck calculators can show the toggle
 * without loading the employer panel (and its state unemployment tables), which
 * is fetched when the visitor first chooses "Employer cost".
 */
export function ResultViewToggle({ view, onChange }: { view: ResultView; onChange: (v: ResultView) => void }) {
  const options: { value: ResultView; label: string; icon: typeof User }[] = [
    { value: 'employee', label: 'Employee take-home', icon: User },
    { value: 'employer', label: 'Employer cost', icon: Briefcase },
  ];
  return (
    <div className="mb-3 flex rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Result view">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={view === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            view === o.value ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <o.icon className="h-4 w-4" />
          {o.label}
        </button>
      ))}
    </div>
  );
}

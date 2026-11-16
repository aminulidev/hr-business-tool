'use client';

import { CalendarRange, Info } from 'lucide-react';
import { track } from '@/lib/analytics';
import { SELECTABLE_TAX_YEARS, taxYearLabel, type TaxYear, type TaxYearNote } from '@/lib/payroll/withholding';

/**
 * Tax-year choice for the engine-backed paycheck calculators (Roadmap v2, Phase 20).
 * Renders nothing while only one year is selectable, so it can stay in the form all year.
 */
export function TaxYearSwitch({ year, onChange }: { year: TaxYear; onChange: (year: TaxYear) => void }) {
  if (SELECTABLE_TAX_YEARS.length < 2) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span id="tax-year-switch-label" className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
        <CalendarRange className="h-3.5 w-3.5 text-emerald-600" />
        Tax year:
      </span>
      <div role="group" aria-labelledby="tax-year-switch-label" className="inline-flex rounded-full border border-border/60 bg-muted/40 p-0.5">
        {SELECTABLE_TAX_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            aria-pressed={y === year}
            onClick={() => {
              if (y === year) return;
              track('mode_change', { mode: `tax-year-${y}` });
              onChange(y);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              y === year ? 'bg-emerald-600 text-white' : 'text-foreground hover:bg-muted'
            }`}
          >
            {taxYearLabel(y)}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * What a result for this year rests on, shown only when something is not final:
 * a federal figure taken from a draft, or state lines carried over from the year
 * before because the state has not published yet. The caller builds the note
 * with `taxYearNote`, which also words the pay stub footer.
 */
export function TaxYearNotice({ note }: { note: TaxYearNote | null }) {
  if (!note) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-left text-xs text-foreground/80" role="note" data-tax-year-note>
      <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
      <div className="space-y-1.5">
        <p>
          <strong className="text-foreground">{note.title}</strong> {note.sentences.join(' ')}
        </p>
        <p>
          Sources:{' '}
          {note.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

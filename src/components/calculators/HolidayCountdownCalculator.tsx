'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import TryExample from './TryExample';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

// 2026 US Federal Holidays
const HOLIDAYS_2026: { date: string; name: string; day: string }[] = [
  { date: '2026-01-01', name: "New Year's Day", day: 'Thu' },
  { date: '2026-01-19', name: 'MLK Jr. Day', day: 'Mon' },
  { date: '2026-02-16', name: "Washington's Birthday", day: 'Mon' },
  { date: '2026-05-25', name: 'Memorial Day', day: 'Mon' },
  { date: '2026-06-19', name: 'Juneteenth', day: 'Fri' },
  { date: '2026-07-04', name: 'Independence Day', day: 'Sat' },
  { date: '2026-09-07', name: 'Labor Day', day: 'Mon' },
  { date: '2026-10-12', name: 'Columbus Day', day: 'Mon' },
  { date: '2026-11-11', name: 'Veterans Day', day: 'Wed' },
  { date: '2026-11-26', name: 'Thanksgiving', day: 'Thu' },
  { date: '2026-12-25', name: 'Christmas', day: 'Fri' },
];

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function HolidayCountdownCalculator() {
  const [refDate, setRefDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [calculated, setCalculated] = useState(false);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ refDate: string }>('holiday-countdown-calculator');

  const result = useMemo(() => {
    const ref = new Date(refDate + 'T12:00:00');
    const upcoming = HOLIDAYS_2026.map((h) => {
      const hd = new Date(h.date + 'T12:00:00');
      const days = daysBetween(ref, hd);
      return { ...h, days, observed: h.day };
    }).filter((h) => h.days >= 0);
    return { upcoming, next: upcoming[0] };
  }, [refDate]);

  const handleTryExample = () => { setRefDate(new Date().toISOString().slice(0, 10)); setCalculated(false); };
  const handleCalculate = () => {
    setCalculated(true);
    const next = result.next;
    saveEntry({ refDate }, next ? `${next.days} days until ${next.name}` : 'No upcoming holidays');
  };
  const handleReset = () => { setRefDate(new Date().toISOString().slice(0, 10)); setCalculated(false); };
  const handleRestore = (i: { refDate: string }) => { setRefDate(i.refDate); setCalculated(true); };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-muted-foreground">
          <PartyPopper className="inline h-3 w-3 mr-1" />
          11 US federal holidays (5 U.S.C. 6103) for 2026. Private employers are not required to offer paid holidays — see <a href="/calculators/holiday-pay-calculator" className="text-amber-600 hover:underline">Holiday Pay Calculator</a> for premium pay.
        </div>

        <div className="space-y-2 max-w-md">
          <label htmlFor="hc-date" className="text-sm font-medium">Reference Date</label>
          <input id="hc-date" type="date" value={refDate} onChange={(e) => { setRefDate(e.target.value); setCalculated(false); }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate}
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25 flex-1 sm:flex-none">
              Show Countdown
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && result.next && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Next Federal Holiday</p>
                <p className="text-4xl font-bold text-amber-600">{result.next.name}</p>
                <p className="text-2xl font-semibold">{result.next.days} {result.next.days === 1 ? 'day' : 'days'} away</p>
                <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{result.next.date} ({result.next.day})</Badge>
              </div>

              <div className="rounded-xl border border-border/50 overflow-hidden">
                <div className="px-4 py-2 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground">
                  All 2026 Federal Holidays
                </div>
                <div className="divide-y divide-border/40">
                  {HOLIDAYS_2026.map((h) => {
                    const hd = new Date(h.date + 'T12:00:00');
                    const ref = new Date(refDate + 'T12:00:00');
                    const days = daysBetween(ref, hd);
                    const isPast = days < 0;
                    const isNext = result.next && h.date === result.next.date;
                    return (
                      <div key={h.date} className={`grid grid-cols-3 gap-2 px-4 py-2 text-xs ${isNext ? 'bg-amber-500/10' : isPast ? 'opacity-50' : ''}`}>
                        <div className="font-semibold">{h.name}</div>
                        <div className="text-muted-foreground">{h.date} ({h.day})</div>
                        <div className="text-right font-semibold">
                          {isPast ? <span className="text-muted-foreground">passed</span> : <span className={isNext ? 'text-amber-600' : ''}>{days} days</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 Federal employees receive paid time off on these 11 holidays (5 U.S.C. 6103). If a holiday falls on a Saturday, it is observed on Friday; if Sunday, observed on Monday. Private employers are NOT required to offer paid holidays — about 78% of private-sector workers get paid holidays. State holidays vary (e.g., Cesar Chavez Day in CA, TX Independence Day in TX).
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

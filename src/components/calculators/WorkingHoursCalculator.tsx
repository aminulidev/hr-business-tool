'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

interface WorkingHoursSnapshot { weeklyHours: number; annualHours: number; monthlyHours: number; ptoHours: number; netHours: number; label: string; }

const COUNTRY_HOLIDAYS: Record<string, number> = { US: 11, UK: 8, CA: 9, AU: 7, EU: 10, DE: 9, FR: 11, OTHER: 10 };

export default function WorkingHoursCalculator() {
  const [weeklyHours, setWeeklyHours] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [holidays, setHolidays] = useState('11');
  const [country, setCountry] = useState('US');
  const [ptoDays, setPtoDays] = useState('15');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<WorkingHoursSnapshot | null>(null);
  const [compareB, setCompareB] = useState<WorkingHoursSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ weeklyHours: string; weeksPerYear: string; holidays: string; country: string; ptoDays: string }>('working-hours-calculator');

  const wph = parseFloat(weeklyHours) || 0;
  const wpy = parseFloat(weeksPerYear) || 0;
  const hol = parseFloat(holidays) || 0;
  const pto = parseFloat(ptoDays) || 0;

  const grossAnnual = wph * wpy;
  const holidayHours = hol * wph / 5; // holiday = 1 day = wph/5 hours
  const ptoHours = pto * wph / 5;
  const netAnnual = grossAnnual - holidayHours - ptoHours;
  const netMonthly = netAnnual / 12;
  const netWeekly = netAnnual / 52;

  const handleTryExample = () => { setWeeklyHours('40'); setWeeksPerYear('52'); setHolidays('11'); setCountry('US'); setPtoDays('15'); setCalculated(false); };
  const handleCalculate = () => {
    if (wph > 0) {
      setCalculated(true);
      saveEntry({ weeklyHours, weeksPerYear, holidays, country, ptoDays }, `${wph}h/wk × ${wpy}wk = ${netAnnual.toFixed(0)}h net/year`);
    }
  };
  const handleReset = () => { setWeeklyHours('40'); setWeeksPerYear('52'); setHolidays('11'); setCountry('US'); setPtoDays('15'); setCalculated(false); };
  const handleRestore = (i: { weeklyHours: string; weeksPerYear: string; holidays: string; country: string; ptoDays: string }) => {
    setWeeklyHours(i.weeklyHours); setWeeksPerYear(i.weeksPerYear); setHolidays(i.holidays); setCountry(i.country); setPtoDays(i.ptoDays); setCalculated(true);
  };
  const snap = (): WorkingHoursSnapshot => ({ weeklyHours: wph, annualHours: netAnnual, monthlyHours: netMonthly, ptoHours: ptoHours + holidayHours, netHours: netAnnual, label: `${wph}h/wk` });

  const chartData = [
    { name: 'Gross Annual', value: grossAnnual, fill: '#10b981' },
    { name: 'Holidays Off', value: holidayHours, fill: '#f59e0b' },
    { name: 'PTO Off', value: ptoHours, fill: '#8b5cf6' },
    { name: 'Net Annual', value: netAnnual, fill: '#3b82f6' },
  ];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wh-weekly">Hours per Week</Label>
            <Input id="wh-weekly" type="number" step="0.5" min="0" placeholder="40" value={weeklyHours}
              onChange={(e) => { setWeeklyHours(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wh-weeks">Weeks per Year</Label>
            <Input id="wh-weeks" type="number" step="1" min="1" max="52" placeholder="52" value={weeksPerYear}
              onChange={(e) => { setWeeksPerYear(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wh-country">Country (auto-fill holidays)</Label>
            <Select value={country} onValueChange={(v) => { setCountry(v); setHolidays(String(COUNTRY_HOLIDAYS[v] || 10)); setCalculated(false); }}>
              <SelectTrigger id="wh-country"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(COUNTRY_HOLIDAYS).map(([code, n]) => (
                  <SelectItem key={code} value={code}>{code} ({n} holidays)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wh-holidays">Public Holidays (days)</Label>
            <Input id="wh-holidays" type="number" step="1" min="0" placeholder="11" value={holidays}
              onChange={(e) => { setHolidays(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wh-pto">PTO / Vacation Days</Label>
            <Input id="wh-pto" type="number" step="0.5" min="0" placeholder="15" value={ptoDays}
              onChange={(e) => { setPtoDays(e.target.value); setCalculated(false); }} />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={wph <= 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none">
              Calculate Working Hours
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Net Working Hours (Annual)</p>
                <p className="text-4xl font-bold text-blue-600">{netAnnual.toFixed(0)}h</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{netMonthly.toFixed(0)}h/month</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{netWeekly.toFixed(1)}h/week avg</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{(holidayHours + ptoHours).toFixed(0)}h off</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Gross Annual', value: `${grossAnnual.toFixed(0)}h` },
                  { label: 'Holiday Hours Off', value: `${holidayHours.toFixed(0)}h` },
                  { label: 'PTO Hours Off', value: `${ptoHours.toFixed(0)}h` },
                  { label: 'Net Annual', value: `${netAnnual.toFixed(0)}h`, amber: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.amber ? 'text-blue-600' : ''}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(v) => `${(v / 100).toFixed(0)}h`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [`${v.toFixed(0)}h`, '']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 US average: 1,800-1,900 net working hours/year (vs. Germany ~1,400 and South Korea ~2,100). The OECD average is ~1,740 hours. FLSA does not cap weekly hours — only overtime (1.5×) applies after 40h. EU Working Time Directive caps at 48h/week avg over 16 weeks.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Weekly Hours', valueA: `${compareA.weeklyHours}h`, valueB: `${compareB.weeklyHours}h`, numA: compareA.weeklyHours, numB: compareB.weeklyHours },
          { label: 'Annual Net', valueA: `${compareA.annualHours.toFixed(0)}h`, valueB: `${compareB.annualHours.toFixed(0)}h`, numA: compareA.annualHours, numB: compareB.annualHours },
          { label: 'Monthly Net', valueA: `${compareA.monthlyHours.toFixed(0)}h`, valueB: `${compareB.monthlyHours.toFixed(0)}h`, numA: compareA.monthlyHours, numB: compareB.monthlyHours },
          { label: 'Total Time Off', valueA: `${compareA.ptoHours.toFixed(0)}h`, valueB: `${compareB.ptoHours.toFixed(0)}h`, numA: compareA.ptoHours, numB: compareB.ptoHours },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

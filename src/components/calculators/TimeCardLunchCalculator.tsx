'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coffee,
  Clock,
  Info,
  AlertCircle,
  BarChart as BarChartIcon,
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

type LunchMode = 'auto' | 'manual';

interface DayEntry {
  enabled: boolean;
  clockIn: string;
  lunchStart: string;
  lunchEnd: string;
  clockOut: string;
}

interface DayResult {
  day: string;
  enabled: boolean;
  clockIn: string;
  lunchStart: string;
  lunchEnd: string;
  clockOut: string;
  hoursBeforeLunch: number;
  hoursAfterLunch: number;
  lunchDuration: number;
  totalHours: number;
}

interface TimeCardResult {
  days: DayResult[];
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalHours: number;
  overtimeThreshold: number;
  weeklyDecimal: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minutesToDecimal(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function createEmptyDay(): DayEntry {
  return {
    enabled: true,
    clockIn: '09:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    clockOut: '17:00',
  };
}

const DEFAULT_DAYS: DayEntry[] = [
  createEmptyDay(),
  createEmptyDay(),
  createEmptyDay(),
  createEmptyDay(),
  createEmptyDay(),
  { enabled: false, clockIn: '', lunchStart: '', lunchEnd: '', clockOut: '' },
  { enabled: false, clockIn: '', lunchStart: '', lunchEnd: '', clockOut: '' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TimeCardLunchCalculator() {
  const [days, setDays] = useState<DayEntry[]>(DEFAULT_DAYS);
  const [lunchMode, setLunchMode] = useState<LunchMode>('manual');
  const [autoLunchDuration, setAutoLunchDuration] = useState('60');
  const [overtimeThreshold, setOvertimeThreshold] = useState('40');
  const [result, setResult] = useState<TimeCardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateDay = (idx: number, field: keyof DayEntry, value: string | boolean) => {
    setDays((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
    setResult(null);
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const otThresh = parseFloat(overtimeThreshold);
    if (isNaN(otThresh) || otThresh <= 0) {
      setError('Please enter a valid overtime threshold greater than zero.');
      return;
    }

    const autoDur = parseFloat(autoLunchDuration);
    if (lunchMode === 'auto' && (isNaN(autoDur) || autoDur < 0)) {
      setError('Please enter a valid lunch duration.');
      return;
    }

    const dayResults: DayResult[] = [];
    let totalMinutes = 0;

    for (let i = 0; i < days.length; i++) {
      const day = days[i];

      if (!day.enabled) {
        dayResults.push({
          day: DAYS[i],
          enabled: false,
          clockIn: '',
          lunchStart: '',
          lunchEnd: '',
          clockOut: '',
          hoursBeforeLunch: 0,
          hoursAfterLunch: 0,
          lunchDuration: 0,
          totalHours: 0,
        });
        continue;
      }

      if (!day.clockIn || !day.clockOut) {
        setError(`Please enter clock-in and clock-out times for ${DAYS[i]}.`);
        return;
      }

      const clockInMin = timeToMinutes(day.clockIn);
      const clockOutMin = timeToMinutes(day.clockOut);

      if (clockOutMin <= clockInMin) {
        setError(
          `Clock-out time must be after clock-in time for ${DAYS[i]}.`
        );
        return;
      }

      let lunchMin = 0;
      let hoursBefore = 0;
      let hoursAfter = 0;

      if (lunchMode === 'manual') {
        if (!day.lunchStart || !day.lunchEnd) {
          setError(
            `Please enter lunch start and end times for ${DAYS[i]} (or switch to auto-deduct mode).`
          );
          return;
        }
        const lunchStartMin = timeToMinutes(day.lunchStart);
        const lunchEndMin = timeToMinutes(day.lunchEnd);

        if (lunchEndMin <= lunchStartMin) {
          setError(
            `Lunch end must be after lunch start for ${DAYS[i]}.`
          );
          return;
        }
        if (lunchStartMin < clockInMin || lunchEndMin > clockOutMin) {
          setError(
            `Lunch times must be within clock-in and clock-out times for ${DAYS[i]}.`
          );
          return;
        }

        lunchMin = lunchEndMin - lunchStartMin;
        hoursBefore = lunchStartMin - clockInMin;
        hoursAfter = clockOutMin - lunchEndMin;
      } else {
        // Auto-deduct: subtract lunch from the middle of the shift
        lunchMin = autoDur || 0;
        const totalShiftMin = clockOutMin - clockInMin;
        if (totalShiftMin <= lunchMin) {
          setError(
            `Total shift time for ${DAYS[i]} is less than or equal to the lunch duration.`
          );
          return;
        }
        const effectiveMin = totalShiftMin - lunchMin;
        const half = lunchMin / 2;
        hoursBefore = totalShiftMin / 2 - half;
        hoursAfter = totalShiftMin / 2 - half;
      }

      const totalDayMin = hoursBefore + hoursAfter;
      totalMinutes += totalDayMin;

      dayResults.push({
        day: DAYS[i],
        enabled: true,
        clockIn: day.clockIn,
        lunchStart: lunchMode === 'manual' ? day.lunchStart : '',
        lunchEnd: lunchMode === 'manual' ? day.lunchEnd : '',
        clockOut: day.clockOut,
        hoursBeforeLunch: minutesToDecimal(hoursBefore),
        hoursAfterLunch: minutesToDecimal(hoursAfter),
        lunchDuration: minutesToDecimal(lunchMin),
        totalHours: minutesToDecimal(totalDayMin),
      });
    }

    const totalHours = minutesToDecimal(totalMinutes);
    const totalRegularHours = Math.min(totalHours, otThresh);
    const totalOvertimeHours = Math.max(totalHours - otThresh, 0);

    setResult({
      days: dayResults,
      totalRegularHours,
      totalOvertimeHours,
      totalHours,
      overtimeThreshold: otThresh,
      weeklyDecimal: totalHours,
    });
  };

  const handleReset = () => {
    setDays(DEFAULT_DAYS);
    setLunchMode('manual');
    setAutoLunchDuration('60');
    setOvertimeThreshold('40');
    setResult(null);
    setError(null);
  };

  // ------ SEO content ------

  const howToSteps = [
    'Enable or disable each day of the work week (Mon–Sun) using the toggles. Disabled days are excluded from the calculation entirely.',
    'Choose your lunch mode: "Manual" to enter specific lunch start and end times for each day, or "Auto-Deduct" to subtract a fixed lunch duration (e.g., 30 or 60 minutes) from the middle of each shift.',
    'Enter your clock-in time and clock-out time for each enabled workday. If using manual mode, also enter your lunch start and end times.',
    'Set the overtime threshold (default is 40 hours per week). Hours worked beyond this threshold are counted as overtime hours.',
    'Click "Calculate Hours" to see a daily breakdown table showing hours before lunch, hours after lunch, lunch duration, and total hours per day, along with weekly totals including overtime.',
  ];

  const formula =
    'Total Hours = (Lunch Start − Clock In) + (Clock Out − Lunch End)';

  const formulaDescription =
    'The total work hours for a day are calculated by splitting the shift into two segments: the time from clock-in to lunch start, and the time from lunch end to clock-out. The lunch break period is excluded from paid hours. In auto-deduct mode, the calculator simply subtracts a fixed duration (e.g., 30 or 60 minutes) from the total shift time. Under the Fair Labor Standards Act (FLSA), employers are generally not required to pay for bona fide meal breaks (typically 30 minutes or longer), provided the employee is completely relieved of all duties during the break. Shorter breaks (usually under 20 minutes) must generally be compensated.';

  const workedExamples = [
    {
      title: 'Standard 5-Day Week with 1-Hour Lunch',
      description:
        'Clock in at 9:00 AM, lunch from 12:00 PM to 1:00 PM, clock out at 5:00 PM. Hours before lunch: 3.00h. Hours after lunch: 4.00h. Lunch duration: 1.00h. Total daily hours: 7.00h. Over 5 days: 35.00 total hours (all regular, no overtime since under 40h threshold).',
    },
    {
      title: '6-Day Week with 30-Minute Auto-Deduct Lunch',
      description:
        'A restaurant worker works 6 days: Mon–Sat, 10:00 AM to 6:00 PM with a 30-minute auto-deducted lunch. Total shift per day: 8h − 0.5h = 7.5h. Weekly total: 7.5 × 6 = 45.00 hours. Regular hours: 40.00. Overtime hours: 5.00. The overtime premium (at 1.5x) would apply to those 5 extra hours.',
    },
    {
      title: 'Variable Schedule with Manual Lunch Times',
      description:
        'Mon: 8:00 AM–12:00 PM (4h, no lunch). Tue: 9:00 AM–5:30 PM with lunch 12:30–1:00 PM (before: 3.5h, after: 4.5h, total: 8.0h). Wed: 10:00 AM–6:00 PM with lunch 1:00–1:30 PM (total: 7.5h). Thu–Fri: same as Tue (8.0h each). Weekly total: 4.0 + 8.0 + 7.5 + 8.0 + 8.0 = 35.5 hours. All regular, no overtime.',
    },
  ];

  const faqs = [
    {
      question: 'Does my employer have to pay me for my lunch break?',
      answer:
        'Generally, no — under the FLSA, employers are not required to pay for bona fide meal periods (typically 30 minutes or longer) if the employee is completely relieved of all duties during the break. However, if you are required to remain at your workstation, answer phones, or perform any work during your lunch, that time must be compensated. State laws may provide additional protections: some states (like California) require a paid 30-minute meal break for shifts exceeding 5 hours. Short breaks of 5–20 minutes are generally considered compensable rest periods and must be paid.',
    },
    {
      question: 'What are the FLSA lunch break rules?',
      answer:
        'The federal FLSA does not require employers to provide meal or rest breaks. However, if an employer chooses to provide short breaks (typically 5–20 minutes), the FLSA considers them compensable work time that must be included in hours worked. For bona fide meal periods (typically 30 minutes or more), the employee must be completely free from duty for the break to be unpaid. Many states have their own break requirements that go beyond federal law. California, for example, requires a 30-minute unpaid meal period for shifts over 5 hours and a 10-minute paid rest break per 4 hours worked.',
    },
    {
      question: 'Can my employer auto-deduct lunch from my timesheet?',
      answer:
        'Employers can auto-deduct a standard lunch duration (e.g., 30 or 60 minutes) from timesheets, but only if the employee actually takes the full break. If an employee works through lunch or takes a shorter break, the employer must pay for the actual time worked. The Department of Labor has ruled that auto-deductions are permissible only when the employer has a reasonable basis for believing the deduction is accurate (e.g., the employee reliably takes their full lunch break). If auto-deductions result in an employee being underpaid, the employer must compensate for the actual hours worked.',
    },
    {
      question: 'What if I work through my lunch break?',
      answer:
        'If you work through your lunch break — even if your employer has a policy that you should take a break — you must be paid for that time. The key question is whether you were "completely relieved of duty." If you ate at your desk while working, monitored equipment, or remained available to assist customers or colleagues, the time is compensable. Document your actual work hours, including lunch periods when you worked. If your employer auto-deducts lunch despite you working through it, you may have a wage claim for unpaid hours. Many employment lawsuits revolve around exactly this issue.',
    },
    {
      question: 'How many hours is an 8-hour shift with lunch?',
      answer:
        'An 8-hour workday with a 1-hour unpaid lunch means you are at work for 9 hours total (8 hours paid + 1 hour unpaid lunch). If you have a 30-minute lunch, you are at work for 8.5 hours (8 hours paid + 0.5 hours unpaid). Conversely, if you need to get 8 hours of paid work done with a 1-hour lunch, you need to be at work from 8:00 AM to 5:00 PM (9 total hours on-site). Always clarify with your employer whether "8-hour shift" means 8 hours of paid work or 8 hours of total time including breaks.',
    },
    {
      question: 'How does time rounding work on time cards?',
      answer:
        'Many employers round time card entries to the nearest 5, 10, or 15 minutes. Under FLSA regulations, rounding is permissible if it averages out fairly over time — meaning the rounding does not consistently favor the employer. For example, if you clock in at 8:57 and the system rounds to 9:00, but you also clock out at 5:03 and it rounds to 5:00, the rounding is considered neutral. However, if rounding consistently results in underpayment (e.g., always rounding down), it may violate wage laws. Some states restrict or prohibit time rounding. The most common rounding methods are: round to nearest quarter-hour (7:52→8:00, 7:53→7:45), and round in favor of the employee (always round up for clock-in, down for clock-out).',
    },
  ];

  const relatedTools = [
    {
      slug: 'time-card',
      title: 'Time Card Calculator',
      description:
        'Calculate total work hours from clock-in/out times for payroll',
      icon: 'Clock',
    },
    {
      slug: 'overtime',
      title: 'Overtime Calculator',
      description:
        'Calculate overtime pay with standard time-and-a-half and double-time rates',
      icon: 'Timer',
    },
    {
      slug: 'payroll',
      title: 'Payroll & Paycheck Calculator',
      description:
        'Estimate your take-home pay after taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'wages',
      title: 'Wages Calculator',
      description:
        'Calculate gross wages from hours worked and hourly rates with overtime',
      icon: 'Banknote',
    },
    {
      slug: 'business-day',
      title: 'Business Day Calculator',
      description:
        'Count business days between dates or add/subtract working days',
      icon: 'CalendarDays',
    },
  ];

  // ------ Render ------

  return (
    <CalculatorLayout
      title="Time Card Calculator with Lunch"
      description="Calculate total work hours with automatic lunch break deduction. Supports manual or auto-deduct lunch mode and weekly overtime tracking."
      icon={<Coffee className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Time Card Calculator with Lunch' },
      ]}
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
        {/* Lunch Mode */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Coffee className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Lunch Break Mode
          </Label>
          <Select
            value={lunchMode}
            onValueChange={(v) => {
              setLunchMode(v as LunchMode);
              setResult(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">
                Manual — Enter lunch start/end times
              </SelectItem>
              <SelectItem value="auto">
                Auto-Deduct — Subtract fixed duration
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Lunch Duration */}
        {lunchMode === 'auto' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="autoLunch" className="text-sm font-medium">
              Auto-Deduct Lunch Duration (minutes)
            </Label>
            <Select value={autoLunchDuration} onValueChange={setAutoLunchDuration}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                <SelectItem value="90">90 minutes (1.5 hours)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This duration will be deducted from each workday automatically
            </p>
          </motion.div>
        )}

        {/* Overtime Threshold */}
        <div className="space-y-2">
          <Label htmlFor="otThresh" className="text-sm font-medium">
            <AlertCircle className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Weekly Overtime Threshold (hours)
          </Label>
          <Input
            id="otThresh"
            type="number"
            min="0"
            step="1"
            value={overtimeThreshold}
            onChange={(e) => setOvertimeThreshold(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Federal default: 40 hours/week
          </p>
        </div>

        {/* Daily Entries */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Daily Time Entries
          </p>

          {/* Header row (desktop) */}
          <div className="hidden sm:grid grid-cols-6 gap-2 text-xs text-muted-foreground font-medium px-1">
            <span>Day</span>
            <span>Clock In</span>
            {lunchMode === 'manual' && <span>Lunch Out</span>}
            {lunchMode === 'manual' && <span>Lunch In</span>}
            <span>Clock Out</span>
            <span className="text-right">On/Off</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {days.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`rounded-lg border p-3 space-y-2 transition-colors ${
                  day.enabled
                    ? 'border-border/50 bg-background'
                    : 'border-border/20 bg-muted/20 opacity-60'
                }`}
              >
                {/* Mobile label */}
                <div className="sm:hidden flex items-center justify-between">
                  <span className="text-sm font-medium">{DAYS[idx]}</span>
                  <button
                    type="button"
                    onClick={() => updateDay(idx, 'enabled', !day.enabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
                      day.enabled
                        ? 'bg-emerald-500'
                        : 'bg-input border border-border'
                    }`}
                    role="switch"
                    aria-checked={day.enabled}
                  >
                    <span
                      className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        day.enabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`grid gap-2 ${
                    lunchMode === 'manual'
                      ? 'grid-cols-3 sm:grid-cols-6'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}
                >
                  {/* Day label (desktop) */}
                  <div className="hidden sm:flex items-center">
                    <span className="text-sm font-medium">{DAYS[idx]}</span>
                  </div>

                  {/* Clock In */}
                  <div className="space-y-1">
                    <Label
                      htmlFor={`in-${idx}`}
                      className="sm:hidden text-xs font-medium"
                    >
                      Clock In
                    </Label>
                    <Input
                      id={`in-${idx}`}
                      type="time"
                      value={day.enabled ? day.clockIn : ''}
                      disabled={!day.enabled}
                      onChange={(e) =>
                        updateDay(idx, 'clockIn', e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>

                  {/* Lunch Start (manual) */}
                  {lunchMode === 'manual' && (
                    <div className="space-y-1">
                      <Label
                        htmlFor={`ls-${idx}`}
                        className="sm:hidden text-xs font-medium"
                      >
                        Lunch Out
                      </Label>
                      <Input
                        id={`ls-${idx}`}
                        type="time"
                        value={day.enabled ? day.lunchStart : ''}
                        disabled={!day.enabled}
                        onChange={(e) =>
                          updateDay(idx, 'lunchStart', e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                  )}

                  {/* Lunch End (manual) */}
                  {lunchMode === 'manual' && (
                    <div className="space-y-1">
                      <Label
                        htmlFor={`le-${idx}`}
                        className="sm:hidden text-xs font-medium"
                      >
                        Lunch In
                      </Label>
                      <Input
                        id={`le-${idx}`}
                        type="time"
                        value={day.enabled ? day.lunchEnd : ''}
                        disabled={!day.enabled}
                        onChange={(e) =>
                          updateDay(idx, 'lunchEnd', e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                  )}

                  {/* Clock Out */}
                  <div className="space-y-1">
                    <Label
                      htmlFor={`out-${idx}`}
                      className="sm:hidden text-xs font-medium"
                    >
                      Clock Out
                    </Label>
                    <Input
                      id={`out-${idx}`}
                      type="time"
                      value={day.enabled ? day.clockOut : ''}
                      disabled={!day.enabled}
                      onChange={(e) =>
                        updateDay(idx, 'clockOut', e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>

                  {/* Toggle (desktop) */}
                  <div className="hidden sm:flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        updateDay(idx, 'enabled', !day.enabled)
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
                        day.enabled
                          ? 'bg-emerald-500'
                          : 'bg-input border border-border'
                      }`}
                      role="switch"
                      aria-checked={day.enabled}
                    >
                      <span
                        className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          day.enabled ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <Clock className="h-4 w-4 mr-2" />
            Calculate Hours
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
          className="mt-8 px-4 sm:px-6"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Total Weekly Hours
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {result.totalHours.toFixed(2)} hrs
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-xs font-medium"
                >
                  {result.totalRegularHours.toFixed(2)} regular
                </Badge>
                {result.totalOvertimeHours > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 border-amber-500/30 text-amber-600 px-3 py-1 text-xs font-medium"
                  >
                    {result.totalOvertimeHours.toFixed(2)} overtime
                  </Badge>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Total Hours',
                  value: `${result.totalHours.toFixed(2)} hrs`,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Regular Hours',
                  value: `${result.totalRegularHours.toFixed(2)} hrs`,
                  color: 'text-blue-600',
                },
                {
                  label: 'Overtime Hours',
                  value: `${result.totalOvertimeHours.toFixed(2)} hrs`,
                  color: result.totalOvertimeHours > 0 ? 'text-amber-600' : 'text-muted-foreground',
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="rounded-xl bg-background border border-border/50 p-3 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className={`text-base sm:text-lg font-bold ${item.color}`}>
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Daily Hours Bar Chart */}
            {result.days.some((d) => d.enabled) && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChartIcon className="h-4.5 w-4.5 text-primary" />
                  Hours Worked Per Day
                </p>
                <div className="h-64 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={result.days.filter((d) => d.enabled)}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: '#888888', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#888888', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <RechartsTooltip
                        formatter={(value: number) => [`${value.toFixed(2)} hrs`, 'Hours Worked']}
                        labelStyle={{ color: '#888888' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="totalHours" radius={[4, 4, 0, 0]} fill="#10b981" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Daily Breakdown Table */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Daily Breakdown
              </p>
              <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">
                          Day
                        </th>
                        {lunchMode === 'manual' && (
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Before Lunch
                          </th>
                        )}
                        {lunchMode === 'manual' && (
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            After Lunch
                          </th>
                        )}
                        <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                          Lunch
                        </th>
                        <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {result.days.map((d, idx) => (
                        <tr
                          key={idx}
                          className={
                            d.enabled ? '' : 'opacity-40 text-muted-foreground'
                          }
                        >
                          <td className="px-3 py-2 font-medium">
                            {d.day}
                            {!d.enabled && (
                              <span className="ml-1 text-xs">(off)</span>
                            )}
                          </td>
                          {lunchMode === 'manual' && (
                            <td className="text-right px-3 py-2">
                              {d.enabled ? d.hoursBeforeLunch.toFixed(2) : '—'}
                            </td>
                          )}
                          {lunchMode === 'manual' && (
                            <td className="text-right px-3 py-2">
                              {d.enabled ? d.hoursAfterLunch.toFixed(2) : '—'}
                            </td>
                          )}
                          <td className="text-right px-3 py-2 text-amber-600">
                            {d.enabled
                              ? `−${d.lunchDuration.toFixed(2)}`
                              : '—'}
                          </td>
                          <td className="text-right px-3 py-2 font-semibold">
                            {d.enabled ? d.totalHours.toFixed(2) : '—'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-500/5 font-bold">
                        <td className="px-3 py-2.5" colSpan={lunchMode === 'manual' ? 4 : 2}>
                          Weekly Total
                        </td>
                        <td className="text-right px-3 py-2.5 text-emerald-600">
                          {result.totalHours.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> Hours are displayed in decimal format
                (e.g., 7.50 = 7 hours 30 minutes) which is standard for payroll
                processing. Overtime is calculated for hours exceeding{' '}
                {result.overtimeThreshold} per week. Federal FLSA requires overtime
                pay at 1.5x the regular rate for non-exempt employees. State laws
                may have additional daily overtime requirements.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </CalculatorLayout>
  );
}

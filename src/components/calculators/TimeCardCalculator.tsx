'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Trash2, DollarSign, Timer, AlertCircle, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WorkDay {
  id: string;
  label: string;
  clockIn: string;
  clockOut: string;
  lunchBreak: string;
}

interface TimeCardResult {
  days: {
    label: string;
    clockIn: string;
    clockOut: string;
    lunchBreak: number;
    totalHours: number;
    decimalHours: number;
  }[];
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalDecimalHours: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  hourlyRate: number;
  overtimeThreshold: number;
  overtimeMultiplier: number;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return -1;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return -1;
  return hours * 60 + minutes;
}

function minutesToDecimal(totalMinutes: number): number {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return parseFloat((hours + mins / 60).toFixed(2));
}

function formatDecimalHours(decimal: number): string {
  return decimal.toFixed(2);
}

function formatHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

const defaultDays: WorkDay[] = DAY_LABELS.slice(0, 5).map((label) => ({
  id: generateId(),
  label,
  clockIn: '09:00',
  clockOut: '17:00',
  lunchBreak: '30',
}));

export default function TimeCardCalculator() {
  const [days, setDays] = useState<WorkDay[]>(defaultDays);
  const [hourlyRate, setHourlyRate] = useState('');
  const [overtimeThreshold, setOvertimeThreshold] = useState('40');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [result, setResult] = useState<TimeCardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addDay = useCallback(() => {
    const dayIndex = days.length % 7;
    const label = DAY_LABELS[dayIndex];
    setDays((prev) => [
      ...prev,
      {
        id: generateId(),
        label: prev.length < 7 ? label : `Day ${prev.length + 1}`,
        clockIn: '09:00',
        clockOut: '17:00',
        lunchBreak: '30',
      },
    ]);
  }, [days.length]);

  const removeDay = useCallback((id: string) => {
    setDays((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  const updateDay = useCallback((id: string, field: keyof WorkDay, value: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }, []);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const rate = parseFloat(hourlyRate) || 0;
    const threshold = parseFloat(overtimeThreshold) || 40;
    const multiplier = parseFloat(overtimeMultiplier) || 1.5;

    const parsedDays: TimeCardResult['days'] = [];
    let totalHours = 0;

    for (const day of days) {
      const inMinutes = parseTimeToMinutes(day.clockIn);
      const outMinutes = parseTimeToMinutes(day.clockOut);
      const lunchMinutes = parseFloat(day.lunchBreak) || 0;

      if (inMinutes < 0) {
        setError(`Invalid clock-in time for ${day.label}. Use HH:MM format (e.g., 09:00).`);
        return;
      }
      if (outMinutes < 0) {
        setError(`Invalid clock-out time for ${day.label}. Use HH:MM format (e.g., 17:00).`);
        return;
      }
      if (outMinutes <= inMinutes) {
        setError(`Clock-out must be after clock-in for ${day.label}.`);
        return;
      }

      const workedMinutes = outMinutes - inMinutes - lunchMinutes;
      if (workedMinutes < 0) {
        setError(`Lunch break exceeds total work time for ${day.label}.`);
        return;
      }

      const totalMins = workedMinutes;
      const decimalHours = minutesToDecimal(totalMins);
      const displayHours = totalMins / 60;

      parsedDays.push({
        label: day.label,
        clockIn: day.clockIn,
        clockOut: day.clockOut,
        lunchBreak: lunchMinutes,
        totalHours: displayHours,
        decimalHours,
      });

      totalHours += displayHours;
    }

    const regularHours = Math.min(totalHours, threshold);
    const overtimeHours = Math.max(totalHours - threshold, 0);

    const regularPay = rate * regularHours;
    const overtimePay = rate * overtimeHours * multiplier;
    const totalPay = regularPay + overtimePay;

    setResult({
      days: parsedDays,
      totalRegularHours: regularHours,
      totalOvertimeHours: overtimeHours,
      totalDecimalHours: minutesToDecimal(Math.round(totalHours * 60)),
      regularPay,
      overtimePay,
      totalPay,
      hourlyRate: rate,
      overtimeThreshold: threshold,
      overtimeMultiplier: multiplier,
    });
  };

  const formatCurrency = (value: number): string =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const howToSteps = [
    'Enter your clock-in and clock-out times for each workday using the HH:MM 24-hour format. For example, enter 09:00 for 9:00 AM and 17:00 for 5:00 PM.',
    'Specify your lunch break duration in minutes for each day. The default is 30 minutes, which will be subtracted from your total worked hours automatically.',
    'If you want to calculate your wages, enter your hourly rate in dollars. You can also adjust the overtime threshold (default 40 hours/week) and overtime multiplier (default 1.5x).',
    'Add or remove workdays as needed. The calculator starts with a standard Monday through Friday week, but you can add weekend shifts or remove days you did not work.',
    'Click "Calculate Hours" to see a detailed breakdown of regular hours, overtime hours, decimal hours, and—if provided—your total earnings for the period.',
  ];

  const formula = 'Total Hours = Σ(Clock Out − Clock In) − Σ(Lunch Break / 60)';
  const formulaDescription =
    'The total hours worked is calculated by summing the difference between clock-out and clock-in times for each day, then subtracting the total lunch break time converted to hours. Decimal hours are calculated as Hours + Minutes / 60 (e.g., 8 hours 30 minutes = 8.50 decimal hours).';

  const faqs = [
    {
      question: 'How do you convert minutes to decimal hours?',
      answer:
        'To convert minutes to decimal hours, divide the minutes by 60 and add the result to the whole hours. For example, 8 hours and 45 minutes becomes 8 + 45/60 = 8.75 decimal hours. This format is commonly used in payroll systems and time tracking software because it makes it easier to calculate wages. Most employers require time entries in decimal format for accurate payment processing.',
    },
    {
      question: 'What is overtime and when does it apply?',
      answer:
        'Overtime is the time an employee works beyond their standard scheduled hours, typically beyond 40 hours in a workweek in the United States under the Fair Labor Standards Act (FLSA). Overtime must be compensated at a rate of at least 1.5 times the employee\'s regular hourly rate, known as "time and a half." Some states have additional daily overtime rules, such as California where exceeding 8 hours in a single day also triggers overtime pay.',
    },
    {
      question: 'How does time rounding work in time cards?',
      answer:
        'Many employers use time rounding to simplify payroll calculations. The most common rounding methods include rounding to the nearest quarter-hour (15 minutes), nearest tenth of an hour (6 minutes), or nearest 5 minutes. For example, if an employee clocks in at 8:53 AM and the system rounds to the nearest quarter-hour, the time would be recorded as 9:00 AM. Federal law permits rounding as long as it does not systematically result in the employee losing pay over time.',
    },
    {
      question: 'Can lunch breaks be unpaid?',
      answer:
        'Yes, in most U.S. states, meal breaks of 30 minutes or more can be unpaid as long as the employee is completely relieved of all duties during the break. The federal FLSA does not require employers to provide meal or rest breaks, though many states have their own laws mandating break times. Shorter breaks (typically 5-20 minutes) are generally considered compensable work time and must be paid. Always check your state and local labor laws for specific requirements.',
    },
    {
      question: 'How do I calculate overtime pay?',
      answer:
        'Overtime is typically calculated at 1.5 times your regular hourly rate for any hours exceeding 40 in a single workweek under US federal law. The formula is: OT pay = overtime hours × regular hourly rate × 1.5. Some states, such as California, also require daily overtime for hours worked beyond 8 in a single day, and double-time for hours beyond 12. Always check your state\'s specific overtime rules for the most accurate calculation.',
    },
    {
      question: 'What is time rounding and is it legal?',
      answer:
        'Time rounding is the practice of rounding clock-in and clock-out times to the nearest preset increment, commonly 5, 10, or 15 minutes. Under federal law, time rounding is legal as long as it does not consistently disadvantage employees over time. For example, if rounding sometimes benefits the employer and sometimes benefits the employee, it is generally permissible. However, if rounding systematically shortchanges workers, the employer may be required to pay back wages.',
    },
    {
      question: 'How do I handle on-call hours?',
      answer:
        'On-call hours where you are required to remain at the workplace or are severely restricted in your activities are typically counted as hours worked and must be compensated. On-call hours where you are free to pursue personal activities at home and simply carry a phone or pager may not count as compensable time, depending on your jurisdiction. Check your local labor laws and company policy, as rules vary significantly between states and industries.',
    },
    {
      question: 'Can my employer require me to work through lunch?',
      answer:
        'In most US states, employers must provide a meal break for shifts exceeding 6 hours, but they may not be required to pay for it if you are fully relieved of all work duties. If your employer requires you to work through your lunch period or respond to calls and emails during the break, that time is typically compensable under the FLSA. Some states like California impose strict penalties for missed meal breaks. Document any instances where you are asked to work through lunch to protect your right to compensation.',
    },
  ];

  return (
    <CalculatorLayout
      title="Time Card & Decimal Hours Calculator"
      description="Calculate total work hours from clock in/out times, deduct lunch breaks, and convert to decimal format for payroll."
      icon={<Clock className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Time Card & Decimal Calculator' },
      ]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Time Card Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={howToSteps}
      formula={formula}
      formulaDescription={formulaDescription}
      workedExamples={[
        {
          title: 'Standard 40-Hour Week',
          description:
            'A standard Monday through Friday schedule clocking in at 09:00 and out at 17:00 each day, with a 30-minute unpaid lunch break. Each day yields 7.5 hours of work (8 hours minus 30 minutes), but with a 30-minute lunch that\'s 7.5 hours per day × 5 days = 40 hours total regular time. Decimal format: 40.00 hours. No overtime applies since the total equals exactly the standard 40-hour threshold.',
        },
        {
          title: 'Overtime Week (45 Hours)',
          description:
            'Working Monday through Thursday for 8 hours each (09:00–17:00 with 30-min lunch), and Friday for 9 hours (09:00–18:00 with 30-min lunch). That gives 8 × 4 = 32 regular hours Mon–Thu plus 8.5 hours on Friday for a total of 40.5 hours. With a $20/hr rate and 1.5x overtime multiplier: regular pay = 40 × $20 = $800, overtime pay = 0.5 × $20 × 1.5 = $15, total weekly pay = $815.',
        },
        {
          title: 'Half-Day Clock-In',
          description:
            'A part-time or half-day shift from 12:00 to 17:00 with no lunch break. Total worked time is 5 hours, which converts to 5.00 decimal hours. This is a common scenario for part-time employees, students, or workers picking up an extra half shift. At $18/hr with no overtime, earnings for this shift would be $90.',
        },
      ]}
      faqs={faqs}
      relatedTools={[
        { slug: 'time-card-calculator-with-lunch', title: 'Time Card Calculator with Lunch', description: 'Track work hours with automatic lunch break deduction', icon: 'Coffee' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Calculate take-home pay from hours worked', icon: 'CreditCard' },
        { slug: 'salary-converter', title: 'Salary Converter', description: 'Convert between hourly, monthly, and annual salary', icon: 'DollarSign' },
        { slug: 'time-to-decimal-calculator', title: 'Decimal & Fraction Converter', description: 'Convert between decimals, fractions, and percentages', icon: 'Hash' },
        { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'See what a raise looks like in your paycheck', icon: 'TrendingUp' },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* Work Days */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-base">
              <Clock className="inline h-4 w-4 mr-1.5 text-muted-foreground" />
              Work Days
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addDay}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Day
            </Button>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {days.map((day) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="rounded-xl border border-border/50 bg-muted/20 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">
                    {day.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDay(day.id)}
                    disabled={days.length <= 1}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Clock In</Label>
                    <Input
                      type="text"
                      placeholder="09:00"
                      value={day.clockIn}
                      onChange={(e) => updateDay(day.id, 'clockIn', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Clock Out</Label>
                    <Input
                      type="text"
                      placeholder="17:00"
                      value={day.clockOut}
                      onChange={(e) => updateDay(day.id, 'clockOut', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Lunch (min)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="30"
                      value={day.lunchBreak}
                      onChange={(e) => updateDay(day.id, 'lunchBreak', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Wage Settings */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
          <Label className="text-sm font-semibold">
            <DollarSign className="inline h-4 w-4 mr-1.5 text-muted-foreground" />
            Wage Settings (Optional)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate" className="text-xs text-muted-foreground">
                <DollarSign className="inline h-3 w-3 mr-1" />
                Hourly Rate ($)
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="25.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="otThreshold" className="text-xs text-muted-foreground">
                <Timer className="inline h-3 w-3 mr-1" />
                OT Threshold (hrs/wk)
              </Label>
              <Input
                id="otThreshold"
                type="number"
                min="0"
                step="1"
                placeholder="40"
                value={overtimeThreshold}
                onChange={(e) => setOvertimeThreshold(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="otMultiplier" className="text-xs text-muted-foreground">
                OT Rate Multiplier
              </Label>
              <Input
                id="otMultiplier"
                type="number"
                min="0"
                step="0.1"
                placeholder="1.5"
                value={overtimeMultiplier}
                onChange={(e) => setOvertimeMultiplier(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-500 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
          size="lg"
        >
          Calculate Hours
        </Button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8" aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Hours Worked
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatDecimalHours(result.totalDecimalHours)} hrs
              </p>
              <p className="text-xs text-muted-foreground">
                ({formatHHMM(Math.round(result.totalDecimalHours * 60))} in hours & minutes)
              </p>
            </div>

            {/* Daily Hours Bar Chart */}
            {result.days.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChartIcon className="h-4.5 w-4.5 text-primary" />
                  Hours Worked Per Day
                </p>
                <div className="h-64 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={result.days}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis
                        dataKey="label"
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
                        formatter={(value: number) => [`${formatDecimalHours(value)} hrs`, 'Hours Worked']}
                        labelStyle={{ color: '#888888' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="decimalHours" radius={[4, 4, 0, 0]} fill="#10b981" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Daily Breakdown Table */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Day
                    </th>
                    <th className="text-center px-3 py-3 font-medium text-muted-foreground">
                      In
                    </th>
                    <th className="text-center px-3 py-3 font-medium text-muted-foreground">
                      Out
                    </th>
                    <th className="text-center px-3 py-3 font-medium text-muted-foreground">
                      Lunch
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Hours
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Decimal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {result.days.map((day) => (
                    <tr key={day.label}>
                      <td className="px-4 py-3 font-medium">{day.label}</td>
                      <td className="text-center px-3 py-3 text-muted-foreground">
                        {day.clockIn}
                      </td>
                      <td className="text-center px-3 py-3 text-muted-foreground">
                        {day.clockOut}
                      </td>
                      <td className="text-center px-3 py-3 text-muted-foreground">
                        {day.lunchBreak}m
                      </td>
                      <td className="text-right px-4 py-3">
                        {formatHHMM(Math.round(day.totalHours * 60))}
                      </td>
                      <td className="text-right px-4 py-3 font-mono font-medium">
                        {formatDecimalHours(day.decimalHours)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hours Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Regular</p>
                <p className="text-xl font-bold">
                  {formatDecimalHours(result.totalRegularHours)}
                </p>
                <p className="text-xs text-muted-foreground">hrs</p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Overtime</p>
                <p className="text-xl font-bold text-amber-600">
                  {formatDecimalHours(result.totalOvertimeHours)}
                </p>
                <p className="text-xs text-muted-foreground">hrs</p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatDecimalHours(result.totalDecimalHours)}
                </p>
                <p className="text-xs text-muted-foreground">hrs</p>
              </div>
            </div>

            {/* Pay Breakdown */}
            {result.hourlyRate > 0 && (
              <div className="rounded-xl bg-background border border-border/50 p-4 space-y-3">
                <p className="text-sm font-semibold text-center">Earnings Breakdown</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Regular Pay</p>
                    <p className="text-lg font-bold">{formatCurrency(result.regularPay)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Overtime Pay ({result.overtimeMultiplier}x)
                    </p>
                    <p className="text-lg font-bold text-amber-600">
                      {formatCurrency(result.overtimePay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Total Pay</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatCurrency(result.totalPay)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center pt-1">
                  <Badge variant="outline" className="text-xs">
                    Rate: {formatCurrency(result.hourlyRate)}/hr | OT after {result.overtimeThreshold} hrs/wk
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </CalculatorLayout>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote } from 'lucide-react';
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
import { formatCurrency } from '@/lib/utils';

interface PayrollHoursSnapshot { regHours: number; otHours: number; dtHours: number; totalPay: number; label: string; }
const PAY_FREQS: Record<string, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };

export default function PayrollHoursCalculator() {
  const [regHours, setRegHours] = useState('40');
  const [otHours, setOtHours] = useState('0');
  const [dtHours, setDtHours] = useState('0');
  const [regRate, setRegRate] = useState('22');
  const [payFreq, setPayFreq] = useState('biweekly');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<PayrollHoursSnapshot | null>(null);
  const [compareB, setCompareB] = useState<PayrollHoursSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ regHours: string; otHours: string; dtHours: string; regRate: string; payFreq: string }>('payroll-hours-calculator');

  const rh = parseFloat(regHours) || 0;
  const oh = parseFloat(otHours) || 0;
  const dh = parseFloat(dtHours) || 0;
  const r = parseFloat(regRate) || 0;

  const otRate = r * 1.5;
  const dtRate = r * 2;
  const regPay = rh * r;
  const otPay = oh * otRate;
  const dtPay = dh * dtRate;
  const totalPay = regPay + otPay + dtPay;
  const perPay = totalPay * (PAY_FREQS[payFreq] / 52);
  const annualPay = totalPay * 52;

  const handleTryExample = () => { setRegHours('40'); setOtHours('6'); setDtHours('2'); setRegRate('25'); setPayFreq('biweekly'); setCalculated(false); };
  const handleCalculate = () => {
    if (r > 0 && (rh + oh + dh) > 0) {
      setCalculated(true);
      saveEntry({ regHours, otHours, dtHours, regRate, payFreq }, `${rh}h reg + ${oh}h OT + ${dh}h DT · ${formatCurrency(totalPay)}/wk`);
    }
  };
  const handleReset = () => { setRegHours('40'); setOtHours('0'); setDtHours('0'); setRegRate('20'); setPayFreq('biweekly'); setCalculated(false); };
  const handleRestore = (i: { regHours: string; otHours: string; dtHours: string; regRate: string; payFreq: string }) => {
    setRegHours(i.regHours); setOtHours(i.otHours); setDtHours(i.dtHours); setRegRate(i.regRate); setPayFreq(i.payFreq); setCalculated(true);
  };
  const snap = (): PayrollHoursSnapshot => ({ regHours: rh, otHours: oh, dtHours: dh, totalPay, label: `${rh}h+${oh}h+${dh}h` });

  const chartData = [
    { name: 'Regular', amount: regPay, fill: '#10b981' },
    { name: 'OT (1.5×)', amount: otPay, fill: '#f59e0b' },
    { name: 'DT (2×)', amount: dtPay, fill: '#f43f5e' },
  ];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ph-reg">Regular Hours</Label>
            <Input id="ph-reg" type="number" step="0.5" min="0" placeholder="40" value={regHours}
              onChange={(e) => { setRegHours(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph-ot">OT Hours (1.5×)</Label>
            <Input id="ph-ot" type="number" step="0.5" min="0" placeholder="0" value={otHours}
              onChange={(e) => { setOtHours(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph-dt">DT Hours (2×)</Label>
            <Input id="ph-dt" type="number" step="0.5" min="0" placeholder="0" value={dtHours}
              onChange={(e) => { setDtHours(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph-rate">Hourly Rate</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ph-rate" type="number" step="0.25" min="0" placeholder="20.00" value={regRate}
                onChange={(e) => { setRegRate(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph-freq">Pay Frequency</Label>
            <Select value={payFreq} onValueChange={(v) => { setPayFreq(v); setCalculated(false); }}>
              <SelectTrigger id="ph-freq"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly (52 pays)</SelectItem>
                <SelectItem value="biweekly">Bi-weekly (26 pays)</SelectItem>
                <SelectItem value="semimonthly">Semi-monthly (24 pays)</SelectItem>
                <SelectItem value="monthly">Monthly (12 pays)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={r <= 0 || (rh + oh + dh) <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Payroll
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Gross Pay ({payFreq})</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(perPay)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{formatCurrency(totalPay)} weekly</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{formatCurrency(annualPay)} annual</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">OT rate: {formatCurrency(otRate)}/h</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Regular Pay', value: formatCurrency(regPay) },
                  { label: 'OT Pay (1.5×)', value: formatCurrency(otPay) },
                  { label: 'DT Pay (2×)', value: formatCurrency(dtPay) },
                  { label: 'Total Gross', value: formatCurrency(totalPay), amber: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.amber ? 'text-emerald-600' : ''}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [formatCurrency(v), 'Amount']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 FLSA requires OT at 1.5× for hours over 40/week. Double-time (2×) is mandatory in California for hours over 12/day or over 8 on the 7th consecutive day. For net pay after taxes, see <a href="/calculators/payroll-calculator" className="text-emerald-600 hover:underline">Payroll Calculator</a> or <a href="/calculators/hourly-paycheck-calculator" className="text-emerald-600 hover:underline">Hourly Paycheck Calculator</a>.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Regular Hours', valueA: `${compareA.regHours}h`, valueB: `${compareB.regHours}h`, numA: compareA.regHours, numB: compareB.regHours },
          { label: 'OT Hours', valueA: `${compareA.otHours}h`, valueB: `${compareB.otHours}h`, numA: compareA.otHours, numB: compareB.otHours },
          { label: 'DT Hours', valueA: `${compareA.dtHours}h`, valueB: `${compareB.dtHours}h`, numA: compareA.dtHours, numB: compareB.dtHours },
          { label: 'Total Pay', valueA: formatCurrency(compareA.totalPay), valueB: formatCurrency(compareB.totalPay), numA: compareA.totalPay, numB: compareB.totalPay },
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

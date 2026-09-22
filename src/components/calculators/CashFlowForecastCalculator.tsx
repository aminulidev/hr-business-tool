'use client';

/**
 * CashFlowForecastCalculator — projects 12-month cash flow based on
 * starting cash, monthly revenue, monthly expenses, and growth rate.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Info, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TryExample from './TryExample';

interface MonthData {
  month: number;
  revenue: number;
  expenses: number;
  netCashFlow: number;
  cumulativeCash: number;
}

interface ForecastResult {
  months: MonthData[];
  lowestCash: { month: number; cash: number };
  highestCash: { month: number; cash: number };
  endsPositive: boolean;
  breakEvenMonth: number | null;
  totalRevenue: number;
  totalExpenses: number;
  totalNet: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function CashFlowForecastCalculator() {
  const [startingCash, setStartingCash] = useState('50000');
  const [monthlyRevenue, setMonthlyRevenue] = useState('30000');
  const [monthlyExpenses, setMonthlyExpenses] = useState('25000');
  const [revenueGrowth, setRevenueGrowth] = useState('2');
  const [expenseGrowth, setExpenseGrowth] = useState('1');
  const [months, setMonths] = useState('12');

  const result = useMemo<ForecastResult | null>(() => {
    const sc = parseFloat(startingCash);
    const mr = parseFloat(monthlyRevenue);
    const me = parseFloat(monthlyExpenses);
    const rg = parseFloat(revenueGrowth) / 100;
    const eg = parseFloat(expenseGrowth) / 100;
    const m = parseInt(months);

    if (isNaN(sc) || isNaN(mr) || isNaN(me) || isNaN(rg) || isNaN(eg) || isNaN(m)) return null;

    const monthData: MonthData[] = [];
    let cumCash = sc;
    let currentRev = mr;
    let currentExp = me;
    let lowestCash = { month: 0, cash: sc };
    let highestCash = { month: 0, cash: sc };
    let breakEvenMonth: number | null = null;
    let totalRev = 0;
    let totalExp = 0;

    for (let i = 1; i <= m; i++) {
      const net = currentRev - currentExp;
      cumCash += net;
      monthData.push({
        month: i,
        revenue: currentRev,
        expenses: currentExp,
        netCashFlow: net,
        cumulativeCash: cumCash,
      });
      if (cumCash < lowestCash.cash) lowestCash = { month: i, cash: cumCash };
      if (cumCash > highestCash.cash) highestCash = { month: i, cash: cumCash };
      if (breakEvenMonth === null && cumCash <= 0) breakEvenMonth = i;
      totalRev += currentRev;
      totalExp += currentExp;
      currentRev *= (1 + rg);
      currentExp *= (1 + eg);
    }

    return {
      months: monthData,
      lowestCash,
      highestCash,
      endsPositive: cumCash > 0,
      breakEvenMonth,
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      totalNet: totalRev - totalExp,
    };
  }, [startingCash, monthlyRevenue, monthlyExpenses, revenueGrowth, expenseGrowth, months]);

  const handleTryExample = () => {
    setStartingCash('75000');
    setMonthlyRevenue('45000');
    setMonthlyExpenses('38000');
    setRevenueGrowth('3');
    setExpenseGrowth('1.5');
    setMonths('12');
  };

  const handleReset = () => {
    setStartingCash('50000');
    setMonthlyRevenue('30000');
    setMonthlyExpenses('25000');
    setRevenueGrowth('2');
    setExpenseGrowth('1');
    setMonths('12');
  };

  return (
    <div className="p-5 sm:p-6 space-y-6">
      <TryExample onClick={handleTryExample} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sc" className="text-sm font-medium">Starting Cash ($)</Label>
          <Input id="sc" type="number" value={startingCash} onChange={(e) => setStartingCash(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="mr" className="text-sm font-medium">Monthly Revenue ($)</Label>
          <Input id="mr" type="number" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="me" className="text-sm font-medium">Monthly Expenses ($)</Label>
          <Input id="me" type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="rg" className="text-sm font-medium">Revenue Growth (%/mo)</Label>
          <Input id="rg" type="number" value={revenueGrowth} onChange={(e) => setRevenueGrowth(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="eg" className="text-sm font-medium">Expense Growth (%/mo)</Label>
          <Input id="eg" type="number" value={expenseGrowth} onChange={(e) => setExpenseGrowth(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="m" className="text-sm font-medium">Forecast Months</Label>
          <Input id="m" type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="mt-1" />
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-display space-y-5"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="size-4 text-emerald-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">12-Month Revenue</p>
              </div>
              <p className="text-xl font-bold text-emerald-600">{fmt(result.totalRevenue)}</p>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown className="size-4 text-red-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">12-Month Expenses</p>
              </div>
              <p className="text-xl font-bold text-red-600">{fmt(result.totalExpenses)}</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="size-4 text-blue-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Net Cash Flow</p>
              </div>
              <p className={`text-xl font-bold ${result.totalNet >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {fmt(result.totalNet)}
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="size-4 text-amber-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Lowest Cash Month</p>
              </div>
              <p className="text-xl font-bold text-amber-600">{fmt(result.lowestCash.cash)}</p>
              <p className="text-xs text-muted-foreground mt-1">Month {result.lowestCash.month}</p>
            </div>
          </div>

          {/* Cash flow warning */}
          {result.breakEvenMonth !== null && (
            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">Cash runs out in month {result.breakEvenMonth}</p>
                <p className="text-xs text-red-600/90 mt-1">
                  Based on current projections, cumulative cash drops below $0 in month {result.breakEvenMonth}.
                  Consider reducing expenses, accelerating revenue, or securing additional financing before then.
                </p>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="rounded-xl border border-border/60 p-4">
            <h3 className="text-sm font-semibold mb-3">12-Month Cumulative Cash Projection</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={result.months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} stroke="#9ca3af" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} stroke="#9ca3af" />
                <Tooltip
                  formatter={(v: number) => fmt(v)}
                  labelFormatter={(v) => `Month ${v}`}
                />
                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" label="Break-even" />
                <Line
                  type="monotone"
                  dataKey="cumulativeCash"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ fill: '#059669', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Cumulative Cash"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Monthly Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Monthly Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly breakdown */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">Expenses</th>
                  <th className="text-right p-2">Net</th>
                  <th className="text-right p-2">Cumulative Cash</th>
                </tr>
              </thead>
              <tbody>
                {result.months.map((m) => (
                  <tr key={m.month} className="border-t border-border/30">
                    <td className="p-2 font-medium">M{m.month}</td>
                    <td className="p-2 text-right text-emerald-600">{fmt(m.revenue)}</td>
                    <td className="p-2 text-right text-red-600">{fmt(m.expenses)}</td>
                    <td className={`p-2 text-right font-medium ${m.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {m.netCashFlow >= 0 ? '+' : ''}{fmt(m.netCashFlow)}
                    </td>
                    <td className={`p-2 text-right font-bold ${m.cumulativeCash >= 0 ? 'text-foreground' : 'text-red-600'}`}>
                      {fmt(m.cumulativeCash)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
        </motion.div>
      )}
    </div>
  );
}

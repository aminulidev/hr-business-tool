'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, Download, Copy, Check, Sparkles, DollarSign, Calculator, HelpCircle, Building2, BarChart2 } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface EmployeeRow {
  id: string;
  name: string;
  department: string;
  regHours: string;
  otHours: string;
  dtHours: string;
  rate: string;
}

interface EmployeeHoursSnapshot {
  totalEmployees: number;
  totalRegHours: number;
  totalOTHours: number;
  totalDTHours: number;
  totalGrossPay: number;
  totalEmployerCost: number;
  label: string;
}

const PRESET_TEAMS: Record<string, EmployeeRow[]> = {
  office: [
    { id: '1', name: 'Alice Walker', department: 'Operations', regHours: '40', otHours: '0', dtHours: '0', rate: '28.00' },
    { id: '2', name: 'Bob Martinez', department: 'Logistics', regHours: '40', otHours: '6.5', dtHours: '0', rate: '24.50' },
    { id: '3', name: 'Carol Chang', department: 'Customer Care', regHours: '35', otHours: '0', dtHours: '0', rate: '21.00' },
    { id: '4', name: 'David Smith', department: 'Operations', regHours: '40', otHours: '10', dtHours: '2', rate: '32.00' },
  ],
  construction: [
    { id: '1', name: 'Mike Johnson', department: 'Framing', regHours: '40', otHours: '12', dtHours: '4', rate: '34.00' },
    { id: '2', name: 'Leo Rivera', department: 'Framing', regHours: '40', otHours: '10', dtHours: '2', rate: '30.00' },
    { id: '3', name: 'Sarah Miller', department: 'Electrical', regHours: '40', otHours: '8', dtHours: '0', rate: '38.50' },
    { id: '4', name: 'Chris Evans', department: 'Laborer', regHours: '40', otHours: '14', dtHours: '5', rate: '25.00' },
  ],
  healthcare: [
    { id: '1', name: 'Nurse Emma', department: 'ICU', regHours: '36', otHours: '8', dtHours: '4', rate: '48.00' },
    { id: '2', name: 'Nurse Daniel', department: 'ER', regHours: '36', otHours: '12', dtHours: '2', rate: '46.50' },
    { id: '3', name: 'Tech Liam', department: 'Radiology', regHours: '40', otHours: '4', dtHours: '0', rate: '31.00' },
  ],
};

export default function EmployeeHoursCalculator() {
  const [employees, setEmployees] = useState<EmployeeRow[]>(PRESET_TEAMS.office);
  const [employerTaxLoad, setEmployerTaxLoad] = useState('10.0'); // 7.65% FICA + ~2.35% FUTA/SUTA/Workers Comp
  const [calculated, setCalculated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [compareA, setCompareA] = useState<EmployeeHoursSnapshot | null>(null);
  const [compareB, setCompareB] = useState<EmployeeHoursSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('employee-hours-calculator');

  const parseRow = (e: EmployeeRow) => {
    const reg = parseFloat(e.regHours) || 0;
    const ot = parseFloat(e.otHours) || 0;
    const dt = parseFloat(e.dtHours) || 0;
    const r = parseFloat(e.rate) || 0;
    const regPay = reg * r;
    const otPay = ot * r * 1.5;
    const dtPay = dt * r * 2.0;
    const totalPay = regPay + otPay + dtPay;
    const totalHours = reg + ot + dt;
    return { reg, ot, dt, r, regPay, otPay, dtPay, totalPay, totalHours };
  };

  const parsed = useMemo(() => employees.map(parseRow), [employees]);

  const summary = useMemo(() => {
    const totalReg = parsed.reduce((s, p) => s + p.reg, 0);
    const totalOT = parsed.reduce((s, p) => s + p.ot, 0);
    const totalDT = parsed.reduce((s, p) => s + p.dt, 0);
    const totalHours = totalReg + totalOT + totalDT;
    const totalRegPay = parsed.reduce((s, p) => s + p.regPay, 0);
    const totalOTPay = parsed.reduce((s, p) => s + p.otPay, 0);
    const totalDTPay = parsed.reduce((s, p) => s + p.dtPay, 0);
    const totalGrossPay = totalRegPay + totalOTPay + totalDTPay;
    const taxRate = (parseFloat(employerTaxLoad) || 0) / 100;
    const employerTaxes = totalGrossPay * taxRate;
    const totalEmployerCost = totalGrossPay + employerTaxes;
    const avgHourlyCost = totalHours > 0 ? totalGrossPay / totalHours : 0;

    return {
      totalReg,
      totalOT,
      totalDT,
      totalHours,
      totalRegPay,
      totalOTPay,
      totalDTPay,
      totalGrossPay,
      employerTaxes,
      totalEmployerCost,
      avgHourlyCost,
    };
  }, [parsed, employerTaxLoad]);

  const updateRow = (id: string, field: keyof EmployeeRow, value: string) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    setCalculated(false);
  };

  const addEmployee = () => {
    const newId = String(Date.now());
    setEmployees((prev) => [
      ...prev,
      {
        id: newId,
        name: `Employee ${prev.length + 1}`,
        department: 'General',
        regHours: '40',
        otHours: '0',
        dtHours: '0',
        rate: '25.00',
      },
    ]);
    setCalculated(false);
  };

  const removeEmployee = (id: string) => {
    if (employees.length <= 1) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setCalculated(false);
  };

  const loadPreset = (teamKey: keyof typeof PRESET_TEAMS) => {
    setEmployees(PRESET_TEAMS[teamKey]);
    setCalculated(false);
  };

  const handleTryExample = () => {
    loadPreset('office');
    setEmployerTaxLoad('10.0');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (summary.totalGrossPay > 0) {
      setCalculated(true);
      const inputs: Record<string, string> = { employerTaxLoad };
      employees.forEach((e, i) => {
        inputs[`e${i}_id`] = e.id;
        inputs[`e${i}_name`] = e.name;
        inputs[`e${i}_dept`] = e.department;
        inputs[`e${i}_reg`] = e.regHours;
        inputs[`e${i}_ot`] = e.otHours;
        inputs[`e${i}_dt`] = e.dtHours;
        inputs[`e${i}_rate`] = e.rate;
      });
      saveEntry(
        inputs,
        `${employees.length} employees · ${summary.totalHours.toFixed(1)}h · ${formatCurrency(summary.totalGrossPay)} payroll`,
      );
    }
  };

  const handleReset = () => {
    setEmployees([
      { id: '1', name: 'Employee 1', department: 'General', regHours: '40', otHours: '0', dtHours: '0', rate: '25.00' },
    ]);
    setEmployerTaxLoad('10.0');
    setCalculated(false);
  };

  const handleRestore = (i: Record<string, string>) => {
    const count = Object.keys(i).filter((k) => k.startsWith('e') && k.endsWith('_name')).length;
    const ne: EmployeeRow[] = [];
    for (let idx = 0; idx < count; idx++) {
      ne.push({
        id: i[`e${idx}_id`] || String(idx),
        name: i[`e${idx}_name`] || `Employee ${idx + 1}`,
        department: i[`e${idx}_dept`] || 'General',
        regHours: i[`e${idx}_reg`] || '40',
        otHours: i[`e${idx}_ot`] || '0',
        dtHours: i[`e${idx}_dt`] || '0',
        rate: i[`e${idx}_rate`] || '20.00',
      });
    }
    if (ne.length > 0) setEmployees(ne);
    if (i.employerTaxLoad) setEmployerTaxLoad(i.employerTaxLoad);
    setCalculated(true);
  };

  const exportCSV = () => {
    const headers = ['Employee Name', 'Department', 'Regular Hours', 'Overtime (1.5x)', 'Double Time (2.0x)', 'Hourly Rate', 'Regular Pay', 'Overtime Pay', 'Double Time Pay', 'Total Gross Pay'];
    const rows = employees.map((e, idx) => {
      const p = parsed[idx];
      return [
        `"${e.name}"`,
        `"${e.department}"`,
        p.reg.toFixed(2),
        p.ot.toFixed(2),
        p.dt.toFixed(2),
        p.r.toFixed(2),
        p.regPay.toFixed(2),
        p.otPay.toFixed(2),
        p.dtPay.toFixed(2),
        p.totalPay.toFixed(2),
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employee_payroll_hours_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySummary = () => {
    const lines = [
      'TEAM PAYROLL & HOURS SUMMARY',
      '============================',
      ...employees.map((e, idx) => {
        const p = parsed[idx];
        return `${e.name} (${e.department}): ${p.totalHours.toFixed(1)}h total [${p.reg}h reg, ${p.ot}h ot, ${p.dt}h dt] @ $${p.r.toFixed(2)}/h = ${formatCurrency(p.totalPay)}`;
      }),
      '----------------------------',
      `Total Headcount: ${employees.length} employees`,
      `Total Team Hours: ${summary.totalHours.toFixed(1)}h (${summary.totalReg.toFixed(1)}h reg + ${summary.totalOT.toFixed(1)}h ot + ${summary.totalDT.toFixed(1)}h dt)`,
      `Total Gross Payroll: ${formatCurrency(summary.totalGrossPay)}`,
      `Estimated Employer Taxes (${employerTaxLoad}%): ${formatCurrency(summary.employerTaxes)}`,
      `Total Employer Cost: ${formatCurrency(summary.totalEmployerCost)}`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const snap = (): EmployeeHoursSnapshot => ({
    totalEmployees: employees.length,
    totalRegHours: summary.totalReg,
    totalOTHours: summary.totalOT,
    totalDTHours: summary.totalDT,
    totalGrossPay: summary.totalGrossPay,
    totalEmployerCost: summary.totalEmployerCost,
    label: `${employees.length} emp · ${summary.totalHours.toFixed(1)}h · ${formatCurrency(summary.totalGrossPay)}`,
  });

  const chartData = employees.map((e, idx) => ({
    name: e.name.split(' ')[0] || `Emp ${idx + 1}`,
    regular: parsed[idx].regPay,
    overtime: parsed[idx].otPay + parsed[idx].dtPay,
    total: parsed[idx].totalPay,
  }));

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Banner */}
        <div className="flex items-start gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
          <Users className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">
              Multi-Employee Payroll & Hours Tracker
            </p>
            <p>
              Consolidate weekly timesheets for your entire team. Computes straight-time, 1.5× overtime, 2.0× double-time, and estimated employer payroll tax overhead (FICA, FUTA, SUTA) for accurate labor budgeting.
            </p>
          </div>
        </div>

        {/* Quick Load Team Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Load Sample Teams
            </Label>
            <span className="text-[11px] text-muted-foreground">Select team template:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => loadPreset('office')}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Office & Support (4)</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('construction')}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Construction Crew (4)</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('healthcare')}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Healthcare Staff (3)</span>
            </button>
            <button
              type="button"
              onClick={addEmployee}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Employee</span>
            </button>
          </div>
        </div>

        {/* Employee Roster Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Employee Roster ({employees.length} Members)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Employer Tax Load:</span>
              <div className="relative w-20">
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={employerTaxLoad}
                  onChange={(e) => { setEmployerTaxLoad(e.target.value); setCalculated(false); }}
                  className="h-7 text-xs pr-4 text-right"
                />
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">%</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/70 bg-card">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground">
                  <th className="py-2.5 px-3">Employee Name</th>
                  <th className="py-2.5 px-2">Dept / Role</th>
                  <th className="py-2.5 px-2 text-right">Reg (1.0x)</th>
                  <th className="py-2.5 px-2 text-right">OT (1.5x)</th>
                  <th className="py-2.5 px-2 text-right">DT (2.0x)</th>
                  <th className="py-2.5 px-2 text-right">Rate ($/hr)</th>
                  <th className="py-2.5 px-3 text-right">Gross Pay</th>
                  <th className="py-2.5 px-2 text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {employees.map((e, idx) => {
                  const p = parsed[idx];
                  return (
                    <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-2 px-3">
                        <Input
                          placeholder="Employee Name"
                          value={e.name}
                          onChange={(ev) => updateRow(e.id, 'name', ev.target.value)}
                          className="h-8 text-xs font-medium"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input
                          placeholder="Department"
                          value={e.department}
                          onChange={(ev) => updateRow(e.id, 'department', ev.target.value)}
                          className="h-8 text-xs"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="40"
                          value={e.regHours}
                          onChange={(ev) => updateRow(e.id, 'regHours', ev.target.value)}
                          className="h-8 text-xs text-right w-20 ml-auto font-mono"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="0"
                          value={e.otHours}
                          onChange={(ev) => updateRow(e.id, 'otHours', ev.target.value)}
                          className="h-8 text-xs text-right w-20 ml-auto font-mono"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="0"
                          value={e.dtHours}
                          onChange={(ev) => updateRow(e.id, 'dtHours', ev.target.value)}
                          className="h-8 text-xs text-right w-20 ml-auto font-mono"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <div className="relative w-24 ml-auto">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            step="0.25"
                            min="0"
                            placeholder="25.00"
                            value={e.rate}
                            onChange={(ev) => updateRow(e.id, 'rate', ev.target.value)}
                            className="h-8 text-xs text-right pl-5 font-mono"
                          />
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right font-bold font-mono text-sm text-foreground">
                        {formatCurrency(p.totalPay)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeEmployee(e.id)}
                          disabled={employees.length <= 1}
                          className="text-muted-foreground hover:text-rose-600 disabled:opacity-30 transition-colors p-1"
                          title="Remove employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/40 font-bold border-t border-border/70 text-xs">
                  <td colSpan={2} className="py-2.5 px-3">
                    Team Totals ({employees.length} Staff)
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-emerald-600">
                    {summary.totalReg.toFixed(1)}h
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-amber-600">
                    {summary.totalOT.toFixed(1)}h
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-rose-600">
                    {summary.totalDT.toFixed(1)}h
                  </td>
                  <td className="py-2.5 px-2 text-right text-muted-foreground">
                    Avg ${(summary.avgHourlyCost).toFixed(2)}/h
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-600 text-sm">
                    {formatCurrency(summary.totalGrossPay)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addEmployee}
              className="text-xs h-9 text-blue-700 dark:text-blue-300 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Row
            </Button>
            <TryExample onClick={handleTryExample} />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={summary.totalGrossPay <= 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none font-medium"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Total Payroll
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {/* Calculated Results Display */}
        {calculated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="result-display mt-2"
            aria-live="polite"
          >
            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-6 space-y-6">
              {/* Hero KPI Card */}
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Total Weekly Team Gross Payroll
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-blue-600 tracking-tight">
                  {formatCurrency(summary.totalGrossPay)}
                </p>
                <div className="flex justify-center items-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-medium">
                    {summary.totalHours.toFixed(1)} Total Hours ({employees.length} Staff)
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium">
                    {summary.totalReg.toFixed(1)}h Regular Pay: {formatCurrency(summary.totalRegPay)}
                  </Badge>
                  {(summary.totalOT > 0 || summary.totalDT > 0) && (
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 font-medium">
                      {(summary.totalOT + summary.totalDT).toFixed(1)}h Premium Pay: {formatCurrency(summary.totalOTPay + summary.totalDTPay)}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300 font-medium">
                    Employer Burden ({employerTaxLoad}%): {formatCurrency(summary.totalEmployerCost)}
                  </Badge>
                </div>

                <div className="flex justify-center gap-2 pt-3 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copySummary}
                    className="h-7 text-[11px] px-3 gap-1.5 border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportCSV}
                    className="h-7 text-[11px] px-3 gap-1.5 border-border bg-background hover:bg-muted text-foreground"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2.5 border-primary/30 bg-primary/5 text-primary">
                    {compareA ? '↺ Update Scenario A' : '+ Save Scenario A'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2.5 border-amber-500/30 bg-amber-500/5 text-amber-600">
                    {compareB ? '↺ Update Scenario B' : '+ Save Scenario B'}
                  </Button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Total Team Hours</p>
                  <p className="text-lg font-bold text-foreground">{summary.totalHours.toFixed(1)}h</p>
                  <p className="text-[10px] text-muted-foreground">{employees.length} team members</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Regular Pay (1.0x)</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(summary.totalRegPay)}</p>
                  <p className="text-[10px] text-muted-foreground">{summary.totalReg.toFixed(1)} straight hours</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Overtime + Double Pay</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(summary.totalOTPay + summary.totalDTPay)}</p>
                  <p className="text-[10px] text-muted-foreground">{(summary.totalOT + summary.totalDT).toFixed(1)} premium hours</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Total Employer Cost</p>
                  <p className="text-lg font-bold text-purple-600">{formatCurrency(summary.totalEmployerCost)}</p>
                  <p className="text-[10px] text-muted-foreground">Includes {employerTaxLoad}% tax burden</p>
                </div>
              </div>

              {/* Individual Employee Labor Cost Breakdown Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Gross Pay Breakdown by Employee
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    Shows regular base wages vs overtime premium
                  </span>
                </div>
                <div className="h-52 w-full bg-background/50 rounded-xl p-2 border border-border/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                      <RechartsTooltip
                        formatter={(v: number, name: string) => [formatCurrency(v), name === 'regular' ? 'Regular Pay' : 'Overtime / Premium Pay']}
                        contentStyle={{ borderRadius: '8px', border: 'none', background: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                      />
                      <Bar dataKey="regular" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="overtime" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Employer Payroll Tax Burden Notice */}
              <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-xs text-muted-foreground space-y-1">
                <p>
                  💼 <strong>Employer Labor Cost Planning:</strong> Beyond gross wages ({formatCurrency(summary.totalGrossPay)}), employers are legally responsible for paying matching FICA taxes (6.2% Social Security + 1.45% Medicare = 7.65%), Federal Unemployment (FUTA 0.6% on first $7,000), State Unemployment (SUTA), and Workers' Compensation. At an estimated {employerTaxLoad}% burden rate, your true labor expenditure is <strong>{formatCurrency(summary.totalEmployerCost)}</strong>.
                </p>
                <p>
                  To compute net take-home pay after employee tax withholdings, use our <a href="/calculators/payroll-calculator" className="text-blue-600 hover:underline font-medium">Payroll Calculator</a> or <a href="/calculators/w-2-calculator" className="text-blue-600 hover:underline font-medium">W-2 Calculator</a>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Comparison Drawer */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Employees', valueA: String(compareA.totalEmployees), valueB: String(compareB.totalEmployees), numA: compareA.totalEmployees, numB: compareB.totalEmployees },
          { label: 'Regular Hours', valueA: `${compareA.totalRegHours.toFixed(1)}h`, valueB: `${compareB.totalRegHours.toFixed(1)}h`, numA: compareA.totalRegHours, numB: compareB.totalRegHours },
          { label: 'OT Hours (1.5x)', valueA: `${compareA.totalOTHours.toFixed(1)}h`, valueB: `${compareB.totalOTHours.toFixed(1)}h`, numA: compareA.totalOTHours, numB: compareB.totalOTHours },
          { label: 'Double Time (2.0x)', valueA: `${compareA.totalDTHours.toFixed(1)}h`, valueB: `${compareB.totalDTHours.toFixed(1)}h`, numA: compareA.totalDTHours, numB: compareB.totalDTHours },
          { label: 'Total Gross Payroll', valueA: formatCurrency(compareA.totalGrossPay), valueB: formatCurrency(compareB.totalGrossPay), numA: compareA.totalGrossPay, numB: compareB.totalGrossPay },
          { label: 'Total Employer Cost', valueA: formatCurrency(compareA.totalEmployerCost), valueB: formatCurrency(compareB.totalEmployerCost), numA: compareA.totalEmployerCost, numB: compareB.totalEmployerCost },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel
              rows={rows}
              labelA={compareA.label}
              labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }}
            />
          </div>
        );
      })()}

      <CalcHistoryPanel
        history={history}
        onRestore={handleRestore}
        onClear={clearHistory}
        onDelete={deleteEntry}
      />
    </div>
  );
}


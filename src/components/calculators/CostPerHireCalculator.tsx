'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface CphSnap { totalCost: number; numHires: number; cph: number; label: string; }

export default function CostPerHireCalculator() {
  const [internalRecruiting, setInternalRecruiting] = useState('');
  const [externalAgency, setExternalAgency] = useState('');
  const [jobBoards, setJobBoards] = useState('');
  const [backgroundChecks, setBackgroundChecks] = useState('');
  const [travelRelocation, setTravelRelocation] = useState('');
  const [otherCosts, setOtherCosts] = useState('');
  const [numHires, setNumHires] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<CphSnap | null>(null);
  const [compareB, setCompareB] = useState<CphSnap | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ numHires: string; internalRecruiting: string; externalAgency: string }>('cost-per-hire');

  const parse = (v: string) => parseFloat(v) || 0;
  const internal = parse(internalRecruiting);
  const external = parse(externalAgency);
  const boards = parse(jobBoards);
  const bg = parse(backgroundChecks);
  const travel = parse(travelRelocation);
  const other = parse(otherCosts);
  const hiresNum = parse(numHires);
  const totalCost = internal + external + boards + bg + travel + other;
  const cph = hiresNum > 0 ? totalCost / hiresNum : 0;
  // SHRM 2024 average: ~$4,700
  const shrm = 4700;

  const handleCalculate = () => {
    if (totalCost > 0 && hiresNum > 0) {
      setCalculated(true);
      saveEntry({ numHires, internalRecruiting, externalAgency }, `${hiresNum} hires · Total: ${formatCurrency(totalCost)} · CPH: ${formatCurrency(cph)}`);
    }
  };
  const handleReset = () => {
    [setInternalRecruiting, setExternalAgency, setJobBoards, setBackgroundChecks, setTravelRelocation, setOtherCosts, setNumHires].forEach(fn => fn(''));
    setCalculated(false);
  };
  const handleRestore = (i: { numHires: string; internalRecruiting: string; externalAgency: string }) => {
    setNumHires(i.numHires); setInternalRecruiting(i.internalRecruiting); setExternalAgency(i.externalAgency); setCalculated(true);
  };
  const snap = (): CphSnap => ({ totalCost, numHires: hiresNum, cph, label: `${hiresNum} hires · ${formatCurrency(cph)}/hire` });

  const costItems = [
    { name: 'Internal Recruiting', value: internal, color: '#6366f1' },
    { name: 'Agency Fees', value: external, color: '#f59e0b' },
    { name: 'Job Boards', value: boards, color: '#10b981' },
    { name: 'Background Checks', value: bg, color: '#ec4899' },
    { name: 'Travel / Relocation', value: travel, color: '#14b8a6' },
    { name: 'Other', value: other, color: '#94a3b8' },
  ].filter(c => c.value > 0);

  return (
    <CalculatorLayout
      title="Cost per Hire Calculator"
      description="Calculate your average cost per hire from internal and external recruiting expenses. Compare to industry benchmarks and find cost-saving opportunities."
      icon={<Briefcase className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Cost per Hire Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={[
        'Enter your internal recruiting costs — HR staff time, internal referral bonuses, and ATS software costs.',
        'Enter external recruiting costs — staffing agency fees, executive search fees, and placement fees.',
        'Add job board and advertising costs — LinkedIn, Indeed, Glassdoor, and other paid postings.',
        'Include background check fees, drug screening, and skills assessments.',
        'Enter travel and relocation costs for candidates and new hires.',
        'Divide by the number of hires to get your cost per hire. Compare to the SHRM average of ~$4,700.',
      ]}
      formula={'Total Recruiting Cost = Internal Costs + External Costs + Job Boards + Background Checks + Travel/Relocation + Other\nCost per Hire = Total Recruiting Cost / Number of Hires'}
      formulaDescription="According to SHRM's 2024 Talent Acquisition Benchmark Report, the average cost per hire in the US is approximately $4,700. This includes all direct recruiting expenditures. Some organizations also add indirect costs like manager time spent interviewing (typically 5–10 hours per candidate)."
      workedExamples={[
        { title: 'Small Tech Company (10 Hires)', description: 'Internal HR costs: $8,000, LinkedIn job ads: $3,000, background checks: $500, no agency fees. Total: $11,500. Cost per hire: $1,150 — well below the SHRM average.' },
        { title: 'Mid-Size Firm with Agency (5 Hires)', description: 'Internal costs: $5,000, agency fee: $25,000 (20% of $125k salary), job boards: $2,000, background: $500. Total: $32,500. Cost per hire: $6,500 — above average but efficient for executive roles.' },
        { title: 'Large Enterprise (100 Hires)', description: 'Internal recruiting team: $180,000, job boards: $12,000, background checks: $5,000, relocation: $30,000. Total: $227,000. Cost per hire: $2,270 — economies of scale.' },
      ]}
      faqs={[
        { question: 'What is the average cost per hire?', answer: 'According to SHRM, the average cost per hire is approximately $4,700 (2024). However, this varies dramatically by role level and industry. Entry-level roles might cost $1,000–3,000, while executive searches can cost $15,000–50,000+. Companies using in-house recruiting teams typically achieve significantly lower CPH than those relying on agencies.' },
        { question: 'What is included in cost per hire?', answer: 'Direct costs include advertising and job board fees, agency/recruiter fees, background checks, drug tests, skills assessments, candidate travel and relocation, sign-on bonuses, and ATS software. Indirect costs include manager and HR time spent reviewing resumes, interviewing, and onboarding.' },
        { question: 'How can I reduce cost per hire?', answer: 'Build an employee referral program (referred hires cost 50–70% less). Develop your employer brand to attract passive candidates. Invest in a quality ATS to reduce time-to-fill. Reduce agency dependency by building direct sourcing capabilities. Track time-to-fill alongside CPH, as slow hiring has hidden productivity costs.' },
        { question: 'Is a lower cost per hire always better?', answer: 'Not necessarily. Extremely low CPH can indicate underinvestment in hiring quality, leading to high turnover. Quality of hire (measured by performance ratings and retention) is often more important than CPH alone. The goal is optimizing total workforce cost — balancing CPH with turnover cost and productivity.' },
      ]}
      relatedTools={[
        { slug: 'employee-turnover', title: 'Employee Turnover Calculator', description: 'Turnover rate & attrition cost', icon: 'Users' },
        { slug: 'revenue-per-employee', title: 'Revenue per Employee', description: 'Workforce productivity ratio', icon: 'Activity' },
        { slug: 'workers-comp', title: 'Workers Comp Calculator', description: 'Estimate insurance premiums', icon: 'ShieldCheck' },
        { slug: 'roi', title: 'ROI Calculator', description: 'Measure return on HR investment', icon: 'BarChart3' },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'internal-recruiting', label: 'Internal Recruiting Costs', placeholder: '8,000', note: 'HR staff time, ATS software, referral bonuses', value: internalRecruiting, set: setInternalRecruiting },
            { id: 'external-agency', label: 'Agency / Recruiter Fees', placeholder: '15,000', note: 'Staffing agencies, executive search, placement fees', value: externalAgency, set: setExternalAgency },
            { id: 'job-boards', label: 'Job Boards & Advertising', placeholder: '3,000', note: 'LinkedIn, Indeed, Glassdoor, social media ads', value: jobBoards, set: setJobBoards },
            { id: 'background-checks', label: 'Background Checks & Screening', placeholder: '500', note: 'Criminal, drug, skills assessments, reference checks', value: backgroundChecks, set: setBackgroundChecks },
            { id: 'travel-relocation', label: 'Travel & Relocation', placeholder: '2,000', note: 'Candidate travel, new hire relocation packages', value: travelRelocation, set: setTravelRelocation },
            { id: 'other-costs', label: 'Other Recruiting Costs', placeholder: '0', note: 'Sign-on bonuses, equipment, training materials', value: otherCosts, set: setOtherCosts },
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <div className="relative">
                <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input id={field.id} type="number" step="100" min="0" placeholder={field.placeholder}
                  value={field.value} onChange={(e) => { field.set(e.target.value); setCalculated(false); }} className="pl-7" />
              </div>
              <p className="text-xs text-muted-foreground">{field.note}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <Label htmlFor="num-hires" className="font-semibold">Number of Hires</Label>
          <Input id="num-hires" type="number" step="1" min="1" placeholder="10" className="max-w-xs"
            value={numHires} onChange={(e) => { setNumHires(e.target.value); setCalculated(false); }} />
        </div>

        {totalCost > 0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-3 text-sm text-indigo-700 dark:text-indigo-300">
            📊 Total recruiting spend: <strong>{formatCurrency(totalCost)}</strong>
            {hiresNum > 0 && <> → <strong>{formatCurrency(cph)}</strong> per hire</>}
          </motion.div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleCalculate} disabled={totalCost <= 0 || hiresNum <= 0}
            className="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 flex-1 sm:flex-none">
            Calculate Cost per Hire
          </Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="result-display" aria-live="polite">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cost per Hire</p>
                <p className="text-4xl font-bold text-indigo-600">{formatCurrency(cph)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-600">{hiresNum} total hires</Badge>
                  <Badge variant="outline" className={cph <= shrm ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-amber-500/10 border-amber-500/30 text-amber-600'}>
                    {cph <= shrm ? `${formatCurrency(shrm - cph)} below` : `${formatCurrency(cph - shrm)} above`} SHRM avg
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Recruiting Cost', value: formatCurrency(totalCost) },
                  { label: 'Total Hires', value: `${hiresNum} employees` },
                  { label: 'SHRM 2024 Avg', value: formatCurrency(shrm) },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>

              {costItems.length > 0 && (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={costItems} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value">
                        {costItems.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <RechartsTooltip formatter={(v: number) => [formatCurrency(v)]} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                      <Legend iconType="circle" iconSize={10} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Recruiting Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost, higherIsBetter: false },
          { label: 'Number of Hires', valueA: `${compareA.numHires}`, valueB: `${compareB.numHires}`, numA: compareA.numHires, numB: compareB.numHires },
          { label: 'Cost per Hire', valueA: formatCurrency(compareA.cph), valueB: formatCurrency(compareB.cph), numA: compareA.cph, numB: compareB.cph, higherIsBetter: false },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </CalculatorLayout>
  );
}

'use client';

import { useMemo, useRef, useState } from 'react';
import { Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { buildPayStubHtml, defaultPeriodNumber, type PayStubData } from '@/lib/payroll/pay-stub';

type StubInputs = Omit<PayStubData, 'employeeName' | 'employerName' | 'payDate' | 'periodNumber'>;

interface PayStubDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: StubInputs;
}

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Pay stub preview (Phase 16.1): the live paycheck as a print-ready earnings
 * statement with YTD columns and the employer section. The preview iframe and
 * the printed page share one HTML renderer; "Print / Save as PDF" uses the
 * browser's own dialog, so no PDF library ships to the client.
 */
export default function PayStubDialog({ open, onOpenChange, data }: PayStubDialogProps) {
  const [employeeName, setEmployeeName] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [payDate, setPayDate] = useState(todayIso);
  const [periodNumber, setPeriodNumber] = useState(() => String(defaultPeriodNumber(new Date(), data.result.periodsPerYear)));
  const frameRef = useRef<HTMLIFrameElement>(null);

  const html = useMemo(
    () =>
      buildPayStubHtml({
        ...data,
        employeeName,
        employerName,
        payDate,
        periodNumber: parseInt(periodNumber, 10) || 1,
      }),
    [data, employeeName, employerName, payDate, periodNumber],
  );

  const print = () => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  };

  const download = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pay-stub-${payDate}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pay stub preview</DialogTitle>
          <DialogDescription>
            A print-ready earnings statement for the paycheck above, with year-to-date columns and employer contributions. Use
            &quot;Print / Save as PDF&quot; and choose &quot;Save as PDF&quot; in the print dialog to download it. It is an estimate, not an official pay record.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="stub-employee" className="text-xs">Employee name</Label>
            <Input id="stub-employee" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Optional" maxLength={80} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stub-employer" className="text-xs">Employer name</Label>
            <Input id="stub-employer" value={employerName} onChange={(e) => setEmployerName(e.target.value)} placeholder="Optional" maxLength={80} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stub-date" className="text-xs">Pay date</Label>
            <Input id="stub-date" type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stub-period" className="text-xs">Pay period # (of {data.result.periodsPerYear})</Label>
            <Input
              id="stub-period"
              type="number"
              min="1"
              max={data.result.periodsPerYear}
              step="1"
              value={periodNumber}
              onChange={(e) => setPeriodNumber(e.target.value)}
            />
          </div>
        </div>

        <iframe
          ref={frameRef}
          title="Pay stub preview"
          srcDoc={html}
          className="w-full rounded-lg border border-border/60 bg-white"
          style={{ height: 'min(70vh, 900px)' }}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">YTD columns assume the same pay every period. Edit the period number to match your paycheck count.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={download}>
              <Download className="h-4 w-4 mr-1.5" /> Download HTML
            </Button>
            <Button type="button" size="sm" onClick={print} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Printer className="h-4 w-4 mr-1.5" /> Print / Save as PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

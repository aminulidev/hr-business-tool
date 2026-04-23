'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Copy, Check } from 'lucide-react';

export default function ResultActions() {
  const [copied, setCopied] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  // ---- Watch for .result-display appearing / disappearing via MutationObserver ----
  useEffect(() => {
    const checkResult = () => {
      const el = document.querySelector('.result-display');
      setHasResult(!!el);
    };

    checkResult();

    const observer = new MutationObserver(() => {
      checkResult();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  // ---- Print: open a new clean window with ONLY the result data ----
  const handlePrint = useCallback(() => {
    if (!hasResult) return;

    // 1. Grab the calculator title
    const titleEl = document.querySelector('h1');
    const calculatorTitle = titleEl ? titleEl.textContent?.trim() || 'Calculator' : 'Calculator';

    // 2. Grab the result section
    const resultEl = document.querySelector('.result-display');
    if (!resultEl) return;

    // 3. Clone the result element to strip Framer Motion inline styles
    const clone = resultEl.cloneNode(true) as HTMLElement;
    const cleanStyles = (el: Element) => {
      // Remove all inline style attributes set by Framer Motion
      el.removeAttribute('style');
      // Recursively clean children
      Array.from(el.children).forEach(cleanStyles);
    };
    cleanStyles(clone);

    // 4. Build a clean HTML document with only the result
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${calculatorTitle} - Result</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1a1a1a;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .print-header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e5e5e5;
    }
    .print-header h1 {
      font-size: 20px;
      font-weight: 700;
      color: #111;
      margin-bottom: 4px;
    }
    .print-header p {
      font-size: 12px;
      color: #888;
    }
    .result-container {
      border: 2px solid #333;
      border-radius: 12px;
      padding: 24px;
      background: #f9fafb;
    }
    /* Inherit structure from the result-display */
    .result-container > div > div {
      text-align: center;
      margin-bottom: 16px;
    }
    .result-container .text-center {
      text-align: center;
    }
    .result-container [class*="text-4xl"],
    .result-container [class*="text-3xl"] {
      font-size: 28px;
      font-weight: 700;
      color: #059669;
    }
    .result-container [class*="text-xl"] {
      font-size: 18px;
      font-weight: 600;
    }
    .result-container [class*="text-lg"] {
      font-size: 16px;
      font-weight: 600;
    }
    .result-container [class*="font-bold"] {
      font-weight: 700;
    }
    .result-container [class*="font-semibold"] {
      font-weight: 600;
    }
    .result-container [class*="text-sm"],
    .result-container [class*="text-xs"] {
      font-size: 13px;
      color: #555;
    }
    .result-container [class*="text-muted"] {
      color: #666;
    }
    .result-container [class*="text-emerald"] {
      color: #059669;
    }
    .result-container [class*="text-red"] {
      color: #dc2626;
    }
    .result-container [class*="text-amber"] {
      color: #d97706;
    }
    /* Grid layouts */
    .result-container [class*="grid"] {
      display: grid;
      gap: 12px;
      margin-bottom: 16px;
    }
    .result-container [class*="grid-cols-1"] {
      grid-template-columns: 1fr;
    }
    .result-container [class*="grid-cols-2"],
    .result-container [class*="grid-cols-2"] {
      grid-template-columns: 1fr 1fr;
    }
    .result-container [class*="grid-cols-3"] {
      grid-template-columns: 1fr 1fr 1fr;
    }
    @media print {
      .grid-cols-1 { grid-template-columns: 1fr; }
      .grid-cols-2 { grid-template-columns: 1fr 1fr; }
      .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    }
    /* Card-like containers */
    .result-container [class*="rounded-lg"],
    .result-container [class*="rounded-xl"] {
      border-radius: 8px;
      padding: 12px;
      border: 1px solid #e5e5e5;
      background: white;
    }
    .result-container [class*="bg-muted"] {
      background: #f5f5f5 !important;
    }
    .result-container [class*="bg-emerald"] {
      background: #ecfdf5 !important;
    }
    .result-container [class*="bg-red"] {
      background: #fef2f2 !important;
    }
    .result-container [class*="bg-amber"] {
      background: #fffbeb !important;
    }
    /* Badges */
    .result-container [class*="badge" i],
    .result-container [class*="Badge" i] {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid #d1d5db;
      background: white;
      color: #374151;
    }
    /* Table styles */
    .result-container table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .result-container thead th {
      text-align: left;
      padding: 8px 12px;
      font-weight: 600;
      color: #555;
      border-bottom: 2px solid #e5e5e5;
      background: #f9fafb;
    }
    .result-container thead th:not(:first-child) {
      text-align: right;
    }
    .result-container tbody td {
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
    }
    .result-container tbody td:not(:first-child) {
      text-align: right;
    }
    .result-container tbody tr:last-child {
      border-bottom: none;
    }
    /* Hide empty divs and motion wrappers */
    .result-container [class*="motion-"] {
      opacity: 1 !important;
      transform: none !important;
    }
    .print-footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #e5e5e5;
      font-size: 11px;
      color: #aaa;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .print-header { margin-bottom: 16px; }
    }
  </style>
</head>
<body>
  <div class="print-header">
    <h1>${calculatorTitle}</h1>
    <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
  </div>
  <div class="result-container">
    ${clone.innerHTML}
  </div>
  <div class="print-footer">
    CalcHub — Free Small Business & HR Calculators
  </div>
</body>
</html>`;

    // 5. Open print window and print
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      // Popup blocked — fallback to iframe approach
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 5000);
      }
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to render, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Auto-close after print dialog
        printWindow.onafterprint = () => printWindow.close();
        // Fallback close after 10 seconds
        setTimeout(() => {
          if (!printWindow.closed) printWindow.close();
        }, 10000);
      }, 300);
    };
  }, [hasResult]);

  const handleCopy = useCallback(async () => {
    if (!hasResult) return;

    try {
      const resultSection =
        document.querySelector('.result-display') ||
        document.querySelector('[class*="result-display"]');
      if (resultSection) {
        const text = resultSection.textContent || '';
        await navigator.clipboard.writeText(text.trim());
      } else {
        await navigator.clipboard.writeText(
          document.title + ' - ' + window.location.href
        );
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = document.title + ' - ' + window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [hasResult]);

  const buttonBase = 'gap-1.5 text-xs transition-all duration-150';

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        disabled={!hasResult}
        title={
          hasResult
            ? 'Print calculation result'
            : 'Calculate a result first to print'
        }
        className={`${buttonBase} ${
          hasResult
            ? 'text-muted-foreground hover:text-foreground'
            : 'text-muted-foreground/40 cursor-not-allowed opacity-50'
        }`}
      >
        <Printer className="h-3.5 w-3.5" />
        Print
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={!hasResult}
        title={
          hasResult
            ? 'Copy result to clipboard'
            : 'Calculate a result first to copy'
        }
        className={`${buttonBase} ${
          hasResult
            ? 'text-muted-foreground hover:text-foreground'
            : 'text-muted-foreground/40 cursor-not-allowed opacity-50'
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}

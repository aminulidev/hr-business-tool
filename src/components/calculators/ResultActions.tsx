'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Printer,
  Copy,
  Check,
  Code2,
  Link as LinkIcon,
  Download,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy-load EmbedModal — zero bundle cost until user clicks Embed
const EmbedModal = dynamic(() => import('./EmbedModal'), { ssr: false });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read all visible text/number inputs and selects from the calculator card */
function gatherInputs(): Record<string, string> {
  const inputs: Record<string, string> = {};
  const card = document.querySelector('.calculator-form') ?? document.body;

  card.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
    'input[type="text"], input[type="number"], input:not([type]), select'
  ).forEach((el, idx) => {
    const key = el.id || el.name || `v${idx}`;
    inputs[key] = el.value;
  });

  return inputs;
}

/** Inject URL params back into matching form inputs and fire input/change events */
function injectParams(params: URLSearchParams) {
  if (!params.toString()) return;

  const card = document.querySelector('.calculator-form') ?? document.body;
  const els = card.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
    'input[type="text"], input[type="number"], input:not([type]), select'
  );

  els.forEach((el, idx) => {
    const key = el.id || el.name || `v${idx}`;
    const val = params.get(key);
    if (val !== null) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        el.tagName === 'SELECT'
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Try to click the first Calculate / Submit button
  setTimeout(() => {
    const btn = document.querySelector<HTMLButtonElement>(
      'button[type="submit"], button[id*="calc"], button[id*="calculate"]'
    );
    btn?.click();
  }, 200);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ResultActions() {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedSlug, setEmbedSlug] = useState('');
  const [embedTitle, setEmbedTitle] = useState('');
  const injectedRef = useRef(false);

  // ---- Watch for .result-display appearing / disappearing via MutationObserver ----
  useEffect(() => {
    const checkResult = () => {
      const el = document.querySelector('.result-display');
      setHasResult(!!el);
    };

    checkResult();

    const observer = new MutationObserver(() => checkResult());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // ---- Read URL params once on mount and inject into form ----
  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    if (params.toString()) {
      // Wait for the calculator card to mount
      const tryInject = (attempts = 0) => {
        const hasInputs = document.querySelectorAll(
          '.calculator-form input, .calculator-form select'
        ).length > 0;

        if (hasInputs) {
          injectParams(params);
        } else if (attempts < 20) {
          setTimeout(() => tryInject(attempts + 1), 150);
        }
      };
      tryInject();
    }
  }, []);

  // ---- Derive slug from pathname ----
  const getSlugInfo = useCallback(() => {
    const parts = window.location.pathname.split('/');
    const calcIdx = parts.indexOf('calculators');
    const slug = calcIdx !== -1 && parts[calcIdx + 1] ? parts[calcIdx + 1] : '';
    const titleEl = document.querySelector('h1');
    const title = titleEl?.textContent?.trim() ?? 'Calculator';
    return { slug, title };
  }, []);

  // ---- Print ----
  const handlePrint = useCallback(() => {
    if (!hasResult) return;

    const titleEl = document.querySelector('h1');
    const calculatorTitle = titleEl ? titleEl.textContent?.trim() || 'Calculator' : 'Calculator';
    const safeName = calculatorTitle.toLowerCase().replace(/\s+/g, '-');
    const resultEl = document.querySelector('.result-display');
    if (!resultEl) return;

    const clone = resultEl.cloneNode(true) as HTMLElement;
    const cleanStyles = (el: Element) => {
      el.removeAttribute('style');
      Array.from(el.children).forEach(cleanStyles);
    };
    cleanStyles(clone);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${safeName}-report</title>
  <style>
    @page { size: A4 portrait; margin: 20mm 15mm; }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; line-height: 1.5; }
    
    .pdf-container { max-width: 800px; margin: 0 auto; padding-bottom: 50px; }
    
    /* Header */
    .pdf-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #059669; padding-bottom: 15px; margin-bottom: 25px; }
    .pdf-header-left { display: flex; align-items: center; gap: 12px; }
    .pdf-logo { width: 44px; height: 44px; display: block; }
    .pdf-brand { font-size: 24px; font-weight: 800; color: #059669; letter-spacing: -0.5px; margin-top: 2px; }
    .pdf-header-right { text-align: right; }
    .pdf-doc-title { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px; }
    .pdf-date { font-size: 12px; color: #9ca3af; margin-top: 4px; font-weight: 500; }

    /* Title Section */
    .pdf-title-section { margin-bottom: 30px; }
    .pdf-title-section h2 { font-size: 28px; font-weight: 800; color: #111827; margin-bottom: 8px; letter-spacing: -0.5px; }
    .pdf-title-section p { font-size: 14px; color: #4b5563; font-weight: 500; }

    /* Result Container */
    .result-container { border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px; background: #f9fafb; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .result-container .text-center { text-align: center; }
    .result-container [class*="text-4xl"], .result-container [class*="text-3xl"] { font-size: 32px; font-weight: 800; color: #059669; }
    .result-container [class*="text-xl"]  { font-size: 18px; font-weight: 700; color: #1f2937; }
    .result-container [class*="text-lg"]  { font-size: 16px; font-weight: 600; color: #374151; }
    .result-container [class*="font-bold"]     { font-weight: 700; }
    .result-container [class*="font-semibold"] { font-weight: 600; }
    .result-container [class*="text-sm"], .result-container [class*="text-xs"] { font-size: 13px; color: #6b7280; }
    .result-container [class*="text-muted"]   { color: #6b7280; }
    .result-container [class*="text-emerald"] { color: #059669; }
    .result-container [class*="text-red"]     { color: #dc2626; }
    .result-container [class*="text-amber"]   { color: #d97706; }
    .result-container [class*="grid"]        { display: grid; gap: 16px; margin-bottom: 20px; }
    .result-container [class*="grid-cols-2"] { grid-template-columns: 1fr 1fr; }
    .result-container [class*="grid-cols-3"] { grid-template-columns: 1fr 1fr 1fr; }
    .result-container [class*="rounded-lg"], .result-container [class*="rounded-xl"] { border-radius: 10px; padding: 16px; border: 1px solid #e5e7eb; background: white; }
    .result-container [class*="bg-muted"]   { background: #f3f4f6 !important; }
    .result-container [class*="bg-emerald"] { background: #ecfdf5 !important; }
    .result-container [class*="bg-red"]     { background: #fef2f2 !important; }
    .result-container table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 16px; }
    .result-container thead th { text-align: left; padding: 10px 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; background: #f9fafb; }
    .result-container thead th:not(:first-child) { text-align: right; }
    .result-container tbody td { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; }
    .result-container tbody td:not(:first-child) { text-align: right; }
    
    /* Footer */
    .pdf-footer-wrapper { position: fixed; bottom: 0; left: 0; width: 100%; background: white; z-index: 10; }
    .pdf-footer { max-width: 800px; margin: 0 auto; padding-top: 15px; padding-bottom: 10px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #9ca3af; }
    .pdf-footer-links { font-weight: 600; color: #059669; }
    
    @media print { 
      body { background: white; } 
      .result-container { box-shadow: none; border-color: #d1d5db; }
      .pdf-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .pdf-footer-wrapper { position: fixed; bottom: 0; left: 0; right: 0; }
    }
  </style>
</head>
<body>
  <div class="pdf-container">
    <!-- Header -->
    <div class="pdf-header">
      <div class="pdf-header-left">
        <img src="${window.location.origin}/logo.svg" alt="Logo" class="pdf-logo" onerror="this.style.display='none'" />
        <span class="pdf-brand">QuickBizCalc</span>
      </div>
      <div class="pdf-header-right">
        <div class="pdf-doc-title">Official Report</div>
        <div class="pdf-date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </div>

    <!-- Title -->
    <div class="pdf-title-section">
      <h2>${calculatorTitle}</h2>
      <p>Calculation generated on ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
    </div>

    <!-- Results -->
    <div class="result-container">${clone.innerHTML}</div>
  </div>

  <!-- Footer -->
  <div class="pdf-footer-wrapper">
    <div class="pdf-footer">
      <div>&copy; ${new Date().getFullYear()} QuickBizCalc. All rights reserved.</div>
      <div class="pdf-footer-links">www.quickbizcalc.com</div>
    </div>
  </div>

  <script>
    window.onload = function () { 
      setTimeout(function () { 
        window.print(); 
      }, 400); 
    };
    window.onafterprint = function() {
      window.close();
    };
  </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      document.body.appendChild(iframe);
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open(); iframeDoc.write(html); iframeDoc.close();
        iframe.contentWindow?.focus();
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 5000);
        }, 300);
      }
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }, [hasResult]);

  // ---- Copy result text ----
  const handleCopy = useCallback(async () => {
    if (!hasResult) return;

    try {
      const resultSection = document.querySelector('.result-display');
      if (resultSection) {
        await navigator.clipboard.writeText((resultSection.textContent || '').trim());
      } else {
        await navigator.clipboard.writeText(document.title + ' - ' + window.location.href);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = document.title + ' - ' + window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [hasResult]);

  // ---- Share: encode inputs into URL, copy to clipboard ----
  const handleShare = useCallback(async () => {
    const inputs = gatherInputs();
    const url = new URL(window.location.href);

    // Clear existing calc params
    url.search = '';

    // Encode all current input values
    Object.entries(inputs).forEach(([key, value]) => {
      if (value.trim()) url.searchParams.set(key, value);
    });

    const shareUrl = url.toString();

    // Update browser URL (non-navigating)
    window.history.replaceState({}, '', shareUrl);

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  }, []);

  // ---- PDF Export — opens a styled print preview; user selects "Save as PDF" ----
  const handlePDF = useCallback(() => {
    if (!hasResult || pdfLoading) return;
    setPdfLoading(true);

    try {
      const resultEl = document.querySelector<HTMLElement>('.result-display');
      if (!resultEl) { setPdfLoading(false); return; }

      const titleEl = document.querySelector('h1');
      const calculatorTitle = titleEl?.textContent?.trim() ?? 'Calculator';
      const safeName = calculatorTitle.toLowerCase().replace(/\s+/g, '-');

      const clone = resultEl.cloneNode(true) as HTMLElement;
      const cleanStyles = (el: Element) => {
        el.removeAttribute('style');
        Array.from(el.children).forEach(cleanStyles);
      };
      cleanStyles(clone);

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${safeName}-report</title>
  <style>
    @page { size: A4 portrait; margin: 20mm 15mm 25mm 15mm; }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; line-height: 1.5; }
    .pdf-container { max-width: 800px; margin: 0 auto; }
    .pdf-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #059669; padding-bottom: 15px; margin-bottom: 25px; }
    .pdf-header-left { display: flex; align-items: center; gap: 12px; }
    .pdf-logo { width: 44px; height: 44px; display: block; }
    .pdf-brand { font-size: 24px; font-weight: 800; color: #059669; letter-spacing: -0.5px; margin-top: 2px; }
    .pdf-header-right { text-align: right; }
    .pdf-doc-title { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px; }
    .pdf-date { font-size: 12px; color: #9ca3af; margin-top: 4px; font-weight: 500; }
    .pdf-title-section { margin-bottom: 30px; }
    .pdf-title-section h2 { font-size: 28px; font-weight: 800; color: #111827; margin-bottom: 8px; letter-spacing: -0.5px; }
    .pdf-title-section p { font-size: 14px; color: #4b5563; font-weight: 500; }
    .result-container { border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px; background: #f9fafb; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .result-container .text-center { text-align: center; }
    .result-container [class*="text-4xl"], .result-container [class*="text-3xl"] { font-size: 32px; font-weight: 800; color: #059669; }
    .result-container [class*="text-xl"]  { font-size: 18px; font-weight: 700; color: #1f2937; }
    .result-container [class*="text-lg"]  { font-size: 16px; font-weight: 600; color: #374151; }
    .result-container [class*="font-bold"]     { font-weight: 700; }
    .result-container [class*="font-semibold"] { font-weight: 600; }
    .result-container [class*="text-sm"], .result-container [class*="text-xs"] { font-size: 13px; color: #6b7280; }
    .result-container [class*="text-muted"]   { color: #6b7280; }
    .result-container [class*="text-emerald"] { color: #059669; }
    .result-container [class*="text-red"]     { color: #dc2626; }
    .result-container [class*="text-amber"]   { color: #d97706; }
    .result-container [class*="grid"]        { display: grid; gap: 16px; margin-bottom: 20px; }
    .result-container [class*="grid-cols-2"] { grid-template-columns: 1fr 1fr; }
    .result-container [class*="grid-cols-3"] { grid-template-columns: 1fr 1fr 1fr; }
    .result-container [class*="rounded-lg"], .result-container [class*="rounded-xl"] { border-radius: 10px; padding: 16px; border: 1px solid #e5e7eb; background: white; }
    .result-container [class*="bg-muted"]   { background: #f3f4f6 !important; }
    .result-container [class*="bg-emerald"] { background: #ecfdf5 !important; }
    .result-container [class*="bg-red"]     { background: #fef2f2 !important; }
    .result-container table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 16px; }
    .result-container thead th { text-align: left; padding: 10px 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; background: #f9fafb; }
    .result-container thead th:not(:first-child) { text-align: right; }
    .result-container tbody td { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; }
    .result-container tbody td:not(:first-child) { text-align: right; }
    .pdf-footer-wrapper { position: fixed; bottom: 0; left: 0; width: 100%; background: white; }
    .pdf-footer { max-width: 800px; margin: 0 auto; padding-top: 12px; padding-bottom: 8px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #9ca3af; }
    .pdf-footer-links { font-weight: 600; color: #059669; }
    @media print {
      body { background: white; }
      .result-container { box-shadow: none; border-color: #d1d5db; }
      .pdf-footer-wrapper { position: fixed; bottom: 0; left: 0; right: 0; }
    }
  </style>
</head>
<body>
  <div class="pdf-container">
    <div class="pdf-header">
      <div class="pdf-header-left">
        <img src="${window.location.origin}/logo.svg" alt="Logo" class="pdf-logo" onerror="this.style.display='none'" />
        <span class="pdf-brand">QuickBizCalc</span>
      </div>
      <div class="pdf-header-right">
        <div class="pdf-doc-title">Official Report</div>
        <div class="pdf-date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </div>
    <div class="pdf-title-section">
      <h2>${calculatorTitle}</h2>
      <p>Calculation generated on ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
    </div>
    <div class="result-container">${clone.innerHTML}</div>
  </div>
  <div class="pdf-footer-wrapper">
    <div class="pdf-footer">
      <div>&copy; ${new Date().getFullYear()} QuickBizCalc. All rights reserved.</div>
      <div class="pdf-footer-links">www.quickbizcalc.com</div>
    </div>
  </div>
  <script>
    window.onload = function () { setTimeout(function () { window.print(); }, 400); };
    window.onafterprint = function () { window.close(); };
  </script>
</body>
</html>`;

      const pdfWindow = window.open('', '_blank', 'width=820,height=720');
      if (pdfWindow) {
        pdfWindow.document.open();
        pdfWindow.document.write(html);
        pdfWindow.document.close();
      } else {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
        document.body.appendChild(iframe);
        const iDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iDoc) {
          iDoc.open(); iDoc.write(html); iDoc.close();
          iframe.contentWindow?.focus();
          setTimeout(() => {
            iframe.contentWindow?.print();
            setTimeout(() => document.body.removeChild(iframe), 6000);
          }, 400);
        }
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setPdfLoading(false);
    }
  }, [hasResult, pdfLoading]);

  // ---- Embed ----
  const handleEmbed = useCallback(() => {
    const { slug, title } = getSlugInfo();
    setEmbedSlug(slug);
    setEmbedTitle(title);
    setShowEmbed(true);
  }, [getSlugInfo]);

  const buttonBase = 'gap-1.5 text-xs transition-all duration-150';
  const activeBtn = 'text-muted-foreground hover:text-foreground';
  const disabledBtn = 'text-muted-foreground/40 cursor-not-allowed opacity-50';

  return (
    <>
      <div className="flex items-center gap-1.5 print:hidden flex-wrap">
        {/* Share */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          title="Copy shareable link with current inputs pre-filled"
          className={`${buttonBase} ${activeBtn}`}
        >
          {linkCopied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              Link Copied!
            </>
          ) : (
            <>
              <LinkIcon className="h-3.5 w-3.5" />
              Share
            </>
          )}
        </Button>

        {/* Print */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          disabled={!hasResult}
          title={hasResult ? 'Print calculation result' : 'Calculate a result first to print'}
          className={`${buttonBase} ${hasResult ? activeBtn : disabledBtn}`}
        >
          <Printer className="h-3.5 w-3.5" />
          Print
        </Button>

        {/* Copy result */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!hasResult}
          title={hasResult ? 'Copy result to clipboard' : 'Calculate a result first to copy'}
          className={`${buttonBase} ${hasResult ? activeBtn : disabledBtn}`}
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

        {/* Download PDF */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePDF}
          disabled={!hasResult || pdfLoading}
          title={hasResult ? 'Download PDF of results' : 'Calculate a result first to export PDF'}
          className={`${buttonBase} ${hasResult ? activeBtn : disabledBtn}`}
        >
          {pdfLoading ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Exporting…
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              PDF
            </>
          )}
        </Button>

        {/* Embed */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmbed}
          title="Get embed code for your website"
          className={`${buttonBase} ${activeBtn}`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Embed
        </Button>
      </div>

      {/* Embed Modal */}
      {showEmbed && (
        <EmbedModal
          slug={embedSlug}
          title={embedTitle}
          onClose={() => setShowEmbed(false)}
        />
      )}
    </>
  );
}

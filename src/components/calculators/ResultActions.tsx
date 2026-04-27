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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${calculatorTitle} - Result</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; padding: 24px; max-width: 800px; margin: 0 auto; }
    .print-header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e5e5e5; }
    .print-header h1 { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 4px; }
    .print-header p { font-size: 12px; color: #888; }
    .result-container { border: 2px solid #333; border-radius: 12px; padding: 24px; background: #f9fafb; }
    .result-container > div > div { text-align: center; margin-bottom: 16px; }
    .result-container .text-center { text-align: center; }
    .result-container [class*="text-4xl"], .result-container [class*="text-3xl"] { font-size: 28px; font-weight: 700; color: #059669; }
    .result-container [class*="text-xl"] { font-size: 18px; font-weight: 600; }
    .result-container [class*="text-lg"] { font-size: 16px; font-weight: 600; }
    .result-container [class*="font-bold"] { font-weight: 700; }
    .result-container [class*="font-semibold"] { font-weight: 600; }
    .result-container [class*="text-sm"], .result-container [class*="text-xs"] { font-size: 13px; color: #555; }
    .result-container [class*="text-muted"] { color: #666; }
    .result-container [class*="text-emerald"] { color: #059669; }
    .result-container [class*="text-red"] { color: #dc2626; }
    .result-container [class*="text-amber"] { color: #d97706; }
    .result-container [class*="grid"] { display: grid; gap: 12px; margin-bottom: 16px; }
    .result-container [class*="grid-cols-2"] { grid-template-columns: 1fr 1fr; }
    .result-container [class*="grid-cols-3"] { grid-template-columns: 1fr 1fr 1fr; }
    .result-container [class*="rounded-lg"], .result-container [class*="rounded-xl"] { border-radius: 8px; padding: 12px; border: 1px solid #e5e5e5; background: white; }
    .result-container table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .result-container thead th { text-align: left; padding: 8px 12px; font-weight: 600; color: #555; border-bottom: 2px solid #e5e5e5; }
    .result-container thead th:not(:first-child) { text-align: right; }
    .result-container tbody td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; }
    .result-container tbody td:not(:first-child) { text-align: right; }
    .print-footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e5e5; font-size: 11px; color: #aaa; text-align: center; }
    @media print { body { padding: 0; } }
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
  <div class="print-footer">QuickBizCalc — Free Small Business &amp; HR Calculators</div>
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
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 5000);
      }
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
        setTimeout(() => { if (!printWindow.closed) printWindow.close(); }, 10000);
      }, 300);
    };
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

  // ---- PDF Export (print-window → Save as PDF) ----
  // Uses the same clean-HTML approach as Print to avoid html2canvas
  // incompatibility with Tailwind v4 lab()/oklch() CSS color functions.
  const handlePDF = useCallback(() => {
    if (!hasResult || pdfLoading) return;
    setPdfLoading(true);

    try {
      const resultEl = document.querySelector<HTMLElement>('.result-display');
      if (!resultEl) { setPdfLoading(false); return; }

      const titleEl = document.querySelector('h1');
      const calculatorTitle = titleEl?.textContent?.trim() ?? 'Calculator';
      const safeName = calculatorTitle.toLowerCase().replace(/\s+/g, '-');

      // Clone + strip Framer Motion inline styles
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
  <title>${safeName}-result</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 14mm; }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .pdf-header { display: flex; justify-content: space-between; align-items: center; background: #059669; color: white; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; }
    .pdf-header-brand { font-size: 15px; font-weight: 700; }
    .pdf-header-url   { font-size: 10px; opacity: 0.85; }
    .pdf-title h2 { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 3px; }
    .pdf-title p  { font-size: 11px; color: #888; }
    .result-container { border: 1px solid #e5e5e5; border-radius: 10px; padding: 20px; background: #f9fafb; margin-top: 14px; }
    .result-container .text-center { text-align: center; }
    .result-container [class*="text-4xl"], .result-container [class*="text-3xl"] { font-size: 26px; font-weight: 700; color: #059669; }
    .result-container [class*="text-xl"]  { font-size: 17px; font-weight: 600; }
    .result-container [class*="text-lg"]  { font-size: 15px; font-weight: 600; }
    .result-container [class*="font-bold"]     { font-weight: 700; }
    .result-container [class*="font-semibold"] { font-weight: 600; }
    .result-container [class*="text-sm"], .result-container [class*="text-xs"] { font-size: 12px; color: #555; }
    .result-container [class*="text-muted"]   { color: #666; }
    .result-container [class*="text-emerald"] { color: #059669; }
    .result-container [class*="text-red"]     { color: #dc2626; }
    .result-container [class*="text-amber"]   { color: #d97706; }
    .result-container [class*="grid"]        { display: grid; gap: 10px; margin-bottom: 14px; }
    .result-container [class*="grid-cols-2"] { grid-template-columns: 1fr 1fr; }
    .result-container [class*="grid-cols-3"] { grid-template-columns: 1fr 1fr 1fr; }
    .result-container [class*="rounded-lg"], .result-container [class*="rounded-xl"] { border-radius: 8px; padding: 10px; border: 1px solid #e5e5e5; background: white; }
    .result-container [class*="bg-muted"]   { background: #f5f5f5 !important; }
    .result-container [class*="bg-emerald"] { background: #ecfdf5 !important; }
    .result-container [class*="bg-red"]     { background: #fef2f2 !important; }
    .result-container table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .result-container thead th { text-align: left; padding: 7px 10px; font-weight: 600; color: #555; border-bottom: 2px solid #e5e5e5; }
    .result-container thead th:not(:first-child) { text-align: right; }
    .result-container tbody td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; }
    .result-container tbody td:not(:first-child) { text-align: right; }
    .pdf-footer { margin-top: 14px; padding-top: 10px; border-top: 1px solid #e5e5e5; font-size: 10px; color: #aaa; text-align: center; }
    @media print { body { background: white; } .pdf-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="pdf-header">
    <span class="pdf-header-brand">QuickBizCalc</span>
    <span class="pdf-header-url">quickbizcalc.com</span>
  </div>
  <div class="pdf-title">
    <h2>${calculatorTitle}</h2>
    <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} &nbsp;&middot;&nbsp; ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
  </div>
  <div class="result-container">${clone.innerHTML}</div>
  <div class="pdf-footer">Generated by QuickBizCalc &mdash; Free Business &amp; HR Calculators &nbsp;|&nbsp; quickbizcalc.com</div>
  <script>
    window.onload = function () { setTimeout(function () { window.print(); }, 350); };
  <\/script>
</body>
</html>`;

      const pdfWindow = window.open('', '_blank', 'width=820,height=720');
      if (pdfWindow) {
        pdfWindow.document.open();
        pdfWindow.document.write(html);
        pdfWindow.document.close();
      } else {
        // Popup blocked — iframe fallback
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open(); doc.write(html); doc.close();
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 6000);
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

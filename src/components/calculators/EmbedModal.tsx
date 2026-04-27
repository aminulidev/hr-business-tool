'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Copy, Check, X, ExternalLink, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmbedModalProps {
  slug: string;
  title: string;
  onClose: () => void;
}

const EMBED_WIDTH = 900;
const EMBED_HEIGHT = 700;

export default function EmbedModal({ slug, title, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState(String(EMBED_WIDTH));
  const [height, setHeight] = useState(String(EMBED_HEIGHT));

  const embedUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/calculators/${slug}/embed`
      : `https://calchub.com/calculators/${slug}/embed`;

  const iframeCode = `<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  style="border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.10)"
  title="${title}"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = iframeCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [iframeCode]);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="embed-backdrop"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          key="embed-modal"
          className="relative w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                <Code2 className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Embed This Calculator</h2>
                <p className="text-xs text-muted-foreground">Copy the code and paste it on your website</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted"
              aria-label="Close embed modal"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body — scrollable */}
          <div className="p-5 space-y-5 overflow-y-auto flex-1">
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Monitor className="size-3" /> Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  min={300}
                  max={1400}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Monitor className="size-3" /> Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  min={400}
                  max={1200}
                />
              </div>
            </div>

            {/* Code block */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Embed Code</p>
              <div className="relative">
                <pre className="text-xs font-mono bg-muted/60 border border-border rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed text-foreground/80">
                  {iframeCode}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="absolute top-2.5 right-2.5 gap-1.5 text-xs h-7 px-2.5 bg-background hover:bg-muted"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Free to embed.</strong> This calculator will remain free and ad-supported on your site. A small &quot;Powered by CalcHub&quot; attribution appears at the bottom.
            </div>

            {/* Preview link */}
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
            >
              <ExternalLink className="size-3" />
              Preview embed page
            </a>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

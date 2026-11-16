// ---------------------------------------------------------------------------
// Embed snippet (Phase 18). The code a visitor copies is an iframe plus a
// visible credit line outside the iframe, so the credit is ordinary HTML on
// the host page rather than something hidden inside our frame.
//
// The credit link is branded ("QuickBizCalc"), not keyword anchor text, and
// carries rel="nofollow": Google's link-spam policy treats followed links
// that ship inside a distributed widget as unnatural, and this site is
// recovering from a spam update. It still earns referral visits and brand
// recognition. To change the policy, edit EMBED_LINK_REL only.
// ---------------------------------------------------------------------------
import { SITE_URL } from '@/lib/registry/site';

export const EMBED_LINK_REL = 'nofollow noopener';
export const EMBED_REF = 'ref=embed';
export const EMBED_DEFAULT_WIDTH = 900;
export const EMBED_DEFAULT_HEIGHT = 700;

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clamp = (n: number, lo: number, hi: number, fallback: number) => (Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : fallback);

/** Page a credit link points at: the canonical calculator URL tagged so embed referrals can be counted */
export const embedCreditUrl = (slug: string) => `${SITE_URL}/calculators/${slug}?${EMBED_REF}`;
export const embedFrameUrl = (slug: string) => `${SITE_URL}/calculators/${slug}/embed`;

export interface EmbedCodeInput {
  slug: string;
  title: string;
  width?: number;
  height?: number;
}

export function buildEmbedCode({ slug, title, width, height }: EmbedCodeInput): string {
  const w = clamp(width ?? EMBED_DEFAULT_WIDTH, 300, 1400, EMBED_DEFAULT_WIDTH);
  const h = clamp(height ?? EMBED_DEFAULT_HEIGHT, 400, 1600, EMBED_DEFAULT_HEIGHT);
  const safeTitle = attr(title);
  return `<iframe
  src="${embedFrameUrl(slug)}"
  width="${w}"
  height="${h}"
  style="border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.10);max-width:100%"
  title="${safeTitle}"
  loading="lazy"
  allow="clipboard-write"
></iframe>
<p style="font:13px/1.5 system-ui,sans-serif;margin:8px 0 0;text-align:center">
  ${safeTitle} by <a href="${embedCreditUrl(slug)}" target="_blank" rel="${EMBED_LINK_REL}">QuickBizCalc</a>
</p>`;
}

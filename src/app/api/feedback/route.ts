import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getCalculatorBySlug, isCalculatorPublished, SITE_URL } from '@/lib/calculator-meta';
import { feedbackSubject, parseFeedback, shouldNotifyOwner } from '@/lib/server/feedback';
import { emailOwner, emailShell, escapeHtml, escapeMultiline } from '@/lib/server/mailer';

/**
 * Calculator feedback (Phase 18). Files cannot be written in production, so comments and thumbs-down
 * votes are emailed to the owner, where they can actually be read. A bare thumbs-up is only logged.
 * Local development also appends to data/calculator-feedback.jsonl.
 */

const LOCAL_FILE = path.join(process.cwd(), 'data', 'calculator-feedback.jsonl');
const isHosted = Boolean(process.env.VERCEL);

const isKnownSlug = (slug: string) => {
  const calc = getCalculatorBySlug(slug);
  return Boolean(calc && isCalculatorPublished(calc));
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const parsed = parseFeedback(body, isKnownSlug);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const record = parsed.record;

  try {
    if (!isHosted) {
      try {
        await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
        await fs.appendFile(LOCAL_FILE, JSON.stringify(record) + '\n', 'utf8');
      } catch (ioErr) {
        console.warn('[feedback] local file write failed:', ioErr);
      }
    }
    if (shouldNotifyOwner(record)) {
      const url = `${SITE_URL}/calculators/${record.slug}`;
      await emailOwner({
        subject: feedbackSubject(record),
        html: emailShell(
          'Calculator feedback',
          `<p><strong>Page:</strong> <a href="${url}">${escapeHtml(record.slug)}</a></p><p><strong>Vote:</strong> ${record.helpful === true ? 'Helpful' : record.helpful === false ? 'Not helpful' : 'No vote'}</p>${record.message ? `<p><strong>Comment:</strong></p><div style="background:#f8fafc;padding:15px;border-radius:4px;border-left:4px solid #cbd5e1">${escapeMultiline(record.message)}</div>` : '<p>No comment was left.</p>'}<p style="color:#64748b;font-size:12px">${escapeHtml(record.ts)}</p>`,
        ),
      });
    }
    console.log('[feedback]', { slug: record.slug, helpful: record.helpful, hasMessage: Boolean(record.message) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[feedback] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'feedback' });
}

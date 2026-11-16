import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { SITE_NAME, SITE_URL } from '@/lib/registry/site';
import { canMailSubscribers, emailOwner, emailShell, escapeHtml, getResend, senderAddress } from '@/lib/server/mailer';
import { parseSubscription, subscribe, type StoreResult, type SubscribeDeps } from '@/lib/server/newsletter';

/**
 * Newsletter sign-up (Phase 18). Production runs on Vercel, where files cannot be written, so a
 * subscriber is saved as a Resend contact (and added to RESEND_SEGMENT_ID when set). If that fails
 * the owner is emailed the address; only local development falls back to data/*.jsonl. The response
 * says "subscribed" only when the address was really stored.
 */

const LOCAL_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.jsonl');
const isHosted = Boolean(process.env.VERCEL);

async function appendLocal(entry: { email: string; source: string; ts: string }): Promise<StoreResult> {
  let existing = '';
  try {
    existing = await fs.readFile(LOCAL_FILE, 'utf8');
  } catch {}
  if (existing.split('\n').some((line) => line.includes(`"email":"${entry.email}"`))) return 'exists';
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.appendFile(LOCAL_FILE, JSON.stringify(entry) + '\n', 'utf8');
  return 'added';
}

async function buildDeps(): Promise<SubscribeDeps> {
  const resend = await getResend();
  const deps: SubscribeDeps = {};
  if (resend) {
    const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID;
    deps.addToAudience = async (email) => {
      const { error } = await resend.contacts.create({ email, unsubscribed: false, ...(segmentId ? { segments: [{ id: segmentId }] } : {}) });
      if (!error) return 'added';
      if (/already|exist|duplicate/i.test(error.message)) return 'exists';
      throw new Error(error.message);
    };
    deps.notifyOwner = (email, source) =>
      emailOwner({
        subject: '[Newsletter] New subscriber (not saved to the list)',
        html: emailShell('Newsletter sign-up', `<p>The mailing list could not be updated, so add this address by hand:</p><p><strong>${escapeHtml(email)}</strong></p><p>Signed up on: ${escapeHtml(source)}</p>`),
      });
    if (canMailSubscribers()) {
      deps.sendWelcome = async (email) => {
        const { error } = await resend.emails.send({
          from: senderAddress(),
          to: email,
          subject: `You are subscribed to ${SITE_NAME} payroll updates`,
          html: emailShell(
            'You are on the list',
            `<p>Thanks for subscribing. We email when US payroll rules, rates or deadlines change and when we publish a calculator worth knowing about: at most once a month.</p><p>You can browse the calculators at <a href="${SITE_URL}">${escapeHtml(SITE_URL.replace('https://', ''))}</a>.</p><p style="color:#64748b;font-size:12px">If you did not sign up, ignore this email and reply to let us know; we will remove the address.</p>`,
          ),
        });
        if (error) throw new Error(error.message);
      };
    }
  }
  // A file is only a real store on a developer's machine.
  if (!isHosted) deps.appendLocal = appendLocal;
  return deps;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
  }
  const parsed = parseSubscription(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  // Bots that fill the hidden field get the same answer as a person, and nothing is stored.
  if (parsed.bot) return NextResponse.json({ success: true, message: 'Successfully subscribed', confirmationSent: false });

  try {
    const outcome = await subscribe(parsed.email, parsed.source, await buildDeps());
    if (!outcome.stored) {
      console.error('[newsletter] sign-up could not be stored anywhere');
      return NextResponse.json({ error: 'Sign-ups are unavailable right now. Please try again later.' }, { status: 503 });
    }
    return NextResponse.json({
      success: true,
      message: outcome.alreadySubscribed ? 'You are already subscribed!' : 'Successfully subscribed',
      alreadySubscribed: outcome.alreadySubscribed,
      confirmationSent: outcome.stored === 'audience' && !outcome.alreadySubscribed && canMailSubscribers(),
    });
  } catch (err) {
    console.error('[newsletter] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'newsletter' });
}

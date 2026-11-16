import { NextResponse } from 'next/server';
import { emailOwner, emailShell, escapeHtml, escapeMultiline, getResend } from '@/lib/server/mailer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const name = str(body?.name, 120);
  const email = str(body?.email, 254);
  const subject = str(body?.subject, 200).replace(/[\r\n]+/g, ' ');
  const message = str(body?.message, 5000);
  if (!name || !email || !subject || !message) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  if (!EMAIL_REGEX.test(email)) return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });

  try {
    if (!(await getResend())) {
      // Local development without a key: there is nowhere to send it.
      console.warn('[contact] RESEND_API_KEY not set — submission logged:', { name, subject });
      return NextResponse.json({ success: true, message: 'Submission received.' });
    }
    // Everything the visitor typed is escaped before it goes into the HTML email.
    const sent = await emailOwner({
      subject: `[Contact Form] ${subject}`,
      replyTo: email,
      html: emailShell(
        'New Contact Submission',
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p><strong>Message:</strong></p><div style="background:#f8fafc;padding:15px;border-radius:4px;border-left:4px solid #cbd5e1">${escapeMultiline(message)}</div>`,
      ),
    });
    if (!sent) return NextResponse.json({ error: 'Your message could not be sent. Please try again later.' }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

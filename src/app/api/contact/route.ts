import { NextResponse } from 'next/server';
import { CONTACT_EMAIL } from '@/lib/calculator-meta';

// ------------------------------------------------------------------
// Lazy-import Resend only when an API key is configured.
// This avoids a hard crash during `next build` when the env var is
// missing (the Resend SDK throws on instantiation without a key).
// ------------------------------------------------------------------
let resendInstance: any = null;
async function getResend() {
  if (resendInstance) return resendInstance;
  if (!process.env.RESEND_API_KEY) return null;
  const { Resend } = await import('resend');
  resendInstance = new Resend(process.env.RESEND_API_KEY);
  return resendInstance;
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resend = await getResend();

    // No API key configured — accept the submission gracefully
    // (log to server, return success so users are not blocked)
    if (!resend) {
      console.warn(
        '[contact] RESEND_API_KEY not set — submission logged but not emailed:',
        { name, email, subject, message }
      );
      return NextResponse.json({
        success: true,
        message: 'Submission received. RESEND_API_KEY not configured.',
      });
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'QuickBizCalc <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      subject: `[Contact Form] ${subject}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">New Contact Submission</h2>
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; border-left: 4px solid #cbd5e1;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            Submitted via QuickBizCalc Contact Form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

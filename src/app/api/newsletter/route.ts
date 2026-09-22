import { NextResponse } from 'next/server';

// ------------------------------------------------------------------
// POST /api/newsletter
// Receives newsletter signup. No DB required — logs to server console.
// Swap to Resend / ConvertKit / Mailchimp when ready to actually send.
// ------------------------------------------------------------------

interface NewsletterPayload {
  email: string;
  source?: string;
}

// Simple in-memory store (cleared on server restart — fine for v0)
// For production, replace with: Resend audience, ConvertKit, Mailchimp, or DB
const subscribers: { email: string; source?: string; ts: string }[] = [];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as NewsletterPayload;

    if (!body || typeof body.email !== 'string' || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (body.email.length > 254) {
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      );
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = body.email.toLowerCase().trim();

    // Dedup check
    const existing = subscribers.find((s) => s.email === normalizedEmail);
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
        alreadySubscribed: true,
      });
    }

    const entry = {
      email: normalizedEmail,
      source: body.source?.slice(0, 200) || 'unknown',
      ts: new Date().toISOString(),
    };

    subscribers.push(entry);
    console.log('[newsletter] new subscriber:', entry);

    // TODO: When ready to actually send emails, integrate here:
    // - Resend: const { Resend } = await import('resend'); const r = new Resend(process.env.RESEND_API_KEY);
    //   await r.contacts.create({ email: normalizedEmail, audienceId: '...' });
    // - ConvertKit: await fetch('https://api.convertkit.com/v3/forms/{form_id}/subscribe', {...})
    // - Mailchimp: similar API call

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
      subscribersCount: subscribers.length,
    });
  } catch (err) {
    console.error('[newsletter] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'newsletter',
    subscriberCount: subscribers.length,
  });
}

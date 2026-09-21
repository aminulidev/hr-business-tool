import { NextResponse } from 'next/server';

// ------------------------------------------------------------------
// POST /api/feedback
// Receives feedback entries from the FeedbackWidget on every calculator.
// No DB required — logs to server console and returns success.
// Swap to a real persistence layer (Supabase, Airtable, Postgres)
// when you are ready to aggregate the data.
// ------------------------------------------------------------------

interface FeedbackPayload {
  slug: string;
  helpful: boolean | null;
  message?: string;
  ts: number;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FeedbackPayload;

    // Light validation — ignore obviously malformed payloads.
    if (!body || typeof body.slug !== 'string' || body.slug.length > 200) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }
    if (body.message && body.message.length > 5000) {
      return NextResponse.json(
        { error: 'Message too long' },
        { status: 400 }
      );
    }

    // Server-side log so it shows up in production logs (Vercel / Caddy).
    console.log('[feedback]', {
      slug: body.slug,
      helpful: body.helpful,
      message: body.message ? body.message.slice(0, 200) : undefined,
      ts: new Date(body.ts || Date.now()).toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[feedback] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET for health check
export async function GET() {
  return NextResponse.json({ ok: true, service: 'feedback' });
}

import { NextResponse } from 'next/server';

interface FeedbackPayload { slug: string; helpful: boolean | null; message?: string; ts: number; }

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FeedbackPayload;
    if (!body || typeof body.slug !== 'string' || body.slug.length > 200) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    if (body.message && body.message.length > 5000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }
    console.log('[feedback]', { slug: body.slug, helpful: body.helpful, message: body.message ? body.message.slice(0, 200) : undefined, ts: new Date(body.ts || Date.now()).toISOString() });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[feedback] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'feedback' });
}

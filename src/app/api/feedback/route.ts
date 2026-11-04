import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface FeedbackPayload {
  slug: string;
  helpful: boolean | null;
  message?: string;
  ts: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'calculator-feedback.jsonl');

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FeedbackPayload;
    if (!body || typeof body.slug !== 'string' || body.slug.length > 200) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    if (body.message && body.message.length > 5000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    const record = {
      slug: body.slug,
      helpful: body.helpful,
      message: body.message ? body.message.slice(0, 1000) : undefined,
      ts: new Date(body.ts || Date.now()).toISOString(),
    };

    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.appendFile(FEEDBACK_FILE, JSON.stringify(record) + '\n', 'utf8');
    } catch (ioErr) {
      console.warn('[feedback] file write warning:', ioErr);
    }

    console.log('[feedback]', record);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[feedback] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'feedback' });
}

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface NewsletterPayload {
  email: string;
  source?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'newsletter-subscribers.jsonl');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readSubscribers(): Promise<{ email: string; source?: string; ts: string }[]> {
  try {
    const content = await fs.readFile(SUBSCRIBERS_FILE, 'utf8');
    return content
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

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

    const normalizedEmail = body.email.toLowerCase().trim();
    const subscribers = await readSubscribers();

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

    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.appendFile(SUBSCRIBERS_FILE, JSON.stringify(entry) + '\n', 'utf8');
    } catch (ioErr) {
      console.warn('[newsletter] file write warning:', ioErr);
    }

    console.log('[newsletter] new subscriber:', entry);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
      subscribersCount: subscribers.length + 1,
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
  const subscribers = await readSubscribers();
  return NextResponse.json({
    ok: true,
    service: 'newsletter',
    subscriberCount: subscribers.length,
  });
}

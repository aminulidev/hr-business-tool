// ---------------------------------------------------------------------------
// Calculator feedback logic (Phase 18). Production cannot write files, so a
// vote that carries information the owner should read (a written comment, or
// a thumbs-down) is emailed; a bare thumbs-up is only logged.
// ---------------------------------------------------------------------------

export interface FeedbackRecord {
  slug: string;
  helpful: boolean | null;
  message?: string;
  ts: string;
}

export type ParsedFeedback = { ok: true; record: FeedbackRecord } | { ok: false; status: number; error: string };

const MAX_MESSAGE = 1000;

export function parseFeedback(body: unknown, isKnownSlug: (slug: string) => boolean, now: () => Date = () => new Date()): ParsedFeedback {
  if (!body || typeof body !== 'object') return { ok: false, status: 400, error: 'Invalid payload' };
  const b = body as Record<string, unknown>;
  if (typeof b.slug !== 'string' || !isKnownSlug(b.slug)) return { ok: false, status: 400, error: 'Unknown calculator' };
  if (b.helpful !== true && b.helpful !== false && b.helpful !== null && b.helpful !== undefined) return { ok: false, status: 400, error: 'Invalid payload' };
  if (b.message !== undefined && typeof b.message !== 'string') return { ok: false, status: 400, error: 'Invalid payload' };
  if (typeof b.message === 'string' && b.message.length > 5000) return { ok: false, status: 400, error: 'Message too long' };
  const message = typeof b.message === 'string' ? b.message.trim().slice(0, MAX_MESSAGE) : '';
  return { ok: true, record: { slug: b.slug, helpful: b.helpful ?? null, message: message || undefined, ts: now().toISOString() } };
}

/** Only feedback the owner can act on is worth an email */
export const shouldNotifyOwner = (r: FeedbackRecord) => Boolean(r.message) || r.helpful === false;

export const feedbackSubject = (r: FeedbackRecord) => `[Feedback] ${r.helpful === true ? 'Helpful' : r.helpful === false ? 'Not helpful' : 'Comment'}: ${r.slug}`;

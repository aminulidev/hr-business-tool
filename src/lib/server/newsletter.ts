// ---------------------------------------------------------------------------
// Newsletter sign-up logic (Phase 18), separated from the route so it can be
// tested without a network. A sign-up is only reported as successful when it
// was actually stored somewhere durable.
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ParsedSubscription =
  | { ok: true; email: string; source: string; bot: false }
  | { ok: true; bot: true }
  | { ok: false; status: number; error: string };

/** Validate the request body. `website` is a honeypot field no person fills in. */
export function parseSubscription(body: unknown): ParsedSubscription {
  if (!body || typeof body !== 'object') return { ok: false, status: 400, error: 'Please provide a valid email address' };
  const b = body as Record<string, unknown>;
  if (typeof b.website === 'string' && b.website.trim() !== '') return { ok: true, bot: true };
  if (typeof b.email !== 'string') return { ok: false, status: 400, error: 'Please provide a valid email address' };
  const email = b.email.trim().toLowerCase();
  if (email.length > 254) return { ok: false, status: 400, error: 'Email address is too long' };
  if (!EMAIL_REGEX.test(email)) return { ok: false, status: 400, error: 'Please provide a valid email address' };
  const source = typeof b.source === 'string' && b.source.startsWith('/') ? b.source.slice(0, 200) : 'unknown';
  return { ok: true, email, source, bot: false };
}

export type StoreResult = 'added' | 'exists';

export interface SubscribeDeps {
  /** Add the contact to the mailing list. Absent when no audience is configured. */
  addToAudience?: (email: string) => Promise<StoreResult>;
  /** Tell the owner about the sign-up. Returns false when nothing was sent. */
  notifyOwner?: (email: string, source: string) => Promise<boolean>;
  /** Local development fallback: append to a file. */
  appendLocal?: (entry: { email: string; source: string; ts: string }) => Promise<StoreResult>;
  /** Optional welcome email; failures are ignored. */
  sendWelcome?: (email: string) => Promise<void>;
  now?: () => Date;
}

export interface SubscribeOutcome {
  /** Where the address ended up, or null when it could not be stored anywhere */
  stored: 'audience' | 'owner-email' | 'local' | null;
  alreadySubscribed: boolean;
}

/**
 * Store a subscriber in the first place that works: the mailing-list audience, then an email to the owner,
 * then a local file. Each step is tried only if the previous one is unavailable or fails.
 */
export async function subscribe(email: string, source: string, deps: SubscribeDeps): Promise<SubscribeOutcome> {
  const welcome = async () => {
    try {
      await deps.sendWelcome?.(email);
    } catch (err) {
      console.warn('[newsletter] welcome email failed:', err);
    }
  };

  if (deps.addToAudience) {
    try {
      const result = await deps.addToAudience(email);
      if (result === 'added') await welcome();
      return { stored: 'audience', alreadySubscribed: result === 'exists' };
    } catch (err) {
      console.error('[newsletter] audience write failed:', err);
    }
  }
  if (deps.notifyOwner) {
    try {
      if (await deps.notifyOwner(email, source)) return { stored: 'owner-email', alreadySubscribed: false };
    } catch (err) {
      console.error('[newsletter] owner notification failed:', err);
    }
  }
  if (deps.appendLocal) {
    try {
      const result = await deps.appendLocal({ email, source, ts: (deps.now?.() ?? new Date()).toISOString() });
      return { stored: 'local', alreadySubscribed: result === 'exists' };
    } catch (err) {
      console.error('[newsletter] local write failed:', err);
    }
  }
  return { stored: null, alreadySubscribed: false };
}

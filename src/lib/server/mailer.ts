// ---------------------------------------------------------------------------
// Server-side mail helper (Phase 18). Production runs on Vercel, where the
// filesystem is read-only, so anything that must not be lost is sent through
// Resend: owner notifications as email, newsletter subscribers as audience
// contacts. Import only from route handlers.
//
// Environment:
//   RESEND_API_KEY      required for anything to be sent
//   RESEND_SEGMENT_ID   optional: the Resend segment (formerly "audience") new subscribers join, so a
//                       broadcast can target them. Subscribers are saved as Resend contacts either way.
//   RESEND_FROM         a sender on a domain verified in Resend, e.g. "QuickBizCalc <hello@quickbizcalc.com>".
//                       Without it mail is sent from Resend's test sender, which only delivers to the
//                       account owner, so subscriber-facing mail (the welcome email) stays off.
// ---------------------------------------------------------------------------
import type { Resend } from 'resend';
import { CONTACT_EMAIL } from '@/lib/registry/site';

const TEST_SENDER = 'QuickBizCalc <onboarding@resend.dev>';
let instance: Resend | null = null;

export async function getResend(): Promise<Resend | null> {
  if (instance) return instance;
  if (!process.env.RESEND_API_KEY) return null;
  const { Resend: ResendClient } = await import('resend');
  instance = new ResendClient(process.env.RESEND_API_KEY);
  return instance;
}

/** True when a verified sender is configured, i.e. mail can reach people other than the owner */
export const canMailSubscribers = () => Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
export const senderAddress = () => process.env.RESEND_FROM || TEST_SENDER;

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Plain text with line breaks, safe to drop into an HTML email */
export const escapeMultiline = (value: unknown) => escapeHtml(value).replace(/\r?\n/g, '<br>');

export function emailShell(title: string, bodyHtml: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:8px"><h2 style="color:#059669;border-bottom:2px solid #059669;padding-bottom:10px;margin-top:0">${escapeHtml(title)}</h2>${bodyHtml}</div>`;
}

export interface OwnerEmail {
  subject: string;
  html: string;
  replyTo?: string;
}

/** Send a notification to the site owner. Returns false (never throws) when nothing was sent. */
export async function emailOwner({ subject, html, replyTo }: OwnerEmail): Promise<boolean> {
  try {
    const resend = await getResend();
    if (!resend) return false;
    const { error } = await resend.emails.send({ from: senderAddress(), to: CONTACT_EMAIL, subject, html, ...(replyTo ? { replyTo } : {}) });
    if (error) {
      console.error('[mailer] owner email failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[mailer] owner email threw:', err);
    return false;
  }
}

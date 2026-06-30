/**
 * Shared time parsing utilities for Time Card calculators.
 *
 * Supports multiple input formats:
 *   - 24-hour: "09:00", "17:30", "9:00"
 *   - 12-hour: "9:00 AM", "9:00AM", "5:30 PM", "5:30PM"
 *   - Shorthand: "9am", "5pm", "9 AM", "5 PM"
 *   - Hours only: "9", "17"
 */

/**
 * Parse a user-entered time string into total minutes since midnight.
 * Returns -1 if the format is invalid.
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') return -1;

  const raw = timeStr.trim();
  if (!raw) return -1;

  // ── 1. Try 24-hr with colon: "9:00", "09:00", "17:30" ──
  const match24 = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return h * 60 + m;
    }
    return -1;
  }

  // ── 2. Try 12-hr with colon: "9:00 AM", "9:00AM", "12:30 PM", "12:30pm" ──
  const match12 = raw.match(/^(\d{1,2}):(\d{2})\s*(am|pm|AM|PM|a\.m\.|p\.m\.)$/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    const period = match12[3].toLowerCase().replace(/\./g, '');

    if (h < 1 || h > 12 || m < 0 || m > 59) return -1;

    if (period === 'pm' && h !== 12) h += 12;
    if (period === 'am' && h === 12) h = 0;

    return h * 60 + m;
  }

  // ── 3. Try shorthand: "9am", "9 AM", "5pm", "5 PM", "12pm" ──
  const matchShort = raw.match(/^(\d{1,2})\s*(am|pm|AM|PM|a\.m\.|p\.m\.)$/i);
  if (matchShort) {
    let h = parseInt(matchShort[1], 10);
    const period = matchShort[2].toLowerCase().replace(/\./g, '');

    if (h < 1 || h > 12) return -1;

    if (period === 'pm' && h !== 12) h += 12;
    if (period === 'am' && h === 12) h = 0;

    return h * 60;
  }

  // ── 4. Try bare hour: "9", "17" (treated as 24-hr) ──
  const matchBare = raw.match(/^(\d{1,2})$/);
  if (matchBare) {
    const h = parseInt(matchBare[1], 10);
    if (h >= 0 && h <= 23) {
      return h * 60;
    }
    return -1;
  }

  return -1;
}

/**
 * Convert total minutes to decimal hours (e.g., 90 min → 1.50).
 */
export function minutesToDecimal(totalMinutes: number): number {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return parseFloat((hours + mins / 60).toFixed(2));
}

/**
 * Format decimal hours to a fixed 2-decimal string (e.g., 8.50).
 */
export function formatDecimalHours(decimal: number): string {
  return decimal.toFixed(2);
}

/**
 * Format total minutes as "Xh Ym" display string.
 */
export function formatHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

/**
 * List of supported time format examples (for placeholders/help text).
 */
export const TIME_FORMAT_EXAMPLES = '9:00 AM, 9am, 09:00, 17:30';

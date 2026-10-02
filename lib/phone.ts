/**
 * Malaysian mobile number helpers, shared by the audit form (client) and
 * /api/waitlist (server).
 *
 * Accepted input examples:
 *   +60120000000, +60 12-000 0000, 60120000000, 0120000000, 012-000 0000, 0060120000000
 *   011 numbers carry one extra digit: 011-000 00000
 */

export type PhoneResult =
  | { ok: true; e164: string; national: string }
  | { ok: false; reason: "empty" | "format" | "invalid" };

export function normalizeMalaysianMobile(raw: string): PhoneResult {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  if (!/^[+\d\s().-]+$/.test(trimmed)) return { ok: false, reason: "format" };

  let digits = trimmed.replace(/\D/g, "");
  const hadPlus = trimmed.startsWith("+");

  if (digits.startsWith("0060")) digits = digits.slice(4);
  else if (digits.startsWith("60") && (hadPlus || digits.length >= 11)) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  else if (hadPlus) return { ok: false, reason: "format" }; // non-Malaysian country code

  // National significant number for mobiles: 1X + 7 or 8 digits.
  if (!/^1\d{8,9}$/.test(digits)) return { ok: false, reason: "format" };
  // 011 numbers have 10 digits, others 9 (some 015 ranges also have 10).
  if (digits.length === 10 && !/^1[15]/.test(digits)) return { ok: false, reason: "format" };

  const subscriber = digits.slice(2);
  if (/^(\d)\1+$/.test(subscriber)) return { ok: false, reason: "invalid" };
  // The classic placeholder 012-345 6789 and similar straight runs.
  if ("1234567890".startsWith(digits)) return { ok: false, reason: "invalid" };

  return { ok: true, e164: `+60${digits}`, national: `0${digits}` };
}

/** For logs: keep country code and last 3 digits only. */
export function maskPhone(e164: string) {
  if (e164.length < 6) return "***";
  return `${e164.slice(0, 3)}${"*".repeat(e164.length - 6)}${e164.slice(-3)}`;
}

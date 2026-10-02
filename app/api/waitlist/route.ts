import { NextResponse, type NextRequest } from "next/server";
import { maskPhone, normalizeMalaysianMobile } from "@/lib/phone";

/**
 * POST /api/waitlist
 *
 * Receives waitlist requests.
 * - Development: stores in memory when no destination is configured.
 * - Production: forwards to WAITLIST_WEBHOOK_URL and/or TENX_API_URL.
 *   With no destination configured it returns 503. It never reports success
 *   for a submission that was not stored or forwarded.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUSINESS_TYPES = new Set(["property", "clinics", "education", "home-services", "appointments", "other"]);
const MONTHLY_LEADS = new Set(["under-50", "50-200", "200-500", "500-plus", "not-sure"]);
const SOURCES = new Set(["waitlist_form", "waitlist_form_qualification"]);
const MIN_FILL_MS = 1200;

type ErrorCode =
  | "invalid_json"
  | "invalid_phone"
  | "invalid_request"
  | "rate_limited"
  | "not_configured"
  | "upstream_failed";

const MESSAGES: Record<ErrorCode, string> = {
  invalid_json: "Something went wrong. Please try again.",
  invalid_phone: "Please enter a valid Malaysian mobile number, for example 012-XXX XXXX.",
  invalid_request: "Something went wrong. Please try again.",
  rate_limited: "Too many attempts. Please wait a few minutes and try again.",
  not_configured: "We couldn't save your request right now. Please email our sales team at admin@tenx.my.",
  upstream_failed: "We couldn't save your request right now. Please try again, or email admin@tenx.my.",
};

function fail(code: ErrorCode, status: number) {
  return NextResponse.json({ ok: false, error: code, message: MESSAGES[code] }, { status });
}

/* ---------------------------------------------------------------------------
 * Basic abuse protection. In-memory, per server instance, best effort.
 * For multi-instance production traffic, put a platform rate limit in front.
 * ------------------------------------------------------------------------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();
const recent = new Map<string, number>();
const devStore: Record<string, unknown>[] = [];

function rateLimited(key: string) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return list.length > MAX_PER_WINDOW;
}

function clientKey(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

function str(value: unknown, max = 120) {
  if (typeof value !== "string") return undefined;
  const v = value.trim().slice(0, max);
  return v.length ? v : undefined;
}

async function forward(url: string, body: unknown, headers: Record<string, string>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Destination responded ${res.status}`);
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientKey(req))) return fail("rate_limited", 429);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail("invalid_json", 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("invalid_json", 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (str(body.company_website)) return fail("invalid_request", 400);

  // Timing check: forms submitted faster than a human can type are rejected.
  const elapsed = typeof body.elapsedMs === "number" ? body.elapsedMs : NaN;
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return fail("invalid_request", 400);

  const phone = normalizeMalaysianMobile(typeof body.whatsapp === "string" ? body.whatsapp : "");
  if (!phone.ok) return fail("invalid_phone", 422);

  const source = str(body.source, 40) ?? "waitlist_form";
  if (!SOURCES.has(source)) return fail("invalid_request", 400);

  const businessType = str(body.businessType, 30);
  if (businessType && !BUSINESS_TYPES.has(businessType)) return fail("invalid_request", 400);
  const monthlyLeads = str(body.monthlyLeads, 20);
  if (monthlyLeads && !MONTHLY_LEADS.has(monthlyLeads)) return fail("invalid_request", 400);

  const lead = {
    whatsapp: phone.e164,
    businessType,
    monthlyLeads,
    source,
    page: str(body.page, 200),
    utmSource: str(body.utmSource),
    utmMedium: str(body.utmMedium),
    utmCampaign: str(body.utmCampaign),
    referral: str(body.referral, 200),
    submittedAt: new Date().toISOString(),
  };

  // Duplicate protection: an identical request that was already stored in the last 10 minutes.
  const dedupeKey = `${lead.whatsapp}|${source}|${businessType ?? ""}|${monthlyLeads ?? ""}`;
  const seenAt = recent.get(dedupeKey);
  if (seenAt && Date.now() - seenAt < WINDOW_MS) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
  const apiUrl = process.env.TENX_API_URL;
  const isProduction = process.env.NODE_ENV === "production";

  if (!webhookUrl && !apiUrl) {
    if (isProduction) {
      console.error("[waitlist] No destination configured. Set WAITLIST_WEBHOOK_URL or TENX_API_URL.");
      return fail("not_configured", 503);
    }
    devStore.push(lead);
    recent.set(dedupeKey, Date.now());
    console.info(`[waitlist] (dev, in-memory) stored ${maskPhone(lead.whatsapp)} source=${source} total=${devStore.length}`);
    return NextResponse.json({ ok: true, stored: "memory" });
  }

  const payload = { type: "waitlist", lead };
  const deliveries: Promise<void>[] = [];
  if (webhookUrl) {
    const secret = process.env.WAITLIST_WEBHOOK_SECRET;
    deliveries.push(forward(webhookUrl, payload, secret ? { "X-Webhook-Secret": secret } : {}));
  }
  if (apiUrl) {
    const key = process.env.TENX_API_KEY;
    deliveries.push(forward(apiUrl, payload, key ? { Authorization: `Bearer ${key}` } : {}));
  }

  const results = await Promise.allSettled(deliveries);
  const delivered = results.filter((r) => r.status === "fulfilled").length;
  if (delivered === 0) {
    console.error(`[waitlist] Delivery failed for ${maskPhone(lead.whatsapp)}`);
    return fail("upstream_failed", 502);
  }
  if (delivered < results.length) {
    console.warn(`[waitlist] Partial delivery for ${maskPhone(lead.whatsapp)} (${delivered}/${results.length})`);
  }

  recent.set(dedupeKey, Date.now());
  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}

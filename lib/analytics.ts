/**
 * Tiny analytics abstraction. No provider is required.
 *
 * - Events carry anonymous metadata only. Phone numbers, names, emails and
 *   message text are stripped before any provider sees them.
 * - No cookies are set by this module.
 * - Register a provider (GA4, Plausible, PostHog...) with `registerAnalyticsProvider`
 *   from a client component. If `window.dataLayer` exists (e.g. GTM), events are
 *   pushed there automatically.
 */

export type AnalyticsEvent =
  | "hero_cta_clicked"
  | "see_how_it_works_clicked"
  | "vertical_selected"
  | "calculator_used"
  | "workflow_stage_changed"
  | "ai_tab_selected"
  | "product_feature_selected"
  | "pricing_viewed"
  | "pricing_cta_clicked"
  | "audit_started"
  | "audit_submitted"
  | "audit_qualified"
  | "audit_error"
  | "faq_opened"
  | "scroll_depth_25"
  | "scroll_depth_50"
  | "scroll_depth_75"
  | "scroll_depth_100"
  | "nav_cta_clicked"
  | "cta_clicked"
  | "email_clicked"
  | "testimonial_interacted"
  | "command_palette_opened";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

export type AnalyticsProvider = {
  name: string;
  track: (event: AnalyticsEvent, props: Record<string, string | number | boolean>) => void;
};

const providers: AnalyticsProvider[] = [];

export function registerAnalyticsProvider(provider: AnalyticsProvider) {
  if (!providers.some((p) => p.name === provider.name)) providers.push(provider);
}

const BLOCKED_KEY = /(phone|whatsapp|mobile|email|message|address|nric)|^(tel|name|fullname|text|ic)$/i;
const LOOKS_LIKE_PHONE = /\+?\d[\d\s-]{6,}\d/;
const LOOKS_LIKE_EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;

export function sanitize(props: AnalyticsProps = {}) {
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || BLOCKED_KEY.test(key)) continue;
    if (typeof value === "string") {
      if (LOOKS_LIKE_PHONE.test(value) || LOOKS_LIKE_EMAIL.test(value)) continue;
      clean[key] = value.slice(0, 80);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

type DataLayerWindow = Window & { dataLayer?: unknown[] };

export function track(event: AnalyticsEvent, props?: AnalyticsProps) {
  if (typeof window === "undefined") return;
  const payload = sanitize(props);
  try {
    const w = window as DataLayerWindow;
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...payload });
    for (const provider of providers) provider.track(event, payload);
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, payload);
    }
  } catch {
    // Analytics must never break the page.
  }
}

/** Fire an event at most once per page view. */
const fired = new Set<string>();
export function trackOnce(event: AnalyticsEvent, props?: AnalyticsProps, key: string = event) {
  if (fired.has(key)) return;
  fired.add(key);
  track(event, props);
}

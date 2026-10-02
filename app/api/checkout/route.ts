import { NextResponse, type NextRequest } from "next/server";
import { getStripe, isCheckoutTier, tierPrices } from "@/lib/stripe";

/**
 * POST /api/checkout  { tier: "launch" | "growth" | "scale" }
 * Creates a Stripe Checkout session (monthly subscription + one-time setup) and returns { url }.
 *
 * No `runtime = "edge"`: the Edge Runtime is deprecated in Next.js 16. The Stripe client uses
 * fetch and Web Crypto, so this runs on Cloudflare Workers through the default runtime.
 */

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let tier: unknown;
  try {
    tier = ((await req.json()) as { tier?: unknown })?.tier;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!isCheckoutTier(tier)) return NextResponse.json({ error: "invalid_tier" }, { status: 400 });

  const { monthly, setup } = tierPrices(tier);
  if (!process.env.STRIPE_SECRET_KEY || !monthly || !setup) {
    console.error(`[checkout] Missing Stripe configuration for tier=${tier}`);
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    // Subscription mode always creates a customer; `customer_creation` is only accepted in payment mode.
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      client_reference_id: tier,
      line_items: [
        { price: monthly, quantity: 1 },
        { price: setup, quantity: 1 },
      ],
      success_url: "https://app.tenx.my/register?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://tenx.my/#pricing",
      metadata: { tier },
      subscription_data: { metadata: { tier } },
    });
    if (!session.url) throw new Error("Session has no URL");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Session creation failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "checkout_failed" }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}

import { after, NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { cryptoProvider, getStripe } from "@/lib/stripe";

/**
 * POST /api/webhooks/stripe
 * Verifies the Stripe signature on the raw body, then on checkout.session.completed tells the
 * app API to create a pending tenant. Responds 200 straight away; the forward runs in `after()`
 * so the platform keeps it alive after the response (waitUntil on Cloudflare Workers).
 */

export const dynamic = "force-dynamic";

const id = (v: string | { id: string } | null | undefined) => (typeof v === "string" ? v : (v?.id ?? null));

async function createPendingTenant(session: Stripe.Checkout.Session) {
  const apiUrl = process.env.CRM_API_URL;
  const apiKey = process.env.CRM_API_KEY;
  if (!apiUrl || !apiKey) {
    console.error("[stripe-webhook] CRM_API_URL or CRM_API_KEY is not set");
    return;
  }
  const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/tenants/pending`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({
      email: session.customer_details?.email ?? session.customer_email ?? null,
      stripe_customer_id: id(session.customer),
      stripe_subscription_id: id(session.subscription),
      stripe_session_id: session.id,
      tier: session.metadata?.tier ?? session.client_reference_id,
      status: "pending_registration",
    }),
  });
  if (!res.ok) throw new Error(`Tenant API responded ${res.status}`);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  // Raw text, not JSON: the signature is computed over the exact bytes Stripe sent.
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(body, signature, secret, undefined, cryptoProvider);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    after(() =>
      createPendingTenant(session).catch((err) =>
        console.error(`[stripe-webhook] Pending tenant failed for ${session.id}`, err instanceof Error ? err.message : err),
      ),
    );
  }

  return NextResponse.json({ received: true });
}

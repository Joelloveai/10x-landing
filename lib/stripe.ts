import Stripe from "stripe";

/**
 * Server-only Stripe client. Uses fetch and Web Crypto so it runs on Cloudflare Workers.
 * Created lazily so a build without STRIPE_SECRET_KEY still succeeds.
 */
let client: Stripe | null = null;

export function getStripe() {
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return client;
}

export const cryptoProvider = Stripe.createSubtleCryptoProvider();

export const checkoutTiers = ["launch", "growth", "scale"] as const;
export type CheckoutTier = (typeof checkoutTiers)[number];

export function isCheckoutTier(value: unknown): value is CheckoutTier {
  return typeof value === "string" && (checkoutTiers as readonly string[]).includes(value);
}

/** Monthly subscription price and one-time setup price for each tier. */
export function tierPrices(tier: CheckoutTier) {
  const prices = {
    launch: { monthly: process.env.STRIPE_PRICE_LAUNCH, setup: process.env.STRIPE_SETUP_LAUNCH },
    growth: { monthly: process.env.STRIPE_PRICE_GROWTH, setup: process.env.STRIPE_SETUP_GROWTH },
    scale: { monthly: process.env.STRIPE_PRICE_SCALE, setup: process.env.STRIPE_SETUP_SCALE },
  };
  return prices[tier];
}

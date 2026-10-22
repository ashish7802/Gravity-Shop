import Stripe from "stripe";

let stripeCache: Stripe | null = null;

/**
 * Returns a lazily initialized Stripe client.
 * Guarantees that `new Stripe()` is never called with undefined or empty string,
 * preventing Vercel build-time crashes: "Neither apiKey nor config.authenticator provided".
 */
export const getStripe = (): Stripe => {
  if (stripeCache) return stripeCache;

  const rawKey = process.env.STRIPE_SECRET_KEY?.trim();
  const apiKey = rawKey && rawKey.length > 5 ? rawKey : "sk_test_dummy_key_for_builds_12345";

  try {
    stripeCache = new Stripe(apiKey);
  } catch (err) {
    console.warn("[Stripe] Failed to initialize with key, using fallback", err);
    stripeCache = new Stripe("sk_test_dummy_key_for_builds_12345");
  }

  return stripeCache;
};

// Lazy proxy so any legacy import like `import stripe from "@/lib/stripe"`
// or `stripe.webhooks.constructEvent` never triggers `new Stripe()` during static build/page data collection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxyHandler: ProxyHandler<any> = {
  get(_target, prop, receiver) {
    const instance = getStripe();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
};

export const stripe = new Proxy({} as Stripe, proxyHandler);
export default stripe;

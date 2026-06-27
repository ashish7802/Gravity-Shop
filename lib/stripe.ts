import Stripe from "stripe";

let stripeCache: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (stripeCache) return stripeCache;
  
  const getStripeKey = () => {
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (key) return key;
    
    // Always return a dummy key during build or if missing, rather than crashing Next.js static collection
    return "sk_test_dummy_key_for_builds_12345";
  };

  stripeCache = new Stripe(getStripeKey(), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2026-05-27.dahlia" as any,
  });

  return stripeCache;
};

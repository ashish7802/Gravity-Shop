import Stripe from "stripe";

let stripeCache: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (stripeCache) return stripeCache;
  
  const getStripeKey = () => {
    if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY;
    
    // Return dummy key during builds to avoid Next.js static evaluation errors
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build") {
      return "dev_dummy_key";
    }

    if (process.env.NODE_ENV !== "production") return "dev_dummy_key";
    
    throw new Error("FATAL: STRIPE_SECRET_KEY is missing in production environment.");
  };

  stripeCache = new Stripe(getStripeKey(), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2026-05-27.dahlia" as any,
  });

  return stripeCache;
};

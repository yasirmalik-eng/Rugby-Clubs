import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env
  .VITE_STRIPE_PUBLISHABLE_KEY as string;

if (!stripePublishableKey) {
  throw new Error(
    "Missing Stripe env var. Add VITE_STRIPE_PUBLISHABLE_KEY to your .env.local file."
  );
}

export const stripePromise = loadStripe(stripePublishableKey);

import Stripe from 'stripe';
import { signIn } from "next-auth/react";

function useRefreshSession() {
  return async () => {
    await signIn(undefined, { redirect: false }); // Undefined provider works for all sign-in methods
  };
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export { stripe, useRefreshSession };
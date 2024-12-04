import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { Role } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Map Stripe product IDs to roles
const productToRoles: Record<string, Role> = {
  prod_RKmDcsx840rcWE: Role.PREMIUM, // Map product IDs to roles
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_ADD! // Signature for "add" events
    );

    console.log("Webhook verified:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    const subscriptionId = subscription.id;
    const product = subscription.items.data[0]?.price.product;
    const productId = typeof product === "string" ? product : null;

    if (!subscriptionId || !productId) {
      console.error("Missing subscriptionId or valid productId");
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error("Missing userId in subscription metadata");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log("Updating subscription for user:", userId);

    const role = productToRoles[productId] || Role.USER;

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      const updatedSubscription = await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan: "PREMIUM",
          status: "ACTIVE",
          currentPeriodEnd: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        create: {
          userId,
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          plan: "PREMIUM",
          status: "ACTIVE",
        },
      });

      return NextResponse.json({
        message: "Subscription updated successfully",
        updatedSubscription,
        user,
      });
    } catch (err) {
      console.error("Error updating subscription:", err);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Unhandled event type" }, { status: 200 });
}
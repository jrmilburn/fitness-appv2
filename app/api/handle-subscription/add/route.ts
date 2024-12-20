import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { Role } from "@prisma/client";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Map Stripe product IDs to roles
const productToRoles: Record<string, Role> = {
  prod_RKmDcsx840rcWE: Role.PREMIUM, // Use Prisma Role enum values here
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();

    console.log('RAW BODY', rawBody);

    // Verify the Stripe signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_ADD!
    );

    console.log("Webhook verified:", event.type);

    console.log('EVENT', event);

  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    const subscriptionId = subscription.id;
    const product = subscription.items.data[0]?.price.product;

    // Ensure `product` is a string
    const productId = typeof product === "string" ? product : null;

    if (!subscriptionId || !productId) {
      console.error("Missing subscriptionId or valid productId");
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const userId = subscription.metadata?.userId; // Assuming userId is stored in subscription metadata

    if (!userId) {
      console.error("Missing userId in subscription metadata");
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    console.log("Updating subscription for user:", userId);

    // Map product ID to a role
    const role = productToRoles[productId] || Role.USER;

    try {
      // Update the user's role in the database
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      const updatedSubscription = await prisma.subscription.upsert({
        where: {
          userId: userId, // Match by userId
        },
        update: {
          plan: "PREMIUM", // Update these fields if the record exists
          status: "ACTIVE",
          currentPeriodEnd: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Now + 30 days
        },
        create: {
          userId: userId, // Create a new record with these fields if no match is found
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Now + 30 days
          plan: "PREMIUM",
          status: "ACTIVE",
        },
      });

      return NextResponse.json(
        {
          message: "Subscription updated successfully",
          updatedSubscription,
          user,
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error updating subscription:", err);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }
  }

  console.log("Unhandled event type:", event.type);
  return NextResponse.json({ message: "Event received" }, { status: 200 });
}
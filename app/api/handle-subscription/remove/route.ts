import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      process.env.STRIPE_WEBHOOK_SECRET_DELETE!
    );

    console.log("Webhook verified:", event.type);

    console.log('EVENT', event);

  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  if (event.type === "customer.subscription.deleted") {
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

    console.log('SUBSCRIPTION METADATA', subscription.metadata);
    console.log('SUBSCRIPTION', subscription);

    if (!userId) {
      console.error("Missing userId in subscription metadata");
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    console.log("Updating subscription for user:", userId);
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: "USER" },
      });

      const updatedSubscription = await prisma.subscription.update({
        where: {
          userId: userId, // Match by userId
        },
        data: {
          plan: "BASIC", // Update these fields if the record exists
          status: "ACTIVE",
          currentPeriodEnd: new Date(new Date().getTime()), // Now + 30 days
        },
      });

      return NextResponse.json(
        {
          message: "Subscription cancelled successfully",
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
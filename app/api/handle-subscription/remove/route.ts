import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      process.env.STRIPE_WEBHOOK_SECRET_DELETE! // Signature for "delete" events
    );

    console.log("Webhook verified:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    const subscriptionId = subscription.id;

    console.log("Handling subscription deletion for ID:", subscriptionId);

    try {
      const dbSubscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
      });

      if (!dbSubscription) {
        console.error("Subscription not found in the database.");
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
      }

      const canceledSubscription = await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: "CANCELED",
          currentPeriodEnd: null,
        },
      });

      const updatedUser = await prisma.user.update({
        where: { id: dbSubscription.userId },
        data: { role: "USER" },
      });

      console.log("Subscription and user role updated successfully:", {
        canceledSubscription,
        updatedUser,
      });

      return NextResponse.json({
        message: "Subscription deleted successfully",
        canceledSubscription,
        updatedUser,
      });
    } catch (err) {
      console.error("Error handling subscription deletion:", err);
      return NextResponse.json({ error: "Failed to handle subscription deletion" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Unhandled event type" }, { status: 200 });
}
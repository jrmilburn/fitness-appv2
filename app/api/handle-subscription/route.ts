import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma"; // Assuming you're using Prisma to manage your database
import { Role } from "@prisma/client"; // Import Role enum from Prisma

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Map Stripe product IDs to roles
const productToRoles: Record<string, Role> = {
    prod_RKmDcsx840rcWE: Role.PREMIUM, // Use Prisma Role enum values here
};

export async function POST(req: NextRequest) {
  try {

    console.log('HELLOOOOOOO');

    // Parse the request body
    const { subscriptionId, userId } = await req.json();

    console.log('info', subscriptionId, userId);

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: "Missing subscriptionId or userId" },
        { status: 400 }
      );
    }

    // Retrieve subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Extract product ID from subscription
    const productId = subscription.items.data[0]?.price.product;

    if (typeof productId !== "string") {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Map product ID to a role
    const role = productToRoles[productId] || Role.USER; // Default to Role.USER

    console.log("USER ROLE", role);

    // Update the user's role in the database
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }, // Use the Role enum value
    });

    const updatedSubscription = await prisma.subscription.update({
        where: {
            userId: user.id
        },
        data: {
            plan: 'PREMIUM'
        }
    })

    return NextResponse.json(
      {
        message: "Subscription updated successfully",
        subscription,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating subscription:", error);

    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {

    const userSession = await getServerSession(authOptions);

    if (!userSession) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = userSession?.user.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      metadata: {
        userId: user.id 
      },
      mode: 'subscription',
      return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({id: session.id, client_secret: session.client_secret})

  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}

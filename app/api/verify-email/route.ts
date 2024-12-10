// File: /app/api/verify-email/route.js

import { prisma } from '../../lib/prisma';
import { NextResponse } from 'next/server';

// List of allowed origins (same as in register endpoint)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://fitness-appv2.vercel.app",
  "https://fitnessapp-landingpage.vercel.app"
];

// Helper function to set CORS headers dynamically
function setCorsHeaders(req) {
  const origin = req.headers.get("origin");

  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }
  return {};
}

// Handle GET requests for email verification
export async function GET(req) {
  const corsHeaders = setCorsHeaders(req);

  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { message: "Invalid verification link." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find the user with the matching email and token
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.verificationToken !== token) {
      return NextResponse.json(
        { message: "Invalid verification link or user does not exist." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if the token has expired
    if (user.verificationTokenExpiry < new Date()) {
      return NextResponse.json(
        { message: "Verification link has expired." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Update the user's verified status and remove the token fields
    await prisma.user.update({
      where: { email },
      data: {
        verified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    // Optionally, redirect the user to a success page
    // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verification-success`);

    // For API response, return a success message
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS (preflight requests)
export async function OPTIONS(req) {
  const corsHeaders = setCorsHeaders(req);
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
// File: /app/api/register/route.js

import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail } from '../../../lib/email/sendEmail';

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://fitness-appv2.vercel.app",
  "https://fitnessapp-landingpage.vercel.app",
  "https://landing.joemilburn.xyz"
];

// Helper function to set CORS headers dynamically
function setCorsHeaders(req) {
  const origin = req.headers.get("origin");

  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }
  return {};
}

// Handle POST requests
export async function POST(req) {
  const corsHeaders = setCorsHeaders(req);

  try {
    const { email, firstName, lastName, phone } = await req.json();

    console.log(`Registering user with email: ${email}`);

    console.log('CHECK 1', email, firstName, lastName, phone);


    // Basic validation (enhance as needed)
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('CHECK 2', email, firstName, lastName, phone);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log('existing user', existingUser);

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400, headers: corsHeaders }
      );
    }


    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const name = `${firstName} ${lastName}`;

    // Create the new user in the database with verification details
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        verificationToken,
        verificationTokenExpiry,
        verified: false, // Explicitly set to false
      },
    });

    // Create a subscription for the new user
    const newSubscription = await prisma.subscription.create({
      data: {
        userId: newUser.id,
      },
    });

    // Construct verification link
    const verificationLink = `https://fitness.joemilburn.xyz/api/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Email subject and HTML content
    const subject = 'Verify Your Email - JFIT';
    const html = `
      <h1>Welcome to JFIT, ${firstName}!</h1>
      <p>Thank you for registering. Please verify your email by clicking the button below:</p>
      <a href="${verificationLink}" style="
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #28a745;
        text-decoration: none;
        border-radius: 5px;
      ">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not register, please ignore this email.</p>
    `;

    // Send verification email
    await sendEmail(email, subject, html);

    return NextResponse.json(
      {
        message: "Registration successful! Please check your email to verify your account.",
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
        subscription: newSubscription,
      },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: "Internal server error." },
      {
        status: 500,
        headers: corsHeaders,
      }
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
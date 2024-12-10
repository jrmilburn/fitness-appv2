import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

// List of allowed origins
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

        console.log(email);

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                {
                    status: 400,
                    headers: corsHeaders,
                }
            );
        }

        // Hash the password
        const name = `${firstName} ${lastName}`;

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                phone,
            },
        });

        const newSubscription = await prisma.subscription.create({
            data: {
                userId: newUser.id,
            },
        });

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: newUser,
                subscription: newSubscription,
            },
            {
                status: 201,
                headers: corsHeaders,
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
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
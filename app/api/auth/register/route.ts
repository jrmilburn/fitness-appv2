import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://fitness-appv2.vercel.app",
];

// Helper function to set CORS headers
function setCorsHeaders(req, res) {
    const origin = req.headers.origin;

    // Check if the request origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
}

// Handle POST requests
export async function POST(req, res) {
    setCorsHeaders(req, res);

    try {
        const { email, firstName, lastName, phone, password } = await req.json();

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = `${firstName} ${lastName}`;

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                phone,
                password: hashedPassword,
            },
        });

        const newSubscription = await prisma.subscription.create({
            data: {
                userId: newUser.id,
            },
        });

        return NextResponse.json({ message: "User registered successfully", user: newUser, subscription: newSubscription }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// Handle OPTIONS (preflight requests)
export async function OPTIONS(req, res) {
    setCorsHeaders(req, res);
    res.status(200).end(); // Preflight response must end here
}
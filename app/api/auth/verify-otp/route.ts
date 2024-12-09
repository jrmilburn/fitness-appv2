import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // Adjust the path as needed
import { verifyOtp } from "@/app/lib/twilio/SendSms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions"; // Adjust the path based on your project structure

export async function POST(req) {
    try {
        const { email, otp } = await req.json();

        // Validate the OTP
        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Use NextAuth to create a session for the user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Failed to create session" }, { status: 500 });
        }

        return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } catch (error) {
        console.error(`Error in verify-otp endpoint: ${error.message}`);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
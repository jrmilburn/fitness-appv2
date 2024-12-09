import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { SendSms } from '@/app/lib/twilio/SendSms';

export async function POST(req) {
    try {
        const { email } = await req.json();

        // Check if the user exists
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        await SendSms(user.phone);

        return NextResponse.json({ message: "OTP sent to your phone" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
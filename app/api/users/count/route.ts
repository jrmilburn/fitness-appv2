
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';  // Adjust the path to your prisma file
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';  // Adjust the path as needed

export async function GET(req) {
    try {

        const userCount = await prisma.user.count();

        return NextResponse.json({ count: userCount }, { status: 200 });

    } catch (error) {
        console.error('Error fetching user count:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user count' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';  // Adjust the path to your prisma file

export async function GET() {
    try {
        const users = await prisma.user.findMany({
          take: 10
        });
        return NextResponse.json(users);  
    } catch (error) {
        console.error('Error fetching musclegroups:', error);
        return new NextResponse('Failed to fetch musclegroups', { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';  // Adjust the path to your prisma file

// GET method to handle fetching muscle groups
export async function GET() {
    try {
        const musclegroups = await prisma.muscleGroup.findMany();
        return NextResponse.json(musclegroups);  // Return the muscle groups as JSON
    } catch (error) {
        console.error('Error fetching musclegroups:', error);
        return new NextResponse('Failed to fetch musclegroups', { status: 500 });
    }
}
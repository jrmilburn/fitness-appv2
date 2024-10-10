import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';  // Adjust the path to your prisma file

// GET method to handle fetching muscle groups
export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const muscle = searchParams.get('muscle');

    console.log(muscle);

    try {
        const excercises = await prisma.excercise.findMany({
            where: {
                id: muscle
            }
        });
        return NextResponse.json(excercises);  // Return the muscle groups as JSON
    } catch (error) {
        console.error('Error fetching musclegroups:', error);
        return new NextResponse('Failed to fetch musclegroups', { status: 500 });
    }
}
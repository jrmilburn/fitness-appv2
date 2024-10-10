import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';  // Adjust the path to your prisma file

// GET method to handle fetching an exercise by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
) {
  const { id } = params;

  try {
    // Fetch exercise by ID
    const excercise = await prisma.excercise.findMany({
      where: {
        muscleGroupId: id,
        workoutId: null
      },
    });

    // If no exercise is found, return 404
    if (!excercise) {
      return new NextResponse('Exercise not found', { status: 404 });
    }

    return NextResponse.json(excercise);  // Return the exercise as JSON
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return new NextResponse('Failed to fetch exercise', { status: 500 });
  }
}
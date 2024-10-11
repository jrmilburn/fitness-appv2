import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';  // Adjust the path to your prisma file

export async function GET(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
) {
  const { id } = params;

  try {
    const musclegroup = await prisma.muscleGroup.findUnique({
      where: {
        id: id,
      },
    });

    // If no exercise is found, return 404
    if (!musclegroup) {
      return new NextResponse('MuscleGroup not found', { status: 404 });
    }

    return NextResponse.json(musclegroup);  // Return the exercise as JSON
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return new NextResponse('Failed to fetch exercise', { status: 500 });
  }
}
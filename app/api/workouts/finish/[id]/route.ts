import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';  // Adjust the path to your prisma file

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
) {
  const { id } = params;

  try {

    const workout = await prisma.workout.update({
        where: {
            id: id
        },
        data: {
            completed: true
        }
    })

    console.log('UPDATED WORKOUT: ', workout);

    // If no exercise is found, return 404
    if (!workout) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json(workout);  // Return the exercise as JSON
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return new NextResponse('Failed to fetch exercise', { status: 500 });
  }
}

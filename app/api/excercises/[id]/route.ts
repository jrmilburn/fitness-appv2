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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
) {
  const { id } = params;

  try {

    await prisma.set.deleteMany({
      where: {
        excerciseId: id
      }
    })

    const excercise = await prisma.excercise.delete({
      where: {
        id: id
      }
    })
    
    return NextResponse.json(excercise);

  } catch(error) {
    console.error('Error deleting set:', error);
    return new NextResponse('Failed to delete set', { status: 500 });
  }

}

export async function PUT(  req: Request,
  { params }: { params: { id: string } }) {

    const { id } = params;
    const { muscleId, newExcercise } = await req.json();

    try {

      const replaceExcercise = await prisma.excercise.update({
        where: {
          id: id
        },
        data: {
          muscleGroupId: muscleId,
          name: newExcercise,

        },
        include: {
          sets: true
        }
      })

      console.log(replaceExcercise);

      return NextResponse.json(replaceExcercise);

    } catch (err) {

      return NextResponse.json(err);

    }

  }
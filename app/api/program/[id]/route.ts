import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Adjust the path to your prisma file

export async function GET(
  req: Request,
  { params }: { params: { id: string } } // Destructure params to get the `id`
) {
  const { id } = params;

  try {
    const program = await prisma.program.findUnique({
      where: {
        id: id,
      },
      include: {
        weeks: {
          include: {
            workouts: {
              include: {
                excercises: {
                  include: {
                    sets: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // If no program is found, return 404
    if (!program) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json(program); // Return the program as JSON
  } catch (error) {
    console.error('Error fetching program:', error);
    return new NextResponse('Failed to fetch program', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } // Properly typed params
) {
  const { id } = params;

  try {
    const deleteProgram = await prisma.program.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deleteProgram); // Return deleted program details
  } catch (error) {
    console.error('Error deleting program:', error);
    return new NextResponse('Failed to delete program', { status: 500 });
  }
}
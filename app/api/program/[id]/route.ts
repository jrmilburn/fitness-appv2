import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';  // Adjust the path to your prisma file

export async function GET(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
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
                        sets: true
                      }
                    }
                  }
                }
            }
        }
      }
    });

    // If no exercise is found, return 404
    if (!program) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json(program);  // Return the exercise as JSON
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return new NextResponse('Failed to fetch exercise', { status: 500 });
  }
}
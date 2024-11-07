import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';  // Adjust the path to your prisma file

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
) {
  const { id } = params;
  const { weight, reps, completed } = await req.json();

  try {

    const set = await prisma.set.update({
        where: {
            id: id
        },
        data: {
            weight: weight,
            reps: reps,
            completed: completed
        }
    })

    console.log('UPDATED SET: ', set);

    // If no exercise is found, return 404
    if (!set) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json(set);  // Return the exercise as JSON
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return new NextResponse('Failed to fetch exercise', { status: 500 });
  }
}

export async function GET(  req: Request,
  { params }: { params: { id: string } }) {


  const { id } = params;

  try {

    const set = await prisma.set.findUnique({
      where: {
        id: id
      }
    })

    return NextResponse.json(set);

  } catch(error) {
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

    const set = await prisma.set.delete({
      where: {
        id: id
      }
    })
    
    return NextResponse.json(set);

  } catch(error) {
    console.error('Error deleting set:', error);
    return new NextResponse('Failed to delete set', { status: 500 });
  }

}
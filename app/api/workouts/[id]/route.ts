import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

export async function GET(
    req: Request,
    { params }: { params: { id: string } } // Destructure params to get the `id`
  ) {
    const { id } = params;

    try {

      const userSession = await getServerSession(authOptions);

      if (!userSession) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }
  
      const userEmail = userSession?.user.email;
  
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

    const currentWorkout = await prisma.workout.findUnique({
      where: { id: id },
      include: {
        excercises: {
          include: {
            sets: { orderBy: { createdAt: 'asc' } },
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
      },
    });

    if (!currentWorkout) {
      return NextResponse.json({ error: 'Current workout not found in week' }, { status: 404 });
    }

    // Return both the currentWorkout data and the program's completed status
    return NextResponse.json({
      workout: currentWorkout,
      user: user
    });
  } catch (error) {
    console.error('Error fetching current workout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: { id: string } } // Destructure params to get the `id`
  ) {
    const { id } = params;

    try {

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.currentProgramId) {
      return NextResponse.json({ error: 'No current program found for user' }, { status: 404 });
    }

    const currentProgram = await prisma.program.findUnique({
      where: { id: user.currentProgramId },
      select: {
        completed: true,
        currentWeekId: true,
      },
    });

    if (!currentProgram) {
      return NextResponse.json({ error: 'Current program not found' }, { status: 404 });
    }

    const currentWeek = await prisma.week.findUnique({
      where: { id: currentProgram.currentWeekId },
      include: { workouts: true },
    });

    if (!currentWeek) {
      return NextResponse.json({ error: 'Current week not found in program' }, { status: 404 });
    }

    // Set default workout ID if not set
    if (!currentWeek.currentWorkoutId) {
      await prisma.week.update({
        where: { id: currentWeek.id },
        data: { currentWorkoutId: currentWeek.workouts[0]?.id },
      });
    }

    const currentWorkout = await prisma.workout.findUnique({
      where: { id: currentWeek.currentWorkoutId },
      include: {
        excercises: {
          include: {
            sets: { orderBy: { createdAt: 'asc' } },
          },
        },
      },
    });

    if (!currentWorkout) {
      return NextResponse.json({ error: 'Current workout not found in week' }, { status: 404 });
    }

    // Return both the currentWorkout data and the program's completed status
    return NextResponse.json({
      workout: currentWorkout,
      programCompleted: currentProgram.completed,
    });
  } catch (error) {
    console.error('Error fetching current workout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
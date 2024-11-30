import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import { findNextWorkout, updateNextWeekSets } from '@/app/lib/workout-helpers';

export async function PUT(req, { params }) {
  const { id } = params;
  const { weekId } = await req.json();

  try {
    // Mark current workout as completed
    const workout = await prisma.workout.update({
      where: { id },
      data: { completed: true }
    });

    // Check if all workouts in the current week are completed
    const week = await prisma.week.findUnique({
      where: { id: weekId },
      include: { workouts: true }
    });

    if (week && week.workouts.every(workout => workout.completed === true)) {
      console.log("All workouts for the week are completed!");

      // Mark the week as completed
      const completedWeek = await prisma.week.update({
        where: { id: weekId },
        data: { completed: true },
        include: {
          workouts: {
            include: {
              excercises: {
                include: {
                  sets: true,
                  autoRegulator: true
                }
              }
            }
          }
        }
      });

      // Find the next week and update sets if it exists
      const nextWeek = await prisma.week.findFirst({
        where: {
          programId: week.programId,
          weekNo: week.weekNo + 1,
        },
        include: { workouts: { include: { excercises: { include: { sets: true } } } } }
      });

      if (nextWeek) {
        await updateNextWeekSets(completedWeek, nextWeek);
      }
    } else {
      console.log("There are still incomplete workouts in the week.");
    }

    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;

    const nextWorkout = await findNextWorkout(userEmail);

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (nextWorkout === "Program finished") {
      await prisma.program.update({
        where: { id: user?.currentProgramId },
        data: { completed: true }
      });

      return NextResponse.json({ message: "Program finished" }, { status: 200 });
    }

    await prisma.program.update({
      where: { id: user?.currentProgramId },
      data: { currentWeekId: nextWorkout.weekId }
    });

    await prisma.week.update({
      where: { id: nextWorkout.weekId },
      data: { currentWorkoutId: nextWorkout.id }
    });

    if (!workout) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error fetching excercise:', error);
    return new NextResponse('Failed to fetch excercise', { status: 500 });
  }
}


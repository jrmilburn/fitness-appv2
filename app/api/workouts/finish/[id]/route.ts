import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { weekId } = await req.json();

  try {
    const workout = await prisma.workout.update({
      where: { id },
      data: { completed: true }
    });

    const week = await prisma.week.findUnique({
      where: { id: weekId },
      include: { workouts: true }
    });

    if (week && week.workouts.every(workout => workout.completed === true)) {
      console.log("All workouts for the week are completed!");

      const completedWeek = await prisma.week.update({
        where: { id: weekId },
        data: { completed: true }
      });

      // Find the next week and update sets if all workouts are completed
      const nextWeek = await prisma.week.findFirst({
        where: {
          programId: week.programId,
          weekNo: week.weekNo + 1,
        },
        include: { workouts: { include: { excercises: { include: { sets: true } } } } }
      });

      if (nextWeek) {
        await updateNextWeekSets(nextWeek);
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

async function updateNextWeekSets(nextWeek) {
  for (const workout of nextWeek.workouts) {
    for (const excercise of workout.excercises) {
      for (const set of excercise.sets) {
        await prisma.set.update({
          where: { id: set.id },
          data: {
            recommendedReps: set.reps + 1,
            recommendedWeight: set.weight * 1.01
          }
        });
      }
    }
  }
}

async function findNextWorkout(userEmail) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  const userProgram = await prisma.program.findUnique({
    where: { id: user?.currentProgramId },
    include: {
      weeks: {
        include: {
          workouts: true
        }
      }
    }
  });

  let firstIncompleteWorkout = null;

  for (let i = 0; i < userProgram?.weeks?.length; i++) {
    const week = userProgram.weeks.find(week => week.weekNo === i + 1);
    firstIncompleteWorkout = week.workouts.find(workout => !workout.completed);

    if (firstIncompleteWorkout) {
      break;
    }
  }

  if (!firstIncompleteWorkout) {
    return "Program finished";
  }

  return firstIncompleteWorkout;
}
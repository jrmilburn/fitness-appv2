import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

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
                  sets: true
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

async function findPreviousWeekSet(setId, completedWeek) {
  // Retrieve details of the set in the next week
  const nextWeekSet = await prisma.set.findUnique({
    where: { id: setId },
    include: {
      excercise: {
        include: {
          workout: true
        }
      }
    }
  });

  if (!nextWeekSet) {
    console.warn(`Set with ID ${setId} not found in the next week.`);
    return null;
  }

  const workoutNo = nextWeekSet.excercise.workout.workoutNo;
  const excerciseName = nextWeekSet.excercise.name;
  const setNo = nextWeekSet.setNo;

  if (!workoutNo || !excerciseName) {
    console.warn(`WorkoutNo or Exercise name is missing for set ID ${setId}.`);
    return null;
  }

  console.log(`Looking for workoutNo: ${workoutNo}, excerciseName: ${excerciseName}, setNo: ${setNo}`);

  // Ensure the completed week has workouts
  if (!completedWeek || !completedWeek.workouts) {
    console.warn("Completed week or workouts in completed week is missing.");
    return null;
  }

  // Find the corresponding workout in the completed week by workoutNo
  const prevWorkout = completedWeek.workouts.find(
    workout => workout.workoutNo === workoutNo
  );

  if (!prevWorkout) {
    console.warn(`No matching workout found in completedWeek for workoutNo: ${workoutNo}`);
    return null;
  }

  // Find the corresponding exercise in the previous workout by exercise name
  const prevExcercise = prevWorkout.excercises.find(
    excercise => excercise.name === excerciseName
  );

  if (!prevExcercise) {
    console.warn(`No matching exercise found in prevWorkout for exercise name: ${excerciseName}`);
    return null;
  }

  // Find the corresponding set in the previous exercise by setNo
  const prevSet = prevExcercise.sets.find(set => set.setNo === setNo);

  if (!prevSet) {
    console.warn(`No matching set found in prevExcercise for setNo: ${setNo}`);
    return null;
  }

  return prevSet;
}


async function updateNextWeekSets(completedWeek, nextWeek) {

  for (const workout of nextWeek.workouts) {
    for (const excercise of workout.excercises) {
      for (const set of excercise.sets) {

        // Find the corresponding set from the completed week
        const prevSet = await findPreviousWeekSet(set.id, completedWeek);

        console.log('PREV SET: ', prevSet);

        // Check if prevSet exists and log the details for debugging
        if (prevSet) {
          console.log(`Updating set ID: ${set.id} based on previous set ID: ${prevSet.id}`);
          console.log(`Previous Reps: ${prevSet.reps}, Previous Weight: ${prevSet.weight}`);
          
          // Update the set with recommended progressive overload values
          await prisma.set.update({
            where: { id: set.id },
            data: {
              recommendedReps: prevSet.reps + 1,
              recommendedWeight: Math.ceil(prevSet.weight * 1.01) // Example of 1% increase
            }
          });
        } else {
          console.log(`Skipping update for set ID ${set.id} as no matching previous set was found.`);
        }
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

import { prisma } from '../lib/prisma'

export async function skipWorkout(workoutId, status) {

    try {

        const skippedWorkout = await prisma.workout.update({
            where: {
                id: workoutId
            },
            data: {
                completed: status,
                skipped: true
            }
        })

        return skippedWorkout

    } catch (err) {
        return err
    }

}

export async function findNextWorkout(userEmail) {
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


export async function updateNextWeekSets(completedWeek, nextWeek) {

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
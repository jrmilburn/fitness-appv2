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
    for (const nextWorkout of nextWeek.workouts) {
      // Find the corresponding workout in the completed week
      const completedWorkout = completedWeek.workouts.find(
        (workout) => workout.workoutNo === nextWorkout.workoutNo
      );
  
      if (!completedWorkout) {
        console.warn(
          `No matching workout found in completedWeek for workoutNo: ${nextWorkout.workoutNo}`
        );
        continue;
      }
  
      for (const nextExercise of nextWorkout.excercises) {
        // Only process exercises with 'auto' progression
        if (nextExercise.progressionType === 'auto') {
          // Generate sets for 'auto' progression exercises that currently have no sets
          await generateSetsForAutoProgression(nextExercise, completedWorkout);
        } else {
          // For other progression types, maintain existing logic
          for (const set of nextExercise.sets) {
            const prevSet = await findPreviousWeekSet(set.id, completedWeek);
  
            if (prevSet) {
              // Update the set with recommended progressive overload values
              await prisma.set.update({
                where: { id: set.id },
                data: {
                  recommendedReps: prevSet.reps + 1,
                  recommendedWeight: Math.ceil(prevSet.weight * 1.01),
                },
              });
            } else {
              console.log(
                `Skipping update for set ID ${set.id} as no matching previous set was found.`
              );
            }
          }
        }
      }
    }
  }

  async function generateSetsForAutoProgression(nextExercise, completedWorkout) {
    // Check if sets already exist
    const existingSets = await prisma.set.findMany({
      where: { excerciseId: nextExercise.id },
    });
  
    if (existingSets.length > 0) {
      console.log(
        `Sets already exist for exercise ${nextExercise.name} in next week; skipping generation.`
      );
      return;
    }
  
    // Find the corresponding exercise in the completed week
    const completedExercise = completedWorkout.excercises.find(
      (exercise) => exercise.name === nextExercise.name
    );
  
    if (!completedExercise) {
      console.warn(
        `No matching exercise found in completedWorkout for exercise name: ${nextExercise.name}`
      );
      return;
    }
  
    // Determine new set count based on completed exercise
    const newSetCount = await determineNewSetCount(completedExercise);
    await prisma.excercise.update({
      where: {
        id: nextExercise.id
      },
      data: {
        actualSets: newSetCount
      }
    })

    // Generate new sets
    const newSets = [];
  
    for (let index = 0; index < newSetCount; index++) {
      const prevSet = completedExercise.sets[index];
      const recommendedWeight = prevSet
        ? Math.ceil(prevSet.weight * 1.01)
        : 0;
      const recommendedReps = prevSet ? prevSet.reps + 1 : 0;
  
      const setData = {
        excerciseId: nextExercise.id,
        weight: 0,
        reps: 0,
        setNo: index + 1,
        recommendedWeight,
        recommendedReps,
      };
  
      const createdSet = await prisma.set.create({ data: setData });
      newSets.push(createdSet);
    }
  
    // Update the nextExercise object
    nextExercise.sets = newSets;
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

//Algorithm for autoregulation

  async function determineNewSetCount(completedExercise) {
    console.log('COMPLETED EXERCISE', completedExercise);
  
    const weights = {
      soreness: 0.3,
      jointpain: 0.4,
      workload: 0.3,
    };
  
    const maxRating = 3; // Maximum rating for each factor
    const scalingFactor = 2; // Adjusts the overall impact on additionalSets
  
    // Normalize the ratings to a 0-1 scale
    const normalizedSoreness = completedExercise.autoRegulator.soreness / maxRating;
    const normalizedJointPain = completedExercise.autoRegulator.jointpain / maxRating;
    const normalizedWorkload = completedExercise.autoRegulator.workload / maxRating;
  
    // Calculate weighted adjustments for each factor
    let additionalSets =
      ((0.5 - normalizedSoreness) * weights.soreness +
        (0.5 - normalizedJointPain) * weights.jointpain +
        (0.5 - normalizedWorkload) * weights.workload) *
      scalingFactor;
  
    // Round the additionalSets to the nearest integer
    additionalSets = Math.round(additionalSets);
  
    // Calculate the new set count
    let newSetCount = completedExercise.actualSets + additionalSets;
  
    // Ensure newSetCount is at least 1
    newSetCount = Math.max(newSetCount, 1);
  
    return newSetCount;
  }
  
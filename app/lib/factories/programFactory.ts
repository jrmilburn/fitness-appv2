// lib/programFactory.js
import { prisma } from '../prisma';

export async function determineUserId(userEmail) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  return user.id;
}

export function processProgramData(program) {
  const weeks = program.weeks;
  const totalWeeks = weeks.length;

  weeks.forEach((week, weekIndex) => {
    const repsInReserve =
      weekIndex === totalWeeks - 1
        ? 8
        : 3 - Math.floor((3 * weekIndex) / (totalWeeks - 1));

    week.repsInReserve = repsInReserve;

    week.workouts.forEach((workout) => {
      workout.excercises.forEach((excercise) => {
        let setCount;

        //Handle generation for cardio excercises 

        if(excercise.muscle === "Cardio") {

          if (excercise.trainingType === "LISS") {
            // LISS: single continuous set, no cycles
            setCount = 1;
            const sets = [
              {
                activityTime: excercise.activityTime,
                restTime: excercise.restTime
              }
            ];
            Object.assign(excercise, {
              setCount,
              sets
            });
          } else {
            // HIIT or MISS: one set per cycle
            const cycleCount = excercise.cycles || 0;
            setCount = cycleCount;

            console.log('SET COUNT', setCount);

            const sets = Array.from({ length: setCount }, () => ({
              activityTime: excercise.activityTime,
              restTime: excercise.restTime
            }));

            console.log('SETS', sets);
            Object.assign(excercise, {
              setCount,
              sets
            });
          }

        } else {

          if (excercise.setProgression === 'auto' && weekIndex > 0) {
            // For weeks beyond the first, exercises with 'auto' progression have no sets
            setCount = 0;
          } else if (totalWeeks <= 1 || excercise.setProgression === 'none') {
            // If there is only 1 week or progression is 'none', use startSets
            setCount = excercise.startSets;
          } else if (excercise.setProgression === 'auto') {
            // For the first week, exercises with 'auto' progression use startSets
            setCount = excercise.startSets;
          } else if (weekIndex === totalWeeks - 1) {
            // Last week has startSets
            setCount = excercise.startSets;
          } else {
            // Progression weeks from week 0 to second-to-last week
            const progressionWeeks = totalWeeks - 1;
            const step = weekIndex; // weekIndex ranges from 0 to totalWeeks - 2
            const totalSteps = progressionWeeks - 1;
  
            if (totalSteps === 0) {
              // Only one progression week
              setCount = excercise.endSets;
            } else {
              setCount =
                excercise.startSets +
                Math.round(
                  ((excercise.endSets - excercise.startSets) * step) / totalSteps
                );
            }
          }
  
          const sets = Array.from({ length: setCount }, () => ({
            reps: 0,
            weight: 0,
          }));
  
          Object.assign(excercise, {
            setCount,
            sets,
          });

        }
      });
    });
  });

  return program;
}





export async function saveProgram(program, userId, setAsCurrentProgram = true) {
  const { name, length, days, weeks } = program;

  const createdProgram = await prisma.program.create({
    data: {
      name,
      length,
      days,
      userId,
    },
  });

  for (const [weekIndex, week] of weeks.entries()) {
    const createdWeek = await prisma.week.upsert({
      where: {
        programId_weekNo: {
          programId: createdProgram.id,
          weekNo: weekIndex + 1,
        },
      },
      update: {
        updatedAt: new Date(),
        repsInReserve: week.repsInReserve,
      },
      create: {
        weekNo: weekIndex + 1,
        programId: createdProgram.id,
        repsInReserve: week.repsInReserve,
      },
    });

    for (const [workIndex, workout] of week.workouts.entries()) {
      const createdWorkout = await prisma.workout.upsert({
        where: {
          weekId_name: {
            weekId: createdWeek.id,
            name: workout.name,
          },
        },
        update: {
          updatedAt: new Date(),
        },
        create: {
          name: workout.name,
          weekId: createdWeek.id,
          workoutNo: workIndex + 1,
        },
      });

      for (const [excerciseIndex, excercise] of workout.excercises.entries()) {

        // Ensure the MuscleGroup exists or create it if necessary
        const muscleGroupName = excercise.muscle || excercise.muscleGroup?.name;
        const muscleGroup = await prisma.muscleGroup.upsert({
          where: { name: muscleGroupName },
          update: {},
          create: { name: muscleGroupName },
        });

        // Check for existing exercise with non-null `details`
        const existingExercise = await prisma.excercise.findFirst({
          where: {
            name: excercise.name,
            muscleGroupId: muscleGroup.id,
            details: { not: null },
          },
        });

        // Prepare exercise details, including the correct excerciseNo
        const excerciseDetails = {
          name: excercise.name,
          workoutId: createdWorkout.id,
          muscleGroupId: muscleGroup.id,
          details: existingExercise?.details || null,
          startSets: excercise.startSets,
          endSets: excercise.endSets,
          actualSets: excercise.startSets,
          progressionType: excercise.setProgression,
          trainingType: excercise.trainingType,
          excerciseNo: excerciseIndex + 1, // Use the index + 1 for excerciseNo
        };

        const createdExcercise = await prisma.excercise.upsert({
          where: {
            workoutId_name: {
              workoutId: createdWorkout.id,
              name: excercise.name,
            },
          },
          update: {
            ...excerciseDetails,
            updatedAt: new Date(),
          },
          create: excerciseDetails,
        });

        // Add Sets to the Exercise
        for (const [setIndex, set] of excercise.sets.entries()) {
          await prisma.set.create({
            data: {
              excerciseId: createdExcercise.id,
              weight: set.weight,
              reps: set.reps,
              activity: set.activityTime,
              rest: set.restTime,
              setNo: setIndex + 1,
            },
          });
        }
      }
    }
  }

    if (setAsCurrentProgram) {
      // Update user's currentProgramId
      await prisma.user.update({
        where: { id: userId },
        data: { currentProgramId: createdProgram.id },
      });
  
        const firstWeek = weeks.find((week) => week.weekNo === 1 || week.weekNumber === 1);

      const newWeek = await prisma.week.update({
        where: {
          programId_weekNo: {
            programId: createdProgram.id,
            weekNo: firstWeek.weekNo || firstWeek.weekNumber,
          },
        },
        data: {
          currentWorkoutId: firstWeek.workouts[0].id,
        },
        include: {
          workouts: true,
        },
      });
  
      await prisma.program.update({
        where: { id: createdProgram.id },
        data: { currentWeekId: newWeek.id },
      });
    }
  
    return createdProgram;
  }

// lib/programFactory.js
export async function getUserPrograms(userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
  
    const programs = await prisma.program.findMany({
      where: { userId: user.id },
      include: {
        weeks: {
          include: {
            workouts: {
              include: {
                excercises: {
                  include: { muscleGroup: true },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    });
  
    return programs;
  }


  export function handleMoveUp(index, prevProgram, workoutIndex) {
    if (index <= 0) return prevProgram; // Can't move the first item up
  
    // Deep clone the program and update all weeks
    const updatedProgram = {
      ...prevProgram,
      weeks: prevProgram.weeks.map((week) => {
        const updatedWorkouts = week.workouts.map((workout, wIndex) => {
          if (wIndex === workoutIndex) {
            // Clone the exercises array
            const updatedExcercises = [...workout.excercises];
  
            // Swap the exercises
            [updatedExcercises[index - 1], updatedExcercises[index]] = [
              updatedExcercises[index],
              updatedExcercises[index - 1],
            ];
  
            return {
              ...workout,
              excercises: updatedExcercises,
            };
          }
          return workout; // Return unchanged workouts
        });
  
        return {
          ...week,
          workouts: updatedWorkouts,
        };
      }),
    };
  
    return updatedProgram;
  }
  

  export function handleMoveDown(index, prevProgram, workoutIndex, excercises) {
    if (index >= excercises.length - 1) return prevProgram; // Can't move the last item down
  
    // Deep clone the program and update all weeks
    const updatedProgram = {
      ...prevProgram,
      weeks: prevProgram.weeks.map((week) => {
        const updatedWorkouts = week.workouts.map((workout, wIndex) => {
          if (wIndex === workoutIndex) {
            // Clone the exercises array
            const updatedExcercises = [...workout.excercises];
  
            // Swap the exercises
            [updatedExcercises[index], updatedExcercises[index + 1]] = [
              updatedExcercises[index + 1],
              updatedExcercises[index],
            ];
  
            return {
              ...workout,
              excercises: updatedExcercises,
            };
          }
          return workout; // Return unchanged workouts
        });
  
        return {
          ...week,
          workouts: updatedWorkouts,
        };
      }),
    };
  
    return updatedProgram;
  }
  

  
  
  
  

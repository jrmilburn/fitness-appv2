// lib/programFactory.js
import { prisma } from '../prisma';

export async function determineUserId(userEmail, programUserId) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!programUserId) {
    return user?.id;
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@jfit.com.au' },
  });

  return adminUser.id === programUserId ? user.id : programUserId;
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

        console.log('EXCERCISE DATA: ', excercise);

        if (totalWeeks <= 1 || excercise.setProgression === 'none') {
          // If there is only 1 week, use startSets
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
  
        for (const excercise of workout.excercises) {
          console.log('EXCERCISE DATA: ', excercise);
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
  
          const excerciseDetails = {
            name: excercise.name,
            workoutId: createdWorkout.id,
            muscleGroupId: muscleGroup.id,
            details: existingExercise?.details || null,
            startSets: excercise.startSets,
            endSets: excercise.endSets,
            progressionType: excercise.progressionType

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

      console.log('FIRST WEEK: ', firstWeek);

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
  
  
  
  

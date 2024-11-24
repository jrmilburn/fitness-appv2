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
  
    weeks.forEach((week, weekIndex) => {
      const totalWeeks = weeks.length;
  
      const setCount =
        weekIndex === 0 || weekIndex === totalWeeks - 1
          ? 2
          : 2 + Math.floor((2 * weekIndex) / (totalWeeks - 2));
  
      const repsInReserve =
        weekIndex === totalWeeks - 1
          ? 8
          : 3 - Math.floor((3 * weekIndex) / (totalWeeks - 2));
  
      week.repsInReserve = repsInReserve;
  
      week.workouts.forEach((workout) => {
        workout.excercises.forEach((excercise) => {
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
  
      // Set currentWeekId and currentWorkoutId
      const firstWeek = weeks[0];
      const newWeek = await prisma.week.update({
        where: {
          programId_weekNo: {
            programId: createdProgram.id,
            weekNo: 1,
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
  
  
  
  

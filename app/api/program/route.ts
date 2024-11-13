import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';  
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';

export async function POST(req) {
  console.log('REQUEST FOR PROGRAM POST: ', req.body);

  const userSession = await getServerSession(authOptions);
  const userEmail = userSession?.user.email;

  const program = await req.json();
  const weeks = program.weeks;
  
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    }
  });
  const userId = user?.id;

  // Calculate set counts and reps in reserve once
  weeks.forEach((week, weekIndex) => {
    const totalWeeks = weeks.length;
    const setCount = (weekIndex === 0 || weekIndex === totalWeeks - 1)
      ? 2
      : 2 + Math.floor((2 * weekIndex) / (totalWeeks - 2));
    const repsInReserve = (weekIndex === totalWeeks - 1)
      ? 8
      : 3 - Math.floor((3 * weekIndex) / (totalWeeks - 2));
    week.repsInReserve = repsInReserve;

    week.workouts.forEach((workout) => {
      workout.excercises.forEach((excercise, index) => {
        const sets = Array.from({ length: setCount }, () => ({
          reps: 0,
          weight: 0,
        }));
        workout.excercises[index] = { ...excercise, setCount, sets };
      });
    });
  });

  try {
    const createdProgram = await prisma.program.create({
      data: {
        name: program.name,
        length: program.length,
        days: program.days,
        userId: userId,
      }
    });

    // Insert weeks in parallel
    const createdWeeks = await Promise.all(weeks.map((week, weekIndex) => 
      prisma.week.upsert({
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
      })
    ));

    for (const [weekIndex, createdWeek] of createdWeeks.entries()) {
      const week = weeks[weekIndex];
      
      const createdWorkouts = await Promise.all(week.workouts.map((workout, workIndex) =>
        prisma.workout.upsert({
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
        })
      ));

      for (const [workIndex, createdWorkout] of createdWorkouts.entries()) {
        const workout = week.workouts[workIndex];
        
        await Promise.all(workout.excercises.map(async (excercise) => {
          const muscleGroup = await prisma.muscleGroup.upsert({
            where: { name: excercise.muscle },
            update: {},
            create: { name: excercise.muscle },
          });

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

          // Insert sets in a batch
          const setsData = excercise.sets.map((set, setIndex) => ({
            excerciseId: createdExcercise.id,
            weight: set.weight,
            reps: set.reps,
            setNo: setIndex + 1,
          }));
          await prisma.set.createMany({
            data: setsData,
          });
        }));
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { currentProgramId: createdProgram.id },
    });

    const newWeek = await prisma.week.update({
      where: {
        programId_weekNo: {
          programId: createdProgram.id,
          weekNo: weeks[0].weekNumber,
        }
      },
      data: {
        currentWorkoutId: weeks[0].workouts[0].id,
      },
      include: {
        workouts: true,
      }
    });

    const newProgram = await prisma.program.update({
      where: { id: createdProgram.id },
      data: { currentWeekId: newWeek.id },
    });

    console.log(newProgram, newWeek);
    return NextResponse.json(createdProgram);
  } catch (error) {
    console.error('Error saving program:', error);
    return new NextResponse('error saving the program');
  }
}

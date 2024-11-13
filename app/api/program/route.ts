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
  })

  const userId = user?.id;

  console.log(userId);
  
  weeks.forEach((week, weekIndex) => {
    const totalWeeks = weeks.length; // Get the total number of weeks
  
    const setCount = (weekIndex === 0 || weekIndex === totalWeeks - 1)
      ? 2
      : 2 + Math.floor((2 * weekIndex) / (totalWeeks - 2));
  
    const repsInReserve = (weekIndex === totalWeeks - 1)
      ? 8
      : 3 - Math.floor((3 * weekIndex) / (totalWeeks - 2));
  
    // Add repsInReserve to the week object
    week.repsInReserve = repsInReserve;
  
    week.workouts.forEach((workout) => {
      workout.excercises.forEach((excercise, index) => {
        const sets = Array.from({ length: setCount }, () => ({
          reps: 0,
          weight: 0,
        }));
  
        workout.excercises[index] = {
          ...excercise,
          setCount: setCount,  // Set the calculated setCount
          sets: sets,          // Assign the generated sets array
        };
      });
    });
  });
  
  try {
    // Create or update the Program
    const createdProgram = await prisma.program.create({
      data: {
        name: program.name,
        length: program.length,
        days: program.days,
        userId: userId,
      }
    });
  
    for (const [weekIndex, week] of weeks.entries()) {
      // Create or update Week, including repsInReserve
      const createdWeek = await prisma.week.upsert({
        where: {
          programId_weekNo: {
            programId: createdProgram.id,
            weekNo: weekIndex + 1,
          },
        },
        update: {
          updatedAt: new Date(),
          repsInReserve: week.repsInReserve,  // Update repsInReserve
        },
        create: {
          weekNo: weekIndex + 1,
          programId: createdProgram.id,
          repsInReserve: week.repsInReserve,  // Set repsInReserve
        },
      });
  
      for (const [workIndex, workout] of week.workouts.entries()) {
        // Create or update Workout
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
          console.log(excercise);
  
          // Ensure the MuscleGroup exists or create it if necessary
          const muscleGroup = await prisma.muscleGroup.upsert({
            where: { name: excercise.muscle },
            update: {},
            create: { name: excercise.muscle },
          });
  
          // Make sure to check for existing exercise with non-null `details`
          const existingExercise = await prisma.excercise.findFirst({
            where: {
              name: excercise.name,
              muscleGroupId: muscleGroup.id,
              details: { not: null },
            },
          });

          // Prepare exercise details, explicitly setting each field to match the schema
          const excerciseDetails = {
            name: excercise.name,
            workoutId: createdWorkout.id,
            muscleGroupId: muscleGroup.id,
            details: existingExercise?.details || null,
          };

          // Use upsert with the correct fields
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
  
          // Add Sets to the Excercise
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
  
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currentProgramId: createdProgram.id,
      }
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
      where: {
        id: createdProgram.id,
      },
      data: {
        currentWeekId: newWeek.id,
      }
    });
  
    console.log(newProgram, newWeek);
  
    return NextResponse.json(createdProgram);
  } catch (error) {
    console.error('Error saving program:', error);
    return new NextResponse('error saving the program');
  }
}
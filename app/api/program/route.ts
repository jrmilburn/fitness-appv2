import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';  
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';


export async function POST(req) {

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
  
  weeks[0].workouts.forEach(workout => {
      workout.excercises.forEach((excercise, index) => {
          workout.excercises[index] = {
              ...excercise,
              setCount: 2,
              sets: [
                  { reps: 0, weight: 0 },
                  { reps: 0, weight: 0 }
              ]
          };
      });
  });
  
  try {
    // Create or update the Program
    const createdProgram = await prisma.program.create({
      data: {
        name: program.name,
        length: program.length,
        days: program.days,
        userId: userId
    }});
  
    for (const [weekIndex, week] of weeks.entries()) {
      // Create or update Week
      const createdWeek = await prisma.week.upsert({
        where: {
          programId_weekNo: {
            programId: createdProgram.id,
            weekNo: weekIndex + 1,
          },
        },
        update: {
          updatedAt: new Date(),
        },
        create: {
          weekNo: weekIndex + 1,
          programId: createdProgram.id,
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
            workoutNo: workIndex + 1
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
  
          // Create or update Excercise
          const createdExcercise = await prisma.excercise.upsert({
            where: {
              workoutId_name: {
                workoutId: createdWorkout.id,
                name: excercise.excercise,
              },
            },
            update: {
              updatedAt: new Date(),
            },
            create: {
              name: excercise.excercise,
              workoutId: createdWorkout.id,
              muscleGroupId: muscleGroup.id,
            },
          });
  
          // Add Sets to the Excercise
          for (const [setIndex, set] of excercise.sets.entries()) {
            await prisma.set.create({
              data: {
                excerciseId: createdExcercise.id,
                weight: set.weight,
                reps: set.reps,
                setNo: setIndex + 1
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
    })

    const newWeek = await prisma.week.update({
      where: {
        programId_weekNo:{
          programId: createdProgram.id,
          weekNo: weeks[0].weekNumber
        }
      },
      data: {
        currentWorkoutId: weeks[0].workouts[0].id
      },
      include: {
        workouts: true
      }
    })

    const newProgram = await prisma.program.update({
      where: {
        id: createdProgram.id
      },
      data: {
        currentWeekId: newWeek.id
      }
    })

    console.log(newProgram, newWeek);
  
    return NextResponse.json(createdProgram);
  } catch (error) {
    console.error('Error saving program:', error);
    return new NextResponse('error saving the program');
  }
}
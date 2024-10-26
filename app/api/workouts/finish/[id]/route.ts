import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { weekId } = await req.json();


  try {

    const workout = await prisma.workout.update({
        where: {
            id: id
        },
        data: {
            completed: true
        }
    })

    const week = await prisma.week.findUnique({
      where: {
        id: weekId
      },
      include: {
        workouts: true
      }
    })

    if (week && week.workouts.every(workout => workout.completed === true)) {
      console.log("All workouts for the week are completed!");

      const completedWeek = await prisma.week.update({
        where: {
          id: weekId
        },
        data: {
          completed: true
        }
      })

      if(completedWeek){
        console.log(completedWeek);
      }

    } else {
      console.log("There are still incomplete workouts in the week.");
    }


    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user.email;

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })

    const nextWorkout = await findNextWorkout(userEmail);

    const updateUserProgram = await prisma.program.update({
      where: {
        id: user?.currentProgramId
      },
      data: {
        currentWeekId: nextWorkout.weekId
      }
    })

    const updateUserWeek = await prisma.week.update({
      where: {
        id: nextWorkout.weekId
      },
      data: {
        currentWorkoutId: nextWorkout.id
      }
    })

    console.log('UPDATE PROGRAM', updateUserProgram);
    console.log('UPDATE WEEK: ', updateUserWeek);

    // If no exercise is found, return 404
    if (!workout) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json(workout);  // Return the exercise as JSON
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return new NextResponse('Failed to fetch exercise', { status: 500 });
  }
}

async function findNextWorkout(userEmail) {

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    }
  })

  const userProgram = await prisma.program.findUnique({
    where: {
      id: user?.currentProgramId
    },
    include: {
      weeks: {
        include: {
          workouts: true
        }
      }
    }
  })

  let firstIncompleteWorkout = null;

  for (let i = 0; i < userProgram?.weeks?.length; i++ ) {

    const week = userProgram.weeks.find(week => week.weekNo === i+1);
    firstIncompleteWorkout = week.workouts.find(workout => workout.completed === false);

    if(firstIncompleteWorkout){
      break;
    }

  }

  return firstIncompleteWorkout;


    
}

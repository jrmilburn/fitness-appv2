import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';  
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {

    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user.email;

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })

    const currentProgram = await prisma.program.findUnique({
        where: {
            id: user?.currentProgramId
        }
    })

    console.log('CURRENT PROGRAM: ', currentProgram);

    const currentWeek = await prisma.week.findUnique({
        where: {
            id: currentProgram?.currentWeekId
        },
        include: {
            workouts: true
        }
    })

    console.log('CURRENT WEEK: ', currentWeek);

    if (!currentWeek?.currentWorkoutId) {
        await prisma.week.update({
            where: {
                id: currentWeek?.id
            },
            data: {
                currentWorkoutId: currentWeek?.workouts[0]?.id
            }
        })
    }

    const currentWorkout = await prisma.workout.findUnique({
        where: {
            id: currentWeek?.currentWorkoutId
        },
        include: {
            excercises: {
                include: {
                    sets: true
                }
            }
        }
    })

    console.log('CURRENT WORKOUT: ', currentWorkout);

    return NextResponse.json(currentWorkout);

}
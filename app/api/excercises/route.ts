import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';  // Adjust the path to your prisma file

// GET method to handle fetching muscle groups
export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const muscle = searchParams.get('muscle');

    console.log(muscle);

    try {
        const excercises = await prisma.excercise.findMany({
            where: {
                id: muscle
            }
        });
        return NextResponse.json(excercises);  // Return the muscle groups as JSON
    } catch (error) {
        console.error('Error fetching musclegroups:', error);
        return new NextResponse('Failed to fetch musclegroups', { status: 500 });
    }
}

export async function POST(req) {

    const { muscleId, excercise, workoutId } = await req.json();

    const existingExercise = await prisma.excercise.findFirst({
        where: {
          name: excercise,
          muscleGroupId: muscleId,
          details: { not: null },
        },
      });

      const excerciseDetails = {
        name: excercise,
        workoutId: workoutId,
        muscleGroupId: muscleId,
        details: existingExercise?.details || null,
      };

      const createdExcercise = await prisma.excercise.upsert({
        where: {
            workoutId_name: {
                workoutId: workoutId,
                name: excercise,
            },
        },
        update: {
            ...excerciseDetails,
            updatedAt: new Date(),
        },
        create: {
            ...excerciseDetails,
        },
    });
    
    await prisma.set.createMany({
        data: [
            {
                excerciseId: createdExcercise.id,
                setNo: 1,
                weight: 0,
                reps: 0,
            },
            {
                excerciseId: createdExcercise.id,
                setNo: 2,
                weight: 0,
                reps: 0,
            },
        ],
    });
    
    const exerciseWithSets = await prisma.excercise.findUnique({
        where: { id: createdExcercise.id },
        include: {
            sets: true,  
        },
    });
    
    return NextResponse.json(exerciseWithSets);

}
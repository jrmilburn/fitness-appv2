import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';  // Adjust the path to your prisma file

export async function POST(req) {

  const { excerciseId, weight, reps, setNo, completed } = await req.json();

  try {

    const set = await prisma.set.create({
        data: {
            excerciseId: excerciseId,
            weight: weight,
            reps: reps,
            setNo: setNo,
            completed: completed
        }
    })

    console.log('NEW SET: ', set);

    if (!set) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json(set);  // Return the exercise as JSON
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return new NextResponse('Failed to fetch exercise', { status: 500 });
  }
}

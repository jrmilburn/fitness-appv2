import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const user = await prisma.user.findUnique({
    where: {
      email: 'admin@jfit.com.au',
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const programs = await prisma.program.findMany({
    where: {
      userId: user.id,
    },
    include: {
      weeks: {
        include: {
          workouts: {
            include: {
              excercises: {
                include: {
                  muscleGroup: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return NextResponse.json(programs);
}
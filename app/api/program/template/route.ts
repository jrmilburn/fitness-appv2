import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

export async function GET() {

  const userSession = await getServerSession(authOptions);
  const userEmail = userSession?.user.email;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    },
    select: {
      role: true
    }
  })

  const premiumUser = user.role === "PREMIUM" ? true : false;

  const adminUser = await prisma.user.findUnique({
    where: {
      email: 'admin@jfit.com.au',
    },
  });

  if (!adminUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const programs = await prisma.program.findMany({
    where: {
      userId: adminUser.id,
      isPremium: premiumUser
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
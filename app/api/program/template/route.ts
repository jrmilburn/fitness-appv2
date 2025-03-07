import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

export async function GET() {
  const userSession = await getServerSession(authOptions);
  const userEmail = userSession?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: 'User not logged in' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { role: true }
  });

  // Check if user exists
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const premiumUser = user.role === 'PREMIUM';

  // Fetch admin user (the template owner)
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@jfit.com.au' }
  });

  if (!adminUser) {
    return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
  }

  // Construct the 'where' clause conditionally
  const whereClause = {
    userId: adminUser.id,
    ...(premiumUser ? {} : { isPremium: false })
  };

  const programs = await prisma.program.findMany({
    where: whereClause,
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

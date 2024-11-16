import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { prisma } from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const userSession = await getServerSession(authOptions);

  const userEmail = userSession?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const notifications = await prisma.coachingRequest.findMany({
    where: {
          coachId: user.id,
    },
    include: {
      client: true,
    },
  });

  return NextResponse.json(notifications);
}
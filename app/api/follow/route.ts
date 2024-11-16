import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { toUserId } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fromUserId = session.user.id;

    if (!fromUserId || !toUserId) {
      return NextResponse.json({ error: 'Missing user information' }, { status: 400 });
    }

    // Check if the follow relationship already exists
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ error: 'Follow relationship already exists' }, { status: 400 });
    }

    // Create the follow relationship
    const follow = await prisma.userFollow.create({
      data: {
        fromUserId,
        toUserId,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    console.error('Error creating follow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

// POST handler
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const userSession = await getServerSession(authOptions);

  if (!userSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = userSession.user.email;

  const follower = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!follower) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const follow = await prisma.userFollow.create({
      data: {
        fromUserId: follower.id,
        toUserId: id,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const userSession = await getServerSession(authOptions);

  if (!userSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = userSession.user.email;

  const follower = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!follower) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const deleteFollow = await prisma.userFollow.delete({
      where: {
        fromUserId_toUserId: {
          fromUserId: follower.id,
          toUserId: id,
        },
      },
    });

    return NextResponse.json(deleteFollow, { status: 200 });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
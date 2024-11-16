import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server';

export async function POST({ params }) {

    const { id } = params;

    const followee = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user.email;
  
    const follower = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })

    try {

        const follow = await prisma.userFollow.create({
            data: {
                fromUserId: follower.id,
                toUserId: followee.id
            }
        })

        NextResponse.json(follow)
    } catch (error) {
        console.error('Error following user:', error);
    }
  
}

export async function DELETE({ params }) {

    const { id } = params;

    const followee = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user?.email;

    const follower = await prisma.user.findUnique({
        where: {
            email: userEmail
        }
    })

    const deleteFollow = await prisma.userFollow.delete({
        where: {
            fromUserId_toUserId: {
                fromUserId: follower.id,
                toUserId: followee.id
            }
        }
    })

    NextResponse.json(deleteFollow);

}
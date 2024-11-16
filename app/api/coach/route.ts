import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { prisma } from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {

    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user?.email;

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    const notifications = await prisma.coachingRequest.findMany({
        where: {
            coachId: user.id,
            status: 'PENDING'
        },
        include: {
            client: true,
        }
    })

    return NextResponse.json(notifications);

}
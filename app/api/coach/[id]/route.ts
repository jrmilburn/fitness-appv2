import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
    const { id } = params;
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = userSession?.user?.email;

    try {
        const client = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Check if the coaching request already exists
        const existingRequest = await prisma.coachingRequest.findUnique({
            where: {
                clientId_coachId: {
                    clientId: client.id,
                    coachId: id,
                },
            },
        });

        if (existingRequest) {
            return NextResponse.json({ error: 'Request already exists' }, { status: 400 });
        }

        // Create a new coaching request
        const coachingRequest = await prisma.coachingRequest.create({
            data: {
                clientId: client.id,
                coachId: id,
                status: 'PENDING',
                message: req.body.message || null, // Optional message from the client
            },
        });

        return NextResponse.json(coachingRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating coaching request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    const { id } = params; // Coaching request ID
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = userSession?.user?.email;

    try {
        const coach = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!coach) {
            return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
        }

        const { status } = await req.json();

        if (!['ACCEPTED', 'DECLINED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Update the coaching request
        const updatedRequest = await prisma.coachingRequest.update({
            where: { id },
            data: { status },
        });

        if (status === 'ACCEPTED') {
            // Create a UserCoach relation if the request is accepted
            await prisma.userCoach.create({
                data: {
                    clientUserId: updatedRequest.clientId,
                    coachUserId: updatedRequest.coachId,
                },
            });
        }

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error('Error updating coaching request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params; // Coaching request ID
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const deletedRequest = await prisma.coachingRequest.delete({
            where: { id },
        });

        return NextResponse.json(deletedRequest);
    } catch (error) {
        console.error('Error deleting coaching request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
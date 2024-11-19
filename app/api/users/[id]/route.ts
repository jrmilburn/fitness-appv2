import { prisma } from '../../../lib/prisma';  
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
) {
  const { id } = params;
  const { bodyweight, username } = await req.json();

  try {

    const user = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            username: username
        }
    })

    const newBodyWeight = await prisma.bodyWeight.create({
        data: {
            weight: bodyweight,
            userId: id

        }
    })

    console.log('UPDATED USER: ', user, newBodyWeight);

    if (!user) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return new NextResponse('Failed to fetch exercise', { status: 500 });
  }
}

export async function GET(request, { params }) {
    const { id } = params;

    let users;
    if (id) {
        users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: id, mode: 'insensitive' } },
                    { username: { contains: id, mode: 'insensitive' } },
                    { email: { contains: id, mode: 'insensitive' } },
                ],
            },
        });
    } else {
        users = await prisma.user.findMany(); // Fetch all users if no search query is provided
    }

    return new Response(JSON.stringify(users), { status: 200 });
}
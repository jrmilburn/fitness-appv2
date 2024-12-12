import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';  // Adjust the path to your prisma file
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
) {
  const { id } = params;

  const userSession = await getServerSession(authOptions);
  const userEmail = userSession?.user.email;
  const user = await prisma.user.findUnique({
    where: {
        email: userEmail
    }
  })


  const dailyLog = await prisma.dailyLog.findUnique({
    where: {
      dateId_userId: {
        dateId: id, // Example: 24th October 2024
        userId: user.id,
      },
    },
    include: {
      foods: true, // Include related foods
    },
  });

  return NextResponse.json(dailyLog);
}

export async function POST(  req: Request,
    { params }: { params: { id: string } }  // Destructure params to get the `id`
  ) {
    const { id } = params;

    const { name, carbohydratesPerServe,
        proteinPerServe,
        fatPerServe,
        caloriesPerServe,
        quantity,
        unit } = await req.json();
  

    const newFood = await prisma.food.create({
        data: {
            dailylogId: id,
            name: name,
            carbohydratesPerServe: carbohydratesPerServe,
            proteinPerServe: proteinPerServe,
            fatPerServe: fatPerServe,
            caloriesPerServe: caloriesPerServe,
            quantity: quantity,
            unit: unit

        }
    })

    return NextResponse.json(newFood);
}

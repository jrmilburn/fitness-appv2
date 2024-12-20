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

    const { name, carbohydratesPer100,
        proteinPer100,
        fatPer100,
        energyPer100,
        quantity,
        unit } = await req.json();
  

    const newFood = await prisma.food.create({
        data: {
            dailylogId: id,
            name: name,
            carbohydratesPer100: carbohydratesPer100,
            proteinPer100: proteinPer100,
            fatPer100: fatPer100,
            energyPer100: energyPer100,
            quantity: quantity,
            unit: unit

        }
    })

    return NextResponse.json(newFood);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }  // Destructure params to get the `id`
)  {

  const { id } = params;

  const deleteFood = await prisma.food.delete({
    where:{
      id
    }
  })

  return NextResponse.json(deleteFood);

}

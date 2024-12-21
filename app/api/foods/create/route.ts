import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;
    const user = await prisma.user.findUnique({
        where: {
            email: userEmail
        }
    })


    try {

    const { name, protein, fat, carbohydrates,  } = await req.json();


        const energy = (protein * 4 + fat * 9 + carbohydrates * 4) * 4.18;

        const newFood = await prisma.food.create({
            data: {
                name: name,
                proteinPer100: protein,
                fatPer100: fat,
                carbohydratesPer100: carbohydrates,
                energyPer100: energy,
                custom: true,
                createdById: user.id
            }
        });


        return NextResponse.json(newFood);




    } catch(err) {

        return NextResponse.json(err);

    }

}

export async function GET() {

    try {

    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;
    const user = await prisma.user.findUnique({
        where: {
            email: userEmail
        },
    })

    const foods = await prisma.food.findMany({
        where: {
            custom: true,
            createdById: user.id
        }
    })

        return NextResponse.json(foods);

    } catch(err) {
        return NextResponse.json(err);
    }

}
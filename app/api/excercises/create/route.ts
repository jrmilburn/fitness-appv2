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

    const { name, workoutId, muscleGroupId,  } = await req.json();

        const newExcercise = await prisma.excercise.create({
            data: {
                name: name,
                muscleGroupId: muscleGroupId,
                custom: true,
                createdById: user.id
            }
        });

        if(workoutId) {

            const newCurrentExcercise = await prisma.excercise.create({
                data: {
                    name: name,
                    workoutId: workoutId,
                    muscleGroupId: muscleGroupId,
                    custom: true,
                    createdById: user.id
                }
            });

            await prisma.set.create({
                data: {
                    setNo: 1,
                    excerciseId: newCurrentExcercise.id
                }
            })

            await prisma.set.create({
                data: {
                    setNo: 2,
                    excerciseId: newCurrentExcercise.id
                }
            })
        
        }

        return NextResponse.json(newExcercise);




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
        include: {
            excercises: true
        }
    })

        return NextResponse.json(user.excercises);

    } catch(err) {
        return NextResponse.json(err);
    }

}
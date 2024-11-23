import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    const session = await getServerSession(authOptions);
    const userId = session.user.id;

    try {

    const { name, workoutId, muscleGroupId,  } = await req.json();

    console.log('CREATE EXCERCISE: ', name, workoutId, muscleGroupId);

        const newExcercise = await prisma.excercise.create({
            data: {
                name: name,
                muscleGroupId: muscleGroupId,
                custom: true,
                createdById: userId
            }
        });

        if(workoutId) {

            const newCurrentExcercise = await prisma.excercise.create({
                data: {
                    name: name,
                    workoutId: workoutId,
                    muscleGroupId: muscleGroupId,
                    custom: true,
                    createdById: userId
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

    const session = await getServerSession(authOptions);
    const userId = session.user.id;

    try {

        const customExcercises = await prisma.excercise.findMany({
            where: {
                custom: true,
                createdById: userId
            }
        })

        return NextResponse.json(customExcercises);

    } catch(err) {
        return NextResponse.json(err);
    }

}
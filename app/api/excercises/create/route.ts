import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma'

export async function POST(req: Request) {

    try {

    const { name, workoutId, muscleGroupId,  } = await req.json();

    console.log('CREATE EXCERCISE: ', name, workoutId, muscleGroupId);

        const newExcercise = await prisma.excercise.create({
            data: {
                name: name,
                muscleGroupId: muscleGroupId,
                custom: true
            }
        });

        if(workoutId) {

            const newCurrentExcercise = await prisma.excercise.create({
                data: {
                    name: name,
                    workoutId: workoutId,
                    muscleGroupId: muscleGroupId,
                    custom: true
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

        const customExcercises = await prisma.excercise.findMany({
            where: {
                custom: true
            }
        })

        return NextResponse.json(customExcercises);

    } catch(err) {
        return NextResponse.json(err);
    }

}
import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } } 
  ) {
    const { id } = params;

    const deleteCustomExcercise = await prisma.excercise.delete({
        where: {
            id: id
        }
    })

    return NextResponse.json(deleteCustomExcercise);

}
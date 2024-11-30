// your_module.js

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { soreness, jointpain, workload } = await req.json();

  console.log('ID', id);

  try {
    // Build the data object conditionally
    const data = {
      jointpain,
      workload,
      // Include 'soreness' only if it's not null or undefined
      ...(soreness !== null && soreness !== undefined && { soreness }),
    };

    const autoregulation = await prisma.autoRegulator.create({ data });

    const updatedExcercise = await prisma.excercise.update({
      where: { id },
      data: {
        autoRegulatorId: autoregulation.id,
        autoregulation: true,
      },
    });

    return NextResponse.json(updatedExcercise);

  } catch (err) {
    console.error('Error in POST /autoregulation:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

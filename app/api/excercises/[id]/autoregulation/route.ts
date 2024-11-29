import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(  req: Request,
    { params }: { params: { id: string } }) {
  
      const { id } = params;
      const { soreness, jointpain, workload } = await req.json();
  
        console.log('ID', id);

      try {
  
        const autoregulation = await prisma.autoRegulator.create({
            data: {
                soreness: soreness,
                jointpain: jointpain,
                workload: workload
            }
        })

        const updatedExcercise = await prisma.excercise.update({
            where: {
                id
            },
            data: {
                autoRegulatorId: autoregulation.id,
                autoregulation: true
            }
        })
  
        return NextResponse.json(updatedExcercise);
  
      } catch (err) {
  
        return NextResponse.json(err);
  
      }
  
    }
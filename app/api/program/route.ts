import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import {
  determineUserId,
  processProgramData,
  saveProgram,
  getUserPrograms
} from '../../lib/factories/programFactory'

export async function GET() {
  try {
    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;

    const programs = await getUserPrograms(userEmail);

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return new NextResponse('Error fetching programs', { status: 500 });
  }
}


export async function POST(req) {
  try {
    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;
    const program = await req.json();

    let userId;

    if(program.self) {
      userId = await determineUserId(userEmail);
    } else if (!program.self && program.userId) {
      userId = program.userId;
    } else {
      userId = await determineUserId(userEmail);
    }

    // Process the program data
    const processedProgram = processProgramData(program);

    // Save the program to the database
    const createdProgram = await saveProgram(processedProgram, userId);

    return NextResponse.json(createdProgram);
  } catch (error) {
    console.error('Error saving program:', error);
    return new NextResponse('Error saving the program', { status: 500 });
  }
}
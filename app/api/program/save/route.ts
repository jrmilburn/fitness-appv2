import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import {
  determineUserId,
  processProgramData,
  saveProgram,
} from '../../../lib/factories/programFactory'

// pages/api/program/save.js
export async function POST(req) {
  try {
    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;
    const program = await req.json();

    // Determine the correct userId
    const userId = await determineUserId(userEmail, program.userId);

    // Process the program data
    const processedProgram = processProgramData(program);

    // Save the program without setting it as current
    const createdProgram = await saveProgram(processedProgram, userId, false);

    return NextResponse.json(createdProgram);
  } catch (error) {
    console.error('Error saving program:', error);
    return new NextResponse('Error saving the program', { status: 500 });
  }
}

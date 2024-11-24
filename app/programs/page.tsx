// pages/program.js (Server Component)
import { prisma } from '../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';
import ProgramsList from '../components/Program/ProgramsList';

export default async function Programs() {
    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;

    const user = await prisma.user.findUnique({
        where: {
            email: userEmail,
        },
    });

    const userId = user?.id;
    const userProgramId = user?.currentProgramId;

    const programs = await prisma.program.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc'
        }

    });

  return (
    <main className="max-w-screen-sm mx-auto p-8 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8">Your Programs</h1>
      <ProgramsList initialPrograms={programs} userProgramId={userProgramId}/>
    </main>
  );
}
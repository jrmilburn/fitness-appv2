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
        include: {
          weeks: {
            where: {
              weekNo: 1
            },
            include: {
              workouts: {
                where: {
                  workoutNo: 1
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }

    });

    const completedPrograms = await prisma.program.findMany({
      where: {
        userId,
        completed: true
      },
      include: {
        weeks: {
          where: {
            weekNo: 1
          },
          include: {
            workouts: {
              where: {
                workoutNo: 1
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    

  return (
    <main className="max-w-screen-sm mx-auto">
      <h1 className="text-2xl sm:text-3xl inter text-primary-text p-4">Your Programs</h1>
      <ProgramsList initialPrograms={programs} userProgramId={userProgramId} completed={false}/>
      <h1 className="text-2xl sm:text-3xl inter text-primary-text p-4">Completed Programs</h1>
      <ProgramsList initialPrograms={completedPrograms} userProgramId={null} completed={true}/>
    </main>
  );
}
// pages/program.js (Server Component)
import { prisma } from '../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';
import ProgramsList from '../components/Program/ProgramsList';
import { PlusCircleIcon } from "@heroicons/react/outline";
import Link from 'next/link';
import {LightningBoltIcon} from '@heroicons/react/outline';

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
            completed: false
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

    console.log('TEMPLATSES', programs);
    console.log('COMPLETED', completedPrograms);
    

  return (
    <main className="max-w-screen-sm mx-auto h-100% pb-20 sm:pb-0">
        <div className="flex space-x-4 my-4 justify-center">
          <Link 
            href="/create-program" 
            className="flex items-center px-4 py-2 bg-highlight text-white rounded-md"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            New Program
          </Link>
          <Link 
            href="/workouts/current" 
            className="flex items-center px-4 py-2 bg-highlight text-white rounded-md"
          >
            <LightningBoltIcon className="h-5 w-5 mr-2" />
            Current Workout
          </Link>
        </div>
      <div className="flex w-full justify-between border-b-2 border-border p-4 items-center">
      <h1 className="text-2xl sm:text-3xl inter text-primary-text">Your Programs</h1>
      <button
          className="inter-bold border-2 p-2 hover:bg-background-secondary rounded flex gap-2 text-primary-text"
          
        >
          New <PlusCircleIcon className="h-6 w-6 text-primary-text" />
        </button>
        </div>
      <ProgramsList initialPrograms={programs} userProgramId={userProgramId} completed={false}/>
      <h1 className="text-2xl sm:text-3xl inter text-primary-text p-4">Completed Programs</h1>
      <ProgramsList initialPrograms={completedPrograms} userProgramId={null} completed={true}/>
      <p className='text-secondary-text'>Completed programs cannot be deleted</p>
    </main>
  );
}
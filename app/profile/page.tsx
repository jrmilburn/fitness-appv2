import { prisma } from '../lib/prisma'; 
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import Image from 'next/image';
import ProgramTab from '../components/Program/ProgramTab';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user.email,
        }
    });

    let program = null;

    if (user?.currentProgramId) {
        program = await prisma.program.findUnique({
            where: {
                id: user.currentProgramId
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
        });
    }

    const formattedDate = new Date(program?.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className='max-w-2xl mx-auto w-full h-[80%]'>
            <h1 className='text-3xl m-4'>User Profile</h1>
            <div key={user.id} className='flex flex-col w-full bg-background-secondary rounded p-4'>
                <div className='flex justify-between items-center p-4'>
                    <h2 className='text-2xl'>{user.name}</h2>
                    <Image
                        src={user?.image || '/avatar.svg'}
                        width={64}
                        height={64}
                        className='rounded-full'
                        alt="profile"
                    />
                </div>
                <p className='p-4'>{user.email}</p>
                <h2 className='my-4 text-3xl'>Current Program</h2>
                
                {program ? (
                    <ProgramTab
                        name={user?.name}
                        length={program?.length}
                        days={program?.days}
                        id={program?.id}
                        userProgramId={user?.currentProgramId}
                        created={formattedDate}
                        canDelete={false}
                        completed={false}
                        workoutId={program?.weeks[0]?.workouts[0]?.id}
                    />
                ) : (
                    <p className="text-gray-500 p-4">No current program available.</p>
                )}
            </div>
        </div>
    );
}
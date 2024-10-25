import { prisma } from '../lib/prisma';  // Assuming you're using Prisma
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from 'next/image'
import ProgramTab from '../components/Program/ProgramTab'

export default async function ProfilePage() {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user.email,
        }
    })

    const program = await prisma.program.findUnique({
      where: {
        id: user?.currentProgramId
      }
    })

    console.log('SESSION: ', session);
    console.log('USER: ', user);
    console.log('PROGRAM: ', program);

  return (
    <div className='max-w-2xl mx-auto w-full h-[80%]'>
      <h1 className='text-3xl m-4'>User Profile</h1>
        <div key={user.id} className='flex flex-col w-full bg-gray-100 rounded p-4'>
          <div className='flex justify-between items-center p-4'>
            <h2 className='text-2xl'>{user.name}</h2>
            <Image src={`${session?.user?.image}`} width={64} height={64} className='rounded-full' alt="profile"/>
          </div>
          <p className='p-4'>{user.email}</p>
          <h2 className='my-4 text-3xl'>Current Program</h2>
          <ProgramTab name={user?.name} length={program?.length} days={program?.days} id={program?.id} userProgramId={user?.currentProgramId}/>
        </div>
    </div>
  );
}
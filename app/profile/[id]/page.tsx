import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import Image from 'next/image';
import Link from 'next/link';
import ProgramTab from '../../components/Program/ProgramTab';
import backIcon from '../../assets/back.svg';

export default async function Profile({ params }) {
  const session = await getServerSession(authOptions);

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  });

  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  let program = null;

  if (user?.currentProgramId) {
    program = await prisma.program.findUnique({
      where: {
        id: user.currentProgramId,
      },
    });
  }

  const formattedDate = new Date(program?.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className='max-w-2xl mx-auto w-full h-[80%] relative'>
        <h1 className='text-3xl m-4'>User Profile</h1>
        <div key={user.id} className='flex flex-col w-full bg-gray-100 rounded p-4'>
          <div className='flex flex-col items-center p-4'>
            <Image
              src={user?.image || '/avatar.svg'}
              width={64}
              height={64}
              className='rounded-full'
              alt="profile"
            />
            <h2 className='text-2xl mt-2'>{user.username || user.name}</h2>
            
            {/* Conditionally render buttons if the profile being viewed is not the current user's */}
            {user.id !== currentUser?.id && (
              <div className='flex space-x-4 mt-4'>
                <button className='bg-black text-white rounded-lg p-4 font-bold'>
                  Request Coaching
                </button>
                <button className='bg-black text-white rounded-lg p-4 font-bold'>
                  Follow
                </button>
              </div>
            )}
          </div>
          
          <h2 className='my-4 text-3xl'>Current Program</h2>
          <ProgramTab
            name={user?.name}
            length={program?.length}
            days={program?.days}
            id={program?.id}
            userProgramId={user?.currentProgramId}
            created={formattedDate}
          />
        </div>

        <button className='absolute top-[10%] left-[-20%]'>
          <Link href='/search'>
            <Image src={backIcon} alt='back' />
          </Link>
        </button>
      </div>
    </>
  );
}
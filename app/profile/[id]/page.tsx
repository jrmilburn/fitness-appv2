import { prisma } from '../../lib/prisma'; 
import Image from 'next/image'
import Link from 'next/link'
import ProgramTab from '../../components/Program/ProgramTab'
import backIcon from '../../assets/back.svg'

export default async function Profile({ params }) {

    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    let program = null;

    if (user?.currentProgramId) {
        program = await prisma.program.findUnique({
            where: {
                id: user.currentProgramId
            }
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
              <div className='flex justify-between items-center p-4'>
                <h2 className='text-2xl'>{user.name}</h2>
                <Image src={user?.image || '/avatar.svg'} width={64} height={64} className='rounded-full' alt="profile"/>
              </div>
              <p className='p-4'>{user.email}</p>
              <h2 className='my-4 text-3xl'>Current Program</h2>
                        <ProgramTab name={user?.name} length={program?.length} days={program?.days} id={program?.id} userProgramId={user?.currentProgramId} created={formattedDate}/>
            </div>
            <button className='absolute top-[10%] left-[-20%]'>
                <Link href='/search'>
                    <Image 
                        src={backIcon}
                        alt='back'/>
                </Link>
            </button>
        </div>
    </>
  );
}
import { prisma } from '../../lib/prisma'
import Link from 'next/link'
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';


export default async function DashboardProgram() {
  const userSession = await getServerSession(authOptions);
  const userEmail = userSession?.user.email;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  const program = await prisma.program.findUnique({
    where: {
      id: user.currentProgramId,
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 p-4 rounded-lg border-2 w-full h-full">
        <h2 className='text-3xl font-bold'>Current Program</h2>
      <h2 className="text-xl font-semibold">{program?.name || 'Program Name'}</h2>
      <p className="text-gray-700">Length: {program?.length || 'N/A'} weeks</p>
      <p className="text-gray-700">Days per Week: {program?.days || 'N/A'}</p>
      <p className="text-gray-700">Status: {program?.completed ? 'Completed' : 'In Progress'}</p>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="font-medium text-gray-600">Created At:</div>
        <div className="text-gray-800">{program?.createdAt.toLocaleDateString() || 'N/A'}</div>
        
        <div className="font-medium text-gray-600">Last Updated:</div>
        <div className="text-gray-800">{program?.updatedAt ? program.updatedAt.toLocaleDateString() : 'N/A'}</div>
      </div>
      
      <Link href={`/programs/${program.id}`}>
      <button className="mt-4 px-4 py-2 bg-black font-bold text-white rounded hover:bg-black-600">
        View Program
      </button>
      </Link>
    </div>
  );
}
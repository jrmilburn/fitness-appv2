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
    <div className="flex flex-col gap-4 p-6 bg-gray-100 rounded-lg border-2 w-full h-full">
      <h2 className="text-3xl font-bold text-gray-900">Current Program</h2>

      <div className="text-xl font-semibold text-gray-800">
        {program?.name || 'Program Name'}
      </div>

      <div className="text-lg text-gray-700 space-y-2">
        <p><strong>Length:</strong> {program?.length || 'N/A'} weeks</p>
        <p><strong>Days per Week:</strong> {program?.days || 'N/A'}</p>
        <p><strong>Status:</strong> {program?.completed ? 'Completed' : 'In Progress'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-lg mt-4">
        <div className="font-medium text-gray-600">Created At:</div>
        <div className="text-gray-800">{program?.createdAt.toLocaleDateString() || 'N/A'}</div>
        
        <div className="font-medium text-gray-600">Last Updated:</div>
        <div className="text-gray-800">{program?.updatedAt ? program.updatedAt.toLocaleDateString() : 'N/A'}</div>
      </div>

      <Link href={`/programs/${program.id}`}>
        <button className="mt-6 px-6 py-3 bg-black text-white font-bold rounded hover:bg-gray-800">
          View Program
        </button>
      </Link>
    </div>
  );
}
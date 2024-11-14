import { prisma } from '../../lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

export default async function DashboardUser() {
  const userSession = await getServerSession(authOptions);
  const userEmail = userSession?.user.email;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 p-4 bg-gray-100 rounded-lg border-2 w-full h-full">
      <h2 className="text-3xl font-semibold">{user?.name || 'User Name'}</h2>
      <p className="text-gray-700">Username: {user?.username || 'N/A'}</p>
      <p className="text-gray-700">Email: {user?.email || 'N/A'}</p>
      <p className="text-gray-700">Phone: {user?.phone || 'N/A'}</p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="font-medium text-gray-600">Joined:</div>
        <div className="text-gray-800">{user?.createdAt.toLocaleDateString() || 'N/A'}</div>

        <div className="font-medium text-gray-600">Last Updated:</div>
        <div className="text-gray-800">{user?.updatedAt ? user.updatedAt.toLocaleDateString() : 'N/A'}</div>
      </div>

      {user?.image && (
        <Image
          src={user.image}
          alt="User profile picture"
          className="w-16 h-16 rounded-full mt-4"
        />
      )}

      <Link href='/profile'>
      <button className="mt-4 px-4 py-2 bg-black text-white font-bold rounded hover:bg-black-600">
        Profile
      </button>
      </Link>
    </div>
  );
}
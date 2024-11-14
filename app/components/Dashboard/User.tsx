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
    <div className="grid grid-cols-1 gap-4 p-6 bg-gray-100 rounded-lg border-2 w-full h-full">
      <div className="flex items-center space-x-4">
        {user?.image && (
          <Image
            src={user.image}
            alt="User profile picture"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full"
          />
        )}
        <h2 className="text-3xl font-bold text-gray-900">{user?.name || 'User Name'}</h2>
      </div>
      
      <div className="text-lg text-gray-800 space-y-2">
        <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-lg mt-4">
        <div className="font-medium text-gray-600">Joined:</div>
        <div className="text-gray-800">{user?.createdAt?.toLocaleDateString() || 'N/A'}</div>

      </div>

      <Link href="/profile">
        <button className="mt-6 px-6 py-3 bg-black text-white font-bold rounded hover:bg-gray-800">
          View Profile
        </button>
      </Link>
    </div>
  );
}
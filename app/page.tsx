import DashboardProgram from "./components/Dashboard/Program";
import DashboardWorkout from "./components/Dashboard/CurrentWorkout";
import DashboardUser from "./components/Dashboard/User";
import Image from 'next/image';
import { prisma } from './lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";

export default async function Home() {

  const userSession = await getServerSession(authOptions);
  const userEmail = userSession?.user.email;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      image: true
    }
  });

  return (
    <div className="grid grid-cols-2 grid-rows-2 min-h-screen gap-4 p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full h-full flex items-center justify-center bg-white rounded-lg border-2">
        {user?.image ? (
          <Image
            src={user.image}
            alt="User profile picture"
            width={240}
            height={240}
            className="rounded-full"
          />
        ) : (
          <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      
      <div className="w-full h-full">
        <DashboardWorkout />
      </div>
      
      <div className="w-full h-full">
        <DashboardProgram />
      </div>
      
      <div className="w-full h-full">
        <DashboardUser />
      </div>
    </div>
  );
}
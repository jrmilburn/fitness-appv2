import { prisma } from '../../lib/prisma'; 
import Image from 'next/image';
import Link from 'next/link';
import ProgramTab from '../../components/Program/ProgramTab';
import backIcon from '../../assets/back.svg';
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProfileWrapper({ params }) {
  const { id } = params;

  return <Profile id={id} />;
}

function Profile({ id }) {
  const [user, setUser] = useState(null);
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const userData = await prisma.user.findUnique({
        where: { id: id }
      });

      setUser(userData);

      if (userData?.currentProgramId) {
        const programData = await prisma.program.findUnique({
          where: { id: userData.currentProgramId }
        });
        setProgram(programData);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto w-full h-[80%] relative">
      <h1 className="text-3xl m-4">User Profile</h1>
      
      <div className="flex flex-col w-full bg-gray-100 rounded p-4">
        <div className="flex justify-between items-center p-4">
          {isLoading ? (
            <Skeleton circle={true} height={64} width={64} />
          ) : (
            <Image
              src={user?.image || '/avatar.svg'}
              width={64}
              height={64}
              className="rounded-full"
              alt="profile"
            />
          )}

          <h2 className="text-2xl">
            {isLoading ? <Skeleton width={120} /> : user?.name}
          </h2>
        </div>

        <div className="p-4">
          {isLoading ? <Skeleton width={180} /> : <p>{user?.email}</p>}
        </div>

        <h2 className="my-4 text-3xl">Current Program</h2>

        {isLoading ? (
          <Skeleton height={200} />
        ) : program ? (
          <ProgramTab
            name={user?.name}
            length={program?.length}
            days={program?.days}
            id={program?.id}
            userProgramId={user?.currentProgramId}
          />
        ) : (
          <p className="text-gray-500 p-4">No current program available.</p>
        )}
      </div>

      <button className="absolute top-[10%] left-[-20%]">
        <Link href="/search">
          <Image src={backIcon} alt="back" />
        </Link>
      </button>
    </div>
  );
}
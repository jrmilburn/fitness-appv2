import { prisma } from '../lib/prisma'; 
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import Image from 'next/image';
import ProgramTab from '../components/Program/ProgramTab';
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProfilePageWrapper() {
    const [user, setUser] = useState(null);
    const [program, setProgram] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const session = await getServerSession(authOptions);

            const userData = await prisma.user.findUnique({
                where: {
                    email: session?.user.email,
                }
            });

            setUser(userData);

            if (userData?.currentProgramId) {
                const programData = await prisma.program.findUnique({
                    where: {
                        id: userData.currentProgramId
                    }
                });
                setProgram(programData);
            }

            setIsLoading(false);
        }

        fetchData();
    }, []);

    return <ProfilePage user={user} program={program} isLoading={isLoading} />;
}

function ProfilePage({ user, program, isLoading }) {
    return (
        <div className='max-w-2xl mx-auto w-full h-[80%]'>
            <h1 className='text-3xl m-4'>User Profile</h1>
            <div className='flex flex-col w-full bg-gray-100 rounded p-4'>
                <div className='flex justify-between items-center p-4'>
                    {isLoading ? (
                        <Skeleton circle={true} height={64} width={64} />
                    ) : (
                        <Image
                            src={user?.image || '/avatar.svg'}
                            width={64}
                            height={64}
                            className='rounded-full'
                            alt="profile"
                        />
                    )}

                    <h2 className='text-2xl'>
                        {isLoading ? <Skeleton width={120} /> : user?.name}
                    </h2>
                </div>

                <div className="p-4">
                    {isLoading ? <Skeleton width={180} /> : <p>{user?.email}</p>}
                </div>

                <h2 className='my-4 text-3xl'>Current Program</h2>
                
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
        </div>
    );
}
import Loader from '../components/Loader';
import { prisma } from '../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import ProgramTab from '../components/Program/ProgramTab';

export default async function Programs() {

    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user.email;

    const user = await prisma.user.findUnique({
        where: {
            email: userEmail,
        },
    });

    const userId = user?.id;
    const userProgramId = user?.currentProgramId;

    const programs = await prisma.program.findMany({
        where: {
            userId,
        },
    });

    return (
        <main className="w-full mx-auto p-8 space-y-8 overflow-y-scroll h-screen">
            {/* Title */}

            {/* Program Cards */}
            <div className="space-y-6 w-full max-w-2xl mx-auto">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8">Your Programs</h1>

                {programs.map((program) => (
                    <ProgramTab
                        key={program.id}
                        name={program.name}
                        length={program.length}
                        days={program.days}
                        id={program.id}
                        userProgramId={userProgramId}
                    />
                ))}
            </div>
        </main>
    );
}
// pages/program.js
import AssignProgram from '@/app/components/Coaching/AssignProgram';
import { prisma } from '../../../../lib/prisma';

async function fetchProgramData(id) {


    const program = await prisma.program.findUnique({
        where: { id },
        include: {
            weeks: {
                include: {
                    workouts: {
                        include: {
                            excercises: { include: { muscleGroup: true } }
                        }
                    }
                }
            },
            user: true
        }
    });

    const currentWeek = program?.currentWeekId
        ? await prisma.week.findFirst({
              where: { weekNo: 1},
              include: {
                  workouts: {
                      include: { excercises: { include: { sets: true } } }
                  },
              }
          })
        : null;

    return { program, currentWeek };
}

export default async function Program({ params }) {
    const { programId, clientId } = params;
    const { program, currentWeek } = await fetchProgramData(programId);

    console.log('CLIENT ID: ', clientId);

    if (!program) {
        return <div>Program not found</div>;
    }

    return <ProgramWrapper program={program} clientId={clientId} />;
}

// Separate client wrapper for UserProgram
function ProgramWrapper({ program, clientId }) {
    return (
        <div className='w-full mx-auto p-8 overflow-y-auto'>
            <div className='w-full flex justify-between items-center border-b-2 p-2'>
                <h2 className='text-2xl'>{program.name} by {program.user.name}</h2>
                <div className='flex flex-col space-y-4'>
                    <p>{program.length} Weeks</p>
                    <p>{program.days} Days</p>
                </div>
            </div>
            <AssignProgram 
                program={program}
                clientId={clientId}/>
        </div>
    );
}
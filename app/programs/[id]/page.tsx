// pages/program.js
import { prisma } from '../../lib/prisma';
import UserProgram from '@/app/components/Program/UserProgram';

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
            }
        }
    });

    const currentWeek = program?.currentWeekId
        ? await prisma.week.findUnique({
              where: { id: program.currentWeekId },
              include: {
                  workouts: {
                      include: { excercises: { include: { sets: true } } }
                  }
              }
          })
        : null;

    return { program, currentWeek };
}

export default async function Program({ params }) {
    const { id } = params;
    const { program, currentWeek } = await fetchProgramData(id);

    if (!program) {
        return <div>Program not found</div>;
    }

    return <ProgramWrapper program={program} currentWeek={currentWeek} />;
}

// Separate client wrapper for UserProgram
function ProgramWrapper({ program, currentWeek }) {
    return (
        <div className='w-full mx-auto p-8 overflow-y-auto'>
            <div className='w-full flex justify-between items-center border-b-2 p-2'>
                <h2 className='text-2xl'>{program.name}</h2>
                <div className='flex flex-col space-y-4'>
                    <p>{program.length} Weeks</p>
                    <p>{program.days} Days</p>
                </div>
            </div>
            <UserProgram currentWeek={currentWeek} program={program} />
        </div>
    );
}
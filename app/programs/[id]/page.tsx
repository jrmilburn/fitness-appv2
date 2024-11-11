import { prisma } from '../../lib/prisma';
import ProgramView from '../../components/Program/ProgramView';
import CopyProgram from '@/app/components/Program/CopyProgram';
import ProgramExcercises from '@/app/components/CreateProgram/Programexcercises';

export default async function Program({ params }) {

    const { id } = params;
    const program = await prisma.program.findUnique({
        where: {
            id
        }
    })

    const currentWeek = await prisma.week.findUnique({
        where: {
            id: program?.currentWeekId
        },
        include: {
            workouts: {
                include: {
                    excercises: {
                        include: {
                            sets: true
                        }
                    }
                }
            }
        }
    })

    console.log(program);
    
    return (

        <div className='w-full mx-auto p-8 overflow-y-auto'>
            <div className='w-full flex justify-between items-center border-b-2 p-2'>
                <h2 className='text-2xl'>{program?.name}</h2>
                <div className='flex flex-col space-y-4'>
                    <p>{program?.length} Weeks</p>
                    <p>{program?.days} Days</p>
                </div>
            </div>

            <ProgramView 
                week={currentWeek}/>

            <CopyProgram 
                program={program}/>

        </div>

    )

}
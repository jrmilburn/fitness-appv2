import { prisma } from '../../lib/prisma';
import ProgramView from '../../components/Program/ProgramView';

export default async function Program({ params }) {

    const { id } = params;
    const program = await prisma.program.findUnique({
        where: {
            id
        },
        include: {
            weeks: {
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
            }
        }
    })
    
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
                week={program?.weeks[0]}/>
        </div>

    )

}
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Loader from '../../components/Loader';

export default async function Workout() {
    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user.email;

    const user = await prisma.user.findUnique({
        where: {
            email: userEmail,
        },
    });

    const userProgramId = user?.currentProgramId;

    const currentProgram = await prisma.program.findUnique({
        where: {
            id: userProgramId
        }
    });

    const week = await prisma.week.findUnique({
        where: {
            id: currentProgram?.currentWeekId,
        }
    })

    const workouts = await prisma.workout.findMany({
        where: {
            weekId: currentProgram?.currentWeekId
        }
    });

    let newWeek;

    if (!week?.currentWorkoutId) {
        newWeek = await prisma.week.update({
            where: {
                id: currentProgram?.currentWeekId
            },
            data: {
                currentWorkoutId: workouts[0].id
            }
        })
    } else {
        newWeek = week;
    }

    const workout = await prisma.workout.findUnique({
        where: {
            id: newWeek?.currentWorkoutId
        }
    })

    console.log(workout);



    return (
        <div className='mx-auto my-auto flex flex-col items-center space-y-16'>
            <h2 className='text-2xl'>Current workout under construction</h2>
            <Loader 
                size={20}/>
        </div>
    );
}
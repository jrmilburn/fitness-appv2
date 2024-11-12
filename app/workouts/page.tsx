import { prisma } from '../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';
import ViewWorkouts from '../components/Workouts/ViewWorkouts';

export default async function Workouts() {

    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user.email;
  
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })

    const currentProgram = await prisma.program.findUnique({
        where: {
            id: user?.currentProgramId
        }
    })

    console.log('CURRENT PROGRAM: ', currentProgram);

    const currentWeek = await prisma.week.findUnique({
        where: {
            id: currentProgram?.currentWeekId
        }
    })

    console.log('CURRENT WEEK: ', currentWeek);

    const workouts = await prisma.workout.findMany({
        where: {
            weekId: currentWeek?.id 
        },
        include: {
            excercises: {
                include: {
                    sets: true
                }
            }
        }
    })

    console.log(workouts);


    return (
        <div className="w-3xl max-w-3xl mx-auto p-4 w-full">

            <ViewWorkouts 
                workouts={workouts}/>

        </div>
    )

}
import { prisma } from '../lib/prisma'
import CustomExcercises from '../components/CustomExcercises/CustomExcercises'
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';

export default async function CustomExcercisesPage() {


    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;
    const user = await prisma.user.findUnique({
        where: {
            email: userEmail
        },
    })

    const customexcercises = await prisma.excercise.findMany({
        where: {
            custom: true,
            createdById: user.id
        },
        include: {
            muscleGroup: true
        }
    })

    const muscleGroups = await prisma.muscleGroup.findMany()


    return (
        <div className='h-100% pb-20'>
        <CustomExcercises 
            excercises={customexcercises}
            muscleGroups={muscleGroups}/>
        </div>

    )

}
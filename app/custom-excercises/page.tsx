import { prisma } from '../lib/prisma'
import CustomExcercises from '../components/CustomExcercises/CustomExcercises'

export default async function CustomExcercisesPage() {


    const customexcercises = await prisma.excercise.findMany({
        where: {
            custom: true
        },
        include: {
            muscleGroup: true
        }
    })

    const muscleGroups = await prisma.muscleGroup.findMany()


    return (
        <div className='p-8'>
        <CustomExcercises 
            excercises={customexcercises}
            muscleGroups={muscleGroups}/>
        </div>

    )

}
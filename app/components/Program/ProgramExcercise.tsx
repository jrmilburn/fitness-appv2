import { prisma } from '../../lib/prisma';

export default async function ProgramExcercise({ excercise }) {
    const muscleGroup = await prisma.muscleGroup.findUnique({
        where: {
            id: excercise.muscleGroupId
        }
    });

    return (
        <div className="bg-white shadow rounded-lg p-4 w-full space-y-2">
            {/* Muscle Group Title */}
            <h2 className='text-sm font-semibold text-gray-500'>{muscleGroup?.name}</h2>

            {/* Exercise Name */}
            <p className="text-lg font-medium text-gray-800">{excercise.name}</p>

            {/* Set Count */}
            <p className="text-sm text-gray-600">Sets: {excercise.sets.length}</p>
        </div>
    );
}
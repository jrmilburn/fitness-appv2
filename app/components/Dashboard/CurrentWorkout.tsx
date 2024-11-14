import { prisma } from '../../lib/prisma'
import Link from 'next/link'
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';

export default async function DashboardWorkout() {
    const userSession = await getServerSession(authOptions);

    const userEmail = userSession?.user.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    const currentProgram = await prisma.program.findUnique({
      where: { id: user.currentProgramId },
    });

    const currentWeek = await prisma.week.findUnique({
      where: { id: currentProgram.currentWeekId },
      include: { workouts: true },
    });


    if (!currentWeek.currentWorkoutId) {
      await prisma.week.update({
        where: { id: currentWeek.id },
        data: { currentWorkoutId: currentWeek.workouts[0]?.id },
      });
    }

    const currentWorkout = await prisma.workout.findUnique({
      where: { id: currentWeek.currentWorkoutId },
      include: {
        excercises: {
          include: {
            sets: { orderBy: { createdAt: 'asc' } },
          },
        },
      },
    });



  return (
    <div className="grid grid-cols-1 gap-4 p-4 bg-gray-100 rounded-lg border-2 w-80">
      <h2 className="text-xl font-semibold">{currentWorkout?.name || 'Workout Name'}</h2>
      <p className="text-gray-700">Exercises: {currentWorkout?.excercises?.length || 'N/A'}</p>
      <p className="text-gray-700">Status: {currentWorkout?.completed ? 'Completed' : 'In Progress'}</p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="font-medium text-gray-600">Workout Number:</div>
        <div className="text-gray-800">{currentWorkout?.workoutNo || 'N/A'}</div>
        
        <div className="font-medium text-gray-600">Last Updated:</div>
        <div className="text-gray-800">{currentWorkout?.updatedAt ? currentWorkout.updatedAt.toLocaleDateString() : 'N/A'}</div>
      </div>

      <Link href={`/workouts/${currentWorkout?.id}`}>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          View Workout Details
        </button>
      </Link>
    </div>
  );
}
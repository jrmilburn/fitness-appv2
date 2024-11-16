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

  let currentProgram;

  if(user?.currentProgramId) {
   currentProgram = await prisma.program.findUnique({
      where: { id: user?.currentProgramId },
    });
  } else {
    return (
      <div>
        No Workout Set
      </div>
    )
  }

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
    <div className="flex flex-col gap-4 p-6 bg-gray-100 rounded-lg border-2 w-full h-full">
      <h2 className="text-3xl font-bold text-gray-900">Current Workout</h2>

      <div className="text-xl font-semibold text-gray-800">
        {currentWorkout?.name || 'Workout Name'}
      </div>

      <div className="text-lg text-gray-700 space-y-2">
        <p><strong>Exercises:</strong> {currentWorkout?.excercises?.length || 'N/A'}</p>
        <p><strong>Status:</strong> {currentWorkout?.completed ? 'Completed' : 'In Progress'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-lg mt-4">
        <div className="font-medium text-gray-600">Workout Number:</div>
        <div className="text-gray-800">{currentWorkout?.workoutNo || 'N/A'}</div>
        
        <div className="font-medium text-gray-600">Last Updated:</div>
        <div className="text-gray-800">{currentWorkout?.updatedAt ? currentWorkout.updatedAt.toLocaleDateString() : 'N/A'}</div>
      </div>

      <Link href={`/workouts/current`}>
        <button className="mt-6 px-6 py-3 bg-black text-white font-bold rounded hover:bg-gray-800">
          View Workout
        </button>
      </Link>
    </div>
  );
}
import ProgramExcercise from './ProgramExcercise';

export default function ProgramWorkout({ workout }) {
    return (
        <div className='flex flex-col space-y-4 items-center bg-gray-50 rounded-lg shadow-md p-6 min-w-[280px]'>
            {/* Workout Day Title */}
            <h2 className='text-xl font-bold text-gray-700'>Day {workout.workoutNo}</h2>

            {/* Exercise List */}
            <div className="flex flex-col space-y-4 w-full">
                {workout.excercises?.map((excercise) => (
                    <ProgramExcercise
                        key={excercise.id}
                        excercise={excercise}
                    />
                ))}
            </div>
        </div>
    );
}
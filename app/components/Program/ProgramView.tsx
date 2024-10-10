import ProgramWorkout from './ProgramWorkout';

export default function ProgramView({ week }) {
    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-6">
            {/* Week Title */}
            <h2 className='text-3xl font-semibold text-gray-800'>Week {week.weekNo}</h2>

            {/* Workout Container */}
            <div className='flex space-x-6 overflow-x-auto'>
                {week.workouts.map((workout) => (
                    <ProgramWorkout 
                        key={workout.id}
                        workout={workout}
                    />
                ))}
            </div>
        </div>
    );
}
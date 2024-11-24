'use client'

import ProgramWorkout from './ProgramWorkout';

export default function ProgramView({ week }) {
    return (
        <div className="p-4 w-full h-full bg-background overflow-y-auto border-2 rounded space-y-6 ">
            {/* Week Title */}
            <h2 className='text-2xl sm:text-3xl font-semibold text-gray-800'>Week {week.weekNo}</h2>

            {/* Workout Container */}
            <div className='flex space-x-6 overflow-x-auto'>
                {week.workouts
                .sort((a, b) => a.workoutNo - b.workoutNo)
                .map((workout) => (
                    <ProgramWorkout 
                        key={workout.id}
                        workout={workout}
                    />
                ))}
            </div>
        </div>
    );
}
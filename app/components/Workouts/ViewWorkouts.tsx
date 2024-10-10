"use client";

import { useState } from 'react';
import WorkoutSelect from './WorkoutSelect';

export default function ViewWorkouts({ workouts }) {

    const [workoutShown, setWorkoutShown] = useState(0);

    const handleSelectWorkout = (workoutNum) => {
        setWorkoutShown(workoutNum - 1);
    }
    
    return (
        <div className="w-full mx-auto flex flex-col space-y-8 p-4">
            
            {/* Workout Selection Buttons */}
            <div className="flex justify-center space-x-4">
                {workouts.map((workout) => (
                    <WorkoutSelect 
                        key={workout.id}
                        handleSelect={handleSelectWorkout}
                        workoutDay={workout.workoutNo}
                        workoutShown={workoutShown}
                    />
                ))}
            </div>

            {/* Workout Details */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {workouts[workoutShown]?.name}
                </h2>
                <div className="space-y-4">
                    {workouts[workoutShown]?.excercises?.map((excercise) => (
                        <div key={excercise.id} className="border-b pb-4">
                            <h3 className="text-xl font-medium text-gray-700">
                                {excercise.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {excercise.sets.map((set) => (
                                    <p key={set.setNo} className="text-gray-600">
                                        Set {set.setNo}: {set.reps} reps, {set.weight} kg
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
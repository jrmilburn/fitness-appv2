import Link from 'next/link';
import { useState } from 'react';
import Loader from "../Loader";

export default function CompleteWorkout({ completed, workout, setWorkout, programComplete }) {
    const [isLoading, setIsLoading] = useState(false);
    const [programCompleted, setProgramCompleted] = useState(programComplete);

    const handleFinish = async () => {
        setIsLoading(true); // Show loading state
    
        try {
            // Mark the current workout as completed
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL!}/api/workouts/finish/${workout.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        weekId: workout.weekId,
                    }),
                }
            );
    
            const result = await response.json();
    
            if (result.message === 'Program finished') {
                setProgramCompleted(true);
                setWorkout({ ...workout, completed: true }); // Update workout state locally
                setIsLoading(false);
                return;
            }
    
            // Fetch the next workout if the program is not finished
            const newWorkoutResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL!}/api/workouts/current`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const newWorkout = await newWorkoutResponse.json();
            setWorkout(newWorkout.workout);
        } catch (error) {
            console.error('Error finishing workout:', error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    if (programCompleted) {
        return (
            <div className="flex flex-col items-center space-y-4">
                <h2 className="text-xl font-semibold">Program Completed</h2>
                <Link href={`/create-program`} className="w-full max-w-2xl text-lg font-bold text-background bg-foreground p-4 rounded hover:opacity-75 transition-all duration-300 text-center">
                        Create New Program
                </Link>
            </div>
        );
    }

    if (workout?.completed && isLoading === false) {
        return (
            <div className="flex flex-col items-center space-y-4">
                <Link href={`/workouts/current`} className="w-full max-w-2xl text-lg font-bold text-background bg-foreground p-4 rounded hover:opacity-75 transition-all duration-300 text-center">
                        View Current Workout
                </Link>
            </div>
        );
    }

    return (
        <>
            {completed && (
                <button 
                    onClick={handleFinish} 
                    disabled={isLoading}  // Disable button while loading
                    className={`w-full max-w-2xl text-lg font-bold text-background bg-primary-text p-4 rounded hover:opacity-75 transition-all flex items-center justify-center duration-300 fixed bottom-10 ${isLoading ? 'opacity-50' : ''}`}
                >
                    {isLoading ? (
                        <>
                            <Loader size={6} color="background" />
                            <span className="ml-2 text-background">Finishing...</span>
                        </>
                    ) : 'Finish Workout'}
                </button> 
            )}
        </>
    );
}
import Link from 'next/link';
import { useState } from 'react';
import Loader from "../Loader";
import { CheckCircleIcon } from '@heroicons/react/solid';

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
      <div className="flex flex-col items-center justify-center space-y-6 mt-10">
        <CheckCircleIcon className="w-16 h-16 text-green-500" />
        <p className="text-lg text-center text-gray-600">
          You have completed this program.
        </p>
        <Link
          href="/create-program"
          className="mt-4 px-6 py-3 bg-primary-text text-background rounded shadow-lg hover:shadow-xl transition duration-300"
        >
          Create New Program
        </Link>
        <Link
          href="/workouts/current"
          className="mt-4 px-6 py-3 bg-primary-text text-background rounded shadow-lg hover:shadow-xl transition duration-300"
        >
          Current Workout
        </Link>
      </div>
    );
  }

  if (workout?.completed && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 mt-10">
        <h2 className="text-xl font-semibold text-center">
          Workout Completed
        </h2>
        <Link
          href="/workouts/current"
          className="mt-4 px-6 py-3 bg-primary-text text-background rounded shadow-lg hover:shadow-xl transition duration-300"
        >
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
          disabled={isLoading} // Disable button while loading
          className={`fixed bottom-[10%] sm:bottom-5 w-11/12 max-w-md mx-auto left-50 px-6 py-4 bg-primary-text text-background rounded-full shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <Loader size={6} color="background" />
              <span className="ml-2 text-background">Finishing...</span>
            </>
          ) : (
            'Finish Workout'
          )}
        </button>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Exercise from '@/app/components/CurrentWorkout/Excercise';
import WorkoutHeader from '@/app/components/CurrentWorkout/WorkoutHeader';
import CompleteWorkout from '@/app/components/CurrentWorkout/CompleteWorkout';
import Link from "next/link";
import { PlusCircleIcon, ClipboardListIcon } from '@heroicons/react/solid';

export default function Workout() {
  interface Exercise {
    id: string;
    name: string;
    completed: boolean;
    excerciseNo: number;
  }
  
  interface Workout {
    id: string;
    excercises: Exercise[];
    weekId: string;
    name: string;
  }

  const [week, setWeek] = useState(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [completed, setCompleted] = useState(false);
  const [programCompleted, setProgramCompleted] = useState(false);
  const [noWorkout, setNoWorkout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    router.refresh();
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/workouts/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (!response.ok) {
        setNoWorkout(true);
        return null;
      }
      return response.json();
    })
    .then((data) => {
      setWorkout(data?.workout);
      setProgramCompleted(data?.programCompleted);
      setIsLoading(false);
      console.log(data.workout);
    })
    .catch((error) => {
      console.error('Error fetching workout:', error);
      setNoWorkout(true);
      setIsLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (workout?.excercises) {
      const allCompleted = workout.excercises.every(excercise => excercise.completed === true);
      setCompleted(allCompleted);
    }
  }, [workout?.excercises]);

  if (noWorkout) {
    router.push('/create-program');
  }

  return (
    <div className='mx-auto flex flex-col items-center w-full sm:p-8 text-primary-text pb-20'>
      {/* Workout Header */}
      {isLoading ? (
        <Skeleton height={40} width={300} />
      ) : workout?.weekId && (
        <WorkoutHeader 
          name={workout.name}
          weekId={workout.weekId}
          setWorkout={setWorkout}
          workout={workout}
          week={week}
          setWeek={setWeek}
        />
      )}

      {/* Navigation Buttons for Programs */}
      {!isLoading && (
        <div className="flex space-x-4 my-4">
          <Link 
            href="/create-program" 
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            New Program
          </Link>
          <Link 
            href="/programs" 
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <ClipboardListIcon className="h-5 w-5 mr-2" />
            View Programs
          </Link>
        </div>
      )}

      {/* Exercise List */}
      {isLoading ? (
        Array(3).fill(null).map((_, index) => (
          <div key={index} className="w-[100%] max-w-2xl mx-auto p-8 flex flex-col border-2 border-border">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Skeleton width={100} height={16} className="mb-2" /> {/* Muscle Group */}
                <Skeleton width={150} height={24} /> {/* Exercise Name */}
              </div>
              <div className="flex flex-col space-y-4 items-center">
                <Skeleton circle={true} height={24} width={24} /> {/* Info Icon */}
                <Skeleton circle={true} height={24} width={24} /> {/* Edit Icon */}
              </div>
            </div>
            <div className="w-[60%] flex justify-between mx-8 my-2">
              <Skeleton width={50} height={16} /> {/* Weight Label */}
              <Skeleton width={50} height={16} /> {/* Reps Label */}
            </div>
            {/* Set placeholders */}
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="w-full flex justify-between mx-8 my-2">
                <Skeleton width={80} height={20} /> {/* Set Weight */}
                <Skeleton width={40} height={20} /> {/* Set Reps */}
              </div>
            ))}
          </div>
        ))
      ) : (
        workout?.excercises && workout.excercises
          .sort((a, b) => a.excerciseNo - b.excerciseNo)
          .map(excercise => (
            <Exercise 
              key={excercise.id}
              excercise={excercise}
              weekRir={week?.repsInReserve}
              weekNo={week?.weekNo}
              workout={workout}
              setWorkout={setWorkout}
            />
          ))
      )}

      {/* Complete Workout Button */}
      {isLoading ? (
        <Skeleton height={50} width={200} />
      ) : (
        <CompleteWorkout 
          completed={completed}
          workout={workout}
          setWorkout={setWorkout}
          programComplete={programCompleted}
        />
      )}
    </div>
  );
}

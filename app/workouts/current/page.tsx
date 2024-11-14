'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Excercise from '@/app/components/CurrentWorkout/Excercise';
import WorkoutHeader from '@/app/components/CurrentWorkout/WorkoutHeader';
import CompleteWorkout from '@/app/components/CurrentWorkout/CompleteWorkout';

export default function Workout() {

    interface Exercise {
        id: string;
        name: string;
        completed: boolean;
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
    const [noWorkout, setNoWorkout] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        // Refresh the router to ensure we have the latest data
        router.refresh();

        console.log(process.env.NEXT_PUBLIC_BASE_URL!);

        // Fetch the most recent workout data after refreshing
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/workouts/current`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                setNoWorkout(true); // Trigger noWorkout state if the response is not OK
                return null;
            }
            return response.json();
        })
        .then((data) => {
            if (data) {
                setWorkout(data);
            }
            setIsLoading(false); // Stop loading after data is fetched
        })
        .catch((error) => {
            console.error('Error fetching workout:', error);
            setNoWorkout(true);
            setIsLoading(false); // Stop loading if there’s an error
        });
    }, [router]); // Only run on initial mount

    useEffect(() => {
        // Check if all exercises are completed
        if (workout?.excercises) {
            const allCompleted = workout.excercises.every(excercise => excercise.completed === true);
            setCompleted(allCompleted);
        }
    }, [workout?.excercises]);

    if (noWorkout) {
        return (
            <div className='mx-auto my-auto flex flex-col items-center space-y-16 overflow-y-scroll h-screen w-full p-8'>
                <h2>No Workout Available</h2>
                <p>Please Create a Program to Start a Workout</p>
            </div>
        );
    }

    return (
        <div className='mx-auto my-auto flex flex-col items-center space-y-16 overflow-y-scroll h-screen w-full p-8'>
            {/* Workout Header */}
            {isLoading ? (
                <Skeleton height={40} width={300} />
            ) : workout?.weekId && (
                <WorkoutHeader 
                    name={workout.name}
                    weekId={workout.weekId}
                    setWorkout={setWorkout}
                    week={week}
                    setWeek={setWeek}
                />
            )}

            {/* Exercise List */}
            {isLoading ? (
                Array(3).fill(null).map((_, index) => (
                    <Skeleton key={index} height={100} width="100%" />
                ))
            ) : (
                workout?.excercises && workout.excercises.map(excercise => (
                    <Excercise 
                        key={excercise.id}
                        excercise={excercise}
                        weekRir={week?.repsInReserve}
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
                />
            )}
        </div>
    );
}
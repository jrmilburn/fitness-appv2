"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Excercise from '@/app/components/CurrentWorkout/Excercise';
import WorkoutHeader from '@/app/components/CurrentWorkout/WorkoutHeader';
import CompleteWorkout from '@/app/components/CurrentWorkout/CompleteWorkout';

export default function Workout() {
    const [week, setWeek] = useState(null);
    const [workout, setWorkout] = useState({});
    const [completed, setCompleted] = useState(false);
    const [noWorkout, setNoWorkout] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        fetch(`http://localhost:3000/api/workouts/current`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                // If response is not OK, trigger noWorkout state
                setNoWorkout(true);
                return null;
            }
            return response.json();
        })
        .then((data) => {
            if (data) {
                setWorkout(data);
            }
        })
        .catch((error) => {
            console.error('Error fetching workout:', error);
            setNoWorkout(true);
        });
    }, []);

    useEffect(() => {
        if (workout.excercises) {
            const allCompleted = workout.excercises.every(excercise => excercise.completed === true);
            setCompleted(allCompleted);
        }
    }, [workout.excercises]);

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
            {workout.weekId && (
                <WorkoutHeader 
                    name={workout.name}
                    weekId={workout.weekId}
                    setWorkout={setWorkout}
                    week={week}
                    setWeek={setWeek}
                />
            )}
            {workout.excercises && workout.excercises.map(excercise => (
                <Excercise 
                    key={excercise.id}
                    excercise={excercise}
                    weekRir={week?.repsInReserve}
                    workout={workout}
                    setWorkout={setWorkout}
                />
            ))}
            <CompleteWorkout 
                completed={completed}
                workout={workout}
                setWorkout={setWorkout}
            />
        </div>
    );
}
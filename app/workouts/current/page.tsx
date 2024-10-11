"use client";

import {useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import Loader from '../../components/Loader';
import Excercise from '@/app/components/CurrentWorkout/Excercise';
import WorkoutHeader from '@/app/components/CurrentWorkout/WorkoutHeader';

export default function Workout() {


    const [workout, setWorkout] = useState({});

    const { data: session } = useSession();

    useEffect(() => {
        fetch(`http://localhost:3000/api/workouts/current`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setWorkout(data || []);
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      }, []);

    return (
        <div className='mx-auto my-auto flex flex-col items-center space-y-16 overflow-y-scroll h-screen w-full p-8'>
            {workout.weekId && (
                <WorkoutHeader 
                name={workout.name}
                weekId={workout.weekId}/>
            )}
            {workout?.excercises && workout.excercises.map(excercise => (
                <Excercise 
                    key={excercise.id }
                    excercise={excercise}/>
            ))}
        </div>
    );
}
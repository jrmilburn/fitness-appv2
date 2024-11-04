"use client";

import {useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import Excercise from '@/app/components/CurrentWorkout/Excercise';
import WorkoutHeader from '@/app/components/CurrentWorkout/WorkoutHeader';
import CompleteWorkout from '@/app/components/CurrentWorkout/CompleteWorkout';

export default function Workout() {

    const [week, setWeek] = useState(null);
    const [workout, setWorkout] = useState({});
    const [completed, setCompleted] = useState(false);

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

    useEffect(() => {
        if(workout.excercises) {
            const allCompleted = workout?.excercises.every(excercise => excercise.completed === true);
            setCompleted(allCompleted); 
        }
    }, [workout.excercises])

    

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
            {workout?.excercises && workout.excercises.map(excercise => (
                <Excercise 
                    key={excercise.id }
                    excercise={excercise}
                    weekRir={week?.repsInReserve}
                    workout={workout}
                    setWorkout={setWorkout}
                    />
            ))}
            <CompleteWorkout 
                completed={completed}
                workout={workout}
                setWorkout={setWorkout}/>
        </div>


    );
}
"use client";

import {useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import Loader from '../../components/Loader';

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
        <div className='mx-auto my-auto flex flex-col items-center space-y-16'>
            <h2 className='text-2xl'>Current workout under construction</h2>
            <Loader 
                size={20}/>
        </div>
    );
}
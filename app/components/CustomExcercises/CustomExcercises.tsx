"use client"

import { useState } from 'react'
import CustomExcercise from "./CustomExcercise"
import NewExcercise from '../CreateProgram/NewExcercise';
import {
    PlusCircleIcon,
  } from "@heroicons/react/outline";


export default function CustomExcercises({ excercises, muscleGroups }) {

    const [newShown, setNewShown] = useState(false);
    const [customExcercises, setCustomExcercises] = useState(excercises);

    const handleDelete = async (excerciseId) => {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/excercises/create/${excerciseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json'
            }
        })

        if(response.ok) {

            setCustomExcercises((prevExcercises) => 
                prevExcercises.filter((excercise) => excercise.id !== excerciseId)
            );

        }

    }

    return (
        <div className="max-w-2xl flex flex-col mx-auto">

            <div className="flex w-full justify-between border-b-2 border-border p-4 items-center">
                <h2 className="text-2xl sm:text-3xl text-primary-text">Custom Excercises</h2>
                <button className="font-bold border-2 p-2 hover:bg-background-secondary rounded flex gap-2 text-primary-text" onClick={() => setNewShown(true)}>New <PlusCircleIcon className="h-6 w-6 text-primary-text" /></button>
            </div>

            {customExcercises.map(excercise => (
                <CustomExcercise 
                    key={excercise.id}
                    excercise={excercise}
                    onDelete={() => handleDelete(excercise.id)} />
            ))}

            {newShown && (
                <div className='fixed inset-0 bg-primary-text bg-opacity-50 z-50'>
                    <div className='bg-background p-4 absolute m-4 top-1/2 left-1/2 z-50 opacity-100 translate-y-[-50%] translate-x-[-50%]'>
                        <NewExcercise 
                        workoutId={null}
                        muscleGroups={muscleGroups} 
                        onClose={() => setNewShown(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )

}
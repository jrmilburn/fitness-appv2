import Musclegroups from "../CreateProgram/Musclegroups"
import Excercises from "../CreateProgram/Excercises";
import { useState } from 'react'
import Image from 'next/image'

import backIcon from '../../assets/back.svg'

export default function AddExcercise({ onClose, setWorkout, workout }) {

    const [formState, setFormState] = useState(0);
    const [muscle, setMuscle] = useState(null);
    const [muscleGroups, setMuscleGroups] = useState([]);

    const selectMuscleGroup = (muscle) => {

        setMuscle(muscle);
        setFormState(1);
        console.log(muscle);

    };

    const handleSelectExcercise = async (e, addExcercise) => {


        const requestBody = {
            muscleId: muscle.id,
            muscleName: muscle.name,
            excercise: addExcercise,
            workoutId: workout.id
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/excercises`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        if(response.ok) {
            const newExcercise = await response.json();

            setWorkout({...workout,
                excercises: [
                    ...workout.excercises,
                    newExcercise
                ]
            })
        }

        onClose();

    }

    const handleBack = () => {
        setFormState(0);
    }

    return (
        <>
        {formState === 0 ? (
            <>
            <Musclegroups
                visible={true}
                onAdd={selectMuscleGroup}
                onClose={onClose}
                setMuscleGroups={setMuscleGroups}
                muscleGroups={muscleGroups} />
            </>
        ) : (
            <>
            <Excercises 
                visible={true}
                onClose={onClose}
                muscle={muscle.id}
                selectExcercise={handleSelectExcercise}
                muscleGroups={muscleGroups}
                workoutId={workout.id}
            >
                <button onClick={handleBack} className="absolute z-50 right-10">
                    <Image 
                        src={backIcon}
                        alt="back"/>
                </button>
            </Excercises>
            </>
        )}
        </>
    )

}
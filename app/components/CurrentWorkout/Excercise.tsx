import Set from './Set'
import { useEffect, useState } from 'react'

export default function Excercise( {excercise, weekRir} ) {

    const [muscle, setMuscle] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/api/musclegroups/${excercise.muscleGroupId}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }

        })
        .then(response => response.json())
        .then(data => setMuscle(data))

    }, [])

    return (
        <div className="w-[100%] max-w-2xl mx-auto bg-gray-200 p-8">
            <p className="opacity-50 p-1">{muscle.name}</p>
            <h2 className='font-bold text-xl p-1'>{excercise.name}</h2>
            <div className=' w-[60%] flex justify-between mx-8 my-2'>
                <h2>Weight</h2>
                <h2>Reps</h2>
            </div>
            {excercise.sets.map((set, index) => (
                <Set key={index} setId={set.id} Rir={weekRir} />
            ))}
        </div>
    )

}
import Set from './Set'
import { useEffect, useState } from 'react'

export default function Excercise({ excercise, weekRir, workout, setWorkout }) {
    const [muscle, setMuscle] = useState({});
    const [setsCompleted, setSetsComplete] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/api/musclegroups/${excercise.muscleGroupId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setMuscle(data))
        .catch(error => console.error('Error:', error));
    }, [excercise.muscleGroupId]);

    useEffect(() => {
        if (excercise.sets && excercise.sets.length > 0) {

            const allSetsCompleted = excercise.sets.every(set => set.completed === true);
            setSetsComplete(allSetsCompleted);

        }
    }, [excercise.sets]);

    useEffect(() => {
            setWorkout(prev => ({
                ...prev,
                excercises: prev.excercises.map(e => (
                    e.id === excercise.id ? { ...e, completed: setsCompleted } : e
                ))
            }));
    }, [setsCompleted, excercise.id, setWorkout]);

    return (
        <div className={`w-[100%] max-w-2xl mx-auto p-8 ${setsCompleted ? 'border-2 border-green-400' : 'border-2 border-gray-200'}`}>
            <p className="opacity-50 p-1">{muscle.name}</p>
            <h2 className="font-bold text-xl p-1">{excercise.name}</h2>
            <div className="w-[60%] flex justify-between mx-8 my-2">
                <h2>Weight</h2>
                <h2>Reps</h2>
            </div>
            {excercise.sets.map((set, index) => (
                <Set key={index} setId={set.id} Rir={weekRir} workout={workout} setWorkout={setWorkout} />
            ))}

            {setsCompleted && <p className="text-green-500 font-bold">All sets completed!</p>}
        </div>
    );
}
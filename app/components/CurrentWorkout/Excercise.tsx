import Set from './Set'
import { useEffect, useState, useRef } from 'react'
import infoIcon from '../../assets/info.svg'
import horieditIcon from '../../assets/edit-hori.svg'
import Image from 'next/image'
import ExcerciseForm from './ExcerciseForm'


export default function Excercise({ excercise, weekRir, workout, setWorkout }) {
    const [muscle, setMuscle] = useState({});
    const [setsCompleted, setSetsComplete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef(null);

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


    const handleDeleteSet = async (setId) => {

        const updatedSets = excercise.sets.filter(set => set.id !== setId);

        try {

            const response = await fetch(`http://localhost:3000/api/set/${setId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

        } catch (error) {
            console.error('Error deleting set:', error);
        }
        setWorkout(prev => ({
            ...prev,
            excercises: prev.excercises.map(e => (
                e.id === excercise.id ? { ...e, sets: updatedSets } : e
            ))
        }));

    }

    const handleAddSet = async () => {

        const numSets = excercise.sets.length;

        try {
            const response = await fetch(`http://localhost:3000/api/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    excerciseId: excercise.id,
                    setNo: numSets + 1,
                    weight: 0,
                    reps: 0,
                    completed: false
                })
            });
            
            const newSet = await response.json();
    
            setWorkout(prev => ({
                ...prev,
                excercises: prev.excercises.map(e => (
                    e.id === excercise.id ? { ...e, sets: [...e.sets, newSet] } : e
                ))
            }));
        } catch (error) {
            console.error('Error adding new set:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    }
    
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };
    
    useEffect(() => {
      if (isEditing) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isEditing]);

    const handleDeleteExcercise = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/excercises/${excercise.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete exercise');
            }
    
            setWorkout(prev => ({
                ...prev,
                excercises: prev.excercises.filter(e => e.id !== excercise.id)
            }));
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };


    return (
        <div className={`w-[100%] max-w-2xl mx-auto p-8 flex flex-col ${setsCompleted ? 'border-2 border-green-400' : 'border-2 border-gray-200'}`}>
            
            <div className='flex justify-between items-center'>

                <div className='flex flex-col'>
                    <p className="opacity-50 p-1">{muscle.name}</p>
                    <h2 className="font-bold text-xl p-1">{excercise.name}</h2>
                </div>

                <div className='flex flex-col space-y-4 items-center relative'>
                    <button>
                        <Image 
                            src={infoIcon}
                            alt='info'/>
                    </button>
                    <button onClick={handleEditClick}>
                        <Image
                            src={horieditIcon}
                            alt='edit excercise'
                            />
                    </button>
                    {isEditing && (
                        <div ref={formRef} className='absolute top-[10%] translate-x-[-70%] z-50 w-[175px]'>
                            <ExcerciseForm 
                                onDelete={handleDeleteExcercise}/>
                        </div>

                    )}
                </div>

            </div>

            <div className="w-[60%] flex justify-between mx-8 my-2">
                <h2>Weight</h2>
                <h2>Reps</h2>
            </div>
            {excercise.sets.map((set, index) => (
                <Set key={index} setId={set.id} Rir={weekRir} workout={workout} setWorkout={setWorkout} onDelete={() => handleDeleteSet(set.id)} onAdd={() => handleAddSet()} />
            ))}

            {setsCompleted && <p className="text-green-500 font-bold">All sets completed!</p>}
        </div>
    );
}
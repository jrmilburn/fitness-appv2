import Set from './Set'
import { useEffect, useState, useRef } from 'react'
import infoIcon from '../../assets/info.svg'
import horieditIcon from '../../assets/edit-hori.svg'
import Image from 'next/image'
import ExcerciseForm from './ExcerciseForm'
import ExcerciseInfo from './ExcerciseInfo'
import AddExcercise from './AddExcercise'
import ReplaceExcercise from './ReplaceExcercise'


export default function Excercise({ excercise, weekRir, workout, setWorkout }) {

    interface muscle {
        name: string
    }

    const [muscle, setMuscle] = useState<muscle | null>(null);
    const [setsCompleted, setSetsComplete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [infoShown, setInfoShown] = useState(false);
    const [addExcerciseShown, setAddExcerciseShown] = useState(false);
    const [replaceExcerciseShown, setReplaceExcerciseShown] = useState(false);
    const [lastWeekData, setLastWeekData] = useState([]);
    const formRef = useRef(null);
    const infoRef = useRef(null);

    const handleSetDataFetch = (data) => {
        setLastWeekData(prevData => {
            // Ensure no duplicate entries by checking setId
            const existingIndex = prevData.findIndex(item => item.setId === data.setId);
            if (existingIndex >= 0) {
                // Update existing entry
                const updatedData = [...prevData];
                updatedData[existingIndex] = data;
                return updatedData;
            }
            return [...prevData, data];
        });
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/musclegroups/${excercise.muscleGroupId}`, {
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/set/${setId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if(response.ok) {
                console.log(response);
            }

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    excerciseId: excercise.id,
                    setNo: numSets + 1,
                    weight: 0,
                    reps: 0,
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

    const handleAddExcercise = async () => {

        setAddExcerciseShown(true);

    }

    const handleReplaceExcercise = async () => {

        setReplaceExcerciseShown(true);

    }

    const handleDeleteExcercise = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/excercises/${excercise.id}`, {
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

    const handleInfoShown = () => {

        setInfoShown(true);

    }

    const handleInfoClose = (event) => {
        if (infoRef.current && !infoRef.current.contains(event.target)) {
          setInfoShown(false);
        }
      };
      
      useEffect(() => {
        if (infoShown) {
          document.addEventListener('mousedown', handleInfoClose);
        } else {
          document.removeEventListener('mousedown', handleInfoClose);
        }
        return () => {
          document.removeEventListener('mousedown', handleInfoClose);
        };
      }, [infoShown]);



    return (
        <div className={`w-[100%] max-w-screen-sm mx-auto bg-background-secondary p-8 flex flex-col ${setsCompleted ? 'border-2 border-green-400' : 'border-2 border-border'}`}>
            
            <div className='flex justify-between items-center'>

                <div className='flex flex-col'>
                    <p className="p-1 text-secondary-text">{muscle ? muscle.name : ''}</p>
                    <h2 className="font-bold text-xl p-1 text-primary-text">{excercise.name}</h2>
                </div>

                <div className='flex flex-col space-y-4 items-center relative'>
                    <button onClick={handleInfoShown}>
                        <Image 
                            src={infoIcon}
                            alt='info'/>
                    </button>
                    <button onClick={handleEditClick} disabled={excercise.completed}>
                        <Image
                            src={horieditIcon}
                            alt='edit excercise'
                            />
                    </button>
                    {isEditing && (
                        <div ref={formRef} className='absolute top-[10%] translate-x-[-70%] z-50 w-[175px]'>
                            <ExcerciseForm 
                                onAdd={handleAddExcercise}
                                onReplace={handleReplaceExcercise}
                                onDelete={handleDeleteExcercise}
                            />
                        </div>

                    )}
                    {infoShown && (
                        <div ref={infoRef} className='absolute translate-x-[-50%] md:translate-x-[-70%] z-50 w-[400px] bg-white p-2'>
                            <ExcerciseInfo 
                                name={excercise.name}
                                details={excercise.details}
                                lastWeekData={lastWeekData}/>
                        </div>
                    )}
                    {addExcerciseShown && (

                        <AddExcercise 
                            onClose={() => setAddExcerciseShown(false)}
                            setWorkout={setWorkout}
                            workout={workout}/>

                    )}
                    {replaceExcerciseShown && (

                        <ReplaceExcercise 
                            onClose={() => setReplaceExcerciseShown(false)}
                            setWorkout={setWorkout}
                            workout={workout}
                            excercise={excercise}/>

                    )}
                </div>

            </div>

            <div className="w-[60%] flex justify-between mx-8 my-2 text-secondary-text">
                <h2>Weight</h2>
                <h2>Reps</h2>
            </div>
            {excercise?.sets?.map((set, index) => (
                <Set key={index} setId={set.id} Rir={weekRir} workout={workout} setWorkout={setWorkout} onDelete={() => handleDeleteSet(set.id)} onAdd={() => handleAddSet()} onDataFetch={handleSetDataFetch} />
            ))}

            {setsCompleted && <p className="text-green-500 font-bold">All sets completed!</p>}
        </div>
    );
}
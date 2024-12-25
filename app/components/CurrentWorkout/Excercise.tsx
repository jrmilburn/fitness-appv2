import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { PlayIcon } from '@heroicons/react/solid';
import ExcerciseForm from './ExcerciseForm';
import ExcerciseInfo from './ExcerciseInfo';
import AddExcercise from './AddExcercise';
import ReplaceExcercise from './ReplaceExcercise';
import AutoRegulationForm from './AutoRegulation';
import TimerPopup from './TimerPopup';
import Set from './Set';
import infoIcon from '../../assets/info.svg';
import horieditIcon from '../../assets/edit-hori.svg';

export default function Excercise({ 
    excercise, 
    weekRir, 
    weekNo, 
    workout, 
    setWorkout, 
    disabled = false 
}) {
    const [muscle, setMuscle] = useState(null);
    const [setsCompleted, setSetsComplete] = useState(false);
    const [autoRegulationSubmitted, setAutoRegulationSubmitted] = useState(excercise.autoregulation);
    const [isEditing, setIsEditing] = useState(false);
    const [infoShown, setInfoShown] = useState(false);
    const [addExcerciseShown, setAddExcerciseShown] = useState(false);
    const [replaceExcerciseShown, setReplaceExcerciseShown] = useState(false);
    const [lastWeekData, setLastWeekData] = useState([]);
    const [showTimer, setShowTimer] = useState(false);
    const [updatingSets, setUpdatingSets] = useState({});
    const formRef = useRef(null);
    const infoRef = useRef(null);

    // Re-derive the exercise from the global workout each render
    const updatedExcercise = workout.excercises.find(e => e.id === excercise.id) || excercise;

    console.log(updatedExcercise);
    console.log(excercise);

    const handleSetDataFetch = (data) => {
        setLastWeekData((prevData) => {
            const existingIndex = prevData.findIndex((item) => item.setId === data.setId);
            if (existingIndex >= 0) {
                const updatedData = [...prevData];
                updatedData[existingIndex] = data;
                return updatedData;
            }
            return [...prevData, data];
        });
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/musclegroups/${updatedExcercise.muscleGroupId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => setMuscle(data))
            .catch((error) => console.error('Error:', error));
    }, [updatedExcercise.muscleGroupId]);

    useEffect(() => {
        if (updatedExcercise.sets && updatedExcercise.sets.length > 0) {
            const allSetsCompleted = updatedExcercise.sets.every((set) => set.completed === true);
            setSetsComplete(allSetsCompleted);
        }
    }, [updatedExcercise.sets]);

    useEffect(() => {
        setWorkout((prev) => ({
            ...prev,
            excercises: prev.excercises.map((e) =>
                e.id === updatedExcercise.id ? { ...e, completed: setsCompleted } : e
            ),
        }));
    }, [setsCompleted, updatedExcercise.id, setWorkout]);

    const handleDeleteSet = async (setId) => {
        if (disabled) return;
        const updatedSets = updatedExcercise.sets.filter((set) => set.id !== setId);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/set/${setId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(response);
            }
        } catch (error) {
            console.error('Error deleting set:', error);
        }
        setWorkout((prev) => ({
            ...prev,
            excercises: prev.excercises.map((e) =>
                e.id === updatedExcercise.id ? { ...e, sets: updatedSets } : e
            ),
        }));
    };

    const handleAddSet = async () => {
        if (disabled) return;

        const numSets = updatedExcercise.sets.length;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    excerciseId: updatedExcercise.id,
                    setNo: numSets + 1,
                    weight: 0,
                    reps: 0,
                }),
            });

            const newSet = await response.json();

            setWorkout((prev) => ({
                ...prev,
                excercises: prev.excercises.map((e) =>
                    e.id === updatedExcercise.id ? { ...e, sets: [...e.sets, newSet] } : e
                ),
            }));
        } catch (error) {
            console.error('Error adding new set:', error);
        }
    };

    const handleEditClick = () => {
        if (disabled) return;
        setIsEditing(!isEditing);
    };

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
        if (disabled) return;
        setAddExcerciseShown(true);
    };

    const handleReplaceExcercise = async () => {
        if (disabled) return;
        setReplaceExcerciseShown(true);
    };

    const handleDeleteExcercise = async () => {
        if (disabled) return;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/excercises/${updatedExcercise.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete exercise');
            }

            setWorkout((prev) => ({
                ...prev,
                excercises: prev.excercises.filter((e) => e.id !== updatedExcercise.id),
            }));
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };

    const handleInfoShown = () => {
        if (disabled) return;
        setInfoShown(true);
    };

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

    const handlePlayClick = () => {
        setShowTimer(true);
    }

    const handleTimerClose = () => {
        setShowTimer(false);
    }

    const onSetUpdate = async ({ setId, weight, reps, activity, rest, completed, setWorkout }) => {
        setUpdatingSets((prev) => ({ ...prev, [setId]: true }));
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/set/${setId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ weight, reps, activity, rest, completed })
        });

        setWorkout((prev) => ({
            ...prev,
            excercises: prev.excercises.map((exc) => ({
                ...exc,
                sets: exc.sets.map((s) =>
                    s.id === setId
                        ? { ...s, weight, reps, activity, rest, completed }
                        : s
                ),
            })),
        }));

        setUpdatingSets((prev) => ({ ...prev, [setId]: false }));
    };

    return (
        <div
            className={`w-[100%] max-w-screen-sm mx-auto bg-background-secondary p-8 flex flex-col ${
                setsCompleted ? 'border-2 border-green-400' : 'border-2 border-border'
            }`}
        >
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <p className="p-1 text-secondary-text inter-main">
                        {muscle ? muscle.name : ''}
                        {updatedExcercise?.progressionType === 'linear'
                            ? ' - Linear progression'
                            : updatedExcercise.progressionType === 'none'
                            ? ' - No set progression'
                            : updatedExcercise.progressionType === 'auto'
                            ? ' - Auto Regulated progression'
                            : ''}
                    </p>
                    <h2 className="text-xl p-1 text-primary-text inter-bold">{updatedExcercise.name}</h2>
                    
                    {/* Display Exercise Notes */}
                    {updatedExcercise.notes && (
                        <div className="mt-2 p-2 bg-gray-100 rounded-md">
                            <p className="text-sm text-gray-700">{updatedExcercise.notes}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-4 items-center relative">
                    <button onClick={handleInfoShown} disabled={disabled} aria-label="Show Exercise Info">
                        <Image src={infoIcon} alt="info" />
                    </button>
                    <button onClick={handleEditClick} disabled={disabled || updatedExcercise.completed} aria-label="Edit Exercise">
                        <Image src={horieditIcon} alt="edit exercise" />
                    </button>
                    
                    {/* Edit Form */}
                    {isEditing && !disabled && (
                        <div
                            ref={formRef}
                            className="absolute top-[10%] translate-x-[-70%] z-50 w-[175px]"
                        >
                            <ExcerciseForm
                                onAdd={handleAddExcercise}
                                onReplace={handleReplaceExcercise}
                                onDelete={handleDeleteExcercise}
                            />
                        </div>
                    )}

                    {/* Info Popup */}
                    {infoShown && (
                        <div
                            ref={infoRef}
                            className="absolute translate-x-[-50%] md:translate-x-[-70%] z-50 bg-white p-2 shadow-lg rounded-md"
                        >
                            <ExcerciseInfo
                                name={updatedExcercise.name}
                                lastWeekData={lastWeekData}
                            />
                        </div>
                    )}

                    {/* Add Excercise Popup */}
                    {addExcerciseShown && !disabled && (
                        <AddExcercise
                            onClose={() => setAddExcerciseShown(false)}
                            setWorkout={setWorkout}
                            workout={workout}
                        />
                    )}

                    {/* Replace Excercise Popup */}
                    {replaceExcerciseShown && !disabled && (
                        <ReplaceExcercise
                            onClose={() => setReplaceExcerciseShown(false)}
                            setWorkout={setWorkout}
                            workout={workout}
                            excercise={updatedExcercise}
                        />
                    )}

                    {/* Auto Regulation Form */}
                    {setsCompleted && !autoRegulationSubmitted && !disabled && updatedExcercise.progressionType === 'auto' && (
                        <AutoRegulationForm
                            setSubmission={setAutoRegulationSubmitted}
                            id={updatedExcercise.id}
                            weekNo={weekNo}
                        />
                    )}
                </div>
            </div>

            {/* Cardio vs. Non-Cardio Rendering */}
            {muscle?.name === 'Cardio' ? (
                <>
                    {/* Cardio Header */}
                    <div className="w-[60%] flex justify-between mx-8 my-2 text-secondary-text inter-main">
                        <h2>Activity (s)</h2>
                        <h2>Rest (s)</h2>
                    </div>
                    
                    {/* Cardio Sets */}
                    {updatedExcercise.sets.map((set, index) => (
                        <Set
                            key={index}
                            setId={set.id}
                            Rir={weekRir}
                            workout={workout}
                            setWorkout={setWorkout}
                            onDelete={() => handleDeleteSet(set.id)}
                            onAdd={handleAddSet}
                            onDataFetch={handleSetDataFetch}
                            disabled={disabled}
                            initialWeight={set?.weight}
                            initialReps={set?.reps}
                            activityTime={set?.activity}
                            restTime={set?.rest}
                            type='cardio'
                            updatingSets={updatingSets}
                            onSetUpdate={onSetUpdate}
                        />
                    ))}

                    {/* Begin Button */}
                    <button
                        onClick={handlePlayClick}
                        className="bg-highlight text-primary-text px-4 py-2 rounded mt-4 flex items-center justify-center hover:bg-highlight-dark transition-colors"
                        aria-label="Begin Cardio Timer"
                    >
                        <PlayIcon className="h-6 w-6 mr-2" />
                        Begin
                    </button>

                    {/* Timer Popup */}
                    <TimerPopup
                        sets={updatedExcercise.sets}
                        onClose={handleTimerClose}
                        visible={showTimer}
                        setWorkout={setWorkout}
                    />
                </>
            ) : updatedExcercise.sets.length === 0 ? (
                updatedExcercise.progressionType === 'auto' ? (
                    <>
                        <p>Sets not programmed yet</p>
                        <p className="text-secondary-text">
                            Complete previous workouts to get autoregulated set volumes
                        </p>
                    </>
                ) : (
                    <p>No sets programmed for this exercise</p>
                )
            ) : (
                <>
                    {/* Non-Cardio Header */}
                    <div className="w-[60%] flex justify-between mx-8 my-2 text-secondary-text inter-main">
                        <h2>Weight</h2>
                        <h2>Reps</h2>
                    </div>
                    
                    {/* Non-Cardio Sets */}
                    {updatedExcercise.sets.map((set, index) => (
                        <Set
                            key={index}
                            setId={set.id}
                            Rir={weekRir}
                            workout={workout}
                            setWorkout={setWorkout}
                            onDelete={() => handleDeleteSet(set.id)}
                            onAdd={handleAddSet}
                            onDataFetch={handleSetDataFetch}
                            disabled={disabled}
                            initialReps={set?.reps}
                            initialWeight={set?.weight}
                            activityTime={set?.activity}
                            restTime={set?.rest}
                            updatingSets={updatingSets}
                            onSetUpdate={onSetUpdate}
                        />
                    ))}
                </>
            )}

            {/* Completion Message */}
            {setsCompleted && <p className="text-green-500 inter-bold mt-4">All sets completed!</p>}
        </div>
    )
}
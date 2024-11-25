import { useState, useEffect } from 'react';
import Excercises from './Excercises';

export default function Excercise({
    muscleId,
    muscleName,
    excercise,
    setProgram,
    workout,
    excerciseindex,
    onDelete,
    advanced
}) {
    const [showExcercises, setShowExcercises] = useState(false);
    const [selectedExcercise, setSelectedExcercise] = useState(excercise?.name);

    // New state variables for additional capabilities
    const [setProgressionType, setSetProgressionType] = useState('linear');
    const [startSets, setStartSets] = useState(2); // Default start sets
    const [endSets, setEndSets] = useState(4); // Default end sets

    const handleSelectExcercise = (e, excercise) => {
        e.preventDefault();
        setSelectedExcercise(excercise);

        setProgram((prev) => {
            const newProgram = { ...prev };

            newProgram.weeks.forEach((week) => {
                week.workouts.forEach((session) => {
                    if (session.name === workout) {
                        if (session.excercises.length <= excerciseindex) {
                            session.excercises.push({
                                muscle: muscleName,
                                name: excercise,
                                setProgression: setProgressionType,
                                startSets: startSets,
                                endSets: endSets,
                            });
                        } else {
                            session.excercises[excerciseindex] = {
                                muscle: muscleName,
                                name: excercise,
                                setProgression: setProgressionType,
                                startSets: startSets,
                                endSets: endSets,
                            };
                        }
                    }
                });
            });

            return newProgram;
        });

        setShowExcercises(false);
    };

    const handleShowExcercises = (e) => {
        e.preventDefault();
        setShowExcercises(true);
    };

    useEffect(() => {
        setProgram((prev) => {
            const newProgram = { ...prev };
    
            newProgram.weeks.forEach((week) => {
                week.workouts.forEach((session) => {
                    if (session.name === workout) {
                        if (session.excercises.length > excerciseindex) {
                            session.excercises[excerciseindex] = {
                                ...session.excercises[excerciseindex],
                                setProgression: setProgressionType,
                                startSets: startSets,
                                endSets: endSets,
                            };
                        }
                    }
                });
            });
    
            return newProgram;
        });
    }, [setProgressionType, startSets, endSets]);

    return (
        <>
            <div className="bg-background-secondary p-2 flex flex-col space-y-2 items-baseline relative text-primary-text">
                <h2 className="bg-highlight p-1 text-secondary-text">{muscleName}</h2>
                <button
                    onClick={handleShowExcercises}
                    className="w-[100%] h-[100%] text-left border-solid border-2 border-gray-700 p-1"
                >
                    {selectedExcercise ? selectedExcercise : 'Select Exercise'}
                </button>

                {advanced && (
                <>
                <label className="flex flex-col w-full mt-2">
                    Set Progression Type:
                    <select
                        value={setProgressionType}
                        onChange={(e) => setSetProgressionType(e.target.value)}
                        className="border border-border p-1 mt-1"
                    >
                        <option value="linear">Linear</option>
                        <option value="none">None</option>
                    </select>
                </label>

                <div className='flex'>
                <label className="flex flex-col w-full mt-2">
                    Start Sets:
                    <input
                        type="number"
                        min="1"
                        value={startSets}
                        onChange={(e) => setStartSets(Number(e.target.value))}
                        className="border border-border p-1 mt-1"
                    />
                </label>

                {setProgressionType === 'linear' && (
                <label className="flex flex-col w-full mt-2">
                End Sets:
                <input
                    type="number"
                    min="1"
                    value={endSets}
                    onChange={(e) => setEndSets(Number(e.target.value))}
                    className="border border-border p-1 mt-1"
                />
                </label>    
                )}
                </div>
                </>
                )}


                {/* Delete Button */}
                <button
                    onClick={onDelete}
                    className="absolute top-0 right-0 p-1 m-2 text-red-500 hover:text-red-700"
                >
                    &#10006;
                </button>
            </div>
            {showExcercises && (
                <Excercises
                    muscle={muscleId}
                    visible={showExcercises}
                    onClose={() => setShowExcercises(false)}
                    selectExcercise={handleSelectExcercise}
                    muscleGroups={null}
                    workoutId={null}
                >
                    <></>
                </Excercises>
            )}
        </>
    );
}

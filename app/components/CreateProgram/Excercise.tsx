import { useState, useEffect } from 'react';
import Excercises from './Excercises';
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/outline";

// Sub-component for Non-Cardio Exercises
const NonCardioFields = ({ startSets, setStartSets, endSets, setEndSets, setProgressionType }) => (
    <div className="flex flex-col space-y-4 mt-2">
        <div className="flex space-x-4">
            {/* Start Sets Input */}
            <label className="flex flex-col">
                Start Sets:
                <input
                    type="number"
                    min="1"
                    value={startSets}
                    onChange={(e) => setStartSets(Number(e.target.value))}
                    className="border border-border p-1 mt-1 w-24"
                />
            </label>
            
            {/* End Sets Input (only shown if setProgressionType is 'linear') */}
            {setProgressionType === 'linear' && (
                <label className="flex flex-col">
                    End Sets:
                    <input
                        type="number"
                        min="1"
                        value={endSets}
                        onChange={(e) => setEndSets(Number(e.target.value))}
                        className="border border-border p-1 mt-1 w-24"
                    />
                </label>
            )}
        </div>
    </div>
);

// Sub-component for Cardio Exercises
const CardioFields = ({
    trainingTypeState,
    setTrainingTypeState,
    activityTime,
    setActivityTime,
    restTime,
    setRestTime,
    cycles,
    setCycles,
    weeklyCardioProgression,
    setWeeklyCardioProgression
}) => (
    <div className="flex flex-col space-y-4 mt-2">
        {/* Training Type Selection */}
        <div className='flex gap-2'>
            <label className="flex flex-col">
                Training Type:
                <select
                    value={trainingTypeState}
                    onChange={(e) => setTrainingTypeState(e.target.value)}
                    className="border border-border p-1 mt-1 h-8"
                >
                    <option value="HIIT">HIIT</option>
                    <option value="MISS">MISS</option>
                    <option value="LISS">LISS</option>
                </select>
            </label>

            {/* Cycles (Not shown for LISS) */}
            {trainingTypeState !== "LISS" && (
                <label className="flex flex-col">
                    No of Cycles:
                    <input
                        type="number"
                        min="1"
                        value={cycles}
                        onChange={(e) => setCycles(Number(e.target.value))}
                        className="border border-border p-1 mt-1 w-24 h-8"
                    />
                </label>
            )}
        </div>

        {/* Activity Time */}
        <label className="flex flex-col">
            Activity Time (seconds):
            <input
                type="number"
                min="1"
                value={activityTime}
                onChange={(e) => setActivityTime(Number(e.target.value))}
                className="border border-border p-1 mt-1 w-24"
            />
        </label>

        {/* Rest Time (only shown if not LISS) */}
        {trainingTypeState !== "LISS" && (
            <label className="flex flex-col">
                Rest Time (seconds):
                <input
                    type="number"
                    min="0"
                    value={restTime}
                    onChange={(e) => setRestTime(Number(e.target.value))}
                    className="border border-border p-1 mt-1 w-24"
                />
            </label>
        )}

        {/* Checkbox for Weekly Cardio Progression */}
        <label className="flex items-center mt-2">
            <input
                type="checkbox"
                checked={weeklyCardioProgression}
                onChange={(e) => setWeeklyCardioProgression(e.target.checked)}
                className="mr-2"
            />
            Implement Weekly Cardio Progression
        </label>
    </div>
);

export default function Excercise({
    muscleId,
    muscleName,
    excercise,
    setWorkoutDetails,
    setProgram,
    handleMoveUp,
    handleMoveDown,
    workout,
    excerciseindex,
    onDelete,
    advanced,
    progressionType,
    startSetCount,
    endSetCount
}) {

    const [showExcercises, setShowExcercises] = useState(false);
    const initialSelectedExcercise = Array.isArray(excercise) ? excercise[0] : excercise;
    const [selectedExcercise, setSelectedExcercise] = useState(initialSelectedExcercise);
    const [setProgressionType, setSetProgressionType] = useState(progressionType);

    // Default sets
    const [startSets, setStartSets] = useState(startSetCount || 2);
    const [endSets, setEndSets] = useState(endSetCount || 4);

    // Cardio-specific states
    const [trainingTypeState, setTrainingTypeState] = useState(excercise?.trainingType || "HIIT"); 
    const [activityTime, setActivityTime] = useState(excercise?.activityTime || 30);
    const [restTime, setRestTime] = useState(excercise?.restTime || 15);
    const [cycles, setCycles] = useState(excercise?.cycles || 5);

    // New state for weekly cardio progression
    const [weeklyCardioProgression, setWeeklyCardioProgression] = useState(excercise?.weeklyCardioProgression || false);

    const handleSelectExcercise = (e, chosenExcercise) => {
        e.preventDefault();
        setSelectedExcercise(chosenExcercise);

        setWorkoutDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[excerciseindex] = {
                ...updatedDetails[excerciseindex],
                excercise: {
                    ...chosenExcercise,
                    name: chosenExcercise
                }
            };
            return updatedDetails;
        });

        setProgram((prev) => {
            const newProgram = { ...prev };

            newProgram.weeks.forEach((week) => {
                week.workouts.forEach((session) => {
                    if (session.name === workout) {
                        if (session.excercises.length <= excerciseindex) {
                            session.excercises.push({
                                muscle: muscleName,
                                name: chosenExcercise,
                                excerciseNo: excerciseindex,
                                setProgression: setProgressionType,
                                startSets: startSets,
                                endSets: endSets,
                                trainingType: trainingTypeState,
                                activityTime: activityTime,
                                restTime: trainingTypeState === "LISS" ? 0 : restTime,
                                cycles: trainingTypeState === "LISS" ? 1 : cycles,
                                weeklyCardioProgression: weeklyCardioProgression,
                            });
                        } else {
                            session.excercises[excerciseindex] = {
                                muscle: muscleName,
                                name: chosenExcercise,
                                excerciseNo: excerciseindex,
                                setProgression: setProgressionType,
                                startSets: startSets,
                                endSets: endSets,
                                trainingType: trainingTypeState,
                                activityTime: activityTime,
                                restTime: trainingTypeState === "LISS" ? 0 : restTime,
                                cycles: trainingTypeState === "LISS" ? 1 : cycles,
                                weeklyCardioProgression: weeklyCardioProgression,
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
                    if (session.name === workout && session.excercises.length > excerciseindex) {
                        session.excercises[excerciseindex] = {
                            ...session.excercises[excerciseindex],
                            setProgression: setProgressionType,
                            // Only set sets if not Cardio
                            ...(muscleName !== "Cardio" && {
                                startSets: startSets,
                                endSets: endSets,
                            }),
                            trainingType: trainingTypeState,
                            activityTime: activityTime,
                            ...(trainingTypeState !== "LISS" && { restTime: restTime }),
                            cycles: trainingTypeState === "LISS" ? 1 : cycles,
                            weeklyCardioProgression: weeklyCardioProgression,
                        };
                    }
                });
            });
    
            return newProgram;
        });
    }, [
        setProgressionType,
        startSets,
        endSets,
        trainingTypeState,
        activityTime,
        restTime,
        cycles,
        muscleName,
        excerciseindex,
        setProgram,
        workout,
        weeklyCardioProgression
    ]);

    return (
        <>
            <div className="bg-background-secondary p-2 flex flex-col space-y-2 items-baseline relative text-primary-text">
                {/* Header Section */}
                <div className='flex justify-between w-[60%] items-center'>
                    <h2 className="bg-highlight p-1 text-secondary-text">{muscleName}</h2>
                    <div className='flex flex-col'>
                        <button onClick={(e) => handleMoveUp(e, excerciseindex)} aria-label="Move Up">
                            <ChevronUpIcon className="h-6 w-6 text-primary-text" />
                        </button>
                        <button onClick={(e) => handleMoveDown(e, excerciseindex)} aria-label="Move Down">
                            <ChevronDownIcon className="h-6 w-6 text-primary-text" />
                        </button>
                    </div>
                </div>

                {/* Exercise Selection Button */}
                <button
                    onClick={handleShowExcercises}
                    className="w-[100%] h-10 text-left border-solid border-2 border-gray-700 p-1 rounded-md"
                >
                    {selectedExcercise ? selectedExcercise.name : 'Select Exercise'}
                </button>

                {/* Advanced Options */}
                {advanced && (
                    <>
                        {/* Set Progression Type */}
                        <label className="flex flex-col w-full mt-2">
                            Set Progression Type:
                            <select
                                value={setProgressionType}
                                onChange={(e) => setSetProgressionType(e.target.value)}
                                className="border border-border p-1 mt-1 rounded-md"
                            >
                                <option value="linear">Linear</option>
                                <option value="none">None</option>
                                <option value="auto">Auto</option>
                            </select>
                        </label>

                        {/* Conditional Rendering Based on Progression Type */}
                        {setProgressionType !== 'auto' && (
                            <>
                                {/* Non-Cardio Fields */}
                                {muscleName !== "Cardio" && (
                                    <NonCardioFields
                                        startSets={startSets}
                                        setStartSets={setStartSets}
                                        endSets={endSets}
                                        setEndSets={setEndSets}
                                        setProgressionType={setProgressionType}
                                    />
                                )}

                                {/* Cardio Fields */}
                                {muscleName === "Cardio" && (
                                    <CardioFields
                                        trainingTypeState={trainingTypeState}
                                        setTrainingTypeState={setTrainingTypeState}
                                        activityTime={activityTime}
                                        setActivityTime={setActivityTime}
                                        restTime={restTime}
                                        setRestTime={setRestTime}
                                        cycles={cycles}
                                        setCycles={setCycles}
                                        weeklyCardioProgression={weeklyCardioProgression}
                                        setWeeklyCardioProgression={setWeeklyCardioProgression}
                                    />
                                )}
                            </>
                        )}

                        {/* Exercise Notes */}
                        <div className="w-full my-4">
                            <label htmlFor="excercise-notes" className="block text-primary-text inter-bold mb-2">
                                Exercise Notes:
                            </label>
                            <textarea
                                id="excercise-notes"
                                className="w-full h-16 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-highlight"
                                placeholder="Enter exercise cues here..."
                                rows={2}
                                // Add state and handler if needed
                            />
                        </div>
                    </>
                )}

                {/* Delete Button */}
                <button
                    onClick={onDelete}
                    className="absolute top-0 right-0 p-1 m-2 text-red-500 hover:text-red-700"
                    aria-label="Delete Exercise"
                >
                    &#10006;
                </button>
            </div>

            {/* Excercises Modal */}
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

import { useState, useEffect } from 'react';
import Excercises from './Excercises';
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/outline";

// Sub-component for Non-Cardio Exercises
const NonCardioFields = ({ startSets, setStartSets, endSets, setEndSets, setProgressionType }) => (
    <div className="flex flex-col space-y-4 mt-2">
        <div className="flex flex-col space-y-2">
            {/* Start Sets Input */}
            <label className="flex flex-col">
                Start Sets:
                <input
                    type="number"
                    min="1"
                    value={startSets}
                    onChange={(e) => setStartSets(Number(e.target.value))}
                    className="border border-border p-1 mt-1 w-24 rounded-md"
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
                        className="border border-border p-1 mt-1 w-24 rounded-md"
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
    startCycles,
    setStartCycles,
    endCycles,
    setEndCycles,
    startActivityTime,
    setStartActivityTime,
    endActivityTime,
    setEndActivityTime
}) => (
    <div className="flex flex-col space-y-4 mt-2">
        {/* Training Type Selection */}
        <div className='flex flex-col space-y-2'>
            <label className="flex flex-col">
                Training Type:
                <select
                    value={trainingTypeState}
                    onChange={(e) => setTrainingTypeState(e.target.value)}
                    className="border border-border p-1 mt-1 h-8 rounded-md"
                >
                    <option value="HIIT">HIIT</option>
                    <option value="MISS">MISS</option>
                    <option value="LISS">LISS</option>
                </select>
            </label>
        </div>

        {/* Conditional Rendering Based on Training Type */}
        {trainingTypeState === "HIIT" || trainingTypeState === "MISS" ? (
            <div className="flex flex-col space-y-2">
                {/* Activity Time */}
                <label className="flex flex-col">
                    Activity (s):
                    <input
                        type="number"
                        min="1"
                        value={activityTime}
                        onChange={(e) => setActivityTime(Number(e.target.value))}
                        className="border border-border p-1 mt-1 w-24 rounded-md"
                    />
                </label>

                {/* Rest Time */}
                <label className="flex flex-col">
                    Rest (s):
                    <input
                        type="number"
                        min="0"
                        value={restTime}
                        onChange={(e) => setRestTime(Number(e.target.value))}
                        className="border border-border p-1 mt-1 w-24 rounded-md"
                    />
                </label>

                {/* Start Cycles */}
                <label className="flex flex-col">
                    Start Cycles:
                    <input
                        type="number"
                        min="1"
                        value={startCycles}
                        onChange={(e) => setStartCycles(Number(e.target.value))}
                        className="border border-border p-1 mt-1 w-24 rounded-md"
                    />
                </label>

                {/* End Cycles */}
                <label className="flex flex-col">
                    End Cycles:
                    <input
                        type="number"
                        min="1"
                        value={endCycles}
                        onChange={(e) => setEndCycles(Number(e.target.value))}
                        className="border border-border p-1 mt-1 w-24 rounded-md"
                    />
                </label>
            </div>
        ) : trainingTypeState === "LISS" ? (
            <div className="flex flex-col space-y-2">
                {/* Start Activity Time */}
                <label className="flex flex-col">
                    Start Activity Time (seconds):
                    <input
                        type="number"
                        min="1"
                        value={startActivityTime}
                        onChange={(e) => setStartActivityTime(Number(e.target.value))}
                        className="border border-border p-1 mt-1 w-24 rounded-md"
                    />
                </label>

                {/* End Activity Time */}
                <label className="flex flex-col">
                    End Activity Time (seconds):
                    <input
                        type="number"
                        min="1"
                        value={endActivityTime}
                        onChange={(e) => setEndActivityTime(Number(e.target.value))}
                        className="border border-border p-1 mt-1 w-24 rounded-md"
                    />
                </label>
            </div>
        ) : null}
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

    console.log('EXCERCISE CHECK', excercise);

    const [showExcercises, setShowExcercises] = useState(false);
    
    // Initialize selectedExcercise based on whether excercise is an array
    const initialSelectedExcercise = Array.isArray(excercise) ? (excercise[0]?.name || excercise[0]) : excercise;
    const [selectedExcercise, setSelectedExcercise] = useState(initialSelectedExcercise);

    const [setProgressionType, setSetProgressionType] = useState(progressionType);

    const [excerciseNotes, setExcerciseNotes] = useState('');

    // Default sets
    const [startSets, setStartSets] = useState(startSetCount || 2);
    const [endSets, setEndSets] = useState(endSetCount || 4);

    // Cardio-specific states
    const [trainingTypeState, setTrainingTypeState] = useState(excercise?.trainingType || "HIIT"); 
    const [activityTime, setActivityTime] = useState(excercise?.activityTime || 30);
    const [restTime, setRestTime] = useState(excercise?.restTime || 15);
    const [startCycles, setStartCycles] = useState(excercise?.startCycles || 5);
    const [endCycles, setEndCycles] = useState(excercise?.endCycles || 10);
    const [startActivityTime, setStartActivityTime] = useState(excercise?.startActivityTime || 15);
    const [endActivityTime, setEndActivityTime] = useState(excercise?.endActivityTime || 30);

    // Update selectedExcercise if excercise prop changes
    useEffect(() => {
        if (Array.isArray(excercise)) {
            setSelectedExcercise(excercise[0]?.name || excercise[0] || null); // Set to first item or null if empty
        } else {
            setSelectedExcercise(excercise);
        }
    }, [excercise]);

    const handleSelectExcercise = (e, chosenExcercise) => {
        e.preventDefault();
        setSelectedExcercise(chosenExcercise);

        setWorkoutDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[excerciseindex] = {
                ...updatedDetails[excerciseindex],
                excercise: {
                    ...chosenExcercise,
                    name: chosenExcercise.name || chosenExcercise
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
                                name: chosenExcercise.name || chosenExcercise,
                                excerciseNo: excerciseindex,
                                setProgression: setProgressionType,
                                startSets: startSets,
                                endSets: endSets,
                                trainingType: trainingTypeState,
                                activityTime: activityTime,
                                restTime: trainingTypeState === "LISS" ? 0 : restTime,
                                startCycles: trainingTypeState === "LISS" ? 0 : startCycles,
                                endCycles: trainingTypeState === "LISS" ? 0 : endCycles,
                                startActivityTime: trainingTypeState === "LISS" ? startActivityTime : 0,
                                endActivityTime: trainingTypeState === "LISS" ? endActivityTime : 0,
                            });
                        } else {
                            session.excercises[excerciseindex] = {
                                muscle: muscleName,
                                name: chosenExcercise.name || chosenExcercise,
                                excerciseNo: excerciseindex,
                                setProgression: setProgressionType,
                                startSets: startSets,
                                endSets: endSets,
                                trainingType: trainingTypeState,
                                activityTime: activityTime,
                                restTime: trainingTypeState === "LISS" ? 0 : restTime,
                                startCycles: trainingTypeState === "LISS" ? 0 : startCycles,
                                endCycles: trainingTypeState === "LISS" ? 0 : endCycles,
                                startActivityTime: trainingTypeState === "LISS" ? startActivityTime : 0,
                                endActivityTime: trainingTypeState === "LISS" ? endActivityTime : 0,
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
                            restTime: trainingTypeState !== "LISS" ? restTime : 0,
                            startCycles: trainingTypeState === "LISS" ? 0 : startCycles,
                            endCycles: trainingTypeState === "LISS" ? 0 : endCycles,
                            startActivityTime: trainingTypeState === "LISS" ? startActivityTime : 0,
                            endActivityTime: trainingTypeState === "LISS" ? endActivityTime : 0,
                            notes: excerciseNotes
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
        startCycles,
        endCycles,
        startActivityTime,
        endActivityTime,
        muscleName,
        excerciseindex,
        setProgram,
        workout,
        excerciseNotes
    ]);

    return (
        <>
            <div className="bg-background-secondary p-2 flex flex-col space-y-2 items-baseline relative text-primary-text">
                {/* Header Section */}
                <div className='flex justify-between w-full md:w-[60%] items-center'>
                    <h2 className="bg-highlight p-1 text-secondary-text rounded-md">{muscleName}</h2>
                    <div className='flex flex-col space-y-1'>
                        <button onClick={(e) => handleMoveUp(e, excerciseindex)} aria-label="Move Up">
                            <ChevronUpIcon className="h-6 w-6 text-primary-text hover:text-highlight transition-colors" />
                        </button>
                        <button onClick={(e) => handleMoveDown(e, excerciseindex)} aria-label="Move Down">
                            <ChevronDownIcon className="h-6 w-6 text-primary-text hover:text-highlight transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Exercise Selection Button */}
                <button
                    onClick={handleShowExcercises}
                    className="w-full h-10 text-left border border-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                    {selectedExcercise ? (selectedExcercise.name || selectedExcercise) : 'Select Exercise'}
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
                                        startCycles={startCycles}
                                        setStartCycles={setStartCycles}
                                        endCycles={endCycles}
                                        setEndCycles={setEndCycles}
                                        startActivityTime={startActivityTime}
                                        setStartActivityTime={setStartActivityTime}
                                        endActivityTime={endActivityTime}
                                        setEndActivityTime={setEndActivityTime}
                                    />
                                )}
                            </>
                        )}

                        {/* Exercise Notes */}
                        <div className="w-full my-4">
                            <label htmlFor="excercise-notes" className="block text-primary-text font-semibold mb-2">
                                Exercise Notes:
                            </label>
                            <textarea
                                id="excercise-notes"
                                className="w-full h-16 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-highlight"
                                placeholder="Enter exercise cues here..."
                                rows={2}
                                value={excerciseNotes}
                                onChange={(e) => setExcerciseNotes(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {/* Delete Button */}
                <button
                    onClick={onDelete}
                    className="absolute top-0 right-0 p-1 m-2 text-red-500 hover:text-red-700 transition-colors"
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

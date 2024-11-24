import { useState } from 'react';
import Excercises from './Excercises';

export default function Excercise({ muscleId, muscleName, excercise, setProgram, workout, excerciseindex, onDelete }) {
    const [showExcercises, setShowExcercises] = useState(false);
    const [selectedExcercise, setSelectedExcercise] = useState(excercise?.name);

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
                            });
                        } else {
                            session.excercises[excerciseindex] = {
                                muscle: muscleName,
                                name: excercise,
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

    return (
        <>
            <div className="bg-background-secondary p-2 flex flex-col space-y-2 items-baseline relative text-primary-text">
                <h2 className="bg-highlight p-1 text-secondary-text">{muscleName}</h2>
                <button
                    onClick={handleShowExcercises}
                    className="w-[100%] h-[100%] text-left border-solid border-2 border-gray-700 p-1"
                >
                    {selectedExcercise ? selectedExcercise : 'Select Excercise'}
                </button>
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
"use client";

import { useState } from 'react';
import Excercises from './Excercises';

export default function Excercise({ muscleId, muscleName, excercise, setProgram, workout, excerciseindex}) {

    const [showExcercises, setShowExcercises] = useState(false);
    const [selectedExcercise, setSelectedExcercise] = useState(null);

    const handleSelectExcercise = (e, excercise) => {
        e.preventDefault();
        setSelectedExcercise(excercise)
        setProgram((prev) => {
          const newProgram = { ...prev };
          newProgram.weeks[0].workouts.forEach((session) => {
            if (session.name === workout) {
    
                console.log(session.excercises);
    
                if(session.excercises.length <= excerciseindex) {
                    session.excercises.push({
                        muscle: muscleName,
                        excercise: excercise,
                    });
                } else {
                    session.excercises[excerciseindex] = {
                        muscle: muscleName,
                        excercise: excercise,
                    };
                }
    
            }
          });
          return newProgram;
        });
        setShowExcercises(false);
    }

    const handleShowExcercises = (e) => {
      e.preventDefault();
      setShowExcercises(true);
    }

    return (
        <>
            <div className="bg-gray-200 p-2 flex flex-col space-y-2 items-baseline">
              <h2 className="bg-gray-400 p-1">{muscleName}</h2>
              <button
                onClick={handleShowExcercises}
                className="w-[100%] h-[100%] text-left border-solid border-2 border-gray-700 p-1"
              > 
                {selectedExcercise ? selectedExcercise : 'Select Excercise'}
              </button>
            </div>
            {showExcercises && (
              <Excercises
                muscle={muscleId}
                visible={showExcercises}
                onClose={() => setShowExcercises(false)}
                selectExcercise={handleSelectExcercise}
              />
            )}
        </>
    )

}
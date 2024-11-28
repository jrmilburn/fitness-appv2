import { useState, useEffect } from 'react';
import Excercises from './Excercises';
import {  
    ChevronUpIcon, 
    ChevronDownIcon
} from "@heroicons/react/outline";

export default function Excercise({
    muscleId,
    muscleName,
    excercise,
    setProgram,
    handleMoveUp,
    handleMoveDown,
    workout,
    excerciseindex,
    onDelete,
    advanced
}) {
    const [showExcercises, setShowExcercises] = useState(false);
    const [selectedExcercise, setSelectedExcercise] = useState(excercise?.name);
    const [setProgressionType, setSetProgressionType] = useState(excercise?.setProgression || excercise?.progressionType || 'linear');
    const [startSets, setStartSets] = useState(excercise?.startSets || 2); // Default start sets
    const [endSets, setEndSets] = useState(excercise?.endSets || 2); // Default end sets

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
                                excerciseNo: excerciseindex,
                                setProgression: setProgressionType,
                                startSets: startSets,
                                endSets: endSets,
                            });
                        } else {
                            session.excercises[excerciseindex] = {
                                muscle: muscleName,
                                name: excercise,
                                excerciseNo: excerciseindex,
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
                <div className='flex justify-between w-[60%] items-center'>
                    <h2 className="bg-highlight p-1 text-secondary-text">{muscleName}</h2>
                    <div className='flex flex-col'>
                        <button className='' onClick={(e) => handleMoveUp(e, excerciseindex)}><ChevronUpIcon className="h-6 w-6 text-primary-text" /></button>
                        <button className='' onClick={(e) => handleMoveDown(e, excerciseindex)}><ChevronDownIcon className="h-6 w-6 text-primary-text" /></button>
                    </div>

                </div>

                <button
                    onClick={handleShowExcercises}
                    className="w-[100%] h-[100%] text-left border-solid border-2 border-gray-700 p-1"
                >
                    {selectedExcercise ? excercise.name : 'Select Exercise'}
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

    <div className="flex space-x-4 mt-2">
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
      />
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

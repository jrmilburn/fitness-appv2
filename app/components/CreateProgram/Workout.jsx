import Musclegroups from './Musclegroups';
import Excercise from './Excercise';
import { useState, useEffect } from 'react';
import { handleMoveUp, handleMoveDown } from '@/app/lib/factories/programFactory';

export default function Workout({ workout, setProgram, program, excercises, advanced, workoutIndex }) {
    const [muscleGroupsShown, setMuscleGroupsShown] = useState(false);
    const [workoutDetails, setWorkoutDetails] = useState([]);
    const [muscleGroups, setMuscleGroups] = useState([]);

    // Populate muscleGroups with all muscleGroup objects from excercises, including duplicates
    useEffect(() => {
        const initialWorkoutDetails = excercises.map((exercise) => ({
            muscleGroup: exercise.muscleGroup,
            exercise,
        }));
        setWorkoutDetails(initialWorkoutDetails);
    }, [excercises]);

    console.log('excercises from workout: ', excercises);

    const addMuscleGroup = (muscleGroup) => {
        setWorkoutDetails((prevDetails) => [
            ...prevDetails,
            { muscleGroup, exercise: null } // Add muscleGroup with no exercise initially
        ]);
        setMuscleGroupsShown(false);
    };

    const showMuscleGroups = (e) => {
        e.preventDefault();
        setMuscleGroupsShown(true);
    };

    // Function to remove a muscle group from the workout
    const removeMuscleGroup = (index) => {
        setWorkoutDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
    };

    const moveUp = (e, index) => {
        e.preventDefault();
        const newProgram = handleMoveUp(index, program, workoutIndex);
        setProgram(newProgram);
        setWorkoutDetails((prevDetails) => {
            if (index <= 0) return prevDetails; // Can't move the first item up
    
            const updatedDetails = [...prevDetails];
            [updatedDetails[index - 1], updatedDetails[index]] = [
                updatedDetails[index],
                updatedDetails[index - 1],
            ];
            return updatedDetails;
        });
    };

    const moveDown = (e, index) => {
        e.preventDefault();
        const newProgram = handleMoveDown(index, program, workoutIndex, excercises);
        setProgram(newProgram);
        setWorkoutDetails((prevDetails) => {
            if (index >= prevDetails.length - 1) return prevDetails; // Can't move the last item down
    
            const updatedDetails = [...prevDetails];
            [updatedDetails[index], updatedDetails[index + 1]] = [
                updatedDetails[index + 1],
                updatedDetails[index],
            ];
            return updatedDetails;
        });
    };

    return (
        <>
            <div className="bg-background min-w-64 p-4 flex flex-col space-y-4 justify">
                <h2 className="text-lg text-primary-text">{workout}</h2>
                <div className="flex flex-col space-y-4">
                {workoutDetails.map((detail, index) => (
                    <Excercise
                        key={`${workout.name}-${index}`}
                        excerciseindex={index}
                        handleMoveUp={moveUp}
                        handleMoveDown={moveDown}
                        muscleId={detail.muscleGroup?.id || null}
                        muscleName={detail.muscleGroup?.name || "Unspecified"}
                        excercise={detail.exercise}
                        setProgram={setProgram}
                        workout={workout}
                        onDelete={() => removeMuscleGroup(index)}
                        advanced={advanced}
                    />
                ))}
            </div>
                <button type="button" className="bg-background-secondary text-primary-text p-2" onClick={showMuscleGroups}>
                    Add Muscle Group +
                </button>
            </div>
            <Musclegroups
                visible={muscleGroupsShown}
                onClose={() => setMuscleGroupsShown(false)}
                onAdd={(muscleGroup) => addMuscleGroup(muscleGroup)}
                muscleGroups={muscleGroups}
                setMuscleGroups={setMuscleGroups}
            />
        </>
    );
}
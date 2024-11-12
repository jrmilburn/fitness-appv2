import Musclegroups from './Musclegroups';
import Excercise from './Excercise';
import { useState, useEffect } from 'react';

export default function Workout({ workout, setProgram, excercises }) {
    const [muscleGroupsShown, setMuscleGroupsShown] = useState(false);
    const [muscleGroups, setMuscleGroups] = useState([]);

    // Populate muscleGroups with all muscleGroup objects from excercises, including duplicates
    useEffect(() => {
        const allMuscleGroups = excercises.map((exercise) => exercise.muscleGroup);
        setMuscleGroups(allMuscleGroups);
    }, [excercises]);

    console.log('excercises from workout: ', excercises);

    const addMuscleGroup = (muscleGroup) => {
        setMuscleGroups([...muscleGroups, muscleGroup]);
        setMuscleGroupsShown(false);
    };

    const showMuscleGroups = (e) => {
        e.preventDefault();
        setMuscleGroupsShown(true);
    };

    // Function to remove a muscle group from the workout
    const removeMuscleGroup = (index) => {
        setMuscleGroups((prevGroups) =>
            prevGroups.filter((_, i) => i !== index)
        );
    };

    return (
        <>
            <div className="bg-gray-300 min-w-64 p-4 flex flex-col space-y-4">
                <h2 className="text-lg">{workout}</h2>
                <div className="flex flex-col space-y-4">
                    {muscleGroups.map((muscleGroup, index) => (
                        <Excercise
                            key={index}
                            excerciseindex={index}
                            muscleId={muscleGroup.id}
                            muscleName={muscleGroup.name}
                            excercise={excercises[index]}
                            setProgram={setProgram}
                            workout={workout}
                            onDelete={() => removeMuscleGroup(index)} // Pass delete handler
                        />
                    ))}
                </div>
                <button type="button" className="bg-gray-200 p-2" onClick={showMuscleGroups}>
                    Add Muscle Group +
                </button>
            </div>
            <Musclegroups visible={muscleGroupsShown} onClose={() => setMuscleGroupsShown(false)} onAdd={addMuscleGroup} />
        </>
    );
}
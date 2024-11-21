import Musclegroups from "../CreateProgram/Musclegroups";
import Excercises from "../CreateProgram/Excercises";
import { useState } from "react";
import Image from "next/image";

import backIcon from "../../assets/back.svg";

export default function ReplaceExcercise({ onClose, setWorkout, workout, excercise }) {
  const [formState, setFormState] = useState(0);
  const [muscle, setMuscle] = useState(null);
  const [muscleGroups, setMuscleGroups] = useState([])

  const selectMuscleGroup = (muscle) => {
    setMuscle(muscle);
    setFormState(1);
  };

  const handleSelectExcercise = async (replaceExcercise) => {
    const requestBody = {
      muscleId: muscle.id,
      muscleName: muscle.name,
      newExcercise: replaceExcercise,
      workoutId: workout.id,
      previousExcerciseId: excercise.id,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/excercises/${excercise.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const newExcercise = await response.json();

      setWorkout({
        ...workout,
        excercises: workout.excercises.map((ex) =>
          ex.id === excercise.id ? newExcercise : ex // Replace the old exercise with the new one
        ),
      });
    }

    onClose();
  };

  const handleBack = () => {
    setFormState(0);
  };

  return (
    <>
      {formState === 0 ? (
        <Musclegroups visible={true} onAdd={selectMuscleGroup} onClose={onClose} setMuscleGroups={setMuscleGroups} muscleGroups={muscleGroups} />
      ) : (
        <>
          <Excercises
            visible={true}
            onClose={onClose}
            muscle={muscle.id}
            selectExcercise={handleSelectExcercise}
            muscleGroups={muscleGroups}
            workoutId={workout.id}
          >
            <button onClick={handleBack} className="absolute z-50 right-10">
              <Image src={backIcon} alt="back" />
            </button>
          </Excercises>
        </>
      )}
    </>
  );
}

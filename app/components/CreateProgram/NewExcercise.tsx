"use client";

import RadioBtn from "../Radiobtn";
import { useState } from "react";

export default function NewExcercise({ workoutId, muscleGroups, onClose }) {
  const [muscle, setMuscle] = useState(""); // To store the selected muscle group
  const [exerciseName, setExerciseName] = useState(""); // To store the exercise name
  console.log('MUSCLE GROUPS', muscleGroups);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!exerciseName || !muscle) {
      alert("Please provide both an exercise name and select a muscle group.");
      return;
    }

    const newExercise = {
      workoutId,
      name: exerciseName,
      muscleGroupId: muscle,
    };

    console.log("New Exercise:", newExercise);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/excercises/create`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newExercise)
    })

    if(response.ok) {

    }

    onClose(); 
  };

  return (
    <div className="p-6 bg-background rounded w-full h-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-primary-text">Add New Exercise</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Exercise Name Input */}
        <div>
          <input
            id="exerciseName"
            type="text"
            className="mt-1 block w-full border-2 border-border bg-background rounded-md p-2 shadow-sm sm:text-sm"
            placeholder="Enter exercise name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            required
          />
        </div>

        {/* Muscle Group Radio Buttons */}
        <fieldset>
          <div className="mt-2 flex flex-wrap gap-2 text-xs justify-center">
            {muscleGroups?.map((group) => (
              <RadioBtn
                key={group.id}
                id={group.id}
                name="muscleGroup"
                text={group.name}
                onChange={() => setMuscle(group.id)}
                checked={muscle === group.name}
                size={1.5}
              />
            ))}
          </div>
        </fieldset>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-secondary-text text-gray-700 rounded hover:bg-highlight"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

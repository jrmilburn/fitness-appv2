"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Loader from '../Loader';
import Workout from './Workout';

export default function ProgramExercises({ program, setProgram, type, onPrevious, clientId = null }) {

  const { data: session } = useSession();

  // Initialize programNotes with program.notes if it exists
  const [programNotes, setProgramNotes] = useState(program?.notes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const router = useRouter();

  // Synchronize programNotes with program.notes
  useEffect(() => {
    setProgram(prevProgram => ({
      ...prevProgram,
      notes: programNotes
    }));
  }, [programNotes, setProgram]);

  const handleCreate = async (self = true) => {
    setIsLoading(true);
    console.log('CREATED PROGRAM: ', program);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: false,
          days: program.days,
          length: program.length,
          name: program.name,
          userId: clientId,
          self: self,
          notes: program.notes, // Include notes in the payload
          weeks: program.weeks.map((week) => ({
              weekNumber: week.weekNo || week.weekNumber,
              workouts: week.workouts.map((workout) => ({
                  name: workout.name,
                  excercises: workout.excercises.map((excercise) => ({
                      muscle: excercise?.muscleGroup?.name || excercise.muscle,
                      name: excercise?.name,
                      setProgression: excercise.progressionType || excercise.setProgression,
                      startSets: excercise.startSets,
                      endSets: excercise.endSets,
                      startCycles: excercise.startCycles,
                      endCycles: excercise.endCycles,
                      excerciseNo: excercise.excerciseNo,
                      trainingType: excercise.trainingType,
                      activityTime: excercise.activityTime,
                      startActivityTime: excercise.startActivityTime,
                      endActivityTime: excercise.endActivityTime,
                      restTime: excercise.restTime,
                      notes: excercise.notes
                  }))
              }))
          }))
        }),
      });

      if (response.ok) {
        router.push('/workouts/current');
      } else {
        // Handle non-OK responses
        const errorData = await response.json();
        console.error('Error creating program:', errorData);
        alert('Failed to create program. Please try again.');
      }
    } catch (error) {
      console.error('Error during program creation:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...program,
          notes: program.notes, // Ensure notes are included
        }),
      });

      if (response.ok) {
        router.push('/programs');
      } else {
        // Handle non-OK responses
        const errorData = await response.json();
        console.error('Error saving program:', errorData);
        alert('Failed to save program. Please try again.');
      }
    } catch (error) {
      console.error('Error during program save:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdvanced = (e) => {
    e.preventDefault();
    setAdvanced(prev => !prev);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="text-white text-lg flex items-center justify-center mb-4">
            <span className="text-3xl font-bold">Generating program</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Loader size={10} color="#fff" />
            <span className="text-white">This could take a few minutes...</span>
          </div>
        </div>
      )}

      <form className="w-full p-4 bg-background shadow-md rounded border-2">
        {/* Disclaimer Message */}
        <div className="mb-4">
          <p className="text-sm text-secondary-text text-center md:hidden">
            For the best experience, we recommend using the program builder on a desktop device.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:gap-8">
          <h2 className="text-2xl sm:text-3xl text-primary-text my-4">
            <strong>{program.name}</strong> Exercises
          </h2>
          <button
            type="button"
            className={`relative inter-bold border-2 text-primary-text border-border px-4 py-2 hover:bg-highlight rounded flex gap-2 mt-4 sm:mt-0 ${
              session?.user?.role === "USER" ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={toggleAdvanced}
            disabled={session?.user?.role === "USER"}
            aria-label="Toggle Advanced Builder"
          >
            {advanced ? 'Switch to Basic Builder' : 'Switch to Advanced Builder'}

          </button>
        </div>

        {/* Workouts Container */}
        <div className="w-full flex flex-col sm:overflow-x-auto">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full p-4 items-start max-w-[400px]">
            {(program.weeks.find(week => week.weekNo === 1) || program.weeks[0]).workouts.map((workout, index) => (
              <Workout
                key={`${workout.weekNo}-${index}`}
                workoutIndex={index}
                workout={workout.name}
                setProgram={setProgram}
                program={program}
                excercises={program.weeks[0].workouts[index].excercises}
                advanced={advanced}
              />
            ))}
          </div>

          {/* Program Notes Section */}
          <div className="w-full px-2 sm:px-4 my-4">
            <label htmlFor="program-notes" className="block text-primary-text font-semibold mb-2">
              Program Notes:
            </label>
            <textarea
              id="program-notes"
              className="w-full h-32 p-3 border border-border bg-background text-primary-text rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-highlight"
              placeholder="Enter any notes or comments about the program here..."
              value={programNotes}
              onChange={(e) => setProgramNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {type === 0 ? (
          <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 justify-center items-center">
            <button
              type="button"
              onClick={() => handleCreate(true)}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 mb-2 sm:mb-0"
            >
              Create Program
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 mb-2 sm:mb-0"
            >
              Save Program
            </button>
            <button
              type="button"
              onClick={onPrevious}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300"
            >
              Back
            </button>
          </div>
        ) : type === 1 ? (
          <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 justify-center items-center">
            <button
              type="button"
              onClick={() => handleCreate(true)}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 mb-2 sm:mb-0"
            >
              Copy Program
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300"
            >
              Save Program
            </button>
          </div>
        ) : (
          <div className="mt-4 flex justify-center items-center">
            <button
              type="button"
              onClick={() => handleCreate(false)}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300"
            >
              Assign Program
            </button>
          </div>
        )}
      </form>
    </>
  );
}

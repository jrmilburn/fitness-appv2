"use client";

import Workout from './Workout';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Loader from '../Loader';
import { useSession } from "next-auth/react";
import PremiumIcon from '../PremiumIcon'; 

export default function ProgramExercises({ program, setProgram, type, onPrevious, clientId=null }) {

  const { data: session } = useSession();

  console.log(session.user);

  const [isLoading, setIsLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const router = useRouter();

  const handleCreate = async (self=true) => {
    setIsLoading(true);
    console.log('CREATED PROGRAM: ', program);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/program`, {
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
                    excerciseNo: excercise.excerciseNo,
                    cycles: excercise.cycles,
                    excerciseType: excercise.trainingType,
                    activityTime: excercise.activityTime,
                    restTime: excercise.restTime
                }))
            }))
        }))
      }),
    });

    setIsLoading(false);

    if (response.ok) {
      router.push('/workouts/current');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(program),
    });

    setIsLoading(false);

    if (response.ok) {
      router.push('/programs');
    }
  };

  const toggleAdvanced = (e) => {
    e.preventDefault();
    const newAdvanced = !advanced;
    setAdvanced(newAdvanced);
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
            className="relative inter-bold border-2 text-primary-text border-border px-4 py-2 hover:bg-highlight rounded flex gap-2 mt-4 sm:mt-0"
            onClick={toggleAdvanced}
            disabled={session?.user?.role === "USER" ? true : false}
          >
            {advanced ? 'Switch to Basic Builder' : 'Switch to Advanced Builder'}
            {session?.user?.role === "USER" ? <PremiumIcon text='Advanced Builder is a premium feature'/> : <></> }
          </button>
        </div>

        {/* Workouts Container */}
        <div className="w-full flex flex-col">
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
            <label htmlFor="program-notes" className="block text-primary-text inter-bold mb-2">
              Program Notes:
            </label>
            <textarea
              id="program-notes"
              className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-highlight"
              placeholder="Enter any notes or comments about the program here..."
              rows={10}
            />
          </div>
        </div>

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

"use client";

import Workout from './Workout';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Loader from '../Loader';


export default function ProgramExcercises({ program, setProgram, type, onPrevious }) {

    const [isLoading, setIsLoading] = useState(false);
    const [advanced, setAdvanced] = useState(false);
    const router = useRouter();

    const handleCreate = async () => {

        setIsLoading(true);

        console.log('CREATED PROGRAM: ', program);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/program`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(program),
        });

        setIsLoading(false);

        if(response.ok) {
            router.push('/workouts/current');
        }
            
    };

    const handleSave = async () => {

        setIsLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program/save`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(program),
        })

        setIsLoading(false);

        if(response.ok) {
            router.push('/programs');
        }

    }

    const toggleAdvanced = (e) => {

        e.preventDefault();

        const newAdvanced = !advanced;

        setAdvanced(newAdvanced);
    }

    return (
        <>

            {isLoading && (
                <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-md flex flex-col items-center justify-center">
                    <div className="text-white text-lg flex items-center">
                        <span className='text-3xl font-bold'>Generating program</span>
                        <Loader 
                            size={10}
                            color="#fff"/>
                    </div>
                    <span>This could take a few minutes...</span>
                </div>
            )}

            <form className="w-[100%] h-[75%] sm:h-screen p-4 bg-background shadow-md rounded overflow-x-auto border-2">
                <div className='flex gap-8 items-center'>
                    <h2 className="text-3xl text-primary-text"><strong>{program.name}</strong> Exercises</h2>
                    <button 
                        className="inter-bold border-2 text-primary-text border-border p-2 hover:bg-highlight rounded flex gap-2"
                        onClick={toggleAdvanced}>{advanced ? 'Switch to Basic Builder' : 'Switch to Advanced Builder'}</button>
                </div>

                {/* Workouts Container */}
                <div className="w-full flex flex-col">
                  <div className="flex space-x-4 w-full p-4 items-start">
                    {program.weeks[0].workouts.map((workout, index) => (
                      <Workout
                        key={index}
                        workout={workout.name}
                        setProgram={setProgram}
                        excercises={workout.excercises}
                        advanced={advanced}
                      />
                    ))}
                  </div>
                
                  {/* Program Notes Section */}
                  <div className="w-full px-4 my-6">
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
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row sm:space-x-4 justify-center items-center scale-75 sm:scale-100">
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 mb-2 sm:mb-0"
                        >
                            Create Program
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 mb-2 sm:mb-0"
                        >
                            Save Program
                        </button>
                        <button
                            type="button"
                            onClick={onPrevious}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300"
                        >
                            Back
                        </button>
                    </div>
                ) : type === 1 ? (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row sm:space-x-4 justify-center items-center">
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 mb-2 sm:mb-0"
                        >
                            Copy Program
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300"
                        >
                            Save Program
                        </button>
                    </div>
                ) : (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center">
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300"
                        >
                            Assign Program
                        </button>
                    </div>
                )}

            </form>
        </>
    );
}
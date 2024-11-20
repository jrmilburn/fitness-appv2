"use client";

import Workout from './Workout';
import { useRouter } from "next/navigation";


export default function ProgramExcercises({ program, setProgram, type, onPrevious }) {

    console.log(program);

    const router = useRouter();

    const handleCreate = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/program`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(program),
        });

        if(response.ok) {
            router.push('/workouts/current');
        }
    };

    const handleSave = async () => {
        /*const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program/save`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(program),
        })

        if(response.ok) {
            router.push('/programs');
        }*/

        console.log(program);
    }

    return (
        <>
            <form className="w-[100%] h-screen p-4 bg-white shadow-md rounded overflow-x-auto border-2">
                <h2 className="text-3xl text-gray-800 mb-6"><strong>{program.name}</strong> Exercises</h2>

                {/* Workouts Container */}
                <div className="flex space-x-4 w-full p-4">
                    {program.weeks[0].workouts.map((workout, index) => (
                        <Workout
                            key={index}
                            workout={workout.name}
                            setProgram={setProgram}
                            excercises={workout.excercises}
                        />
                    ))}
                </div>
                {type === 0 ? (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row sm:space-x-4 justify-center items-center">
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
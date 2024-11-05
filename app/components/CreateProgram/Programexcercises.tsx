"use client";

import Workout from './Workout';
import { useRouter } from "next/navigation";

export default function ProgramExcercises({ program, setProgram }) {

    const router = useRouter();

    const handleCreate = async () => {
        const response = await fetch('http://localhost:3000/api/program', {
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

    return (
        <>
            <form className="w-[80%] h-full p-8 bg-white shadow-md rounded-lg overflow-x-auto ml-2 border-2">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Exercises</h2>

                {/* Workouts Container */}
                <div className="flex space-x-4 w-full h-full p-4">
                    {program.weeks[0].workouts.map((workout, index) => (
                        <Workout
                            key={index}
                            workout={workout.name}
                            setProgram={setProgram}
                            exercises={workout.exercises}
                        />
                    ))}
                </div>

                {/* Create Meso Button */}
                <button
                    type="button"
                    onClick={handleCreate}
                    className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 absolute bottom-4 right-4"
                >
                    Create Meso
                </button>
            </form>
        </>
    );
}
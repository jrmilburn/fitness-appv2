"use client";

import Workout from './Workout';
import { useRouter } from "next/navigation";


export default function ProgramExcercises({ program, setProgram, type }) {

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program/save`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({program}),
        })
    }

    return (
        <>
            <form className="w-[80%] h-[80%] p-4 bg-white shadow-md rounded overflow-x-auto border-2">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Exercises</h2>

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
                    <button
                    type="button"
                    onClick={handleCreate}
                    className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 absolute bottom-4 right-[45%]"
                    >
                        Create Program
                    </button>
                ) : type === 1 ? (
                    <button
                    type="button"
                    onClick={handleCreate}
                    className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 absolute bottom-4 right-[45%]"
                    >
                        Copy Program
                    </button>
                ) : (
                    <button
                    type="button"
                    onClick={handleCreate}
                    className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 absolute bottom-4 right-[45%]"
                    >
                        Assign Program
                    </button>
                )}

            </form>
        </>
    );
}
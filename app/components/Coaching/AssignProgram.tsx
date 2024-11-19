'use client';

import { useState, useEffect } from 'react';
import ProgramExcercises from "../CreateProgram/Programexcercises";
import Link from 'next/link';

export default function AssignProgram({ program, clientId }) {
    const [copyProgram, setCopyProgram] = useState(null);

    useEffect(() => {
        function createProgram(programName, programLength, programDays, userId) {
            const newProgram = {
                name: programName,
                length: programLength,
                days: programDays,
                userId: userId,
                weeks: []
            };

            // Loop through each week in the original program (if it exists)
            for (let i = 0; i < programLength; i++) {
                const existingWeek = program.weeks ? program.weeks[i] : null;
                const week = {
                    weekNumber: i + 1,
                    workouts: []
                };

                // Loop through each day/workout in the week
                for (let j = 0; j < programDays; j++) {
                    const existingWorkout = existingWeek?.workouts ? existingWeek.workouts[j] : null;
                    const workout = {
                        name: existingWorkout ? existingWorkout.name : `Day ${j + 1}`,
                        excercises: existingWorkout 
                            ? existingWorkout.excercises.map(excercise => ({
                                ...excercise,
                                muscle: excercise.muscleGroup?.name || '' // Set muscle to the muscleGroup name or empty if not defined
                            }))
                            : [] 
                    };

                    week.workouts.push(workout);
                }

                newProgram.weeks.push(week);
            }

            console.log('Generated Program with Muscle Groups:', newProgram);
            setCopyProgram(newProgram);
        }

        createProgram(program.name, program.length, program.days, clientId);
    }, [program.name, program.length, program.days, program.weeks, clientId]);

    const onPrevious = () => {

    }

    return (
        <>
            {copyProgram && (
                <ProgramExcercises 
                    program={copyProgram}
                    setProgram={setCopyProgram}
                    type={2}
                    onPrevious={onPrevious}
                />
            )}
            <button
                type="button"
                className="right-[5%] px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 absolute bottom-4"
                >
                    <Link href='/coaching/clients'>
                     Back
                    </Link>
            </button>
        </>
    );
}